// Vercel serverless function: answers visitors' questions about Salman Bhatti.
// The API key lives only in the ANTHROPIC_API_KEY environment variable (never in the code or the browser).

const MODEL = 'claude-sonnet-5-5';
const MAX_MESSAGES = 12;      // keep the conversation short
const MAX_CHARS = 800;        // per visitor message
const LIMIT = 25;             // questions per visitor...
const WINDOW_MS = 60 * 60 * 1000; // ...per hour
const hits = new Map();       // ip -> { count, reset }  (per server instance; a good first guard)

const SYSTEM = `You are the portfolio assistant on Salman Bhatti's website. Visitors ask you questions about Salman. Answer them using ONLY the facts below. If a question is not covered, say you don't know and suggest contacting Salman by email at salman.ashraff20@gmail.com. Never invent projects, dates, numbers, employers or opinions. Keep answers short (2 to 4 sentences) unless asked for detail. Speak about Salman in the third person ("Salman designed..."). Politely decline requests unrelated to Salman or his work.

FACTS
Name: Muhammad Salman Bhatti. UX/UI Designer based in Germany. Currently an M.Sc. student in Media Informatics at Saarland University (April 2025 to present), seeking mandatory internships (Pflichtpraktikum) and working-student roles in UX/UI design, e-learning and user research. Languages: English (fluent), German (A2, learning), Urdu (native).

Education: M.Sc. Media Informatics, Saarland University (coursework: Human-Computer Interaction, Living "AI-ducation" Dashboard, Media Art & Design Project, Human-AI Interaction Study Design, Designing Human Oversight of AI). B.Sc. Computer Science, Government College University Lahore (Oct 2019 to Dec 2023); award: Co-Curricular Certificate of Distinction 2023; led the Computer Science Society as Creative Head, then Society Manager and Vice President.

Experience:
- UX/UI Designer, Sumato Solutions, Pakistan (June 2024 to May 2025). Designed the POS module with a product manager, 3 developers and 2 QA testers; live in 10+ client deployments. Redesigned 8 ERP areas (sales, purchases, HRMS, CRM, finance, inventory, reports, dashboards). Built a reusable component library in Figma. Tested with ERP clients and A/B tests. Designed company and ERP product websites.
- UX/UI Designer, D2Soft Intellicence, Pakistan (Jan 2024 to June 2024). Designed 5 Belsio modules (property, CRM, finance, HR, procurement) for a Middle East proptech platform. Designed the Belsio mobile app following Material Design 3. Created a design system for web and mobile using WCAG 2.2 and ISO 9241.
- UX/UI Design Intern, Mashkraft, Pakistan (Oct 2023 to Jan 2024). Produced 50+ web and social media assets; designed app screens for caregivers and families; designed flyers, posters and templates.

Projects on the site:
- Sumato ERP: POS module and ERP redesign (see above).
- ARound the Market: AR guide for Christmas markets (HCI course, Oct 2025 to Feb 2026, team of 3). Voice search, gaze navigation, translation. Wizard-of-Oz study with 4 participants: 4/4 completed the task; 4/4 hesitated when starting AR navigation; proposed fixes not yet tested.
- muq. Smart Mug: companion app and design system for a connected coffee mug (April to July 2026, team of 4 with the founders). Design system: 29 semantic tokens, 12 typography styles, 5 components; 7 issues corrected. Working prototype demonstrated live.
- The Dirty Dozen: 15-minute e-learning course on human factors in aircraft maintenance, built in Articulate Rise 360 (Nov 2026, solo). Six lessons, 12 flashcards, four night-shift decisions, a graded quiz; two reviewers; four issues fixed in version 2. Not yet tested with real technicians.
- Website Designs: six websites (Beehive, Rememball, RoGe Build, Sumato Solutions, Sumato ERP, and All In One Electric, a solo freelance project).
- EDEN: smart dual-zone terrarium (April to June 2026, team of 5). Study with 2 users.
- Other academic and personal projects: a Python data quality pipeline, a job application tracker (Next.js, TypeScript, Supabase), and a freelance marketplace bachelor thesis (MERN stack).

Skills: UX research (user interviews, usability testing, A/B testing, NASA-TLX), UI and interaction design (user flows, wireframing, prototyping, design systems, accessibility), tools (Figma, Photoshop, Illustrator, InDesign, Adobe XD, Miro, Articulate Rise 360, Jira, Azure DevOps, Trello, Slack), technical (HTML/CSS, JavaScript, TypeScript, React, Python, SQL, Git), AI tools (ChatGPT, Claude, Claude Code, Figma MCP, Midjourney) and AI-assisted design workflows.

Certificates: Google UX Foundations (Coursera, June 2024); FAB Spark Fellowship (June 2026); Case Study Programm by Triathlon, Saarland University (2026). Volunteer: Social Media Manager, Pakistan Student Association Saarland (2025 to 2026).

Contact: salman.ashraff20@gmail.com. LinkedIn: linkedin.com/in/m-salman-bhatti. Portfolio: this website.`;

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

function overLimit(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) { hits.set(ip, { count: 1, reset: now + WINDOW_MS }); return false; }
  rec.count += 1;
  return rec.count > LIMIT;
}

function validMessages(list) {
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_MESSAGES) return false;
  if (list[list.length - 1].role !== 'user') return false;
  return list.every(m => (m.role === 'user' || m.role === 'assistant')
    && typeof m.content === 'string' && m.content.trim().length > 0 && m.content.length <= MAX_CHARS);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ error: 'The assistant is not set up yet. Please email Salman instead.' });

  if (overLimit(clientIp(req))) {
    return res.status(429).json({ error: 'You have reached the question limit for this hour. Please try again later.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const messages = body && body.messages;
  if (!validMessages(messages)) return res.status(400).json({ error: 'Please send a question of up to 800 characters.' });

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 500, system: SYSTEM, messages }),
    });
    if (!upstream.ok) return res.status(502).json({ error: 'The assistant is unavailable right now. Please try again shortly.' });
    const data = await upstream.json();
    const reply = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return res.status(200).json({ reply: reply || 'Sorry, I could not come up with an answer. Please rephrase your question.' });
  } catch {
    return res.status(502).json({ error: 'The assistant is unavailable right now. Please try again shortly.' });
  }
}
