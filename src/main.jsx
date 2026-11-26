import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import HomeSidebar from './components/HomeSidebar/HomeSidebar';
import SpotlightCard from './components/SpotlightCard/SpotlightCard';
import './components/SpotlightCard/SpotlightCard.css';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Asterisk, Instagram, Linkedin, Mail, Github, Copy, Check, Menu, X, Sparkles, GraduationCap, GitBranch, Database, BarChart3, Sheet, Workflow, Presentation, MessageSquare, ScanEye, Figma, Wrench, CodeXml, MessagesSquare, Eye, MousePointerClick, Speech, Split, Gauge, LayoutTemplate, MousePointer2, Palette, Accessibility, Component, Cloud, Kanban, Hash, Telescope, Layers, ChartPie, MonitorSmartphone, Play, Pause, Globe, CalendarDays } from 'lucide-react';
import { projects, testimonials, experience, education, certificates, skills, places, clips } from './projects';
import './styles.css';

const EMAIL = 'salman.ashraff20@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/m-salman-bhatti';
const INSTAGRAM = 'https://www.instagram.com/salmancapturedthis/';
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
  const open = useContext(LightboxContext);
  return <button type="button" className={className ? `zoom ${className}` : 'zoom'} onClick={() => open({ src, alt: alt || label, tall })} aria-label={`${"Enlarge image"}: ${alt || label}`}><img src={src} alt={alt} loading="lazy"/></button>;
}

function Lightbox({ image, onClose }) {
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
    <button type="button" className="lightbox-close" ref={closeRef} onClick={onClose} aria-label={"Close image"}><X/></button>
    {image.video
      ? <video src={image.src} poster={image.src.replace('.mp4', '.poster.jpg')} autoPlay loop playsInline controls aria-label={image.alt} onClick={e => e.stopPropagation()}/>
      : <img src={image.src} alt={image.alt} onClick={e => e.stopPropagation()}/>}
  </div>;
}

function Rich({ text }) {
  return text.split('**').map((part, i) => i % 2 ? <b key={i}>{part}</b> : part);
}

const NAV = [['sec-work', "Work"], ['sec-experience', "Experience"], ['sec-skills', "Skills"], ['sec-about', "About"]];

function CopyEmailButton({ label, className, iconSize, leadIcon }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };
  return <button className={className} onClick={copy} aria-label={`${label}: ${EMAIL} ${"copy"}`}>{leadIcon}<span className="btn-label">{label}</span> {!leadIcon && <ArrowUpRight size={iconSize}/>}</button>;
}

function BackToTop() {
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
  return <button className={visible ? 'back-top visible' : 'back-top'} onClick={toTop} aria-label={"Back to top"}><ArrowUp size={20}/></button>;
}

function BackButton({ page, setPage }) {
  const back = () => {
    if (window.history.state?.depth > 0) { window.history.back(); return; }
    setPage(page === 'work' || page === 'about' ? 'home' : 'work');
  };
  return <div className="back-bar section-pad"><button className="pill-link secondary back-link" onClick={back}><ArrowLeft size={17}/> {"Back"}</button></div>;
}

function Footer() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { window.location.href = `mailto:${EMAIL}`; }
  };
  return <footer className="footer" id="contact">
    <div className="footer-top">
      <h2>{"You’ve seen the work. "}<em>{"Now the interesting part."}</em></h2>
      <a className="footer-email" href={`mailto:${EMAIL}`}><Mail size={20}/>{EMAIL}</a>
      <div className="footer-actions">
        <div className="footer-social">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18}/></a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18}/></a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18}/></a>
        </div>
        <button type="button" className="footer-btn" onClick={copy}>{copied ? <Check size={17}/> : <Copy size={17}/>}<span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span></button>
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

