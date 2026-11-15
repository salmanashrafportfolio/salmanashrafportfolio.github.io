import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Asterisk, Download, Instagram, Linkedin, Mail, Github, Copy, Check, Menu, X, Sparkles, GraduationCap, GitBranch, Database, BarChart3, Sheet, Workflow, Presentation, MessageSquare, ScanEye, Figma, Wrench, CodeXml, MessagesSquare, Eye, MousePointerClick, Speech, Split, Gauge, LayoutTemplate, MousePointer2, Palette, Accessibility, Component, Cloud, Kanban, Hash } from 'lucide-react';
import { projects, testimonials, experience, education, certificates, skills, places, clips } from './projects';
import { strings, deLabels, deDescriptions } from './i18n';
import './styles.css';

const EMAIL = 'salman.ashraff20@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/m-salman-bhatti';
const INSTAGRAM = 'https://www.instagram.com/salmancapturedthis/';
const CV_URL = '/Muhammad_Salman_Bhatti_CV.pdf';
const GITHUB = 'https://github.com/msalmanbhatti';
const routes = ['home', 'work', 'about', ...projects.map(p => p.id)];
// Real addresses: / , /work , /about , /work/<project>
function pathToPage(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return 'home';
  if (clean === '/work') return 'work';
  if (clean === '/about') return 'about';
  const m = clean.match(/^\/work\/([a-z0-9-]+)$/i);
  if (m && routes.includes(m[1])) return m[1];
  return 'notfound';
}
function pageToPath(page) {
  if (page === 'home') return '/';
  if (page === 'work') return '/work';
  if (page === 'about') return '/about';
  return '/work/' + page;
}

const LightboxContext = createContext(() => {});
const LangContext = createContext({ lang: 'en', t: strings.en, setLang: () => {} });
const useLang = () => useContext(LangContext);

// Mouse dragging for carousels. Touch keeps its native scrolling.
// enableDragScroll: for containers that scroll sideways (overflow-x).
function enableDragScroll(el) {
  if (!el) return () => {};
  let down = false, startX = 0, startLeft = 0, moved = false;
  const onDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    el.classList.add('is-dragging');
  };
  const onMove = (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    el.scrollLeft = startLeft - dx;
  };
  const onUp = () => {
    if (!down) return;
    down = false; el.classList.remove('is-dragging');
    if (moved) el.dataset.dragged = '1';
  };
  // a drag should not open the image it started on
  const onClick = (e) => { if (el.dataset.dragged) { e.preventDefault(); e.stopPropagation(); delete el.dataset.dragged; } };
  el.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  el.addEventListener('click', onClick, true);
  return () => {
    el.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    el.removeEventListener('click', onClick, true);
  };
}

// enableMarqueeDrag: for rows that move on their own with a CSS animation.
// Dragging takes over the position; releasing resumes the animation from there.
function enableMarqueeDrag(el, track, keyframes, duration) {
  if (!el || !track) return () => {};
  let down = false, startX = 0, base = 0, moved = false;
  const half = () => track.offsetWidth / 2;
  const wrap = (x) => { const h = half(); return -(((-x % h) + h) % h); };
  const onDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const m = getComputedStyle(track).transform;
    base = m && m !== 'none' ? new DOMMatrix(m).m41 : 0;
    track.style.animation = 'none';
    track.style.transform = `translateX(${base}px)`;
    down = true; moved = false; startX = e.clientX;
    el.classList.add('is-dragging');
  };
  const onMove = (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.style.transform = `translateX(${wrap(base + dx)}px)`;
  };
  const onUp = () => {
    if (!down) return;
    down = false; el.classList.remove('is-dragging');
    const x = new DOMMatrix(getComputedStyle(track).transform).m41;
    const progress = ((-x / half()) % 1 + 1) % 1;
    track.style.transform = '';
    track.style.animation = `${keyframes} ${duration}s linear infinite`;
    track.style.animationDelay = `${-progress * duration}s`;
    if (moved) el.dataset.dragged = '1';
  };
  const onClick = (e) => { if (el.dataset.dragged) { e.preventDefault(); e.stopPropagation(); delete el.dataset.dragged; } };
  el.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  el.addEventListener('click', onClick, true);
  return () => {
    el.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    el.removeEventListener('click', onClick, true);
  };
}

function ZoomImage({ src, alt, label, className, tall }) {
  const { t } = useLang();
  const open = useContext(LightboxContext);
  return <button type="button" className={className ? `zoom ${className}` : 'zoom'} onClick={() => open({ src, alt: alt || label, tall })} aria-label={`${t.enlarge}: ${alt || label}`}><img src={src} alt={alt} loading="lazy"/></button>;
}

function Lightbox({ image, onClose }) {
  const { t } = useLang();
  const closeRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const { style } = document.body;
    style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    style.overflow = 'hidden';
    closeRef.current.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      style.overflow = '';
      style.paddingRight = '';
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);
  return <div className={image.tall ? 'lightbox tall' : 'lightbox'} role="dialog" aria-modal="true" aria-label={image.alt} onClick={onClose}>
    <button type="button" className="lightbox-close" ref={closeRef} onClick={onClose} aria-label={t.closeImage}><X/></button>
    <img src={image.src} alt={image.alt} onClick={e => e.stopPropagation()}/>
  </div>;
}

