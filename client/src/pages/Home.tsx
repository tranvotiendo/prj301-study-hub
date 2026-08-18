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
  Focus,
  GraduationCap,
  ListTree,
  Menu,
  PanelLeftClose,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import { Streamdown } from "streamdown";
import defaultMarkdown from "@/content/prj301-java-web.md?raw";

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
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [documentName, setDocumentName] = useState("PRJ301 — Java Web Application Development");
  const [activeSession, setActiveSession] = useState("00");
  const [completed, setCompleted] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const saved = window.localStorage.getItem("prj301-completed-sessions");
      if (saved) setCompleted(JSON.parse(saved));
    } catch {
      setCompleted([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("prj301-completed-sessions", JSON.stringify(completed));
  }, [completed]);

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
    setCompleted((items) => (items.includes(number) ? items.filter((item) => item !== number) : [...items, number]));
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMarkdown(String(reader.result ?? ""));
      setDocumentName(file.name.replace(/\.md$/i, ""));
      setCompleted([]);
      setActiveSession("00");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const resetDocument = () => {
    setMarkdown(defaultMarkdown);
    setDocumentName("PRJ301 — Java Web Application Development");
    setCompleted([]);
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
            <span className="relative grid h-11 w-11 shrink-0 place-items-center border border-[#9cc5bb] bg-[#e4f0e9] p-1 shadow-[3px_3px_0_#c65d3b] before:absolute before:right-0 before:top-0 before:h-2.5 before:w-2.5 before:border-b before:border-l before:border-[#0f766e] before:bg-[#f7f5ef]">
              <img src="/manus-storage/prj301-logo_1ba44e52.png" className="h-full w-full object-contain" alt="Biểu tượng PRJ301 Study Hub" />
            </span>
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
                placeholder="Tìm trong mục lục…"
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
              <Focus size={15} /> {focusMode ? "Thoát tập trung" : "Tập trung"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 items-center gap-2 bg-[#17334a] px-3 text-xs font-bold text-white shadow-[3px_3px_0_#c65d3b] transition-transform hover:-translate-y-0.5 active:scale-[.97]"
            >
              <Upload size={15} /> <span className="hidden sm:inline">Tải Markdown</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".md,text/markdown" className="hidden" onChange={handleFile} />
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
              <span className="font-display text-xl text-[#17334a]">Mục lục</span>
              <button className="grid h-9 w-9 place-items-center border border-[#d8d2c3]" onClick={() => setNavOpen(false)} aria-label="Đóng mục lục">
                <X size={17} />
              </button>
            </div>
            <SessionList sessions={sessions} active={activeSession} completed={completed} onSelect={scrollToSession} />
          </aside>
        </div>
      )}

      <div className="mx-auto grid max-w-[1560px] grid-cols-1 lg:grid-cols-[235px_minmax(0,1fr)_270px] xl:grid-cols-[260px_minmax(0,1fr)_290px]">
        <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] overflow-y-auto border-r border-[#dcd7ca] px-5 py-7 lg:block">
          <div className="mb-5 flex items-center gap-2 text-[#5e706e]">
            <ListTree size={16} />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Bản đồ bài học</span>
          </div>
          <SessionList sessions={visibleSessions} active={activeSession} completed={completed} onSelect={scrollToSession} />
          {search && visibleSessions.length === 0 && (
            <p className="mt-4 border-l-2 border-[#c65d3b] pl-3 text-xs leading-relaxed text-[#69736f]">Không có session phù hợp. Thử tìm “HTTP” hoặc “Servlet”.</p>
          )}
          <div className="mt-8 border-t border-[#dcd7ca] pt-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#84908b]">Nguồn hiển thị</p>
            <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#556764]">
              <FileText size={15} className="mt-0.5 shrink-0 text-[#0f766e]" />
              <span className="line-clamp-3">{documentName}</span>
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-7 lg:px-10 lg:py-9 xl:px-14">
          <section className="relative mb-9 overflow-hidden border border-[#dad5c8] bg-[#ece7da] p-5 sm:p-7">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#0f766e]" aria-hidden="true" />
            <div className="relative z-10 max-w-[38rem]">
              <div className="mb-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">
                <span className="h-px w-8 bg-[#0f766e]" />
                Tài liệu đang mở
              </div>
              <h1 className="font-display text-3xl leading-[1.05] tracking-[-0.045em] text-[#17334a] sm:text-4xl">Đọc luồng request.<br />Hiểu đường đi của dữ liệu.</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#52605d]">Một bàn đọc gọn gàng cho nội dung Markdown. Chọn session ở mục lục, đánh dấu phần đã học và nạp bất kỳ file <code className="rounded-sm bg-white/70 px-1.5 py-0.5 font-mono text-[11px] text-[#0f766e]">.md</code> nào khi cần.</p>
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
            <div className="flex items-center gap-2 text-xs text-[#66736d]"><span className="h-2 w-2 rounded-full bg-[#0f766e]" /> Markdown rendered live</div>
            {markdown !== defaultMarkdown && (
              <button onClick={resetDocument} className="flex items-center gap-1.5 text-xs font-bold text-[#0f766e] hover:text-[#c65d3b]">
                <RotateCcw size={14} /> Khôi phục PRJ301
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
              <div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#7a8580]">Tiến độ session</p><p className="mt-1 font-display text-3xl text-[#17334a]">{completion}%</p></div>
              <span className="rounded-full bg-[#e0f0eb] px-2 py-1 text-[10px] font-bold text-[#0f766e]">{completed.length}/{coreSessions.length || 5} xong</span>
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
            <div className="flex items-center gap-2"><CircleHelp size={16} className="text-[#c65d3b]" /><span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#7f5b4f]">Cách học nhanh</span></div>
            <p className="mt-2 text-xs leading-5 text-[#5c514c]">{studyNotes[noteIndex]}</p>
            <button onClick={() => setNoteIndex((value) => (value + 1) % studyNotes.length)} className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0f766e]">Đổi mẹo <ChevronRight size={13} /></button>
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