function useFinePointer() {
  const q = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(q).matches);
  useEffect(() => {
    const m = window.matchMedia?.(q); if (!m) return;
    const f = () => setOk(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return ok;
}

function ProjectCard({ p, setPage, spot = false }) {
  const fine = useFinePointer();
  const card = <button className="project-card" onClick={() => setPage(p.id)}>
    <div className="project-art">{p.hero ? <img src={p.hero[0]} alt={p.hero[1]} loading="lazy"/> : <div className="nda-art"><span>{p.coverLabel || 'UNDER NDA'}</span><strong>{p.name}</strong></div>}<span className="project-arrow"><ArrowUpRight/></span></div>
    <div className="project-meta"><div><span className="project-number">{p.number} / 0{projects.length}</span><h3>{p.name}</h3><p>{p.description}</p></div><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div>
  </button>;
  if (!(spot && fine)) return card;
  return <SpotlightCard className="project-spot" spotlightColor="rgba(120, 150, 255, 1)" intensity={0.2} spotlightSize={320} style={{ '--spotlight-card-surface': 'transparent', '--spotlight-card-border': 'transparent', '--spotlight-card-shadow': 'none', padding: 0, borderRadius: 0 }}>{card}</SpotlightCard>;
}

function MoreProjects({ id, setPage }) {
  const rowRef = useRef(null);
  useEffect(() => enableDragScroll(rowRef.current), []);
  // start with the projects after this one, then wrap around
  const i = projects.findIndex(x => x.id === id);
  const others = [...projects.slice(i + 1), ...projects.slice(0, i)];
  return <section className="more-projects">
    <h2 id="more-projects-title">{"More "}<em>{"projects."}</em></h2>
    <div className="more-row" ref={rowRef} role="region" aria-label={"More " + "projects."} tabIndex={0}>
      {others.map(p => <ProjectCard key={p.id} p={p} setPage={setPage}/>)}
    </div>
  </section>;
}

function WorkSection({ setPage, standalone=false }) {
  return <section className={standalone ? 'work-section section-pad work-page' : 'work-section section-pad'} id={standalone ? undefined : 'sec-work'}>
    <div className="section-heading"><div className="section-label"><span>02</span> / {"SELECTED PROJECTS"}</div>{standalone ? <h1 className="work-title">{"A selection of"}<br/><em>{"my work."}</em></h1> : <h2>{"Selected "}<em>{"work."}</em></h2>}<div className="section-intro"><p>{"A collection of professional and academic projects exploring how research, interaction design, and visual design come together to solve real-world challenges."}</p><p>{"From complex enterprise applications to augmented reality experiences, each project reflects my approach to creating thoughtful, usable digital interfaces."}</p></div></div>
    {standalone && <h2 className="sr-only">{"SELECTED PROJECTS"}</h2>}
    <div className="project-list">
      {(standalone ? projects : projects.slice(0,4)).map((p) => <ProjectCard key={p.id} p={p} setPage={setPage} spot/>)}
    </div>
    {!standalone && <button className="pill-link see-work" onClick={() => {setPage('work');window.scrollTo(0,0)}}>{"See all my work"} <ArrowUpRight size={17}/></button>}
  </section>;
}

// Scrolls a clipped strip upward on a timer. Hovering or focusing the strip eases it to a stop,
// leaving lets it ease back to speed. On touch, tapping an item pauses and enlarges it (tap again to resume).
function useAutoScroll(ref, pxPerSec, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ITEM = 'figure, .clip-item';
    let frame, last = performance.now(), pos = el.scrollTop, speed = 1, target = 1;
    const clearActive = () => el.querySelectorAll('.is-active').forEach((n) => n.classList.remove('is-active'));
    const step = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      speed += (target - speed) * Math.min(1, dt * 7);
      const half = el.scrollHeight / 2;
      pos += pxPerSec * speed * dt;
      if (half > 0 && pos >= half) pos -= half;
      el.scrollTop = pos;
      frame = requestAnimationFrame(step);
    };
    const onEnter = (e) => { if (e.pointerType !== 'touch') target = 0; };
    const onLeave = (e) => { if (e.pointerType !== 'touch') target = 1; };
    const onFocusIn = () => { target = 0; };
    const onFocusOut = (e) => { if (!el.contains(e.relatedTarget)) target = 1; };
    const onTap = (e) => {
      if (e.pointerType !== 'touch') return;
      const item = e.target.closest(ITEM);
      if (!item || !el.contains(item)) return;
      const wasActive = item.classList.contains('is-active');
      clearActive();
      if (wasActive) target = 1; else { item.classList.add('is-active'); target = 0; }
    };
    const onOutside = (e) => {
      if (e.pointerType === 'touch' && !el.contains(e.target) && el.querySelector('.is-active')) { clearActive(); target = 1; }
    };
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    el.addEventListener('pointerup', onTap);
    document.addEventListener('pointerdown', onOutside);
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
      el.removeEventListener('pointerup', onTap);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [enabled]);
}

