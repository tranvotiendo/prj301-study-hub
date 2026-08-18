/**
 * STYLE: Kỹ thuật giấy ghi chú — đọc trước, thao tác sau; ivory ấm, ink navy và Notebook Teal.
 * Layout: bàn đọc ba vùng với mục lục trái, bài Markdown trung tâm và Study Desk bên phải.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  BookMarked,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  FolderOpen,
  Focus,
  GraduationCap,
  ListTree,
  Menu,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { bundledDocuments, type StudyDocument } from "@/content/library";

type Session = {
  number: string;
  title: string;
};

const getSessions = (source: string): Session[] => {
  const found = Array.from(source.matchAll(/^# Session (\d+) — (.+)$/gm)).map((match) => ({
    number: match[1],
    title: match[2].trim(),
  }));

  return [{ number: "00", title: "Bức tranh lớn" }, ...found];
};

const studyNotes = [
  "Đọc mục tiêu trước, rồi tự trả lời câu hỏi kiểm tra ở cuối mỗi session.",
  "Khi gặp code block, thử đoán output hoặc luồng xử lý trước khi đọc phần giải thích.",
  "Dùng chế độ tập trung khi cần đọc liên tục mà không bị sidebar làm phân tâm.",
];

export default function Home() {
  const [documents, setDocuments] = useState<StudyDocument[]>(bundledDocuments);
  const [activeDocumentId, setActiveDocumentId] = useState(() => bundledDocuments[0]?.id ?? "");
  const [activeSession, setActiveSession] = useState("00");
  const [completionByDocument, setCompletionByDocument] = useState<Record<string, string[]>>({});
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDocument = documents.find((document) => document.id === activeDocumentId) ?? documents[0] ?? null;
  const markdown = activeDocument?.content ?? "# Chưa có tài liệu\n\nHãy thêm file Markdown để bắt đầu.";
  const completed = completionByDocument[activeDocument?.id ?? ""] ?? [];
  const sessions = useMemo(() => getSessions(markdown), [markdown]);
  const coreSessions = sessions.filter((session) => session.number !== "00");
  const visibleSessions = sessions.filter((session) =>
    session.title.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")),
  );
  const completion = coreSessions.length
    ? Math.round((completed.length / coreSessions.length) * 100)
    : 0;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("prj301-completed-documents");
      if (saved) setCompletionByDocument(JSON.parse(saved));
    } catch {
      setCompletionByDocument({});
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("prj301-completed-documents", JSON.stringify(completionByDocument));
  }, [completionByDocument]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(".lesson-prose h1, .lesson-prose h2, .lesson-prose pre");
    headings.forEach((heading) => {
      const text = heading.textContent?.toLocaleLowerCase("vi") ?? "";
      if (heading.tagName === "H1") heading.dataset.note = "SESSION";
      else if (heading.tagName === "PRE") heading.dataset.note = "CODE / REFERENCE";
      else if (text.includes("mục tiêu")) heading.dataset.note = "READ";
      else if (text.includes("câu hỏi")) heading.dataset.note = "PRACTICE";
      else if (text.includes("key takeaways")) heading.dataset.note = "TAKEAWAY";
      else heading.dataset.note = "NOTE";
    });
  }, [markdown]);

  const scrollToSession = (session: Session) => {
    const headingText = session.number === "00" ? "0. Bức tranh lớn" : `Session ${Number(session.number)}`;
    const heading = Array.from(document.querySelectorAll<HTMLElement>(".lesson-prose h1, .lesson-prose h2")).find(
      (item) => item.textContent?.includes(headingText),
    );
    heading?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSession(session.number);
    setNavOpen(false);
  };

  const toggleComplete = (number: string) => {
    if (number === "00") return;
    if (!activeDocument) return;
    setCompletionByDocument((allProgress) => {
      const current = allProgress[activeDocument.id] ?? [];
      const next = current.includes(number) ? current.filter((item) => item !== number) : [...current, number];
      return { ...allProgress, [activeDocument.id]: next };
    });
  };

  const selectDocument = (id: string) => {
    setActiveDocumentId(id);
    setActiveSession("00");
    setSearch("");
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []).filter((file) => file.name.toLowerCase().endsWith(".md"));
    if (!files.length) return;

    const additions = await Promise.all(
      files.map(async (file, index) => ({
        id: `uploaded-${file.name}-${file.lastModified}-${index}`,
        title: file.name.replace(/\.md$/i, ""),
        fileName: file.name,
        content: await file.text(),
        source: "uploaded" as const,
      })),
    );

    setDocuments((current) => [
      ...current,
      ...additions.filter((addition) => !current.some((document) => document.id === addition.id)),
    ]);
    selectDocument(additions[0].id);
    input.value = "";
  };

  const removeUploadedDocuments = () => {
    setDocuments((current) => current.filter((document) => document.source !== "uploaded"));
    setActiveDocumentId(bundledDocuments[0]?.id ?? "");
    setActiveSession("00");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen bg-[#f7f5ef] text-[#19283d] ${focusMode ? "focus-mode" : ""}`}>
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-[#e4dfd1]" aria-hidden="true">
        <div className="h-full bg-[#0f766e] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <header className="sticky top-1 z-40 border-b border-[#dcd7ca] bg-[#f7f5ef]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1560px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            className="grid h-10 w-10 place-items-center border border-[#d8d2c3] bg-[#fffdf7] text-[#193d48] lg:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Mở mục lục"
          >
            <Menu size={19} />
          </button>
          <div className="flex min-w-0 items-center gap-3.5">
            <img
              src="/manus-storage/prj301-user-logo_e0a4de5e.webp"
              className="h-11 w-11 shrink-0 rounded-full border-2 border-[#0f766e]/45 object-cover"
              alt="Logo nhân vật người dùng chọn cho PRJ301 Study Hub"
            />
            <div className="min-w-0">
              <p className="font-display text-[21px] leading-none tracking-[-0.045em] text-[#17334a]">/PRJ301</p>
              <p className="mt-1 truncate text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#0f766e]">Java web · study hub</p>
            </div>
          </div>

          <div className="ml-auto hidden max-w-md flex-1 lg:block">
            <label className="group flex h-10 items-center gap-2 border border-transparent bg-[#ece9df] px-3 transition-colors focus-within:border-[#0f766e]/45 focus-within:bg-white">
              <Search size={16} className="text-[#65706c]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && visibleSessions[0]) scrollToSession(visibleSessions[0]);
                }}
                placeholder="Search outline…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#848982]"
                aria-label="Tìm session"
              />
              <kbd className="rounded-sm border border-[#d8d2c3] px-1.5 py-0.5 font-mono text-[10px] text-[#79817c]">Enter</kbd>
            </label>
          </div>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-4">
            <button
              onClick={() => setFocusMode((value) => !value)}
              className={`hidden h-10 items-center gap-2 border px-3 text-xs font-bold transition-all sm:flex ${focusMode ? "border-[#0f766e] bg-[#0f766e] text-white" : "border-[#d8d2c3] bg-[#fffdf7] text-[#35505a] hover:border-[#0f766e]"}`}
            >
              <Focus size={15} /> {focusMode ? "Exit Focus" : "Focus"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 items-center gap-2 bg-[#17334a] px-3 text-xs font-bold text-white shadow-[3px_3px_0_#c65d3b] transition-transform hover:-translate-y-0.5 active:scale-[.97]"
            >
              <Upload size={15} /> <span className="hidden sm:inline">Add Markdown</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".md,text/markdown" multiple className="hidden" onChange={handleFiles} />
          </div>
        </div>
      </header>

      {navOpen && (
        <div className="fixed inset-0 z-[60] bg-[#17334a]/30 p-3 lg:hidden" onMouseDown={() => setNavOpen(false)}>
          <aside
            className="h-full w-full max-w-sm overflow-y-auto bg-[#fbfaf5] p-5 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl text-[#17334a]">Library</span>
              <button className="grid h-9 w-9 place-items-center border border-[#d8d2c3]" onClick={() => setNavOpen(false)} aria-label="Đóng mục lục">
                <X size={17} />
              </button>
            </div>
            <DocumentLibrary documents={documents} activeDocumentId={activeDocument?.id ?? ""} onSelect={selectDocument} />
            <div className="mt-6 border-t border-[#dcd7ca] pt-5">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#84908b]">Document outline</p>
              <SessionList sessions={sessions} active={activeSession} completed={completed} onSelect={scrollToSession} />
            </div>
          </aside>
        </div>
      )}

      <div className="study-layout mx-auto grid max-w-[1560px] grid-cols-1 lg:grid-cols-[235px_minmax(0,1fr)_270px] xl:grid-cols-[260px_minmax(0,1fr)_290px]">
        <aside className="study-nav sticky top-[65px] hidden h-[calc(100vh-65px)] overflow-y-auto border-r border-[#dcd7ca] px-5 py-7 lg:block">
          <div className="mb-5 flex items-center gap-2 text-[#5e706e]">
            <ListTree size={16} />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Study library</span>
          </div>
          <DocumentLibrary documents={documents} activeDocumentId={activeDocument?.id ?? ""} onSelect={selectDocument} />
          <div className="mt-7 border-t border-[#dcd7ca] pt-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#84908b]">Document outline</p>
              <span className="font-mono text-[10px] text-[#0f766e]">{documents.length} file</span>
            </div>
          <SessionList sessions={visibleSessions} active={activeSession} completed={completed} onSelect={scrollToSession} />
          </div>
          {search && visibleSessions.length === 0 && (
            <p className="mt-4 border-l-2 border-[#c65d3b] pl-3 text-xs leading-relaxed text-[#69736f]">No matching section. Try “HTTP” or “Servlet”.</p>
          )}
          <div className="mt-8 border-t border-[#dcd7ca] pt-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#84908b]">Current file</p>
            <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#556764]">
              <FileText size={15} className="mt-0.5 shrink-0 text-[#0f766e]" />
              <span className="line-clamp-3">{activeDocument?.fileName ?? "Chưa có file"}</span>
            </div>
          </div>
        </aside>

        <main className="lesson-main min-w-0 px-4 py-6 sm:px-7 lg:px-10 lg:py-9 xl:px-14">
          <section className="relative mb-9 overflow-hidden border border-[#dad5c8] bg-[#ece7da] p-5 sm:p-7">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#0f766e]" aria-hidden="true" />
            <div className="relative z-10 max-w-[38rem]">
              <div className="mb-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
                <span className="h-px w-8 bg-[#0f766e]" />
                {activeDocument?.source === "uploaded" ? "Uploaded document" : "Bundled document"}
              </div>
              <h1 className="font-display text-3xl leading-[1.05] tracking-[-0.045em] text-[#17334a] sm:text-4xl">Trace the request.<br />Follow the data flow.</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#52605d]">Đang đọc <strong>{activeDocument?.title ?? "tài liệu Markdown"}</strong>. Chọn file trong thư viện, hoặc thêm nhiều file <code className="rounded-sm bg-white/70 px-1.5 py-0.5 font-mono text-[11px] text-[#0f766e]">.md</code> từ máy mà không thay thế tài liệu cũ.</p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#39565b]">
                <span className="flex items-center gap-1.5"><BookMarked size={15} className="text-[#c65d3b]" /> {coreSessions.length || 5} sessions</span>
                <span className="flex items-center gap-1.5"><Clock3 size={15} className="text-[#c65d3b]" /> {Math.max(12, Math.round(markdown.length / 1100))} phút đọc</span>
              </div>
            </div>
            <img
              src="/manus-storage/prj301-hero-workbench_39225018.jpg"
              alt="Bàn học Java Web được minh hoạ bằng giấy và thẻ kỹ thuật"
              className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[48%] object-cover mix-blend-multiply opacity-95 md:block"
            />
          </section>

          <div className="mb-7 flex items-center justify-between border-y border-[#dcd7ca] py-3">
            <div className="flex items-center gap-2 text-xs text-[#66736d]"><span className="h-2 w-2 rounded-full bg-[#0f766e]" /> LIVE MARKDOWN</div>
            {documents.some((document) => document.source === "uploaded") && (
              <button onClick={removeUploadedDocuments} className="flex items-center gap-1.5 text-xs font-bold text-[#0f766e] hover:text-[#c65d3b]">
                <RotateCcw size={14} /> Clear uploads
              </button>
            )}
          </div>

          <article className="lesson-prose pb-16">
            <Streamdown>{markdown}</Streamdown>
          </article>
        </main>

        <aside className="study-desk sticky top-[65px] hidden h-[calc(100vh-65px)] overflow-y-auto border-l border-[#dcd7ca] px-5 py-7 lg:block">
          <div className="mb-5 flex items-center gap-2 text-[#5e706e]">
            <GraduationCap size={17} />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Study desk</span>
          </div>

          <section className="border border-[#d9d2c3] bg-[#fffdf7] p-4 shadow-[4px_4px_0_rgba(23,51,74,.07)]">
            <div className="flex items-end justify-between">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#7a8580]">Session progress</p><p className="mt-1 font-sans text-[26px] font-extrabold leading-none tracking-[-0.04em] text-[#17334a]">{completion}%</p></div>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-[#e0f0eb] px-2.5 py-1 text-[10px] font-bold leading-none text-[#0f766e]">{completed.length}/{coreSessions.length || 5} done</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden bg-[#e9e4d9]"><div className="h-full bg-[#0f766e] transition-[width] duration-300" style={{ width: `${completion}%` }} /></div>
            <div className="mt-4 space-y-2">
              {coreSessions.map((session) => (
                <button key={session.number} onClick={() => toggleComplete(session.number)} className="group flex w-full items-center gap-2 text-left">
                  <span className={`grid h-4 w-4 place-items-center border transition-colors ${completed.includes(session.number) ? "border-[#0f766e] bg-[#0f766e] text-white" : "border-[#bfc9c3] bg-white group-hover:border-[#0f766e]"}`}><Check size={11} strokeWidth={3} /></span>
                  <span className={`text-[11px] ${completed.includes(session.number) ? "text-[#75817b] line-through" : "text-[#3d5355]"}`}>Session {session.number}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6 overflow-hidden border border-[#d9d2c3] bg-[#fffdf7]">
            <img src="/manus-storage/prj301-flow-card_b98aa8e4.jpg" alt="Minh hoạ luồng request và response" className="aspect-[4/2.2] w-full object-cover" />
            <div className="p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#c65d3b]">Mindset card</p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#28434d]">Browser chỉ gửi HTTP. Container mới gọi Java.</p>
            </div>
          </section>

          <section className="relative mt-6 overflow-hidden border-l-2 border-[#c65d3b] bg-[#efe8dc] p-4">
            <div className="flex items-center gap-2"><CircleHelp size={16} className="text-[#c65d3b]" /><span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#7f5b4f]">Study tip</span></div>
            <p className="mt-2 text-xs leading-5 text-[#5c514c]">{studyNotes[noteIndex]}</p>
            <button onClick={() => setNoteIndex((value) => (value + 1) % studyNotes.length)} className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0f766e]">Next tip <ChevronRight size={13} /></button>
          </section>

          <div className="mt-6 overflow-hidden border border-[#d9d2c3] bg-[#fffdf7]">
            <img src="/manus-storage/prj301-code-study_65216ac8.jpg" alt="Tài liệu học lập trình được sắp xếp trên bàn" className="aspect-[3/1.5] w-full object-cover object-center" />
            <div className="flex items-center justify-between p-3"><span className="text-[11px] font-bold text-[#415c5e]">Học theo nhịp của m.</span><ArrowDownToLine size={15} className="text-[#0f766e]" /></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SessionList({
  sessions,
  active,
  completed,
  onSelect,
}: {
  sessions: Session[];
  active: string;
  completed: string[];
  onSelect: (session: Session) => void;
}) {
  return (
    <nav aria-label="Danh sách session" className="space-y-1">
      {sessions.map((session) => {
        const isActive = active === session.number;
        const isComplete = completed.includes(session.number);
        return (
          <button
            key={`${session.number}-${session.title}`}
            onClick={() => onSelect(session)}
            className={`group flex w-full items-center gap-3 border-l-2 px-2 py-2.5 text-left transition-all ${isActive ? "border-[#0f766e] bg-[#e7f0eb] text-[#174b49]" : "border-transparent text-[#64706c] hover:border-[#c65d3b] hover:bg-[#efede5] hover:text-[#17334a]"}`}
          >
            <span className={`session-marker grid h-5 min-w-5 place-items-center text-[9px] font-extrabold ${isComplete ? "bg-[#0f766e] text-white" : isActive ? "bg-[#cce4dc] text-[#0f766e]" : "bg-[#e6e3d9] text-[#72807a]"}`}>{isComplete ? <Check size={12} strokeWidth={3} /> : session.number}</span>
            <span className="line-clamp-2 text-xs font-semibold leading-4">{session.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

function DocumentLibrary({
  documents,
  activeDocumentId,
  onSelect,
}: {
  documents: StudyDocument[];
  activeDocumentId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav aria-label="Thư viện tài liệu Markdown" className="space-y-1">
      {documents.map((document) => {
        const isActive = activeDocumentId === document.id;
        return (
          <button
            key={document.id}
            onClick={() => onSelect(document.id)}
            className={`group flex w-full items-start gap-2.5 border-l-2 px-2 py-2.5 text-left transition-all ${isActive ? "border-[#c65d3b] bg-[#f1e8dc] text-[#17334a]" : "border-transparent text-[#64706c] hover:border-[#0f766e] hover:bg-[#efede5] hover:text-[#17334a]"}`}
          >
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center ${isActive ? "bg-[#c65d3b] text-white" : "bg-[#e4e5df] text-[#0f766e]"}`}>
              <FolderOpen size={12} />
            </span>
            <span className="min-w-0">
              <span className="line-clamp-2 block text-xs font-bold leading-4">{document.title}</span>
              <span className="mt-1 block truncate font-mono text-[9px] font-medium text-[#7b8781]">{document.source === "uploaded" ? "TẢI TỪ MÁY · " : "CÓ SẴN · "}{document.fileName}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