function Rich({ text }) {
  return text.split('**').map((part, i) => i % 2 ? <b key={i}>{part}</b> : part);
}

const NAV = [['sec-work', 'work'], ['sec-about', 'about'], ['sec-experience', 'navExp']];

function Header({ setPage, goSection }) {
  const { t } = useLang();
  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const set = () => document.documentElement.style.setProperty('--header-space', `${el.offsetHeight + parseFloat(getComputedStyle(el).marginTop)}px`);
    set(); const ro = new ResizeObserver(set); ro.observe(el); window.addEventListener('resize', set);
    return () => { ro.disconnect(); window.removeEventListener('resize', set); };
  }, []);
  // once the navbar has moved past the hero, it turns accent with light text
  useEffect(() => {
    const header = ref.current; if (!header) return;
    const update = () => {
      const hero = document.querySelector('.hero');
      const h = header.getBoundingClientRect();
      const r = hero ? hero.getBoundingClientRect() : null;
      header.classList.toggle('past-hero', !!r && r.bottom <= h.bottom);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  });
  return <header className="header" ref={ref}>
    <button className="brand" onClick={() => go('home')} aria-label={t.home}><span className="brand-text space-grotesk" aria-hidden="true">salman</span></button>
    <nav className="nav-links" aria-label={t.mainNav}>
      {NAV.map(([id, key]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); goSection(id); }}>{t[key]}</a>)}
    </nav>
  </header>;
}

function CopyEmailButton({ label, className, iconSize, leadIcon }) {
  const { t } = useLang();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };
  return <button className={className} onClick={copy} aria-label={`${label}: ${EMAIL} ${t.copy}`}>{leadIcon}<span className="btn-label">{label}</span> {!leadIcon && <ArrowUpRight size={iconSize}/>}</button>;
}

function BackToTop() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight / 2);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const toTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  return <button className={visible ? 'back-top visible' : 'back-top'} onClick={toTop} aria-label={t.toTop}><ArrowUp size={20}/></button>;
}

function BackButton({ page, setPage }) {
  const { t } = useLang();
  const back = () => {
    if (window.history.state?.depth > 0) { window.history.back(); return; }
    setPage(page === 'work' || page === 'about' ? 'home' : 'work');
  };
  return <div className="back-bar section-pad"><button className="pill-link secondary back-link" onClick={back}><ArrowLeft size={17}/> {t.back}</button></div>;
}

function Footer() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { window.location.href = `mailto:${EMAIL}`; }
  };
  return <footer className="footer">
    <div className="footer-top">
      <h2>{t.footH1}<em>{t.footH2}</em></h2>
      <p className="footer-sub">{t.footSub}</p>
      <p className="footer-text">{t.footText}</p>
      <a className="footer-email" href={`mailto:${EMAIL}`}><Mail size={20}/>{EMAIL}</a>
      <div className="footer-actions">
        <div className="footer-social">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18}/></a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18}/></a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18}/></a>
        </div>
        <button type="button" className="footer-btn" onClick={copy}>{copied ? <Check size={17}/> : <Copy size={17}/>}<span aria-live="polite">{copied ? t.copied : t.copyEmail}</span></button>
        <a className="footer-btn solid" href={CV_URL} target="_blank" rel="noopener noreferrer"><Download size={17}/>{t.cvMy}</a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 Salman Bhatti</span>
    </div>
  </footer>;
}

