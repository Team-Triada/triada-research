// GitHub Pages serves files by extension to pick a Content-Type. Next's
// opengraph-image convention emits a file literally named "opengraph-image"
// (no extension) under `output: export`, because normally (Vercel/Node) the
// Content-Type is set per-request via a real HTTP header, not inferred from
// the filename. On GitHub Pages that file would be served as
// application/octet-stream, breaking every social share preview. This walks
// the export output, renames those files to add ".png", and rewrites every
// reference to the old extensionless path across the generated HTML/XML.
import { readdir, rename, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const OUT_DIR = join(process.cwd(), "out");
const TEXT_EXTENSIONS = new Set([".html", ".txt", ".xml"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = await walk(OUT_DIR);

  const renamed = [];
  for (const file of files) {
    if (file.endsWith("opengraph-image") && extname(file) === "") {
      const next = `${file}.png`;
      await rename(file, next);
      renamed.push(next);
    }
  }

  const textFiles = files.filter((f) => TEXT_EXTENSIONS.has(extname(f)));
  let patchedCount = 0;
  for (const file of textFiles) {
    const content = await readFile(file, "utf8");
    // Next appends a content-hash query string to the rendered og:image URL
    // (e.g. .../opengraph-image?ae443a2b921bed5c), so this can't require a
    // quote immediately after the match, just insert .png wherever the bare
    // path shows up and hasn't already been patched.
    const patched = content.replaceAll(/\/opengraph-image(?!\.png)/g, "/opengraph-image.png");
    if (patched !== content) {
      await writeFile(file, patched, "utf8");
      patchedCount++;
    }
  }

  console.log(`fix-og-extensions: renamed ${renamed.length} image file(s), patched ${patchedCount} reference(s) in ${textFiles.length} text file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