function TravelCarousel({ loop = false }) {
  const boxRef = useRef(null), trackRef = useRef(null);
  useAutoScroll(boxRef, 40, loop);
  return <div className="travel-marquee" ref={boxRef} role="region" aria-label={"Travel photos"}><div className="travel-track" ref={trackRef}>
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

const pad2 = (n) => String(n).padStart(2, '0');

function ExperienceBlock({ num }) {
  return <div className="tools-block split"><div className="block-head"><div className="section-label"><span>{pad2(num)}</span> / {"EXPERIENCE"}</div><h2>{"Work "}<em>{"experience."}</em></h2></div><div><Timeline entries={experience}/></div></div>;
}

function EducationBlock({ num }) {
  return <div className="tools-block split"><div className="block-head"><div className="section-label"><span>{pad2(num)}</span> / {"EDUCATION"}</div><h2>{"My "}<em>{"education."}</em></h2></div><div><Timeline entries={education}/></div></div>;
}

function SkillsBlock({ num }) {
  return <div className="skills-block"><div className="section-label"><span>{pad2(num)}</span> / {"SKILLS"}</div><div><h2>{"What I bring "}<em>{"to the table."}</em></h2><p className="block-sub">{"The tools and methods I reach for when the problem gets real."}</p><div className="skill-grid">{skills.map(([k,head,items])=>{ const H = SKILL_HEADS[head]; return <div className="skill" key={k}><h3 className="skill-head"><span className="skill-icon" aria-hidden="true"><H size={18}/></span>{k}</h3><ul className="tool-list">{items.map(([name,icon])=><li key={name}><ToolIcon icon={icon}/>{name}</li>)}</ul></div>; })}</div></div></div>;
}

function CertificatesBlock({ num, loop = false }) {
  const certBox = useRef(null), certTrack = useRef(null);
  useAutoScroll(certBox, 40, loop);
  return <div className="tools-block stacked"><div className="section-label"><span>{pad2(num)}</span> / {"CERTIFICATES"}</div><div><h2>{"My "}<em>{"certificates."}</em></h2><div className="cert-marquee" ref={certBox}><div className="cert-track" ref={certTrack}>{[...certificates, ...certificates].map((c,i)=><figure className="cert" key={i} aria-hidden={i >= certificates.length || undefined} inert={i >= certificates.length ? '' : undefined}>
      <ZoomImage src={`/certificates/${c.file}`} alt="" label={`${"Certificate"}: ${c.title}`}/>
      <figcaption><b>{c.title}</b><span>{c.issuer} · {c.date}</span>{c.verify && <a className="cert-verify" href={c.verify} target="_blank" rel="noopener noreferrer">{"Verify on Coursera"} <ArrowUpRight size={13}/></a>}</figcaption>
    </figure>)}</div></div></div></div>;
}

function TravelBlock({ num, loop = false }) {
  return <div className="tools-block stacked">{num !== undefined && <div className="section-label"><span>{pad2(num)}</span> / {"TRAVEL"}</div>}<div><h2>{"Where "}<em>{"I've been."}</em></h2><p className="block-sub">{"Design is everywhere. Here's what the world looks like through my eyes."}</p><TravelCarousel loop={loop}/></div></div>;
}

// Moments in the Journey tab: muted clip with a play/pause button, no title or link
function ClipPlay({ src }) {
  const video = useRef(null);
  const openLightbox = useContext(LightboxContext);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    // a click is a user gesture, so the clip may play with sound
    if (v.paused) { v.muted = false; v.volume = 1; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); }
    else v.pause();
  };
  return (
    <div className="clip-play"
      onPointerEnter={(e) => { const v = video.current; if (v && e.pointerType !== 'touch' && !REDUCED_MOTION) { v.muted = true; v.play().catch(() => {}); } }}
      onPointerLeave={(e) => { if (e.pointerType !== 'touch') video.current?.pause(); }}>
      <video ref={video} src={src} poster={src.replace('.mp4', '.poster.jpg')} muted playsInline preload="metadata" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={() => { video.current?.pause(); openLightbox({ src, alt: 'Video clip', video: true }); }} />
      <button type="button" className="clip-btn" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
    </div>
  );
}

