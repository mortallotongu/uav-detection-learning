/* Style reminder: Research Notebook — content is the product. Use question-led copy, visible annotations, and interactions that explain a mechanism rather than decorate it. */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Crosshair,
  Focus,
  GitBranch,
  Menu,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
import { allLessons, chapters, glossary, type Lesson } from "@/lib/course";

type FlatLesson = Lesson & {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  color: string;
};

const flatLessons = allLessons as FlatLesson[];
const firstLesson = flatLessons[0];

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark ${small ? "brand-mark--small" : ""}`} aria-hidden="true">
      <span />
      <i />
      <b />
    </span>
  );
}

function ChapterIcon({ id }: { id: string }) {
  const iconProps = { size: 16, strokeWidth: 1.8 };
  if (id === "task") return <Target {...iconProps} />;
  if (id === "feature") return <Focus {...iconProps} />;
  if (id === "training") return <Zap {...iconProps} />;
  if (id === "detr") return <GitBranch {...iconProps} />;
  if (id === "transformer") return <Sparkles {...iconProps} />;
  if (id === "localization") return <Crosshair {...iconProps} />;
  return <CircleHelp {...iconProps} />;
}

function ProgressLine({ done, total }: { done: number; total: number }) {
  const percent = Math.round((done / total) * 100);
  return (
    <div className="progress-line" aria-label={`已完成 ${percent}%`}>
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

function BoxLab() {
  const [x, setX] = useState(47);
  const [y, setY] = useState(47);
  const [size, setSize] = useState(42);
  const iou = Math.max(0, Math.min(1, 1 - (Math.abs(x - 50) + Math.abs(y - 50)) / 90)) * Math.min(1, 42 / size);
  const score = Math.round(iou * 100);
  return (
    <div className="lab-card">
      <div className="lab-head">
        <div><span className="lab-tag">可操作演示 · IoU</span><h3>让预测框靠近真实框</h3></div>
        <button className="icon-button" onClick={() => { setX(47); setY(47); setSize(42); }} aria-label="重置演示"><RotateCcw size={15} /></button>
      </div>
      <p className="lab-copy">灰色框是真实目标，橙色框是预测。拖动滑块，观察“框的位置”和 IoU 如何一起变化。</p>
      <div className="box-stage">
        <div className="box-ground" />
        <div className="truth-box"><span>真实框</span></div>
        <div className="predict-box" style={{ left: `${x}%`, top: `${y}%`, width: `${size}%`, height: `${size * 0.8}%` }}><span>预测框</span></div>
        <div className="iou-readout"><strong>{score}<small>%</small></strong><span>IoU</span></div>
      </div>
      <div className="control-grid">
        <label>水平偏移<input type="range" min="30" max="65" value={x} onChange={(e) => setX(Number(e.target.value))} /></label>
        <label>垂直偏移<input type="range" min="30" max="65" value={y} onChange={(e) => setY(Number(e.target.value))} /></label>
        <label>预测框大小<input type="range" min="28" max="58" value={size} onChange={(e) => setSize(Number(e.target.value))} /></label>
      </div>
      <div className="lab-conclusion"><span className="conclusion-dot" />{score > 75 ? "两个框重叠得很好：分类正确之外，定位也比较精确。" : score > 35 ? "还找到了目标，但框的偏移或大小差异会拉低定位质量。" : "框几乎没有覆盖真实目标：这是定位失败，不只是分数低。"}</div>
    </div>
  );
}

function TensorLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { label: "输入图像", shape: "1 × 3 × 640 × 640", note: "1 张图 · 3 个颜色通道 · 640 高 · 640 宽", color: "input" },
    { label: "浅层特征", shape: "1 × 64 × 160 × 160", note: "空间更小，但每个位置有 64 个学习出的响应", color: "feature" },
    { label: "深层特征", shape: "1 × 256 × 40 × 40", note: "空间更粗，语义更强，能看到更大的上下文", color: "deep" },
  ];
  const current = stages[stage];
  return (
    <div className="lab-card">
      <div className="lab-head"><div><span className="lab-tag">可操作演示 · Tensor Shape</span><h3>跟着一张图穿过 Backbone</h3></div><button className="icon-button" onClick={() => setStage(0)} aria-label="重置演示"><RotateCcw size={15} /></button></div>
      <p className="lab-copy">注意：空间尺寸变小，不代表信息简单了；通道数量增加，表示网络用更多维度表达模式。</p>
      <div className="tensor-track">
        {stages.map((item, index) => <button key={item.label} className={`tensor-node ${index === stage ? "is-active" : ""}`} onClick={() => setStage(index)}><span className={`tensor-stack ${item.color}`}><i /><i /><i /></span><b>{item.label}</b><code>{item.shape}</code></button>)}
      </div>
      <div className="tensor-detail"><div className={`tensor-preview ${current.color}`}><span /><span /><span /><span /></div><div><span className="detail-label">现在看到的是</span><h4>{current.shape}</h4><p>{current.note}</p></div></div>
      <div className="step-buttons"><button disabled={stage === 0} onClick={() => setStage(stage - 1)}><ChevronLeft size={15} />上一步</button><button disabled={stage === stages.length - 1} onClick={() => setStage(stage + 1)}>下一步<ChevronRight size={15} /></button></div>
    </div>
  );
}

function AttentionLab() {
  const [query, setQuery] = useState(1);
  const weights = query === 0 ? [0.78, 0.12, 0.06, 0.04] : query === 1 ? [0.1, 0.72, 0.13, 0.05] : [0.08, 0.12, 0.18, 0.62];
  const labels = ["道路边缘", "小车区域", "树影纹理", "密集目标"];
  return (
    <div className="lab-card">
      <div className="lab-head"><div><span className="lab-tag">可操作演示 · Attention</span><h3>换一个 Query，看它从哪里取信息</h3></div></div>
      <p className="lab-copy">Attention 的直觉是：Query 提出当前需要，Key 提供可比较的索引，Value 携带被读取的内容。</p>
      <div className="attention-stage"><div className="query-rail"><span>Query</span>{["边界", "目标", "密集"].map((label, index) => <button key={label} className={query === index ? "is-active" : ""} onClick={() => setQuery(index)}><i>{index + 1}</i>{label}</button>)}</div><div className="attention-links">{weights.map((weight, index) => <div className="attention-row" key={labels[index]}><span className="key-label">K{index + 1}</span><div className="attention-bar"><span style={{ width: `${weight * 100}%` }} /></div><b>{Math.round(weight * 100)}%</b><small>{labels[index]}</small></div>)}</div></div>
      <div className="lab-conclusion"><span className="conclusion-dot" />当前 Query 更关注“{labels[weights.indexOf(Math.max(...weights))]}”。这不是固定标签，而是一次基于相似度的读取。</div>
    </div>
  );
}

function DistributionLab() {
  const [focus, setFocus] = useState(44);
  const [spread, setSpread] = useState(28);
  const bins = Array.from({ length: 15 }, (_, index) => index * 7 + 2);
  return (
    <div className="lab-card">
      <div className="lab-head"><div><span className="lab-tag">可操作演示 · FDR</span><h3>把“一个坐标”变成可细化的分布</h3></div><button className="icon-button" onClick={() => { setFocus(44); setSpread(28); }} aria-label="重置演示"><RotateCcw size={15} /></button></div>
      <p className="lab-copy">下面不是 D-FINE 的完整实现，而是理解 FDR 的概念模型：边界位置先有一组可能性，再逐步集中到更准确的位置。</p>
      <div className="distribution-stage"><div className="axis-line" />{bins.map((position, index) => { const distance = Math.abs(position - focus); const height = Math.max(8, 88 * Math.exp(-(distance * distance) / (spread * spread))); return <span key={position} style={{ left: `${position}%`, height: `${height}%` }} />; })}<div className="truth-tick" style={{ left: "62%" }}><i />正确边界</div></div>
      <div className="control-grid distribution-controls"><label>分布中心<input type="range" min="18" max="76" value={focus} onChange={(e) => setFocus(Number(e.target.value))} /></label><label>不确定性<input type="range" min="8" max="42" value={spread} onChange={(e) => setSpread(Number(e.target.value))} /></label></div>
      <div className="lab-conclusion"><span className="conclusion-dot" />中心越接近真实边界、分布越集中，定位结果就越精细。FDR 关注的正是这种可表达、可迭代的定位过程。</div>
    </div>
  );
}

function LabPanel({ kind }: { kind?: Lesson["lab"] }) {
  if (kind === "box") return <BoxLab />;
  if (kind === "tensor") return <TensorLab />;
  if (kind === "attention") return <AttentionLab />;
  if (kind === "distribution") return <DistributionLab />;
  return null;
}

function ConceptStrip({ lesson }: { lesson: FlatLesson }) {
  return <div className="concept-strip"><span className="concept-strip-label">本节会遇到</span>{lesson.terms.map((term) => <span className="term-chip" key={term}>{term}</span>)}</div>;
}

function LessonView({ lesson, completed, onComplete, onNext, onPrev }: { lesson: FlatLesson; completed: boolean; onComplete: () => void; onNext: () => void; onPrev: () => void }) {
  return (
    <article className="lesson-view" key={lesson.id}>
      <div className="lesson-meta"><span className={`section-number ${lesson.color}`}>{lesson.chapterNumber}</span><div><span className="eyebrow">{lesson.eyebrow}</span><span className="lesson-chapter">{lesson.chapterTitle}</span></div></div>
      <h1>{lesson.title}</h1>
      <p className="lesson-summary">{lesson.summary}</p>
      <ConceptStrip lesson={lesson} />
      <div className="why-note"><span>为什么先讲这个？</span><p>{lesson.why}</p></div>
      <div className="explain-stack">{lesson.explain.map((paragraph, index) => <div className="explain-row" key={paragraph}><span className="paragraph-index">{String(index + 1).padStart(2, "0")}</span><p>{paragraph}</p></div>)}</div>
      <LabPanel kind={lesson.lab} />
      <div className="takeaway-card"><div className="takeaway-heading"><Sparkles size={16} /><span>把这一节压缩成三句话</span></div><div className="takeaway-list">{lesson.takeaways.map((item) => <div key={item}><Check size={15} />{item}</div>)}</div></div>
      <div className="check-card"><div className="check-icon"><CircleHelp size={19} /></div><div><span className="check-label">现在试着回答</span><p>{lesson.check}</p></div></div>
      <div className="lesson-footer"><button className={`complete-button ${completed ? "is-done" : ""}`} onClick={onComplete}>{completed ? <><Check size={16} />已掌握这节</> : <>标记为已掌握 <ArrowRight size={16} /></>}</button><div className="lesson-nav"><button onClick={onPrev} aria-label="上一节"><ChevronLeft size={17} /></button><button onClick={onNext} aria-label="下一节"><ChevronRight size={17} /></button></div></div>
    </article>
  );
}

function AppHeader({ onMenu }: { onMenu: () => void }) {
  return <header className="topbar"><div className="topbar-inner"><button className="mobile-menu" onClick={onMenu} aria-label="打开课程目录"><Menu size={19} /></button><a className="wordmark" href="#top"><BrandMark /><span><strong>D-FINE</strong><small>LEARNING STUDIO</small></span></a><div className="topbar-note"><span className="pulse-dot" />一条主线，读懂一个模型</div><div className="topbar-actions"><a href="#glossary">术语索引</a><a href="#about">关于课程</a></div></div></header>;
}

export default function Home() {
  const [selectedId, setSelectedId] = useState(firstLesson.id);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dfine-learning-completed") || "[]"); } catch { return []; }
  });
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const selected = useMemo(() => flatLessons.find((lesson) => lesson.id === selectedId) || firstLesson, [selectedId]);
  const currentIndex = flatLessons.findIndex((lesson) => lesson.id === selected.id);
  const percent = Math.round((completed.length / flatLessons.length) * 100);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return chapters;
    return chapters.map((chapter) => ({ ...chapter, lessons: chapter.lessons.filter((lesson) => [lesson.title, lesson.summary, lesson.terms.join(" ")].join(" ").toLowerCase().includes(query)) })).filter((chapter) => chapter.lessons.length > 0);
  }, [search]);

  useEffect(() => { localStorage.setItem("dfine-learning-completed", JSON.stringify(completed)); }, [completed]);
  useEffect(() => { document.title = `${selected.title} · D-FINE Learning Studio`; window.scrollTo({ top: 0, behavior: "smooth" }); }, [selectedId, selected.title]);

  const goTo = (id: string) => { setSelectedId(id); setSidebarOpen(false); };
  const toggleCompleted = () => setCompleted((current) => current.includes(selected.id) ? current.filter((id) => id !== selected.id) : [...current, selected.id]);
  const goNext = () => { if (currentIndex < flatLessons.length - 1) goTo(flatLessons[currentIndex + 1].id); };
  const goPrev = () => { if (currentIndex > 0) goTo(flatLessons[currentIndex - 1].id); };

  return <div className="site-shell" id="top">
    <AppHeader onMenu={() => setSidebarOpen(true)} />
    <div className="layout">
      <aside className={`course-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-top"><div><span className="sidebar-kicker">THE NOTEBOOK</span><h2>读懂 D-FINE</h2></div><button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="关闭课程目录"><X size={19} /></button></div>
        <p className="sidebar-intro">不从术语表开始。沿着一张图的旅程，理解 D-FINE 为什么能把目标框定位得更细。</p>
        <div className="progress-card"><div className="progress-copy"><span>学习记录</span><strong>{percent}%</strong></div><ProgressLine done={completed.length} total={flatLessons.length} /><small>{completed.length} / {flatLessons.length} 节已标记掌握</small></div>
        <label className="search-box"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索概念或章节" /><kbd>/</kbd></label>
        <nav className="chapter-nav" aria-label="课程章节">{filtered.map((chapter) => <div className="chapter-group" key={chapter.id}><div className={`chapter-label ${chapter.color}`}><ChapterIcon id={chapter.id} /><span>{chapter.number}</span><b>{chapter.title}</b></div>{chapter.lessons.map((lesson) => <button key={lesson.id} className={`lesson-link ${lesson.id === selected.id ? "is-active" : ""}`} onClick={() => goTo(lesson.id)}><span>{lesson.title}</span>{completed.includes(lesson.id) && <Check size={14} />}</button>)}</div>)}{filtered.length === 0 && <div className="empty-search">没有找到匹配内容。试试“FDR”“query”或“IoU”。</div>}</nav>
        <div className="sidebar-bottom"><button onClick={() => setShowGlossary(true)}><BookOpen size={15} />打开术语索引</button><span>v1.0 · editorial learning system</span></div>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="关闭目录" />}
      <main className="content-area">
        <div className="content-wrap">
          <div className="mobile-course-bar"><button onClick={() => setSidebarOpen(true)}><Menu size={15} />课程目录</button><span>{selected.chapterNumber} / {String(currentIndex + 1).padStart(2, "0")}</span></div>
          <section className="hero-intro"><div className="hero-copy"><span className="eyebrow">A VISUAL COURSE FOR BEGINNERS</span><h2>不要背 D-FINE。<br /><em>看见它如何定位。</em></h2><p>从一张图、一个特征、一个 Query 开始，直到你能把 FDR 和 GO-LSD 放回完整的检测链里。这里不要求你先成为数学家，只要求每一步都能说清楚。</p><div className="hero-actions"><button className="primary-button" onClick={() => document.getElementById("lesson")?.scrollIntoView({ behavior: "smooth" })}>继续当前章节 <ArrowDown size={15} /></button><span><span className="hero-rule" />{flatLessons.length} 个连续学习单元</span></div></div><div className="hero-art"><img src="/manus-storage/dfine-hero_66e65263.png" alt="从航拍图像到精细定位的抽象示意" /><div className="hero-stamp"><span>MODEL VIEW</span><strong>01—07</strong><small>from image<br />to refinement</small></div></div></section>
          <section className="spine-panel"><div className="spine-heading"><div><span className="eyebrow">THE SINGLE SPINE</span><h3>一张图，五次变形，最后成为一个更准的框。</h3></div><span className="spine-note">当前阅读：{selected.chapterNumber} / {selected.title}</span></div><div className="spine-path">{[{label: "Image", note: "输入"}, {label: "Feature", note: "特征"}, {label: "Query", note: "查询"}, {label: "Box", note: "预测"}, {label: "Refine", note: "细化"}].map((node, index) => <div className={`spine-node ${index <= Math.min(4, Math.floor(currentIndex / 3)) ? "is-lit" : ""}`} key={node.label}><span>{String(index + 1).padStart(2, "0")}</span><b>{node.label}</b><small>{node.note}</small>{index < 4 && <ArrowRight size={15} />}</div>)}</div></section>
          <section className="lesson-section" id="lesson"><div className="reading-rail"><span className="rail-label">READING NOTE</span><span className="rail-line" /><span className="rail-number">{String(currentIndex + 1).padStart(2, "0")} / {String(flatLessons.length).padStart(2, "0")}</span></div><LessonView lesson={selected} completed={completed.includes(selected.id)} onComplete={toggleCompleted} onNext={goNext} onPrev={goPrev} /></section>
          <section className="afterword"><div><span className="eyebrow">WHEN YOU FINISH THE SPINE</span><h2>你应该能讲清楚：<br /><em>一个框为什么会变准。</em></h2></div><div className="afterword-copy"><p>不是因为模型“更大”，也不是因为多堆了几个术语，而是因为你理解了从特征到查询、从查询到集合预测、从直接坐标到分布细化的完整链条。</p><button className="text-button" onClick={() => setShowGlossary(true)}>再查几个关键词 <ArrowRight size={15} /></button></div></section>
          <section className="glossary-section" id="glossary"><div className="glossary-heading"><div><span className="eyebrow">SMALL INDEX</span><h2>六个词，反复回来查。</h2></div><span>术语不是终点，机制才是。</span></div><div className="glossary-grid">{glossary.map(([term, description]) => <div className="glossary-item" key={term}><span>{term}</span><p>{description}</p></div>)}</div></section>
          <footer id="about"><BrandMark small /><span>D-FINE LEARNING STUDIO · A quiet route into detection transformers.</span><a href="#top">回到顶部 ↑</a></footer>
        </div>
      </main>
    </div>
    {showGlossary && <div className="modal-backdrop" onClick={() => setShowGlossary(false)}><section className="glossary-modal" onClick={(e) => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">TERM INDEX</span><h2>随时回来查</h2></div><button className="icon-button" onClick={() => setShowGlossary(false)} aria-label="关闭术语索引"><X size={17} /></button></div><div className="modal-list">{glossary.map(([term, description]) => <div key={term}><strong>{term}</strong><p>{description}</p></div>)}</div></section></div>}
  </div>;
}
