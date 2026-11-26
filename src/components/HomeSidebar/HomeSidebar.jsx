import React, { useState } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { education, skills } from '../../projects';


const WORK = [
  { role: 'UX/UI Designer', dates: 'Jun 2024 – May 2025', org: 'Sumato Solutions' },
  { role: 'UX/UI Designer', dates: 'Jan 2024 – Jun 2024', org: 'D2Soft Intelligence' },
  { role: 'UX/UI Design Intern', dates: 'Oct 2023 – Jan 2024', org: 'Mashkraft' },
];

const LOGO = {
  'Sumato Solutions': '/logos/sumato.png',
  'D2Soft Intelligence': '/logos/d2soft.png',
  'Mashkraft': '/logos/mashkraft.png',
  'Universität des Saarlandes': '/logos/saarland.png',
  'GC University': '/logos/gc-university.png',
};

function Logo({ org }) {
  const [ok, setOk] = useState(true);
  const src = LOGO[org];
  if (!src || !ok) return <span className="hs-initial" aria-hidden="true">{org.charAt(0)}</span>;
  return <img className="hs-logo" src={src} alt="" onError={() => setOk(false)} />;
}

// skill logos from the skills data (image icons only, one per tool)
const SKILL_LOGOS = (() => {
  const seen = new Set();
  return skills.flatMap(([, , items]) => items).filter(([name, icon]) => {
    if (icon.startsWith('icon:') || seen.has(icon)) return false;
    seen.add(icon);
    return true;
  });
})();

function ContactButton({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <span className="hs-contact">
      <button type="button" className="hs-contact-btn" onClick={copy} aria-label="Copy email address">
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      {copied && <span className="hs-toast" role="status">Email copied</span>}
    </span>
  );
}

function WorkItem({ item, open, onToggle, id }) {
  const expandable = !!item.detail;
  return (
    <li className={`hs-job${open ? ' open' : ''}`}>
      <div className="hs-job-head">
        <Logo org={item.org} />
        <div className="hs-job-title">
          <b>{item.role}{item.current && <i className="hs-current" aria-label="current" />}</b>
          <small>
            {item.dates} • {item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer">{item.org} ↗</a> : item.org}
          </small>
        </div>
        {expandable && (
          <button type="button" className="hs-chev" aria-expanded={open} aria-controls={id} aria-label={open ? 'Collapse' : 'Expand'} onClick={onToggle}>
            <ChevronDown size={15} />
          </button>
        )}
      </div>
      {expandable && (
        <div className="hs-job-body" id={id} hidden={!open}>
          <p>{item.detail}</p>
        </div>
      )}
    </li>
  );
}

export default function HomeSidebar({ socials, email }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <aside className="app-side" aria-label="Profile and work history">
      <section className="side-card side-profile">
        <div className="side-top">
          <img className="side-avatar" src="/avatar.webp" alt="Salman Bhatti" width="56" height="56" />
          <h1 className="side-name">Salman Bhatti <span className="side-pron"><svg className="side-pron-arrow" viewBox="0 0 34 18" width="32" height="17" aria-hidden="true" focusable="false"><path d="M32 13c-5-1-8-4-8-7 0-2.5 2.6-3.6 4.2-2.1 1.8 1.7-.4 5.4-5.2 6.3C17.5 11.3 10 10 3 7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 3.6 3 7l4.6 2.6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>zahl-mahn in German</span></h1>
        </div>
        <p className="side-bio">UX/UI designer with 1.5+ years of experience and a background in computer science, designing enterprise apps, web and mobile interfaces, and AR and IoT prototypes. M.Sc. Media Informatics at Saarland University.</p>
        <div className="side-row">
          <a className="hs-cta" href={`mailto:${email}`}>Get in touch</a>
          <span className="hs-status"><i aria-hidden="true" />Available for work</span>
        </div>
        <div className="side-marquee" aria-label="Places I have worked and studied">
          <div className="side-marquee-track">
            {[...SKILL_LOGOS, ...SKILL_LOGOS].map(([name, icon], k) => (
              <span key={k} aria-hidden={k >= SKILL_LOGOS.length || undefined}><img src={`/tools/${icon}`} alt={k < SKILL_LOGOS.length ? name : ''} /></span>
            ))}
          </div>
        </div>
        <div className="side-foot">
          <div className="hs-socials">
            {socials.map(([Icon, href, label]) => (
              <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'} aria-label={label}>
                <Icon size={16} />
              </a>
            ))}
          </div>
          <ContactButton email={email} />
        </div>
      </section>

      <section className="side-card side-history">
        <h2>Experience</h2>
        <ul className="hs-jobs">
          {WORK.map((item, i) => (
            <WorkItem key={item.role + item.org} item={item} id={`job-${i}`} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
          ))}
        </ul>
      </section>

      <section className="side-card side-education">
        <h2>Education</h2>
        <ul className="hs-jobs">
          {education.map((e) => (
            <li key={e.title}>
              <div className="hs-job-head">
                <Logo org={e.org} />
                <div className="hs-job-title">
                  <b>{e.title}</b>
                  <small>{e.dates} • {e.org}</small>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