function MomentsBlock({ num, loop = false }) {
  const clipBox = useRef(null);
  useAutoScroll(clipBox, 40, loop);
  return <div className="tools-block stacked">{num !== undefined && <div className="section-label"><span>{pad2(num)}</span> / {"MOMENTS"}</div>}<div><h2>{"Moments "}<em>{"I have caught."}</em></h2><p className="block-sub">{"Short clips from the places I've wandered. No script, just vibes."}</p>{loop
        ? <div className="clip-marquee" ref={clipBox}><div className="clip-track">{[...clips, ...clips].map(([src],k)=><div key={k} className="clip-item" aria-hidden={k>=clips.length||undefined}><ClipPlay src={src}/></div>)}</div></div>
        : <div className="clip-grid">{clips.map(([src,title])=><a key={src} href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><ClipVideo src={src}/><span><b>{title}</b>{"Watch on Instagram ↗"}</span></a>)}</div>}</div></div>;
}

function TestimonialsBlock({ num }) {
  return <div className="tools-block stacked"><div className="section-label"><span>{pad2(num)}</span> / {"TESTIMONIALS"}</div><div><h2>{"What people "}<em>{"say."}</em></h2><div className="quote-grid">{testimonials.map((q)=><figure className="quote-card" key={q.name}><blockquote>“{q.quote}”</blockquote><figcaption><img src={q.photo} alt="" loading="lazy"/><span><b>{q.name}</b>{q.role}</span></figcaption></figure>)}</div></div></div>;
}

function AboutIntro({ home = false }) {
  const Title = home ? 'h2' : 'h1';
  return <>
    <div className="about-hero"><div>{home ? <h2 className="about-head">{"A little about "}<em>{"me."}</em></h2> : <Title>{"Hello,"}<br/><em>{"I'm Salman."}</em></Title>}<p className="about-lead">{"I'm a UX/UI designer with a background in Computer Science, so I understand both how people think and how products get built. That mix helps me design interfaces that work for users and that developers can actually build."}</p><p className="about-body">{"I'm most curious about how people interact with technology, especially new kinds of interaction like augmented reality, connected devices and AI. Studying Media Informatics in Germany has pushed me further into human-computer interaction and research, and moving here as an international student taught me how it feels when things aren't designed for you."}</p><p className="about-body">{"I like to observe before I design, question my own assumptions, and test early instead of guessing. What motivates me most is turning something complicated into something that feels simple and clear."}</p>
      </div><ZoomImage className="about-photo" src="/salman-paris.webp" alt={"Salman standing in front of the illuminated Eiffel Tower at night"}/></div>
  </>;
}

function AboutPage() {
  return <main id="main" className="inner-page section-pad">
    <div className="section-label"><span>{"ABOUT"}</span> / {"THE PERSON BEHIND THE PIXELS"}</div>
    <AboutIntro/>
    <ExperienceBlock num={1}/>
    <EducationBlock num={2}/>
    <SkillsBlock num={3}/>
    <CertificatesBlock num={4}/>
    <TravelBlock num={5}/>
    <MomentsBlock num={6}/>
  </main>;
}

const SOCIALS = [[Linkedin, LINKEDIN, 'LinkedIn'], [Instagram, INSTAGRAM, 'Instagram'], [Github, GITHUB, 'GitHub'], [Mail, `mailto:${EMAIL}`, 'Email']];

const TILE_GRADIENTS = [['#E4EAF7', '#C9D5EF'], ['#F4E7E3', '#E6CFC8'], ['#F1E9DC', '#E2D3BC'], ['#E0EEE9', '#C5DDD4'], ['#E7E5F5', '#CFCBEC'], ['#E4EEE0', '#CCDEC4']];
// Screen designs sit in a browser frame on the gradient; designed covers and photos stay full-bleed.
const TILE_INFO = {
  sumato: { result: 'POS live in 10+ client businesses' },
  ar: { pos: 'center top', result: 'AR concept tested with 4 participants' },
  muq: { result: 'Working connected-mug prototype' },
  elearning: { result: '15-minute course, published' },
  websites: { result: '6 websites designed' },
  eden: { result: 'Dashboard UI and user evaluation' },
};