// Animated blue silk, drawn with WebGL behind the hero content.
const SILK_VS = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const SILK_FS = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uGrain;
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
}
float fbm(vec2 p){
  float v=0., a=.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=.5; }
  return v;
}
void main(){
  vec2 res = max(uRes, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / res;
  float aspect = res.x / res.y;
  vec2 p = vec2(uv.x*aspect, uv.y);
  float t = uTime * 0.12;
  vec2 w = vec2(fbm(p*1.2 + vec2(t, -t*.6)), fbm(p*1.2 + vec2(-t*.7, t*.4) + 5.2));
  vec2 q = p + (w - .5) * .35;
  float x = q.x / aspect;
  float crest = 0.30
              + 0.22 * exp(-pow((x - 0.60 - 0.05*sin(t*1.3))*4.0, 2.))
              + 0.06 * sin(x*5.0 + t*2.0)
              - 0.10 * x;
  float d = q.y - crest;
  float light = smoothstep(1.25, 0.05, distance(uv, vec2(0.12, 0.85)) * 1.15);
  float shadow = smoothstep(0.03, -0.16, d);
  float ridge  = exp(-pow(d*9.0, 2.)) * 0.35;
  float valley = smoothstep(-0.05, -0.45, d) * (0.5 + 0.5*fbm(q*2.0 - t));
  float d2 = q.y - (0.62 + 0.08*sin(x*3.0 - t*1.5) + 0.25*x);
  float fold2 = exp(-pow(d2*4.0, 2.)) * 0.18;
  vec3 bright = vec3(0.13, 0.20, 0.98);
  vec3 mid    = vec3(0.07, 0.10, 0.70);
  vec3 dark   = vec3(0.03, 0.04, 0.30);
  vec3 deep   = vec3(0.01, 0.02, 0.10);
  vec3 col = mix(mid, bright, light);
  col = mix(col, dark, smoothstep(0.35, 1.0, uv.x) * 0.75 * (1. - light));
  col = mix(col, dark, shadow * 0.85);
  col = mix(col, deep, valley * 0.75);
  col += vec3(0.10, 0.12, 0.45) * ridge * (0.4 + light);
  col -= vec3(0.02, 0.03, 0.12) * fold2;
  float g = hash(gl_FragCoord.xy + fract(uTime*7.31)*vec2(91.7, 37.3)) - 0.5;
  float lum = dot(col, vec3(.3,.4,.3));
  col += g * uGrain * (0.16 + 0.10*(1. - lum)) * vec3(0.7, 0.75, 1.0);
  col *= 1.0 - 0.25 * pow(distance(uv, vec2(.45,.55)), 2.);
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`;

function HeroSilk() {
  const ref = useRef(null);
  useEffect(() => {
    // start after the page has painted, so the hero text is not held back
    let stop = () => {};
    const start = () => {
    const canvas = ref.current;
    const gl = canvas && canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // no WebGL: the hero's static texture stays visible
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compile = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, SILK_VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, SILK_FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uGrain = gl.getUniformLocation(prog, 'uGrain');
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    let t = 0, last = performance.now(), raf = 0, visible = true;
    const draw = () => {
      if (!canvas.width || !canvas.height) return;
      canvas.classList.add('is-live');
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uGrain, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const frame = (now) => {
      t += (now - last) / 1000; last = now;
      draw();
      raf = requestAnimationFrame(frame);
    };
    size();
    const ro = new ResizeObserver(() => { size(); if (reduce || !raf) draw(); });
    ro.observe(canvas);
    // only animate while the hero is on screen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (reduce) return;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(canvas);
    if (reduce) draw(); else { raf = requestAnimationFrame((now) => { last = now; frame(now); }); }
    stop = () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
    };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 300);
    return () => { window.cancelIdleCallback ? window.cancelIdleCallback(idle) : clearTimeout(idle); stop(); };
  }, []);
  return <canvas ref={ref} className="hero-silk" aria-hidden="true"/>;
}

function Hero({ setPage }) {
  const { lang, t } = useLang();
  const german = lang === 'de';
  return <section className={german ? 'hero hero-german' : 'hero'}>
    <HeroSilk/>
   
    <div className="hero-title-wrap">
      <p className="hero-kicker-line">{t.heroKicker}</p>
      <h1 className="hero-greet hero-name"><span className="name-wrap">{t.heroHi} <b>{t.heroName}</b>,<span className="pronounce" aria-hidden="true"><svg viewBox="0 0 44 24" aria-hidden="true"><path d="M42 6C36 18 30 18 26 11S16 4 5 13"/><path d="M13 14 4 14l3-8"/></svg><span>"zahl-mahn"<br/>{t.pronounce}</span></span></span></h1>
      <p className="hero-intro hero-lead">{t.heroP2}</p>
      <p className="hero-intro hero-meta">{t.heroP1}</p>
      <p className="sr-only">{lang === 'de' ? 'Ausgesprochen: zahl-mahn.' : 'Pronounced zahl-mahn, in German.'}</p>
      <div className="hero-actions">
        <button className="pill-link" onClick={() => setPage('work')}>{t.seeWork} <ArrowUpRight size={17}/></button>
        <a className="pill-link secondary" href={CV_URL} target="_blank" rel="noopener noreferrer">{t.cv} <Download size={17}/></a>
      </div>
      
    </div>
    <div className="hero-quotes" role="region" aria-label={t.quotesLabel}><div className="hero-quotes-track">{[...testimonials, ...testimonials].map((q,i)=><figure className="hero-quote" key={i} aria-hidden={i >= testimonials.length || undefined}>
      <blockquote>“{q.quote}”</blockquote>
      <figcaption><img src={q.photo} alt="" loading="lazy"/><span><b>{q.name}</b>{q.role}</span></figcaption>
    </figure>)}</div></div>
    <div className="hero-bottom">
      <span>{t.scroll} <ArrowDownRight size={16}/></span>
    </div>
  </section>;
}

function ProjectCard({ p, setPage }) {
  const { lang } = useLang();
  return <button className="project-card" onClick={() => setPage(p.id)}>
    <div className="project-art">{p.hero ? <img src={p.hero[0]} alt={p.hero[1]} loading="lazy"/> : <div className="nda-art"><span>{p.coverLabel || 'UNDER NDA'}</span><strong>{p.name}</strong></div>}<span className="project-arrow"><ArrowUpRight/></span></div>
    <div className="project-meta"><div><span className="project-number">{p.number} / 0{projects.length}</span><h3>{p.name}</h3><p>{lang === 'de' ? deDescriptions[p.id] || p.description : p.description}</p></div><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div>
  </button>;
}

function MoreProjects({ id, setPage }) {
  const { t } = useLang();
  const rowRef = useRef(null);
  useEffect(() => enableDragScroll(rowRef.current), []);
  // start with the projects after this one, then wrap around
  const i = projects.findIndex(x => x.id === id);
  const others = [...projects.slice(i + 1), ...projects.slice(0, i)];
  return <section className="more-projects">
    <h2 id="more-projects-title">{t.more1}<em>{t.more2}</em></h2>
    <div className="more-row" ref={rowRef} role="region" aria-label={t.more1 + t.more2} tabIndex={0}>
      {others.map(p => <ProjectCard key={p.id} p={p} setPage={setPage}/>)}
    </div>
  </section>;
}

function WorkSection({ setPage, standalone=false }) {
  const { lang, t } = useLang();
  return <section className={standalone ? 'work-section section-pad work-page' : 'work-section section-pad'} id={standalone ? undefined : 'sec-work'}>
    <div className="section-heading"><div className="section-label"><span>01</span> / {t.selected}</div>{standalone ? <h1 className="work-title">{t.workTitle1}<br/><em>{t.workTitle2}</em></h1> : <h2>{t.homeTitle1}<em>{t.homeTitle2}</em></h2>}<div className="section-intro"><p>{t.workText}</p><p>{t.workText2}</p></div></div>
    {standalone && <h2 className="sr-only">{t.selected}</h2>}
    <div className="project-list">
      {(standalone ? projects : projects.slice(0,4)).map((p) => <ProjectCard key={p.id} p={p} setPage={setPage}/>)}
    </div>
    {!standalone && <button className="pill-link see-work" onClick={() => {setPage('work');window.scrollTo(0,0)}}>{t.seeAll} <ArrowUpRight size={17}/></button>}
  </section>;
}

function TravelCarousel() {
  const { t } = useLang();
  const boxRef = useRef(null), trackRef = useRef(null);
  useEffect(() => { const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; return reduce ? enableDragScroll(boxRef.current) : enableMarqueeDrag(boxRef.current, trackRef.current, 'travel-scroll', 80); }, []);
  return <div className="travel-marquee" ref={boxRef} role="region" aria-label={t.travelPhotos}><div className="travel-track" ref={trackRef}>
    {[...places, ...places].map(([f,n,y],i)=>{ const clone = i >= places.length; return <figure key={i} aria-hidden={clone || undefined} inert={clone ? '' : undefined}><ZoomImage src={`/travel/${f}.webp`} alt={n}/><figcaption>{n}, {y}</figcaption></figure>; })}
  </div></div>;
}

function ClipVideo({ src }) {
  const ref = useRef(null);
  // always silent: the muted attribute, the muted property and zero volume
  const silence = (v) => { if (v) { v.setAttribute('muted', ''); v.muted = true; v.volume = 0; } };
  useEffect(() => { silence(ref.current); }, []);
  return <video ref={ref} src={src} poster={src.replace('.mp4', '.poster.jpg')} autoPlay={!REDUCED_MOTION} muted loop playsInline preload="metadata" onPlay={(e) => silence(e.currentTarget)} onLoadedData={(e) => silence(e.currentTarget)}/>;
}

function Timeline({ entries }) {
  return <ol className="timeline">{entries.map(e=>{ const points = e.points || (e.desc ? [e.desc] : null); return <li key={e.title + e.org}>
    <div className="timeline-head"><div><h3>{e.title}</h3><p>{e.org}</p></div><span>{e.dates} · {e.place}</span></div>
    {points && <ul>{points.map(p=><li key={p}>{p}</li>)}</ul>}
  </li>; })}</ol>;
}

// The photo on the front; "My approach" on the back. The "Flip this" hint turns it over.
function FlipPhoto({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return <div className="about-flip">
    <div className={flipped ? 'about-flip-inner is-flipped' : 'about-flip-inner'}>
      <div className="about-flip-face about-flip-front" aria-hidden={flipped || undefined} inert={flipped ? '' : undefined}>{front}</div>
      <div className="about-flip-face about-flip-back" aria-hidden={!flipped || undefined} inert={!flipped ? '' : undefined}>{back}</div>
    </div>
    <button type="button" className="flip-hint" aria-pressed={flipped} onClick={() => setFlipped(f => !f)}>{flipped ? 'Show photo' : 'Flip this'} <span aria-hidden="true">↻</span></button>
  </div>;
}

function AboutContent({ home = false, part = 'all' }) {
  const { lang, t } = useLang();
  const certBox = useRef(null), certTrack = useRef(null);
  useEffect(() => { const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; return reduce ? enableDragScroll(certBox.current) : enableMarqueeDrag(certBox.current, certTrack.current, 'cert-scroll', 70); }, []);
  const label = (text) => lang === 'de' ? deLabels[text] || text : text;
  const Title = home ? 'h2' : 'h1';
  const top = part !== 'bottom', bottom = part !== 'top';
  const n = home ? { exp: 3, edu: 4, bring: 5, cert: 6, places: 7, clips: 8 } : { exp: 1, edu: 2, bring: 3, cert: 4, places: 5, clips: 6 };
  const Label = ({ k, children }) => <div className="section-label"><span>{String(n[k]).padStart(2, '0')}</span> / {children}</div>;
  return <>
    {top && <>
    <div className="about-hero"><div>{home ? <h2 className="about-head">{t.aboutHead1}<em>{t.aboutHead2}</em></h2> : <Title>{t.aboutTitle1}<br/><em>{t.aboutTitle2}</em></Title>}<p className="about-lead">{t.aboutIam} <b>{t.aboutName}</b>{t.aboutLeadRest}</p><p className="about-body">{t.aboutBg}</p><p className="about-body">{t.aboutFocus}</p><p className="about-body">{t.aboutEnjoy}</p>
      </div><FlipPhoto front={<ZoomImage className="about-photo" src="/salman-paris.webp" alt={t.aboutPhoto}/>} back={<div className="about-approach"><span className="about-beyond-label">{t.approachLabel}</span><p>{t.approach1}</p><p>{t.approach2}</p></div>}/></div>
    <div className="tools-block split" id={home ? 'sec-experience' : undefined}><div className="block-head"><Label k="exp">{t.expLabel}</Label><h2>{t.exp1}<em>{t.exp2}</em></h2></div><div><Timeline entries={experience}/></div></div>
    <div className="tools-block split"><div className="block-head"><Label k="edu">{t.eduLabel}</Label><h2>{t.edu1}<em>{t.edu2}</em></h2></div><div><Timeline entries={education}/></div></div>
    <div className="skills-block"><Label k="bring">{t.bringLabel}</Label><div><h2>{t.bring1}<em>{t.bring2}</em></h2><p className="block-sub">{t.bringText}</p><div className="skill-grid">{skills.map(([k,head,items])=>{ const H = SKILL_HEADS[head]; return <div className="skill" key={k}><h3 className="skill-head"><span className="skill-icon" aria-hidden="true"><H size={18}/></span>{label(k)}</h3><ul className="tool-list">{items.map(([name,icon])=><li key={name}><ToolIcon icon={icon}/>{label(name)}</li>)}</ul></div>; })}</div></div></div>
    </>}
    {bottom && <>
    <div className="tools-block stacked"><Label k="cert">{t.certLabel}</Label><div><h2>{t.cert1}<em>{t.cert2}</em></h2><div className="cert-marquee" ref={certBox}><div className="cert-track" ref={certTrack}>{[...certificates, ...certificates].map((c,i)=><figure className="cert" key={i} aria-hidden={i >= certificates.length || undefined} inert={i >= certificates.length ? '' : undefined}>
      <ZoomImage src={`/certificates/${c.file}`} alt="" label={`${t.certificate}: ${c.title}`}/>
      <figcaption><b>{c.title}</b><span>{c.issuer} · {c.date}</span>{c.verify && <a className="cert-verify" href={c.verify} target="_blank" rel="noopener noreferrer">{t.verify} <ArrowUpRight size={13}/></a>}</figcaption>
    </figure>)}</div></div></div></div>
    <div className="tools-block stacked"><Label k="places">{t.placesLabel}</Label><div><h2>{t.places1}<em>{t.places2}</em></h2><p className="block-sub">{t.placesText}</p><TravelCarousel/></div></div>
    <div className="tools-block stacked"><Label k="clips">{t.clipsLabel}</Label><div><h2>{t.clips1}<em>{t.clips2}</em></h2><p className="block-sub">{t.clipsText}</p><div className="clip-grid">{clips.map(([src,title])=><a key={src} href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><ClipVideo src={src}/><span><b>{title}</b>{t.watch}</span></a>)}</div></div></div>
    </>}
  </>;
}

function AboutPage() {
  const { t } = useLang();
  return <main id="main" className="inner-page section-pad">
    <div className="section-label"><span>{t.aboutLabel}</span> / {t.aboutLabel2}</div>
    <AboutContent/>
  </main>;
}

function HomeAbout() {
  const { t } = useLang();
  return <section className="home-about section-pad" id="sec-about">
    <div className="section-label"><span>02</span> / {t.aboutLabel}</div>
    <AboutContent home part="top"/>
  </section>;
}

function HomeAboutMore() {
  return <section className="home-about home-about-more section-pad">
    <AboutContent home part="bottom"/>
  </section>;
}

const TOOL_GLYPHS = { course: GraduationCap, git: GitBranch, database: Database, chart: BarChart3, sheet: Sheet, workflow: Workflow, slides: Presentation, chat: MessageSquare,
  interviews: MessagesSquare, observe: Eye, usability: MousePointerClick, thinkaloud: Speech, ab: Split, workload: Gauge,
  wireframe: LayoutTemplate, prototype: MousePointer2, visual: Palette, a11y: Accessibility, system: Component, ai: Sparkles,
  cloud: Cloud, trello: Kanban, slack: Hash };
const SKILL_HEADS = { research: ScanEye, ui: Figma, tools: Wrench, tech: CodeXml };
function ToolIcon({ icon }) {
  if (icon.startsWith('icon:')) { const G = TOOL_GLYPHS[icon.slice(5)]; return <span className="tool-glyph" aria-hidden="true"><G size={13}/></span>; }
  return <img src={`/tools/${icon}`} alt="" loading="lazy"/>;
}

const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Figure({ src, alt, caption, tall }) {
  return <figure className="case-fig"><ZoomImage src={src} alt={alt} tall={tall}/>{caption && <figcaption><Rich text={caption}/></figcaption>}</figure>;
}

function CoverSwap({ items, interval = 2000 }) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => { if (!paused.current) setActive((a) => (a + 1) % items.length); }, interval);
    return () => clearInterval(id);
  }, [items.length, interval]);
  const pause = (v) => () => { paused.current = v; };
  return <div className="cover-swap" onMouseEnter={pause(true)} onMouseLeave={pause(false)} onFocus={pause(true)} onBlur={pause(false)}>
    {items.map(([src, alt, cap], i) => <div key={src} className={i === active ? 'cover-slide active' : 'cover-slide'} aria-hidden={i !== active || undefined} inert={i !== active ? '' : undefined}>
      <Figure src={src} alt={alt} caption={cap}/>
    </div>)}
  </div>;
}

function CaseCarousel({ items, interval = 2000 }) {
  const { t } = useLang();
  const ref = useRef(null);
  const paused = useRef(false);
  const index = useRef(0);
  const [active, setActive] = useState(0);
  const n = items.length;
  // copies of the first screens at the end make the loop seamless
  const slides = [...items, ...items.slice(0, Math.min(3, n))];
  const step = () => { const el = ref.current; const card = el?.firstElementChild; return card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0) : 0; };
  const goTo = (i, smooth = true) => { const el = ref.current; if (!el) return; index.current = i; el.scrollTo({ left: i * step(), behavior: smooth ? 'smooth' : 'instant' }); setActive(i % n); };
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let reset;
    const id = setInterval(() => {
      if (paused.current || !ref.current) return;
      const next = index.current + 1;
      goTo(next);
      if (next >= n) reset = setTimeout(() => goTo(0, false), 700);
    }, interval);
    return () => { clearInterval(id); clearTimeout(reset); };
  }, [interval, n]);
  const onScroll = () => { const s = step(); if (!s) return; const i = Math.round(ref.current.scrollLeft / s); index.current = i; setActive(i % n); };
  useEffect(() => enableDragScroll(ref.current), []);
  const pause = (v) => () => { paused.current = v; };
  return <div className="case-carousel" onMouseEnter={pause(true)} onMouseLeave={pause(false)} onFocus={pause(true)} onBlur={pause(false)} onTouchStart={pause(true)} onTouchEnd={pause(false)}>
    <div className="case-carousel-track" ref={ref} onScroll={onScroll} role="region" aria-label={t.appScreens} tabIndex={0}>
      {slides.map(([src, alt, caption], i) => i < n
        ? <Figure key={i} src={src} alt={alt} caption={caption}/>
        : <div key={i} className="case-fig-clone" aria-hidden="true" inert=""><Figure src={src} alt="" caption={caption}/></div>)}
    </div>
    <div className="case-carousel-dots">{items.map((it, i) => <button key={it[0]} type="button" className={i === active ? 'active' : ''} aria-label={`${t.showScreen} ${i + 1}`} aria-current={i === active || undefined} onClick={() => goTo(i)}/>)}</div>
  </div>;
}

function Block({ block }) {
  const { t } = useLang();
  if (block.type === 'figs') return <div className={`case-grid c${block.cols}${block.phones ? ' phones' : ''}${block.pages ? ' pages' : ''}${block.wide ? ' wide' : ''}`}>{block.items.map(([src,alt,caption])=><Figure key={src} src={src} alt={alt} caption={caption} tall={block.pages || block.wide}/>)}</div>;
  if (block.type === 'cards') return <div className={`case-grid c${block.cols}`}>{block.items.map(c=><div className="case-card" key={c.title}>{c.img && <ZoomImage src={c.img} alt="" label={`${t.persona}: ${c.title}`}/>}<small>{c.tag}</small><h3 className="case-card-title">{c.title}</h3><p>{c.text}</p></div>)}</div>;
  if (block.type === 'list') return <ul className="case-list">{block.items.map(i=><li key={i}><Rich text={i}/></li>)}</ul>;
  if (block.type === 'pairs') return <div className="case-pairs"><div className="pair-head"><span>{block.head[0]}</span><span>{block.head[1]}</span></div>{block.items.map(([title,a,b])=><div className="pair-row" key={title}><p><Rich text={title}/></p><div className="case-grid c2"><Figure src={a[0]} alt={a[1]}/><Figure src={b[0]} alt={b[1]}/></div></div>)}</div>;
  if (block.type === 'carousel') return <CaseCarousel items={block.items} interval={block.interval}/>;
  if (block.type === 'split') return <div className="case-split"><div>{block.left.map((b,i)=><Block block={b} key={i}/>)}</div><div>{block.right.map((b,i)=><Block block={b} key={i}/>)}</div></div>;
  if (block.type === 'facts') return <dl className="quick-row case-facts">{block.items.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
  if (block.type === 'sub') return <h3 className="case-sub">{block.text}</h3>;
  if (block.type === 'para') return <p className="case-text"><Rich text={block.text}/></p>;
  if (block.type === 'quote') return <p className="case-quote">{block.text}</p>;
  if (block.type === 'flow') return <div className="case-flow">{block.items.map((s,i)=><React.Fragment key={s}>{i>0 && <ArrowRight size={15} aria-hidden="true"/>}<span>{s}</span></React.Fragment>)}</div>;
  if (block.type === 'table') return <div className="case-table"><table>{block.head && <thead><tr>{block.head.map(h=><th key={h}>{h}</th>)}</tr></thead>}<tbody>{block.rows.map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody></table></div>;
  if (block.type === 'stats') return <div className="case-impact case-stats">{block.items.map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div>;
  if (block.type === 'link') return <a className="pill-link" href={block.url} target="_blank" rel="noopener noreferrer">{block.label} <ArrowUpRight size={17}/></a>;
  return <div className="case-bars"><h4>{block.title}</h4>{block.items.map(([k,v])=><div className="bar-row" key={k}><span>{k}</span><div><i style={{width:`${v/20*100}%`}}/></div><b>{v}</b></div>)}<p>{block.note}</p></div>;
}

// Text runs that sit right before a plain image row go on the left, the images on the right (wide, phone and page rows stay full width).
const TEXT_BLOCKS = new Set(['sub', 'para', 'list', 'quote', 'flow', 'table']);
function arrangeBlocks(blocks) {
  const out = []; let run = [];
  blocks.forEach((b) => {
    if (TEXT_BLOCKS.has(b.type)) { run.push(b); return; }
    const sideBySide = b.type === 'figs' && !b.phones && !b.pages && !b.wide && run.length > 0;
    if (sideBySide) out.push({ type: 'split', left: run, right: [b] });
    else out.push(...run, b);
    run = [];
  });
  out.push(...run);
  return out;
}

// Quick-scan row under the title: Role, Timeline, Team and Tools, always shown
function quickRow(p) {
  const pick = (re) => p.meta.find(([k]) => re.test(k))?.[1] || '—';
  const items = [['Role', pick(/role/i)], ['Timeline', pick(/duration|timeline/i)], ['Team', pick(/team/i)], ['Tools', pick(/tools/i)]];
  return <dl className="quick-row">{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

function ProjectPage({ id, setPage }) {
  const { lang, t } = useLang();
  const p = projects.find(x=>x.id===id) || projects[0];
  return <main id="main" className="inner-page project-detail section-pad" lang="en">
    <div className="section-label" lang={lang}><span>{t.caseLabel}</span> / {t.caseLabel2}</div>
    {lang === 'de' && <p className="case-note" lang="de">{t.caseNote}</p>}
    <div className={p.headerImage ? 'detail-top has-cover' : 'detail-top'}><div className="detail-heading"><span className="project-number">{p.number} / 0{projects.length}</span><h1>{p.pageName || p.name}</h1>{p.subtitle && <p className="detail-subtitle">{p.subtitle}</p>}{p.id !== 'websites' && quickRow(p)}<p>{p.lede}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>{[p.live, ...(p.links || [])].filter(Boolean).map(([url,label])=><a className="pill-link" key={url} href={url} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={17}/></a>)}</div>{p.headerImage && p.hero && <div className="case-cover header-cover"><Figure src={p.hero[0]} alt={p.hero[1]} caption={p.hero[2]}/></div>}{p.meta.length > 0 && !p.noFacts && <div className="detail-facts">{p.meta.map(([k,v])=><div key={k}><small>{k.toUpperCase()}</small><b>{v}</b></div>)}</div>}</div>
    {!p.headerImage && p.hero && !p.noCover && <div className={p.coverWide ? 'case-cover wide' : 'case-cover'}><Figure src={p.hero[0]} alt={p.hero[1]} caption={p.hero[2]}/></div>}
    {p.story && <div className="case-story">{p.story.map(([k,v])=><div key={k}><small>{k.toUpperCase()}</small><p>{v}</p></div>)}</div>}
    {p.impact && <div className="case-impact">{p.impact.map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div>}
    {p.note && <p className="case-note">{p.note}</p>}
    {p.sections.map(s=><section className="case-section" key={s.title}><h2>{s.title}</h2>{s.text && <p className="case-text">{s.text}</p>}{arrangeBlocks(s.blocks).map((b,i)=><Block block={b} key={i}/>)}</section>)}
    <MoreProjects id={id} setPage={setPage}/>
    <button className="pill-link" lang={lang} onClick={()=>setPage('work')}>{t.backAll} <ArrowRight size={17}/></button>
  </main>;
}

function CookieBanner({ onClose, onSettings }) {
  const { t } = useLang();
  return <div className="cookie-banner"><div><b>{t.cookieTitle}</b><p>{t.cookieText}</p></div><div><button onClick={onSettings}>{t.cookieSettings}</button><button className="cookie-accept" onClick={onClose}>{t.cookieOk}</button></div></div>;
}

// Scroll reveal: [selector, direction]. Items sharing a parent are staggered.
const REVEAL = [
  ['#sec-work .section-heading > *', 'left'],
  ['#sec-work .project-list > *', 'bottom'],
  ['#sec-work .see-work', 'bottom'],
  ['#sec-about > .section-label', 'left'],
  ['.about-hero > div:first-child > *', 'left'],
  ['.about-hero > .about-photo', 'right'],
  ['.tools-block > .section-label, .skills-block > .section-label, .tools-block .block-head > *', 'bottom'],
  ['.tools-block > div:last-child > h2, .tools-block > div:last-child > .block-sub, .skills-block > div > h2, .skills-block > div > .block-sub', 'bottom'],
  ['.timeline > li, .skill-grid > *, .clip-grid > *', 'bottom'],
  ['.cert-marquee, .travel-marquee', 'bottom'],
  ['.footer-top > *', 'left'],
];

function useScrollReveal(page) {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers = [];
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; io.unobserve(el);
      el.setAttribute('data-shown', '');
      const delay = parseFloat(el.style.getPropertyValue('--rd')) || 0;
      // hand the element back to its normal styles (hover effects etc.) once it has arrived
      timers.push(setTimeout(() => { el.removeAttribute('data-reveal'); el.removeAttribute('data-shown'); el.style.removeProperty('--rd'); }, delay * 1000 + 1000));
    }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const frame = requestAnimationFrame(() => {
      REVEAL.forEach(([sel, dir]) => {
        const count = new Map();
        document.querySelectorAll(sel).forEach((el) => {
          if (el.closest('.hero') || el.hasAttribute('data-reveal')) return;
          const i = count.get(el.parentNode) || 0; count.set(el.parentNode, i + 1);
          el.setAttribute('data-reveal', dir);
          el.style.setProperty('--rd', `${Math.min(i, 6) * 0.1}s`);
          io.observe(el);
        });
      });
    });
    return () => { cancelAnimationFrame(frame); io.disconnect(); timers.forEach(clearTimeout);
      document.querySelectorAll('[data-reveal]').forEach((el) => { el.removeAttribute('data-reveal'); el.removeAttribute('data-shown'); el.style.removeProperty('--rd'); }); };
  }, [page]);
}

function App() {
  const route = () => pathToPage(window.location.pathname);
  const [page,setPage] = useState(() => {
    // old hash links such as /#sumato are converted to /work/sumato
    const hashId = window.location.hash.slice(1);
    if (window.location.pathname === '/' && hashId && hashId !== 'home' && routes.includes(hashId)) {
      window.history.replaceState(window.history.state, '', pageToPath(hashId));
      return hashId;
    }
    return route();
  });
  useScrollReveal(page);
  const depth = useRef(-1);
  // The site is English only: no language switch, no automatic German.
  const lang = 'en';
  const t = strings.en;
  const setLang = useCallback(() => {}, []);
  useEffect(()=>{ document.documentElement.lang = lang; },[lang]);
  const [zoomed,setZoomed] = useState(null);
  const closeZoom = useCallback(() => setZoomed(null), []);
  useEffect(closeZoom,[page,closeZoom]);
  const [cookie,setCookie] = useState(!localStorage.getItem('sb-cookie'));
  const [settings,setSettings] = useState(false);
  useEffect(()=>{const link=document.querySelector('link[rel="canonical"]');const url='https://msalmanbhatti.github.io'+(page==='notfound'?'/':pageToPath(page));if(link)link.href=url;const og=document.querySelector('meta[property="og:url"]');if(og)og.setAttribute('content',url);},[page]);
  useEffect(()=>{document.title = page==='notfound'?'Page not found — Salman Bhatti':page==='home'?t.titleHome:page==='about'?t.titleAbout:page==='work'?t.titleWork:`${projects.find(p=>p.id===page)?.name || t.work} — Salman Bhatti`;},[page,t]);
  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});if(page==='notfound')return;const target=pageToPath(page);if(window.location.pathname!==target)window.history.pushState({depth:(window.history.state?.depth??-1)+1},'',target);else if(window.history.state?.depth==null)window.history.replaceState({depth:0},'');depth.current=window.history.state.depth;},[page]);
  const [section,setSection] = useState(null);
  const goSection = useCallback((id) => { setSection({ id }); setPage('home'); }, []);
  useEffect(()=>{ if (!section || page !== 'home') return; const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; document.getElementById(section.id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); },[section,page]);
  useEffect(()=>{const onPop=()=>setPage(route());window.addEventListener('popstate',onPop);return ()=>window.removeEventListener('popstate',onPop)},[]);
  const closeCookie = ()=>{localStorage.setItem('sb-cookie','yes');setCookie(false);setSettings(false)};
  return <LangContext.Provider value={{ lang, t, setLang }}><LightboxContext.Provider value={setZoomed}><div id="top"><a className="skip-link" href="#main">Skip to content</a><Header setPage={setPage} goSection={goSection}/>
    {page!=='home' && <BackButton page={page} setPage={setPage}/>}
    {page==='home' && <main id="main"><Hero setPage={setPage}/><WorkSection setPage={setPage}/><HomeAbout/><HomeAboutMore/></main>}
    {page==='work' && <main id="main"><WorkSection setPage={setPage} standalone/></main>}
    {page==='about' && <AboutPage/>}
    {page==='notfound' && <main id="main" className="inner-page section-pad not-found"><h1>Page not found</h1><p>This address doesn’t lead to a page on this site.</p><button className="pill-link" onClick={() => setPage('home')}>Back to home <ArrowRight size={17}/></button></main>}
    {projects.some(p=>p.id===page) && <ProjectPage id={page} setPage={setPage}/>}
    <Footer/>
    <BackToTop/>
    {zoomed && <Lightbox image={zoomed} onClose={closeZoom}/>}
    {cookie && <CookieBanner onClose={closeCookie} onSettings={()=>setSettings(true)}/>}
    {settings && <div className="modal-backdrop" onClick={()=>setSettings(false)}><div className="cookie-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" aria-label={t.close} onClick={()=>setSettings(false)}><X/></button><Sparkles/><h3>{t.cookieModalTitle}</h3><p>{t.cookieModalText}</p><button className="pill-link" onClick={closeCookie}>{t.cookieSave} <ArrowRight size={16}/></button></div></div>}
  </div></LightboxContext.Provider></LangContext.Provider>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);