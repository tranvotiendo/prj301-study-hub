/**
 * THƯ VIỆN MARKDOWN — Chỉ cần chép file .md vào thư mục này.
 * Muốn đổi thứ tự/tên hiển thị: thêm hoặc sửa một dòng trong documentCatalog.
 */
export type StudyDocument = {
  id: string;
  title: string;
  fileName: string;
  content: string;
  source: "bundled" | "uploaded";
};

type CatalogEntry = {
  fileName: string;
  title: string;
};

// Mỗi file .md mới đặt ở client/src/content/ sẽ tự xuất hiện trong thư viện.
// Nếu cần tên đẹp hoặc muốn ưu tiên tài liệu này lên đầu, thêm fileName vào đây.
export const documentCatalog: CatalogEntry[] = [
  {
    fileName: "prj301-java-web.md",
    title: "PRJ301 — Java Web Application Development",
  },
  // { fileName: "session-06.md", title: "PRJ301 — Session 6" },
];

const markdownFiles = import.meta.glob("./*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const fileNameFromPath = (path: string) => path.split("/").pop() ?? path;
const fallbackTitle = (fileName: string) =>
  fileName
    .replace(/\.md$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const allFiles = Object.entries(markdownFiles).map(([path, content]) => ({
  fileName: fileNameFromPath(path),
  content,
}));

const orderedFiles = [
  ...documentCatalog
    .map((entry) => ({ ...entry, content: allFiles.find((file) => file.fileName === entry.fileName)?.content }))
    .filter((entry): entry is CatalogEntry & { content: string } => Boolean(entry.content)),
  ...allFiles
    .filter((file) => !documentCatalog.some((entry) => entry.fileName === file.fileName))
    .map((file) => ({ ...file, title: fallbackTitle(file.fileName) })),
];

export const bundledDocuments: StudyDocument[] = orderedFiles.map((document) => ({
  id: `bundled-${document.fileName}`,
  title: document.title,
  fileName: document.fileName,
  content: document.content,
  source: "bundled",
}));