// Tabs for the right panel: Work (projects) and Journey (moments, travel, certificates)
function HomePanel({ setPage, tab, setTab, active }) {
  return <>
    <div className="app-tabs" role="tablist" aria-label="Sections">
      {[['work', 'Work'], ['journey', 'Journey']].map(([id, label]) => (
        <button key={id} type="button" role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls={`panel-${id}`} className={tab === id ? 'app-tab on' : 'app-tab'} onClick={() => setTab(id)}>{label}</button>
      ))}
    </div>
    {tab === 'work'
      ? <div role="tabpanel" id="panel-work" aria-labelledby="tab-work"><HomeWork setPage={setPage} active={active}/></div>
      : <div className="journey-list" role="tabpanel" id="panel-journey" aria-labelledby="tab-journey"><HomeCertificates/><HomeTravel/><HomeMoments/></div>}
  </>;
}

// Right column: all projects as gradient tiles
function HomeWork({ setPage, active }) {
  return <section className="home-block section-pad" id="sec-work">
    <div className="hw-grid">{projects.map((p, i) => { const [g1, g2] = TILE_GRADIENTS[i % TILE_GRADIENTS.length]; return (
      <button key={p.id} type="button" className={p.id === active ? 'hw-tile active' : 'hw-tile'} aria-current={p.id === active || undefined} style={{ '--g1': g1, '--g2': g2 }} onClick={() => setPage(p.id)}>
        {(() => { const info = TILE_INFO[p.id] || {}; // Tile covers are pre-composed (same gradient, frame and position for every project): public/projects/tiles/<id>.webp
          const img = p.hero && <img src={`/projects/tiles/${p.id}.webp`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = p.hero[0]; }} alt={p.hero[1]} loading="lazy" decoding="async" width="1600" height="1200"/>; return <>
          <span className={p.hero ? 'hw-art tile-cover' : 'hw-art'}>{!p.hero ? <span className="hw-nda">{p.coverLabel || 'UNDER NDA'}</span> : img}</span>
          <span className="hw-pill">{p.name}</span>
          {info.result && <span className="hw-result">{info.result}</span>}
        </>; })()}
      </button>); })}</div>
  </section>;
}

function HomeSkills() {
  return <section className="home-block section-pad" id="sec-skills"><SkillsBlock num={3}/></section>;
}

function HomeTestimonials() {
  return <section className="home-block section-pad" id="sec-quotes"><TestimonialsBlock num={2}/></section>;
}

function HomeAbout() {
  return <section className="home-about section-pad" id="sec-about">
    <div className="section-label"><span>04</span> / {"ABOUT"}</div>
    <AboutIntro home/>
  </section>;
}

function HomeEducation() {
  return <section className="home-block section-pad"><EducationBlock num={5}/></section>;
}

function HomeCertificates() {
  return <section className="jcard"><CertificatesBlock num={1} loop/></section>;
}

function HomeTravel() {
  return <section className="jcard"><TravelBlock num={2} loop/></section>;
}

function HomeMoments() {
  return <section className="jcard"><MomentsBlock num={3} loop/></section>;
}


const TOOL_GLYPHS = { course: GraduationCap, git: GitBranch, database: Database, chart: BarChart3, sheet: Sheet, workflow: Workflow, slides: Presentation, chat: MessageSquare,
  interviews: MessagesSquare, observe: Eye, usability: MousePointerClick, thinkaloud: Speech, ab: Split, workload: Gauge,
  wireframe: LayoutTemplate, prototype: MousePointer2, visual: Palette, a11y: Accessibility, system: Component, ai: Sparkles,
  cloud: Cloud, trello: Kanban, slack: Hash, competitor: Telescope, tokens: Layers, dataviz: ChartPie, responsive: MonitorSmartphone };
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
    <div className="case-carousel-track" ref={ref} onScroll={onScroll} role="region" aria-label={"App screens"} tabIndex={0}>
      {slides.map(([src, alt, caption], i) => i < n
        ? <Figure key={i} src={src} alt={alt} caption={caption}/>
        : <div key={i} className="case-fig-clone" aria-hidden="true" inert=""><Figure src={src} alt="" caption={caption}/></div>)}
    </div>
    <div className="case-carousel-dots">{items.map((it, i) => <button key={it[0]} type="button" className={i === active ? 'active' : ''} aria-label={`${"Show screen"} ${i + 1}`} aria-current={i === active || undefined} onClick={() => goTo(i)}/>)}</div>
  </div>;
}

