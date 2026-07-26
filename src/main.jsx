import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { caseStudies, experience, gameExperience, profile, projects, strengths } from "./data";
import "./styles.css";

const BASE_URL = import.meta.env.BASE_URL || "/";
const withBasePath = (path = "/") => {
  const cleanBase = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  if (path === "/") return cleanBase;
  if (path.startsWith("/#")) return `${cleanBase}${path.slice(1)}`;
  if (!path.startsWith("/")) return path;
  return `${cleanBase.replace(/\/$/, "")}${path}`;
};
const homeHref = withBasePath("/");
const projectsHref = withBasePath("/#projects");

const currentRoute = () => {
  const basePath = new URL(BASE_URL, window.location.origin).pathname;
  let route = window.location.pathname;
  if (basePath !== "/" && route.startsWith(basePath)) {
    route = `/${route.slice(basePath.length)}`;
  }
  return route.replace(/\/$/, "") || "/";
};

const Arrow = ({ diagonal = false }) => (
  <span className={`arrow ${diagonal ? "diagonal" : ""}`} aria-hidden="true">→</span>
);

function LazyVideo({ src, poster, autoPlay = true, preload = "none", ...props }) {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShouldLoad(entry.isIntersecting),
      { rootMargin: "240px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !autoPlay) return;
    if (shouldLoad) node.play().catch(() => {});
    else node.pause();
  }, [autoPlay, shouldLoad]);

  return (
    <video
      {...props}
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      autoPlay={autoPlay && shouldLoad}
      preload={shouldLoad ? preload : "none"}
    />
  );
}