function Block({ block }) {
  if (block.type === 'figs') return <div className={`case-grid c${block.cols}${block.phones ? ' phones' : ''}${block.pages ? ' pages' : ''}${block.wide ? ' wide' : ''}`}>{block.items.map(([src,alt,caption])=><Figure key={src} src={src} alt={alt} caption={caption} tall={block.pages || block.wide}/>)}</div>;
  if (block.type === 'cards') return <div className={`case-grid c${block.cols}`}>{block.items.map(c=><div className="case-card" key={c.title}>{c.img && <ZoomImage src={c.img} alt="" label={`${"Persona"}: ${c.title}`}/>}<small>{c.tag}</small><h3 className="case-card-title">{c.title}</h3><p>{c.text}</p></div>)}</div>;
  if (block.type === 'list') return <ul className="case-list">{block.items.map(i=><li key={i}><Rich text={i}/></li>)}</ul>;
  if (block.type === 'pairs') return <div className="case-pairs"><div className="pair-head"><span>{block.head[0]}</span><span>{block.head[1]}</span></div>{block.items.map(([title,a,b])=><div className="pair-row" key={title}><p><Rich text={title}/></p><div className="case-grid c2"><Figure src={a[0]} alt={a[1]} caption={`**${block.head[0]}**`}/><Figure src={b[0]} alt={b[1]} caption={`**${block.head[1]}**`}/></div></div>)}</div>;
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
  const items = [['Role', pick(/role/i)], ['Timeline', pick(/duration|timeline/i)], ['Team', pick(/team/i)], ['Tools', pick(/tools/i)]].filter(([, v]) => v !== '—');
  return <dl className="quick-row">{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

function ProjectPage({ id, setPage, panel = false }) {
  const p = projects.find(x=>x.id===id) || projects[0];
  useEffect(() => {
    if (!panel) return;
    const onKey = (e) => { if (e.key === 'Escape' && !document.querySelector('.lightbox')) setPage('home'); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panel, setPage]);
  if (panel) {
    const timeline = p.meta.find(([k]) => /duration|timeline/i.test(k))?.[1];
    return <article className="pd" lang="en" aria-labelledby="pd-title">
      <header className="pd-head">
        <div>
          <h1 id="pd-title">{p.pageName || p.name}</h1>
          <p className="pd-meta">
            {p.live && <a href={p.live[0]} target="_blank" rel="noopener noreferrer"><Globe size={15} aria-hidden="true"/>{"See it live"}</a>}
            {(p.links || []).map(([url, label]) => <React.Fragment key={url}><span className="pd-dot" aria-hidden="true">•</span><a href={url} target="_blank" rel="noopener noreferrer">{/github/i.test(url) ? <Github size={15} aria-hidden="true"/> : <ArrowUpRight size={15} aria-hidden="true"/>}{label}</a></React.Fragment>)}
            {(p.live || (p.links || []).length > 0) && timeline && <span className="pd-dot" aria-hidden="true">•</span>}
            {timeline && <span><CalendarDays size={15} aria-hidden="true"/>{timeline}</span>}
          </p>
        </div>
        <button type="button" className="pd-close" onClick={() => setPage('home')} aria-label={"Close project"}><X size={18}/></button>
      </header>
      <div className="pd-intro">
        {p.subtitle && <h2>{p.subtitle}</h2>}
        <p>{p.lede}</p>
        <div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
      </div>
      {(p.id !== 'websites' || p.story || p.impact) && <section className="pd-glance" aria-labelledby="pd-glance-title">
        <h2 id="pd-glance-title" className="pd-glance-title">{"At a glance"}</h2>
        {p.id !== 'websites' && quickRow(p)}
        {p.story && <div className="pd-glance-story">{p.story.map(([k,v])=><div key={k}><h3>{k}</h3><p>{v}</p></div>)}</div>}
        {p.impact && <ul className="pd-glance-stats">{p.impact.map(([n,l])=><li key={l}><strong>{n}</strong><span>{l.split(':')[0]}</span></li>)}</ul>}
      </section>}
      {p.hero && !p.noCover && <div className="case-cover pd-cover"><Figure src={p.hero[0]} alt={p.hero[1]} caption={p.hero[2]}/></div>}
      {p.note && <p className="case-note">{p.note}</p>}
      {p.sections.map(s=><section className="case-section" key={s.title}><h2>{s.title}</h2>{s.text && <p className="case-text">{s.text}</p>}{arrangeBlocks(s.blocks).map((b,i)=><Block block={b} key={i}/>)}</section>)}
    </article>;
  }
  return <main id="main" className="inner-page project-detail section-pad" lang="en">
    <div className="section-label"><span>{"CASE STUDY"}</span> / {"SELECTED WORK"}</div>
    <div className={p.headerImage ? 'detail-top has-cover' : 'detail-top'}><div className="detail-heading"><span className="project-number">{p.number} / 0{projects.length}</span><h1>{p.pageName || p.name}</h1>{p.subtitle && <p className="detail-subtitle">{p.subtitle}</p>}{p.id !== 'websites' && quickRow(p)}<p>{p.lede}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>{[p.live, ...(p.links || [])].filter(Boolean).map(([url,label])=><a className="pill-link" key={url} href={url} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={17}/></a>)}</div>{p.headerImage && p.hero && <div className="case-cover header-cover"><Figure src={p.hero[0]} alt={p.hero[1]} caption={p.hero[2]}/></div>}{p.meta.length > 0 && !p.noFacts && <div className="detail-facts">{p.meta.map(([k,v])=><div key={k}><small>{k.toUpperCase()}</small><b>{v}</b></div>)}</div>}</div>
    {!p.headerImage && p.hero && !p.noCover && <div className={p.coverWide ? 'case-cover wide' : 'case-cover'}><Figure src={p.hero[0]} alt={p.hero[1]} caption={p.hero[2]}/></div>}
    {p.story && <div className="case-story">{p.story.map(([k,v])=><div key={k}><small>{k.toUpperCase()}</small><p>{v}</p></div>)}</div>}
    {p.impact && <div className="case-impact">{p.impact.map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div>}
    {p.note && <p className="case-note">{p.note}</p>}
    {p.sections.map(s=><section className="case-section" key={s.title}><h2>{s.title}</h2>{s.text && <p className="case-text">{s.text}</p>}{arrangeBlocks(s.blocks).map((b,i)=><Block block={b} key={i}/>)}</section>)}
    <MoreProjects id={id} setPage={setPage}/>
    <button className="pill-link" onClick={()=>setPage('work')}>{"Back to all work"} <ArrowRight size={17}/></button>
  </main>;
}

function CookieBanner({ onClose, onSettings }) {
  return <div className="cookie-banner"><div><b>{"Cookies, but make them useful."}</b><p>{"This site uses only essential local functionality. No tracking cookies are set."}</p></div><div><button onClick={onSettings}>{"Settings"}</button><button className="cookie-accept" onClick={onClose}>{"Got it"}</button></div></div>;
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
      timers.push(setTimeout(() => { el.removeAttribute('data-reveal'); el.removeAttribute('data-shown'); el.style.removeProperty('--rd'); }, delay * 1000 + 450));
    }), { threshold: 0.1, rootMargin: '0px' });
    const frame = requestAnimationFrame(() => {
      REVEAL.forEach(([sel, dir]) => {
        const count = new Map();
        document.querySelectorAll(sel).forEach((el) => {
          if (el.closest('.hero') || el.hasAttribute('data-reveal')) return;
          const i = count.get(el.parentNode) || 0; count.set(el.parentNode, i + 1);
          el.setAttribute('data-reveal', dir);
          el.style.setProperty('--rd', `${Math.min(i, 4) * 0.05}s`);
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
  const isProject = projects.some(p => p.id === page);
  const [homeTab, setHomeTab] = useState('work');
  const depth = useRef(-1);
  // The site is English only: no language switch, no automatic German.
  const [zoomed,setZoomed] = useState(null);
  const closeZoom = useCallback(() => setZoomed(null), []);
  useEffect(closeZoom,[page,closeZoom]);
  const [cookie,setCookie] = useState(!localStorage.getItem('sb-cookie'));
  const [settings,setSettings] = useState(false);
  useEffect(()=>{const link=document.querySelector('link[rel="canonical"]');const url='https://salmanashrafportfolio.github.io'+(page==='notfound'?'/':pageToPath(page));if(link)link.href=url;const og=document.querySelector('meta[property="og:url"]');if(og)og.setAttribute('content',url);},[page]);
  useEffect(()=>{document.title = page==='notfound'?'Page not found — Salman Bhatti':page==='home'?"Salman Bhatti — UX/UI Designer":page==='about'?"About — Salman Bhatti":page==='work'?"Work — Salman Bhatti":`${projects.find(p=>p.id===page)?.name || "Work"} — Salman Bhatti`;},[page]);
  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});if(page==='notfound')return;const target=pageToPath(page);if(window.location.pathname!==target)window.history.pushState({depth:(window.history.state?.depth??-1)+1},'',target);else if(window.history.state?.depth==null)window.history.replaceState({depth:0},'');depth.current=window.history.state.depth;},[page]);
  const [section,setSection] = useState(null);
  const goSection = useCallback((id) => { setSection({ id }); setPage('home'); }, []);
  useEffect(()=>{ if (!section || page !== 'home') return; const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; document.getElementById(section.id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); },[section,page]);
  useEffect(()=>{const onPop=()=>setPage(route());window.addEventListener('popstate',onPop);return ()=>window.removeEventListener('popstate',onPop)},[]);
  const closeCookie = ()=>{localStorage.setItem('sb-cookie','yes');setCookie(false);setSettings(false)};
  return <LightboxContext.Provider value={setZoomed}><div id="top"><a className="skip-link" href="#main">Skip to content</a>
    {page!=='home' && !isProject && <BackButton page={page} setPage={setPage}/>}
    {(page==='home' || isProject) && <main id="main"><div className={isProject ? 'app-shell detail' : 'app-shell'}>
      {!isProject && <HomeSidebar socials={SOCIALS} email={EMAIL}/>}
      <div className={isProject ? 'app-panel app-list' : 'app-panel'}><HomePanel setPage={setPage} active={isProject ? page : null} tab={homeTab} setTab={(t) => { setHomeTab(t); if (isProject) setPage('home'); }}/></div>
      {isProject && <div className="app-detail" key={page}><ProjectPage id={page} setPage={setPage} panel/></div>}
    </div></main>}
    {page==='work' && <main id="main"><WorkSection setPage={setPage} standalone/></main>}
    {page==='about' && <AboutPage/>}
    {page==='notfound' && <main id="main" className="inner-page section-pad not-found"><h1>Page not found</h1><p>This address doesn’t lead to a page on this site.</p><button className="pill-link" onClick={() => setPage('home')}>Back to home <ArrowRight size={17}/></button></main>}
    {page!=='home' && !isProject && <Footer/>}
    <BackToTop/>
    {zoomed && <Lightbox image={zoomed} onClose={closeZoom}/>}
    {cookie && <CookieBanner onClose={closeCookie} onSettings={()=>setSettings(true)}/>}
    {settings && <div className="modal-backdrop" onClick={()=>setSettings(false)}><div className="cookie-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" aria-label={"Close"} onClick={()=>setSettings(false)}><X/></button><Sparkles/><h3>{"Cookie preferences"}</h3><p>{"This site doesn't use analytics or advertising cookies. Local preferences only remember your language choice and that you dismissed this notice."}</p><button className="pill-link" onClick={closeCookie}>{"Save preferences"} <ArrowRight size={16}/></button></div></div>}
  </div></LightboxContext.Provider>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);