function TacticalField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const context = canvas.getContext("2d");
    let frame;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastDraw = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time = 0) => {
      if (document.hidden) {
        frame = requestAnimationFrame(draw);
        return;
      }
      if (time - lastDraw < 33) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      context.clearRect(0, 0, width, height);
      const t = time * 0.00022;

      // Tactical map grid.
      context.lineWidth = 1;
      for (let x = -40; x < width + 60; x += 72) {
        context.strokeStyle = "rgba(174, 196, 184, 0.055)";
        context.beginPath();
        context.moveTo(x + ((t * 18) % 72), 0);
        context.lineTo(x + ((t * 18) % 72), height);
        context.stroke();
      }
      for (let y = -40; y < height + 60; y += 72) {
        context.strokeStyle = "rgba(174, 196, 184, 0.05)";
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      // Topographic contours.
      const contourSets = [
        [width * 0.22, height * 0.56, 250, 140],
        [width * 0.72, height * 0.34, 340, 190],
        [width * 0.76, height * 0.82, 220, 120],
      ];
      contourSets.forEach(([cx, cy, rx, ry], group) => {
        for (let i = 0; i < 7; i += 1) {
          const wobble = Math.sin(t * 2 + i * 0.7 + group) * 7;
          context.strokeStyle = `rgba(166, 195, 177, ${0.035 + i * 0.012})`;
          context.beginPath();
          context.ellipse(
            cx + Math.sin(i * 1.7) * 16,
            cy + Math.cos(i * 1.4) * 10,
            rx - i * 29 + wobble,
            ry - i * 16 + wobble * 0.5,
            -0.18 + group * 0.14,
            0,
            Math.PI * 2
          );
          context.stroke();
        }
      });

      // Player path and system nodes.
      const nodes = [
        [width * 0.12, height * 0.69],
        [width * 0.27, height * 0.48],
        [width * 0.43, height * 0.57],
        [width * 0.6, height * 0.31],
        [width * 0.78, height * 0.43],
        [width * 0.9, height * 0.24],
      ];
      context.setLineDash([7, 12]);
      context.strokeStyle = "rgba(199, 255, 62, 0.28)";
      context.beginPath();
      nodes.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
      context.setLineDash([]);

      nodes.forEach(([x, y], index) => {
        const pulse = 4 + (Math.sin(t * 8 - index * 1.2) + 1) * 3;
        context.fillStyle = index === 3 ? "#c7ff3e" : "rgba(219, 229, 220, 0.72)";
        context.beginPath();
        context.arc(x, y, index === 3 ? 4 : 2.2, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = `rgba(199, 255, 62, ${0.12 + index * 0.015})`;
        context.beginPath();
        context.arc(x, y, pulse + index, 0, Math.PI * 2);
        context.stroke();
      });

      // Moving signal along the designed path.
      const phase = (t * 0.75) % (nodes.length - 1);
      const segment = Math.floor(phase);
      const progress = phase - segment;
      const from = nodes[segment];
      const to = nodes[segment + 1];
      const sx = from[0] + (to[0] - from[0]) * progress;
      const sy = from[1] + (to[1] - from[1]) * progress;
      const glow = context.createRadialGradient(sx, sy, 0, sx, sy, 48);
      glow.addColorStop(0, "rgba(199, 255, 62, 0.8)");
      glow.addColorStop(0.15, "rgba(199, 255, 62, 0.25)");
      glow.addColorStop(1, "rgba(199, 255, 62, 0)");
      context.fillStyle = glow;
      context.fillRect(sx - 50, sy - 50, 100, 100);

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="tactical-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="tactical-scan" />
      <div className="tactical-radar">
        <span className="radar-hand" />
        <i /><i /><i />
      </div>
      <div className="hud-label hud-a"><b>SYS.01</b><span>CORE LOOP / ONLINE</span></div>
      <div className="hud-label hud-b"><b>PLAYER TRACE</b><span>BUILD 06 · RISK / REWARD</span></div>
      <div className="hud-cross">+</div>
    </div>
  );
}

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} className="cursor-glow" />;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="返回首页">
        M<span className="brand-dot">•</span>G
      </a>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="切换菜单">
        {open ? "关闭" : "菜单"}
      </button>
      <nav className={open ? "nav open" : "nav"} onClick={() => setOpen(false)}>
        <a href="#projects">项目</a>
        <a href="#profile">关于</a>
        <a href="#abilities">能力</a>
        <a href="#game-experience">游戏经历</a>
        <a href="#contact">联系</a>
      </nav>
      <a className="header-contact" href={`mailto:${profile.email}`}>
        LET'S TALK <span className="status-dot" />
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-media">
        <TacticalField />
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="video-noise" />
        <div className="video-shade" />
      </div>
      <Header />
      <div className="hero-content shell">
        <div className="hero-kicker">
          <span>PORTFOLIO / 2026</span>
          <span>AVAILABLE FOR OPPORTUNITIES</span>
        </div>
        <h1>
          <span className="hero-line">GAMEPLAY</span>
          <span className="hero-line outline">SYSTEM <i>/</i></span>
          <span className="hero-line">DESIGN</span>
        </h1>
        <div className="hero-bottom">
          <p>从玩家需求、系统规则到反馈验证，<br />把核心循环、成长节奏和玩家体验做清楚。</p>
          <a className="circle-link" href="#projects" aria-label="查看项目">
            <Arrow diagonal />
          </a>
        </div>
      </div>
      <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">01 / SELECTED WORK</span>
            <h2 className="selected-work-title">把玩家需求，做成可验证的系统。</h2>
          </div>
          <p className="section-note">系统策划 · UI 流程 · 游戏分析<br />从规则设计到反馈迭代</p>
        </div>
        <div className="projects-list">
          {projects.map((project) => (
            <article className={`project project-${project.tone}`} key={project.id}>
              <div className="project-visual">
                <span className="project-index">{project.id}</span>
                <div className="visual-grid" />
                {project.previewVideo ? (
                  <div className="project-gameplay">
                    <LazyVideo src={project.previewVideo} poster={project.preview} muted loop autoPlay playsInline />
                    {project.previewMeta && <span>{project.previewMeta}</span>}
                  </div>
                ) : project.preview ? (
                  <div className="project-gameplay">
                    <img src={project.preview} alt={`${project.title} 实机玩法预览`} loading="lazy" decoding="async" />
                    {project.previewMeta && <span>{project.previewMeta}</span>}
                  </div>
                ) : project.cover ? (
                  <div className="project-document-stack">
                    {project.spreads?.map((spread, index) => (
                      <img
                        className={`document-spread document-spread-${index + 1}`}
                        src={spread}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        key={spread}
                      />
                    ))}
                    <div className="project-document">
                      <img src={project.cover} alt={`${project.title} 文档封面`} loading="lazy" decoding="async" />
                    </div>
                  </div>
                ) : (
                  <div className="project-symbol">{project.symbol}</div>
                )}
                {project.meta && <span className="document-badge">{project.meta}</span>}
                {project.dimensions && (
                  <div className="document-dimensions">
                    {project.dimensions.map((dimension) => <span key={dimension}>{dimension}</span>)}
                  </div>
                )}
              </div>
              <div className="project-copy">
                <span className="project-type">{project.type}</span>
                <h3>{project.title}</h3>
                <h4>{project.subtitle}</h4>
                <p>{project.description}</p>
                {project.caseMetrics && (
                  <div className="case-metrics" aria-label={`${project.title} 关键设计数据`}>
                    {project.caseMetrics.map((metric) => (
                      <div className="case-metric" key={`${metric.value}-${metric.label}`}>
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {project.insights && !project.caseLink && (
                  <div className="project-insights" aria-label={`${project.title} 核心洞察`}>
                    {project.insights.map((insight, index) => (
                      <div className="insight-item" key={insight}>
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                )}
                {project.systemNotes && !project.caseLink && (
                  <div className="system-notes" aria-label={`${project.title} 系统细节`}>
                    {project.systemNotes.map((note) => <span key={note}>{note}</span>)}
                  </div>
                )}
                <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {(project.caseLink || project.link) && (
                  <div className="project-actions">
                    {project.caseLink && (
                      <a className="project-link" href={project.caseLink}>
                        <span>{project.caseLinkLabel}</span><Arrow diagonal />
                      </a>
                    )}
                    {project.link && (
                      <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                        <span>{project.linkLabel}</span><Arrow diagonal />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section className="section profile-section" id="profile">
      <div className="shell profile-grid">
        <div className="portrait-wrap">
          <div className="portrait-card">
            <img src={profile.photo} alt={`${profile.chineseName} portrait`} loading="lazy" decoding="async" />
            <div className="portrait-scan" />
          </div>
          <div className="portrait-caption">
            <span>BASED IN CHINA</span><span>OPEN TO WORK</span>
          </div>
        </div>
        <div className="profile-content">
          <span className="eyebrow">02 / PROFILE</span>
          <p className="profile-lead">
            你好，我是 <strong>{profile.chineseName}</strong>。<br />
            一名用原型、分析和反馈验证设计判断的应届游戏策划。
          </p>
          <p className="profile-intro">{profile.intro}</p>
          <div className="profile-meta">
            <div><small>EDUCATION</small><span>{profile.education}</span></div>
            <div><small>GRADUATION</small><span>{profile.graduation}</span></div>
            <div><small>STATUS</small><span>{profile.status}</span></div>
            <div><small>CONTACT</small><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
          </div>
          <div className="metrics">
            <div><strong>12</strong><span>随机属性词条</span></div>
            <div><strong>6</strong><span>风险收益解锁等级</span></div>
            <div><strong>2</strong><span>原型玩家测试轮次</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Abilities() {
  return (
    <section className="section abilities-section" id="abilities">
      <div className="shell">
        <div className="section-head compact">
          <div><span className="eyebrow">03 / CAPABILITIES</span><h2>能拆系统，<br />也能把系统做出来。</h2></div>
          <p className="section-note">原型 · 分析 · 测试 · 反馈<br />面向游戏策划岗位的能力组合</p>
        </div>
        <div className="ability-grid">
          {strengths.map((item) => (
            <article className="ability-card" key={item.no}>
              <div className="ability-top"><span>{item.no}</span><span>↗</span></div>
              <div>
                <span className="ability-en">{item.en}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <small>{item.tools}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section timeline-section">
      <div className="shell">
        <span className="eyebrow">05 / EXPERIENCE & EDUCATION</span>
        <div className="timeline">
          {experience.map((item, index) => (
            <article className="timeline-row" key={`${item.year}-${item.role}`}>
              <span className="timeline-no">0{index + 1}</span>
              <div className="timeline-date"><strong>{item.year}</strong><small>{item.range}</small></div>
              <div className="timeline-role"><h3>{item.role}</h3><span>{item.org}</span></div>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GameExperience() {
  return (
    <section className="section game-exp-section" id="game-experience">
      <div className="shell">
        <div className="section-head compact">
          <div><span className="eyebrow">04 / PLAY HISTORY</span><h2>部分游戏经历。</h2></div>
          <p className="section-note">长期游玩 · 竞技段位 · 团队副本<br />作为策划视角之外的玩家积累</p>
        </div>
        <div className="game-exp-grid">
          {gameExperience.map((group) => (
            <article className="game-exp-card" key={group.category}>
              <span>{group.category}</span>
              <div className="game-exp-list">
                {group.games.map((game) => (
                  <div className="game-exp-item" key={game.title}>
                    <h3>{game.title}</h3>
                    <small>{game.meta}</small>
                    <p>{game.achievement}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact-section" id="contact">
      <div className="contact-grid" />
      <div className="contact-glow" />
      <div className="shell contact-inner">
        <div className="contact-top">
          <span className="eyebrow">06 / CONTACT</span>
          <span>{profile.location}<br />GMT +08:00</span>
        </div>
        <div className="contact-main">
          <p>欢迎联系我讨论游戏策划 / 系统策划 / 战斗设计相关机会。</p>
          <h2>LET'S <i>TALK.</i></h2>
          <a className="mail-link" href={`mailto:${profile.email}`}>
            <span>{profile.email}</span><Arrow diagonal />
          </a>
        </div>
        <div className="contact-bottom">
          <span>© 2026 {profile.name}</span>
          <div><a href="#top">BACK TO TOP ↑</a></div>
        </div>
      </div>
    </footer>
  );
}

function RoguelikeCase() {
  const study = caseStudies.roguelike;
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <main className="case-page">
      <header className="case-header">
        <a className="brand" href={homeHref} aria-label="返回首页">
          M<span className="brand-dot">·</span>G
        </a>
        <nav className="case-nav" aria-label="案例导航">
          <a href={homeHref}>首页</a>
          <a href="#loop">核心拆解</a>
          <a href="#upgrade">系统设计</a>
          <a href="#iteration">测试迭代</a>
        </nav>
        <a className="header-contact" href={`mailto:${profile.email}`}>
          LET'S TALK <span className="status-dot" />
        </a>
      </header>

      <section className="case-hero">
        <div className="case-bg-grid" />
        <div className="shell case-hero-grid">
          <div className="case-hero-copy">
            <span className="eyebrow">{study.engine}</span>
            <h1 className={study.title === "Combat Shuang" ? "case-title-nowrap" : ""}>{study.title}</h1>
            <p className="case-subtitle">{study.subtitle}</p>
            <p className="case-summary">{study.summary}</p>
            <div className="case-meta-line">
              <span>{study.role}</span>
              <span>{study.period}</span>
            </div>
            {study.fullGameplayVideo && (
              <button
                className="case-primary-link"
                type="button"
                onClick={() => setActiveMedia({
                  type: "video",
                  src: study.fullGameplayVideo,
                  poster: study.fullGameplayPoster,
                  title: "完整实机演示 / Full Gameplay Demo",
                })}
              >
                观看完整实机演示 <Arrow diagonal />
              </button>
            )}
          </div>
          <div className="case-video-card">
            <img src={study.media} alt="Combat Shuang 自动攻击与角色移动实机演示" loading="lazy" decoding="async" />
            <span>GAMEPLAY PREVIEW / AUTO ATTACK LOOP</span>
          </div>
        </div>
      </section>

      <section className="case-section responsibility-section">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">ROLE / RESPONSIBILITY</span>
            <h2>我在项目里负责什么</h2>
          </div>
          <div className="case-list">
            {study.responsibilities.map((item, index) => (
              <div className="case-list-item" key={item}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section compact-case-section metrics-strip-section">
        <div className="shell">
          <div className="case-metrics case-metrics-wide ui-case-metrics">
            {study.metrics.map((metric) => (
              <div className="case-metric" key={`${metric.value}-${metric.label}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section" id="loop">
        <div className="shell">
          <div className="case-section-head">
            <span className="eyebrow">CORE LOOP</span>
            <h2>把“少操作”变成“多决策”</h2>
          </div>
          <CoreLoopDiagram study={study} />
          <div className="loop-grid">
            {study.loop.map((item) => (
              <article className="loop-card" key={item.step}>
                <small>{item.step}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section" id="upgrade">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">UPGRADE DESIGN</span>
            <h2>升级系统：<br /><span className="title-nowrap-line">属性成长 + 弹道变化 + 风险收益</span></h2>
            <p className="case-side-note">这部分展示升级词条池、特殊弹道、出现概率和 Lv.6 后风险收益；下方实机证据用来证明机制已经在原型中跑通。</p>
            {study.upgradeEvidence && (
              <figure className="upgrade-evidence upgrade-evidence-side">
                <button
                  className="upgrade-evidence-media"
                  type="button"
                  onClick={() => setActiveMedia({ type: "image", src: study.upgradeEvidence.image, title: study.upgradeEvidence.title })}
                  aria-label="放大查看诅咒升级截图"
                >
                  <img src={study.upgradeEvidence.image} alt={study.upgradeEvidence.title} loading="lazy" decoding="async" />
                  <span>{study.upgradeEvidence.label}</span>
                </button>
                <figcaption>
                  <h3>{study.upgradeEvidence.title}</h3>
                  <p>{study.upgradeEvidence.text}</p>
                  <div className="evidence-actions">
                    <button
                      type="button"
                      onClick={() => setActiveMedia({ type: "video", src: study.upgradeEvidence.video, poster: study.upgradeEvidence.image, title: "诅咒升级演示视频" })}
                    >
                      播放诅咒升级演示 <Arrow diagonal />
                    </button>
                  </div>
                </figcaption>
              </figure>
            )}
          </div>
          <div className="upgrade-content">
            <div className="upgrade-columns">
              {study.upgradeSystem.map((group) => (
                <article className="upgrade-column" key={group.title}>
                  <h3>{group.title}</h3>
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </article>
              ))}
              <article className="upgrade-column risk-column">
                <h3>Lv.6 风险收益</h3>
                {study.riskReward.map((item) => <span key={item}>{item}</span>)}
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="case-section upgrade-table-section" id="balance">
        <div className="shell">
          <div className="case-section-head">
            <span className="eyebrow">BALANCE TABLE</span>
            <h2>升级词条与数值表</h2>
          </div>
          <div className="upgrade-table-wrap">
            <table className="upgrade-table">
              <thead>
                <tr>
                  <th>词条</th>
                  <th>类型</th>
                  <th>数值</th>
                  <th>触发条件</th>
                  <th>设计目的</th>
                </tr>
              </thead>
              <tbody>
                {study.upgradeTable.map((item) => (
                  <tr key={`${item.name}-${item.type}`}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.value}</td>
                    <td>{item.condition}</td>
                    <td>{item.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="system-rule-grid">
            {study.systemRules.map((rule, index) => (
              <article className="system-rule" key={rule}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <p>{rule}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section enemy-wave-section">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">ENEMY / WAVE</span>
            <h2>敌人行为与波次压力</h2>
            <p className="case-side-note">{study.wave}</p>
          </div>
          <div className="enemy-grid">
            {study.enemies.map((enemy) => (
              <article className="enemy-card" key={enemy.name}>
                <h3>{enemy.name}</h3>
                <p>{enemy.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section iteration-section" id="iteration">
        <div className="shell">
          <div className="case-section-head">
            <span className="eyebrow">PLAYTEST / ITERATION</span>
            <h2>真实 Playtest 反馈与设计迭代</h2>
          </div>
          <div className="playtest-docs">
            {study.playtestDocs.map((doc) => (
              <article className="playtest-doc" key={doc.title}>
                <span>{doc.date}</span>
                <h3>{doc.title}</h3>
                <p>{doc.summary}</p>
                <small>{doc.status}</small>
              </article>
            ))}
          </div>
          <div className="iteration-list">
            {study.iterationRecords.map((item, index) => (
              <article className="iteration-card" key={item.title}>
                <div className="iteration-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="iteration-main">
                  <h3>{item.title}</h3>
                  <div className="iteration-columns">
                    <div><small>问题 / 假设</small><p>{item.before}</p></div>
                    <div><small>设计动作</small><p>{item.action}</p></div>
                    <div><small>预期效果</small><p>{item.result}</p></div>
                  </div>
                  <span className="iteration-source">{item.evidence}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="case-footer">
        <a href={projectsHref}>返回项目列表 <Arrow diagonal /></a>
        <a href={`mailto:${profile.email}`}>联系我 <Arrow diagonal /></a>
      </footer>
      {activeMedia && (
        <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={activeMedia.title}>
          <button className="lightbox-backdrop" type="button" onClick={() => setActiveMedia(null)} aria-label="关闭预览" />
          <div className="lightbox-panel">
            <div className="lightbox-top">
              <span>{activeMedia.title}</span>
              <button type="button" onClick={() => setActiveMedia(null)}>关闭</button>
            </div>
            {activeMedia.type === "video" ? (
              <video src={activeMedia.src} poster={activeMedia.poster} controls autoPlay playsInline preload="metadata" />
            ) : (
              <img src={activeMedia.src} alt={activeMedia.title} loading="lazy" decoding="async" />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function UnityUICase() {
  const study = caseStudies.ui;
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <main className="case-page ui-case">
      <header className="case-header">
        <a className="brand" href={homeHref} aria-label="返回首页">
          M<span className="brand-dot">·</span>G
        </a>
        <nav className="case-nav" aria-label="UI 案例导航">
          <a href={homeHref}>首页</a>
          <a href="#brief">任务</a>
          <a href="#flow">流程</a>
          <a href="#clips">视频</a>
          <a href="#implementation">落地</a>
        </nav>
        <a className="header-contact" href={`mailto:${profile.email}`}>
          LET'S TALK <span className="status-dot" />
        </a>
      </header>

      <section className="case-hero">
        <div className="case-bg-grid" />
        <div className="shell case-hero-grid">
          <div className="case-hero-copy">
            <span className="eyebrow">{study.engine}</span>
            <h1>{study.title}</h1>
            <p className="case-subtitle">{study.subtitle}</p>
            <p className="case-summary">{study.summary}</p>
            <div className="case-meta-line">
              <span>{study.role}</span>
              <span>{study.period}</span>
            </div>
          </div>
          <div className="case-video-card ui-hero-cover">
            <img src={study.cover} alt="Combat Shuang UI 主菜单封面" loading="lazy" decoding="async" />
            <div className="ui-cover-copy">
              <em>UI CASE COVER</em>
              <div>
                <small>MAIN MENU</small>
                <small>HOW TO PLAY</small>
                <small>SETTINGS</small>
                <small>LOCALIZATION</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="case-section compact-case-section metrics-strip-section">
        <div className="shell">
          <div className="case-metrics ui-metrics-grid">
            {study.metrics.map((metric) => (
              <div className="case-metric" key={`${metric.value}-${metric.label}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section ui-brief-section" id="brief">
        <div className="shell">
          <div className="ui-brief-head">
            <span className="eyebrow">DESIGN BRIEF</span>
            <h2>把玩家第一次进入游戏前后的关键路径整理清楚。</h2>
          </div>
          <div className="ui-brief-panel">
            <article>
              <small>PROBLEM</small>
              <p>{study.brief.problem}</p>
            </article>
            <article>
              <small>METHOD</small>
              <p>{study.brief.approach}</p>
            </article>
            <article>
              <small>RESULT</small>
              <p>{study.brief.outcome}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="case-section ui-showcase-section" id="flow">
        <div className="shell">
          <div className="case-section-head ui-section-head">
            <span className="eyebrow">UI / ONBOARDING / LOCALIZATION</span>
            <h2 className="ui-flow-title">把入口、教学、设置和语言切换串成一条玩家路径</h2>
            <p>这页单独展示 UI 工作：玩家从主菜单进入玩法说明或设置，在理解核心规则后进入 Gameplay；语言切换和交互反馈保证界面能被不同玩家顺畅使用。</p>
          </div>
          <div className="ui-flow">
            {study.flow.map((item, index) => (
              <div className="ui-flow-step" key={item}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="ui-point-grid">
            {study.designDecisions.map((point) => (
              <article className="ui-point" key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section" id="clips">
        <div className="shell">
          <div className="case-section-head">
            <span className="eyebrow">INTERACTION PROOF</span>
            <h2>三段实机展示</h2>
          </div>
          <div className="ui-video-grid">
            {study.clips.map((clip) => (
              <article className="ui-video-card" key={clip.title}>
                <button
                  className="ui-video-frame"
                  type="button"
                  onClick={() => setActiveMedia({ type: "video", src: clip.src, title: clip.title })}
                  aria-label={`播放 ${clip.title}`}
                >
                  <LazyVideo src={clip.src} muted loop autoPlay playsInline />
                  <span>{clip.label}</span>
                </button>
                <div>
                  <h3>{clip.title}</h3>
                  <p>{clip.text}</p>
                  <button
                    type="button"
                    onClick={() => setActiveMedia({ type: "video", src: clip.src, title: clip.title })}
                  >
                    打开视频 <Arrow diagonal />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section transfer-section" id="implementation">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">UNITY IMPLEMENTATION</span>
            <h2>不是只画界面，<br />也考虑了交互和工程落地</h2>
            <p className="case-side-note">这部分用脚本和表结构说明：界面不是静态图，而是可以响应玩家操作、切换语言、提供反馈的 Unity UI。</p>
          </div>
          <div className="transfer-grid">
            {study.implementation.map((item) => (
              <article className="transfer-card" key={item.title}>
                <small>UI LOGIC</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="case-footer">
        <a href={projectsHref}>返回项目列表 <Arrow diagonal /></a>
        <a href={`mailto:${profile.email}`}>联系我 <Arrow diagonal /></a>
      </footer>
      {activeMedia && (
        <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={activeMedia.title}>
          <button className="lightbox-backdrop" type="button" onClick={() => setActiveMedia(null)} aria-label="关闭预览" />
          <div className="lightbox-panel">
            <div className="lightbox-top">
              <span>{activeMedia.title}</span>
              <button type="button" onClick={() => setActiveMedia(null)}>关闭</button>
            </div>
            <video src={activeMedia.src} controls autoPlay playsInline preload="metadata" />
          </div>
        </div>
      )}
    </main>
  );
}

function VampireCase() {
  const study = caseStudies.vampire;

  return (
    <main className="case-page vampire-case">
      <header className="case-header">
        <a className="brand" href={homeHref} aria-label="返回首页">
          M<span className="brand-dot">·</span>G
        </a>
        <nav className="case-nav" aria-label="案例导航">
          <a href={homeHref}>首页</a>
          <a href="#framework">核心拆解</a>
          <a href="#rhythm">系统分析</a>
          <a href="#transfer">设计迁移</a>
          <a href={study.pdf} target="_blank" rel="noreferrer">PDF</a>
        </nav>
        <a className="header-contact" href={`mailto:${profile.email}`}>
          LET'S TALK <span className="status-dot" />
        </a>
      </header>

      <section className="case-hero vampire-hero">
        <div className="case-bg-grid" />
        <div className="shell case-hero-grid">
          <div className="case-hero-copy">
            <span className="eyebrow">{study.engine}</span>
            <h1>{study.title}</h1>
            <p className="case-subtitle">{study.subtitle}</p>
            <p className="case-summary">{study.summary}</p>
            <div className="case-meta-line">
              <span>{study.role}</span>
              <span>{study.period}</span>
            </div>
            <a className="case-primary-link" href={study.pdf} target="_blank" rel="noreferrer">
              阅读完整 PDF <Arrow diagonal />
            </a>
          </div>
          <div className="vampire-document-hero">
            <button className="vampire-doc-layer layer-left" type="button" aria-label="预览产品定位页">
              <img src={study.spreads[0]} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            </button>
            <button className="vampire-doc-layer layer-right" type="button" aria-label="预览目标用户页">
              <img src={study.spreads[1]} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            </button>
            <button className="vampire-doc-layer layer-main" type="button" aria-label="预览分析文档封面">
              <img src={study.media} alt="Vampire Survivors 分析文档封面" loading="lazy" decoding="async" />
            </button>
            <span>DOCUMENT PREVIEW / GAME ANALYSIS</span>
          </div>
        </div>
      </section>

      <section className="case-section">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">ANALYSIS SCOPE</span>
            <h2>这份分析文档解决什么问题</h2>
          </div>
          <div className="case-list">
            {study.responsibilities.map((item, index) => (
              <div className="case-list-item" key={item}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section compact-case-section metrics-strip-section">
        <div className="shell">
          <div className="case-metrics case-metrics-wide">
            {study.metrics.map((metric) => (
              <div className="case-metric" key={`${metric.value}-${metric.label}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section" id="framework">
        <div className="shell">
          <div className="case-section-head">
            <span className="eyebrow">FRAMEWORK</span>
            <h2>从四个层面拆解游戏体验</h2>
          </div>
          <div className="analysis-framework-grid">
            {study.analysisFramework.map((item, index) => (
              <article className="analysis-card" key={item.title}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section rhythm-section" id="rhythm">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">30 MIN RUNTIME</span>
            <h2>局内节奏：<br /><span className="title-nowrap-line">压力与成长交替推进</span></h2>
            <p className="case-side-note">文档将单局体验拆成 0—3、3—10、10—20、20—30 分钟四个阶段，观察敌群压力、玩家成长和构筑目标如何逐段变化。</p>
          </div>
          <div className="phase-table">
            {study.phaseTable.map((item) => (
              <article className="phase-row phase-timeline-row" key={item.phase}>
                <span>{item.time}</span>
                <h3>{item.phase}</h3>
                <p>{item.pressure}</p>
                <small>{item.goal}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section">
        <div className="shell">
          <div className="case-section-head">
            <span className="eyebrow">KEY INSIGHTS</span>
            <h2>可以迁移到自己项目的设计结论</h2>
          </div>
          <div className="vampire-insight-grid">
            {study.keyInsights.map((item) => (
              <article className="vampire-insight" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section transfer-section" id="transfer">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">TRANSFER TO PROTOTYPE</span>
            <h2>这份分析如何反哺 Combat Shuang</h2>
            <p className="case-side-note">这部分把“分析能力”和“落地能力”连起来：不是只会写拆解文档，也能把成熟作品里的机制判断迁移到自己的系统设计里。</p>
          </div>
          <div className="transfer-grid">
            {study.transfer.map((item, index) => (
              <article className="transfer-card" key={item.title}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section recommendations-section" id="recommendations">
        <div className="shell">
          <div className="case-section-head">
            <span className="eyebrow">DESIGN PROPOSAL</span>
            <h2>从分析延伸出的优化建议</h2>
          </div>
          <div className="recommendation-list">
            {study.recommendations.map((item, index) => (
              <article className="recommendation-card" key={item.issue}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <div>
                  <h3>{item.issue}</h3>
                  <p>{item.suggestion}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="case-footer">
        <a href={projectsHref}>返回项目列表 <Arrow diagonal /></a>
        <a href={study.pdf} target="_blank" rel="noreferrer">阅读完整 PDF <Arrow diagonal /></a>
      </footer>
    </main>
  );
}

function DarkTowerCase() {
  const study = caseStudies.darkTower;
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <main className="case-page dark-tower-case">
      <header className="case-header">
        <a className="brand" href={homeHref} aria-label="返回首页">
          M<span className="brand-dot">·</span>G
        </a>
        <nav className="case-nav" aria-label="暗渊之塔案例导航">
          <a href={homeHref}>首页</a>
          <a href="#loop">循环</a>
          <a href="#classes">职业</a>
          <a href="#build">构筑</a>
          <a href="#iteration">取舍</a>
        </nav>
        <a className="header-contact" href={`mailto:${profile.email}`}>
          LET'S TALK <span className="status-dot" />
        </a>
      </header>

      <section className="case-hero tower-hero">
        <div className="case-bg-grid" />
        <div className="shell case-hero-grid">
          <div className="case-hero-copy">
            <span className="eyebrow">{study.engine}</span>
            <h1>{study.title}</h1>
            <p className="case-subtitle">{study.subtitle}</p>
            <p className="case-summary">{study.summary}</p>
            <div className="case-meta-line">
              <span>{study.role}</span>
              <span>{study.period}</span>
            </div>
            <p className="tower-responsibility">{study.responsibility}</p>
            <div className="tower-hero-actions">
              <span>可试玩原型已完成</span>
              <span>完整玩法流程演示</span>
              <a className="tower-playable-button" href={study.playtestUrl} target="_blank" rel="noreferrer">
                PLAYABLE TEST <span className="tower-playable-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <figure className="tower-hero-real-media">
            <button
              className="tower-image-button tower-hero-image-button"
              type="button"
              onClick={() => setActiveMedia({ type: "image", src: study.media.heroImage, title: "首屏主图" })}
              aria-label="放大查看首屏主图"
            >
              <img src={study.media.heroImage} alt="暗渊之塔首屏主图，展示俯视角动作 Roguelite 原型画面" decoding="async" />
            </button>
            <figcaption>
              <small>PLAYABLE TOP-DOWN ACTION ROGUELITE PROTOTYPE</small>
              <strong>可试玩玩法原型</strong>
              <p>第一眼展示项目的俯视角战斗场景、原型画面与可运行状态。</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="case-section tower-demo-section" id="demo">
        <div className="shell tower-demo-layout">
          <div>
            <span className="eyebrow">MAIN DEMO</span>
            <h2>完整玩法流程演示</h2>
            <p className="case-side-note">展示从大厅准备、技能配置、路线选择，到战斗、奖励和商店的完整玩法链路。</p>
          </div>
          <div className="tower-demo-video">
            <LazyVideo src={study.media.mainVideo} controls playsInline poster={study.media.heroImage} autoPlay={false} />
            <div>
              <small>FULL GAMEPLAY FLOW</small>
              <span>Lobby / Skill Config / Route / Combat / Reward / Shop</span>
            </div>
          </div>
        </div>
      </section>

      <section className="case-section compact-case-section metrics-strip-section">
        <div className="shell">
          <div className="case-metrics dark-tower-metrics">
            {study.metrics.map((metric) => (
              <div className="case-metric" key={`${metric.value}-${metric.label}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section" id="loop">
        <div className="shell">
          <div className="case-section-head tower-section-head">
            <span className="eyebrow">CORE LOOP</span>
            <h2>用路线选择串联局外成长与局内构筑</h2>
            <p>我希望玩家在看到路线地图时就开始规划本局方向：根据血量、金币和当前构筑，在精英、商人、休整与普通战斗之间做风险收益选择。</p>
          </div>
          <div className="tower-loop-layout">
            <div className="tower-core-loop-panel">
              <div className="tower-core-loop-vertical" aria-label="暗渊之塔核心玩法循环图：局外成长、职业技能配置、路线选择、节点事件、奖励获取、构筑强化，并回到路线选择。">
                {["局外成长", "职业 / 技能配置", "路线选择", "战斗 / 商人 / 休整", "圣物 / 金币 / 附魔", "构筑强化"].map((item, index) => (
                  <React.Fragment key={item}>
                    <article className={`vertical-loop-card ${item === "路线选择" ? "is-anchor" : ""}`}>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <strong>{item}</strong>
                    </article>
                    {index < 5 && <span className="vertical-loop-arrow" aria-hidden="true">↓</span>}
                  </React.Fragment>
                ))}
                <article className="vertical-loop-card vertical-loop-return">
                  <small>↺ LOOP</small>
                  <strong>回到路线选择</strong>
                </article>
              </div>
              <small>CORE GAMEPLAY LOOP DIAGRAM</small>
            </div>
            <div className="tower-loop-list">
              {study.loopPurposes.map((item, index) => (
                <article className="tower-loop-item" key={item.title}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <span>{item.title}</span>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="case-section tower-goals-section">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">DESIGN TARGET</span>
            <h2>这个原型主要验证什么</h2>
            <p className="case-side-note">本项目聚焦验证三个设计问题：职业战斗节奏是否有差异、局外成长是否能支撑长期目标、局内圣物与附魔是否能形成可理解的构筑方向。</p>
          </div>
          <div className="tower-goal-grid">
            {study.goals.map((goal, index) => (
              <article className="tower-goal-card" key={goal.title}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{goal.title}</h3>
                <p>{goal.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section tower-decision-section" id="iteration">
        <div className="shell">
          <div className="case-section-head tower-section-head">
            <span className="eyebrow">DESIGN ITERATION</span>
            <h2>设计迭代与取舍</h2>
          </div>
          <div className="tower-decision-list">
            {study.decisions.map((decision, index) => (
              <article className="tower-decision-card" key={decision.title}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <div>
                  <h3>{decision.title}</h3>
                  <div className="tower-decision-steps">
                    <p><em>初版问题</em>{decision.problem}</p>
                    <p><em>调整方案</em>{decision.action}</p>
                    <p><em>设计结果</em>{decision.result}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section tower-outgame-section" id="outgame">
        <div className="shell">
          <div className="case-section-head tower-section-head">
            <span className="eyebrow">META PROGRESSION</span>
            <h2>局外成长：让构筑从开局前开始</h2>
            <p>玩家在进入战斗前，可以通过玩家强化、职业强化和技能配置决定本局的基础玩法方向。职业强化包含属性成长、技能解锁与技能分支，技能配置则让玩家选择本局携带的主动技能。</p>
          </div>
          <div className="tower-outgame-grid">
            {study.outgameShowcase.map((item, index) => (
              <article className="tower-outgame-card" key={item.title}>
                <button
                  className="tower-image-button"
                  type="button"
                  onClick={() => setActiveMedia({ type: "image", src: item.src, title: item.title })}
                  aria-label={`放大查看${item.title}`}
                >
                  <img src={item.src} alt={`暗渊之塔${item.title}截图`} loading="lazy" decoding="async" />
                </button>
                <div>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section" id="classes">
        <div className="shell">
          <div className="case-section-head tower-section-head">
            <span className="eyebrow">CLASS / COMBAT DESIGN</span>
            <h2>用战士与法师拆出两种战斗节奏</h2>
          </div>
          <div className="tower-class-grid">
            {study.classes.map((job) => (
              <article className="tower-class-card" key={job.title}>
                <div>
                  <small>{job.label}</small>
                  <h3>{job.title}</h3>
                  <p>{job.text}</p>
                </div>
                <div className="tower-keywords">
                  {job.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section tower-combat-media-section">
        <div className="shell">
          <div className="case-section-head tower-section-head">
            <span className="eyebrow">COMBAT RHYTHM</span>
            <h2>职业战斗节奏</h2>
            <p>战士强调近战、连击、突进与生存能力；法师强调咏唱、大范围、持续伤害和控制。两个职业通过不同技能机制形成不同的操作节奏。</p>
          </div>
          <div className="tower-combat-video-grid">
            <article className="tower-combat-video-card">
              <LazyVideo src={study.media.warriorVideo} controls playsInline autoPlay={false} />
              <div>
                <small>WARRIOR SKILLS</small>
                <h3>战士技能</h3>
                <p>用于验证近战压迫、突进切入、连击节奏和生存窗口是否能形成更主动的贴身战斗体验。</p>
              </div>
            </article>
            <article className="tower-combat-video-card">
              <LazyVideo src={study.media.mageVideo} controls playsInline autoPlay={false} />
              <div>
                <small>MAGE SKILLS</small>
                <h3>法师技能</h3>
                <p>用于验证咏唱强化、大范围打击、持续伤害与控制是否能形成“准备—释放—连锁扩散”的远程节奏。</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="case-section" id="build">
        <div className="shell">
          <div className="case-section-head tower-section-head">
            <span className="eyebrow">BUILD SYSTEM</span>
            <h2>技能分支、圣物、附魔共同形成构筑差异</h2>
          </div>
          <div className="tower-build-grid">
            {study.buildSystems.map((system, index) => (
              <article className="tower-build-card" key={system.title}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{system.title}</h3>
                <p>{system.text}</p>
              </article>
            ))}
          </div>
          <div className="tower-archetype-grid">
            {study.archetypes.map((item) => (
              <article className="tower-archetype-card" key={item.title}>
                <span>代表流派</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section tower-route-section">
        <div className="shell tower-route-layout">
          <div>
            <span className="eyebrow">ROUTE SYSTEM</span>
            <h2>路线选择：<br />风险收益规划</h2>
            <p className="case-side-note">每局会生成随机路线。玩家需要根据当前血量、金币和构筑状态，在普通战斗、精英、商人、休整与 Boss 路线之间做选择。</p>
          </div>
          <figure className="tower-route-shot">
            <button
              className="tower-image-button tower-route-image-button"
              type="button"
              onClick={() => setActiveMedia({ type: "image", src: study.media.routeMap, title: "路线地图" })}
              aria-label="放大查看路线地图"
            >
              <img src={study.media.routeMap} alt="暗渊之塔随机路线地图截图" loading="lazy" decoding="async" />
            </button>
            <figcaption>ROUTE MAP / RISK REWARD PLANNING</figcaption>
          </figure>
        </div>
      </section>

      <section className="case-section tower-reward-section">
        <div className="shell">
          <div className="case-section-head tower-section-head">
            <span className="eyebrow">REWARD / SHOP</span>
            <h2>局内奖励：圣物、附魔与金币取舍</h2>
            <p>战斗结束后，玩家可以获得圣物、金币和附魔等局内奖励。商店提供治疗、附魔、圣物等商品，让玩家根据当前构筑和资源情况做取舍。</p>
          </div>
          <div className="tower-reward-grid">
            <figure>
              <button
                className="tower-image-button tower-reward-image-button"
                type="button"
                onClick={() => setActiveMedia({ type: "image", src: study.media.battleReward, title: "战斗奖励" })}
                aria-label="放大查看战斗奖励"
              >
                <img src={study.media.battleReward} alt="暗渊之塔战斗奖励界面截图" loading="lazy" decoding="async" />
              </button>
              <figcaption>战斗奖励 / 圣物、金币、附魔</figcaption>
            </figure>
            <figure>
              <button
                className="tower-image-button tower-reward-image-button"
                type="button"
                onClick={() => setActiveMedia({ type: "image", src: study.media.shop, title: "商店" })}
                aria-label="放大查看商店"
              >
                <img src={study.media.shop} alt="暗渊之塔商店界面截图" loading="lazy" decoding="async" />
              </button>
              <figcaption>商店 / 治疗、附魔、圣物商品</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="case-section tower-status-section" id="scope">
        <div className="shell tower-status-layout">
          <div>
            <span className="eyebrow">IMPLEMENTED</span>
            <h2>当前完成内容</h2>
            <p className="case-side-note">以下内容已在当前原型中完成，用于支撑完整一局的玩法验证。</p>
            <div className="tower-check-grid">
              {study.implemented.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div>
            <span className="eyebrow">PROTOTYPE SCOPE</span>
            <h2>原型边界与优化方向</h2>
            <p className="case-side-note">当前版本重点验证玩法系统与构筑循环，因此将展示重点放在职业、路线、奖励和构筑决策上。</p>
            <div className="tower-plan-list">
              {study.nextPlan.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="case-section tower-reference-section">
        <div className="shell case-two-col">
          <div>
            <span className="eyebrow">REFERENCE</span>
            <h2>参考机制与设计借鉴</h2>
          </div>
          <div className="transfer-grid">
            {study.references.map((item) => (
              <article className="transfer-card" key={item.title}>
                <small>DESIGN REFERENCE</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="case-footer">
        <a href={projectsHref}>返回项目列表 <Arrow diagonal /></a>
        <a href={`mailto:${profile.email}`}>联系我 <Arrow diagonal /></a>
      </footer>
      {activeMedia && (
        <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={activeMedia.title}>
          <button className="lightbox-backdrop" type="button" onClick={() => setActiveMedia(null)} aria-label="关闭预览" />
          <div className="lightbox-panel">
            <div className="lightbox-top">
              <span>{activeMedia.title}</span>
              <button type="button" onClick={() => setActiveMedia(null)}>关闭</button>
            </div>
            <img src={activeMedia.src} alt={activeMedia.title} loading="lazy" decoding="async" />
          </div>
        </div>
      )}
    </main>
  );
}

function CoreLoopDiagram({ study }) {
  return (
    <div className="core-loop-diagram" role="img" aria-label="Combat Shuang 核心循环图：移动翻滚、自动锁敌、自动攻击、击杀经验、升级三选一、波次加压形成闭环。">
      <div className="loop-diagram-head">
        <span>RUNTIME LOOP</span>
        <span>PLAYER INPUT → AUTO COMBAT → GROWTH CHOICE → PRESSURE RESET</span>
      </div>
      <div className="loop-flow">
        {study.loopDiagram.map((node, index) => (
          <React.Fragment key={node.code}>
            <article className={`loop-node loop-node-${index + 1}`}>
              <small>{node.code}</small>
              <h3>{node.title}</h3>
              <p>{node.text}</p>
            </article>
            {index < study.loopDiagram.length - 1 && (
              <span className="loop-arrow" aria-hidden="true">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="loop-return">
        <span aria-hidden="true">↺</span>
        <p>波次压力回流：更高敌群密度、更短生成间隔、更高敌人生命，把玩家重新推回走位与 Build 验证。</p>
      </div>
      <div className="loop-modifiers" aria-label="循环调节器">
        {study.loopModifiers.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

function App() {
  const route = currentRoute();

  if (route === "/projects/dark-tower") {
    return (
      <>
        <CursorGlow />
        <DarkTowerCase />
      </>
    );
  }

  if (route === "/projects/roguelike") {
    return (
      <>
        <CursorGlow />
        <RoguelikeCase />
      </>
    );
  }

  if (route === "/projects/vampire-survivors") {
    return (
      <>
        <CursorGlow />
        <VampireCase />
      </>
    );
  }

  if (route === "/projects/unity-ui") {
    return (
      <>
        <CursorGlow />
        <UnityUICase />
      </>
    );
  }

  return (
    <>
      <CursorGlow />
      <Hero />
      <main>
        <Projects />
        <Profile />
        <Abilities />
        <GameExperience />
        <Timeline />
      </main>
      <Contact />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
