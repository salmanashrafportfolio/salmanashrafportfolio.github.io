const img = (file) => `/projects/${file}`;
const figs = (cols, items, phones = false, pages = false, wide = false) => ({ type: 'figs', cols, phones, pages, wide, items: items.map(([src, alt, caption]) => [img(src), alt, caption]) });
const cards = (cols, items) => ({ type: 'cards', cols, items: items.map((c) => ({ ...c, img: c.img && img(c.img) })) });
const list = (items) => ({ type: 'list', items });
const pairs = (head, items) => ({ type: 'pairs', head, items: items.map(([title, a, b]) => [title, [img(a[0]), a[1]], [img(b[0]), b[1]]]) });
const bars = (title, items, note) => ({ type: 'bars', title, items, note });
const sub = (text) => ({ type: 'sub', text });
const para = (text) => ({ type: 'para', text });
const quote = (text) => ({ type: 'quote', text });
const flow = (items) => ({ type: 'flow', items });
const table = (head, rows) => ({ type: 'table', head, rows });
const stats = (items) => ({ type: 'stats', items });
const facts = (items) => ({ type: 'facts', items });
const split = (left, right) => ({ type: 'split', left, right });
const carousel = (items, interval = 2000) => ({ type: 'carousel', interval, items: items.map(([src, alt, caption]) => [img(src), alt, caption]) });
const link = (url, label) => ({ type: 'link', url, label });

export const projects = [
  {
    id: 'sumato', number: '01', name: 'Sumato ERP',
    noFacts: true,
    title: 'Sumato ERP: a fast POS and one consistent pattern across the platform',
    description: 'Designed a POS module deployed to more than 10 client environments, redesigned eight ERP areas, and built reusable components to support consistency and collaboration across the product.',
    lede: 'Sumato ERP is a cloud-based enterprise resource planning platform for small and medium-sized businesses. I worked as the sole UX/UI designer, improving the usability of existing ERP modules and designing a new point-of-sale (POS) experience.',
    tags: ['Enterprise UX/UI', 'Web Application', 'Design Systems'],
    live: ['https://sumatoerp.com/', 'sumatoerp.com'],
    meta: [['My role', 'UX/UI Designer'], ['Team', 'Product manager, 3 developers, 2 QA testers'], ['Timeline', 'Jun 2024 – May 2025'], ['Tools', 'Figma, Jira, Azure DevOps']],
    headerImage: true,
    hero: [img('pos.webp'), 'Point of Sale screen', '**Point of Sale.** Category tabs with item counts, availability on every item, and a persistent order summary that ends in one primary action.'],
    story: [
      ['The challenge', 'Dense dashboards hid important business information, similar actions behaved differently across modules, non-technical users needed simpler workflows, and clients lacked a dedicated POS for counter sales.'],
      ['What I did', 'Met Sumato’s clients, analysed the live ERP screens, and designed a POS built for quick order entry, a clearer dashboard hierarchy and shared interaction patterns across modules.'],
      ['Result', 'The POS was deployed to 10+ client businesses, 8 ERP areas were redesigned and implemented in the live product, and ERP and POS share one design system.']
    ],
    impact: [['10+', 'client deployments: the new POS module was deployed to more than ten client businesses'], ['8', 'ERP areas redesigned and implemented in the live product'], ['1', 'shared design system: a component library, design tokens and consistent interaction patterns across ERP and POS']],
    sections: [
      { title: 'Research & discovery', blocks: [
        sub('What I did'),
        list([
          '**Client discussions:** I met with clients to understand their daily operations, workflow requirements and expectations for a POS system.',
          '**Existing interface analysis:** I reviewed the ERP dashboard and record-management modules to identify inconsistencies in layout, navigation and interaction patterns.'
        ]),
        sub('Key findings'),
        list([
          '**Information overload:** the dashboard contained numerous small metric cards and repetitive tables, making important business information harder to scan.',
          '**Inconsistent interactions:** common actions such as adding, editing, filtering and deleting records were organized differently across modules.',
          '**Need for counter sales:** clients required a dedicated POS experience that would allow staff to manage orders and complete transactions.'
        ]),
        sub('Design opportunities'),
        table(['Finding', 'Priority', 'What it means'], [['Counter sales', 'POS', 'Create a POS interface optimized for quick order entry.'], ['Inconsistency', 'Shared patterns', 'Establish consistent interaction patterns across ERP modules.'], ['Information overload', 'Dashboard hierarchy', 'Improve hierarchy so important business data is easier to understand.']])
      ] },
      { title: 'Target users & needs', blocks: [
        sub('Who uses it'),
        table(null, [['Cashiers', 'Take orders at the counter, often with a queue waiting'], ['Managers & owners', 'Check sales and the state of the business'], ['Admin staff', 'Manage customers, items and reports']]),
        sub('Needs'),
        list(['Fast, error-free order entry', 'The key numbers at a glance', 'The same way to do things in every module'])
      ] },
      { title: 'Goals & design strategy', blocks: [
        quote('How might we simplify everyday ERP workflows while creating a fast, intuitive POS experience for non-technical users?'),
        sub('Goals'),
        list(['Ship a POS module that clients can use at the counter', 'One shared pattern for every record action', 'A design system across ERP and POS']),
        sub('Success criteria'),
        list(['POS adopted by client businesses (achieved: 10+ deployments)']),
        sub('Constraints'),
        list(['Changes had to work within the existing front end and stay safe to ship', 'A small team: 1 designer, 3 developers, 2 QA'])
      ] },
      { title: 'Ideation & information architecture', blocks: [
        sub('Sitemap: the main navigation I designed for'),
        cards(3, [
          { title: 'Dashboard', text: 'KPI cards, charts, top products' },
          { title: 'POS', text: 'Categories, items, order summary, checkout' },
          { title: 'Sales', text: 'Sales history, returns, return history' },
          { title: 'Items', text: 'Item list, categories, stock' },
          { title: 'Customers', text: 'Customers, types, details' },
          { title: 'Reports', text: 'Sales and business reports' }
        ]),
        sub('One pattern for every action'),
        flow(['List view', 'Toolbar: search · print · export · filter', 'Modal: add / edit / import', 'Confirm in red: delete']),
        para('Every module uses the same list, toolbar, modal and side-panel patterns with the same button order. Users learn the flow once, and developers reuse the same components.'),
        figs(2, [['cust_table.webp', 'Customers list view', '**The shared frame:** one toolbar row above the table, pagination below, reused in every record module.']]),
        sub('POS order flow'),
        flow(['Choose category', 'Tap item: Add to Cart', 'Edit order inline', 'Dine-in / take-away, discount', 'Confirm payment'])
      ] },
      { title: 'Wireframes & early concepts', text: 'Reconstructed for this case study.', blocks: [
        figs(3, [
          ['sumato_wf_pos.webp', 'POS wireframe', '**POS.** Items in a grid, the order summary always visible on the right and one primary action at the bottom.'],
          ['sumato_wf_dashboard.webp', 'Dashboard wireframe', '**Dashboard.** Summary first: 4 KPI cards, then charts for detail. One date range controls the page.'],
          ['sumato_wf_records.webp', 'Record module wireframe', '**Record modules.** One toolbar row above the table, pagination below: the same frame for customers, sales and items.']
        ]),
        quote('Design principle: make important actions easy to find, keep relevant information visible, and reuse familiar patterns wherever possible.'),
        sub('Key interaction decisions'),
        list(['**Large tap targets** and one-tap “Add to Cart” for the counter', '**Unavailable items greyed out,** so errors are prevented, not reported', '**Destructive actions** always ask for confirmation in red']),
        sub('Accessibility standards I set'),
        list(['Contrast and readability rules for text and status colours', 'Minimum touch-target size for the POS', 'Every module follows the same rules'])
      ] },
      { title: 'Final UI: Point of Sale', blocks: [
        list([
          '**Built for speed at the counter:** large tap targets, one-tap “Add to Cart” and quantity shown on the button.',
          '**Errors prevented, not reported:** unavailable items are greyed out and can’t be added.',
          '**Order always visible:** items, sizes and notes stay on screen with inline edit and remove.',
          '**One clear finish:** dine-in/take-away and discounts are toggles, checkout is a single green action.'
        ])
      ] },
      { title: 'Dashboard: summary before detail', blocks: [
        figs(2, [['dashboard.webp', 'Sales overview dashboard', '**Sales Overview.** KPI cards with 30-day trends, followed by charts for detail, so managers see the state of the business at a glance.']]),
        sub('How I worked and validated'),
        table(null, [['Design reviews', 'I evaluated UI variants through design reviews with the product manager and developers.'], ['Accessibility', 'Shared standards for contrast, touch-target size and readability, so every module followed the same rules.'], ['Team & delivery', 'Scrum sprints with a product manager, 3 developers and 2 QA testers, from design reviews to developer handoff.']])
      ] },
      { title: 'Reusable patterns: the shared flows of every record module', blocks: [
        figs(3, [
          ['cust_edit.webp', 'Add or edit customer form', '**Add / Edit.** One shared three-column form for both actions.'],
          ['cust_filter.webp', 'Filter side panel', '**Filter.** A side panel keeps the table in view while filtering.'],
          ['cust_import.webp', 'Import customers dialog', '**Import.** Drag-and-drop CSV upload with size limit and file preview.'],
          ['cust_delete.webp', 'Delete confirmation dialog', '**Delete.** Destructive actions ask for confirmation in red.']
        ])
      ] },
      { title: 'Redesigning the Sumato ERP screens', text: 'The original ERP UI and my redesign, implemented in the live product: same modules and data, clearer hierarchy and one consistent pattern.', blocks: [
        pairs(['Before', 'After'], [
          ['**Dashboard.** Summary before detail: 4 KPI cards with 30-day trends and % change replace 8 small number tiles. Fewer, clearer charts: growth, weekly sales and targets instead of repeated progress tables. One date range in the header controls the whole page.', ['sumato_before_dashboard.webp', 'Old sales dashboard'], ['dashboard.webp', 'Redesigned sales overview']],
          ['**Customers.** Clear page title and user role in a consistent header. One toolbar row: tabs, search, print, export and filters together. Calmer table: no red delete icon on every row, readable IDs such as CUS-42.', ['sumato_before_customers.webp', 'Old customers list'], ['cust_table.webp', 'Redesigned customers list']],
          ['**Sales history.** Same pattern as Customers, so users learn the layout once. Scannable data: invoice numbers (INV-1042) and readable dates. Payment mode as coloured tags (cash, card, bank transfer).', ['sumato_before_sales.webp', 'Old sales history'], ['sumato_after_sales.webp', 'Redesigned sales history']]
        ])
      ] },
      { title: 'Validation', blocks: [
        list([
          '**Design reviews:** I evaluated UI variants through design reviews with the product manager and developers.',
          '**QA:** I collaborated with QA testers during implementation.'
        ])
      ] },
      { title: 'Results & impact', blocks: [
        list([
          'The new POS module was deployed to **more than ten client businesses**.',
          '**8 ERP areas** were redesigned and implemented in the live product.',
          'A **shared design system** across ERP and POS: component library, design tokens and consistent interaction patterns.'
        ]),
        sub('Not measured'),
        para('Checkout time and error rates were not measured before and after the redesign, so I don’t claim speed gains.')
      ] },
      { title: 'Client feedback on the product', text: 'Published client reviews of Sumato ERP on sumatoerp.com. They describe the product and the whole team’s work.', blocks: [
        cards(2, [
          { tag: 'KM Electrical Accessories', title: '“Their solution helped us organize our workflows and access real-time insights with ease.”' },
          { tag: 'Vista Innovations', title: '“Sumato ERP brought structure and clarity to our business operations.”' }
        ])
      ] },
      { title: 'Learnings & next steps', blocks: [
        sub('What I learned'),
        para('Designing for enterprise workflows requires balancing usability, consistency and technical constraints. **Predictable interactions and clear information hierarchy can be more valuable than adding visual complexity.**'),
        sub('What I would improve'),
        para('Next time I would establish usability metrics earlier, observe cashiers during peak hours, and measure task completion time and errors.')
      ] }
    ]
  },
  {
    id: 'ar', number: '02', name: 'ARound the Market',
    noFacts: true,
    title: 'ARound the Market: an AR guide for Christmas markets',
    subtitle: 'Designing Hands-Free Navigation for Christmas Markets',
    description: 'Designed an augmented reality experience for Christmas market visitors, exploring voice search, gaze-based navigation, and translation through field research and usability testing.',
    lede: 'ARound the Market is an augmented reality concept designed to help visitors explore crowded Christmas markets using AR glasses. The experience combines voice search, gaze-based interaction, AR navigation, and menu translation to help visitors find stalls and navigate the market without relying on a smartphone.',
    tags: ['AR Interface Design', 'UX Research', 'Usability Testing'],
    meta: [
      ['My role', 'UX/UI Designer'],
      ['Project type', 'Human-Computer Interaction (HCI), Saarland University'],
      ['Duration', 'October 2025 – February 2026'],
      ['Team', '3 Students'],
      ['Tools & methods', 'Figma, Wizard-of-Oz Prototyping, Think-Aloud, NASA-TLX'],
      ['My contributions', 'Interaction design, user flows, wireframing, high-fidelity prototyping, and usability evaluation as part of a three-person HCI team.']
    ],
    coverWide: true,
    headerImage: true,
    hero: [img('ar_hi_ar.webp'), 'AR navigation view with a glowing route to a stall', '**AR navigation:** a glowing route on the ground guides visitors to the selected stall.'],
    sections: [
      { title: 'The Challenge', blocks: [
        para('Christmas markets can be difficult to navigate, especially for first-time visitors and international tourists.'),
        para('Crowded walkways, similar-looking stalls, language barriers, and occupied hands can make traditional smartphone navigation inconvenient.'),
        quote('How might we help visitors discover, evaluate, and navigate to market stalls through an intuitive, hands-free experience?')
      ] },
      { title: 'Understanding the Market Experience', blocks: [
        para('To better understand visitors’ needs and navigation challenges, our team conducted **field observations at the Saarbrücken Christmas market** and **five semi-structured interviews** with visitors aged 19–45.'),
        para('The findings informed our personas, user scenarios, task analysis, and design requirements.'),
        sub('Key research insights'),
        cards(3, [
          { tag: '01', title: 'Navigation was challenging', text: 'All five interviewees described difficulties navigating the market and frequently relied on recognizable landmarks to find their way.' },
          { tag: '02', title: 'Hands-free interaction mattered', text: 'Crowds, cold weather, gloves, and occupied hands made smartphone interaction less convenient.' },
          { tag: '03', title: 'Waiting times and language affected decisions', text: 'Three of five interviewees indicated a maximum acceptable waiting time of approximately 10–15 minutes. German-only menus also created difficulties for international visitors.' }
        ]),
        para('These exploratory insights helped guide the interaction design and features of the AR concept.'),
        sub('From insight to feature'),
        table(['Research insight', 'Design response'], [['Navigation difficulties', 'AR navigation'], ['Occupied hands', 'Voice search'], ['Language barriers', 'Menu translation']])
      ] },
      { title: 'From Research to Interaction Design', blocks: [
        para('We explored multiple hands-free interaction methods, including voice commands, gaze-based selection, and blinking.'),
        para('The final concept focused on **voice and gaze interactions.**'),
        sub('Main user flow'),
        flow(['Open Menu', 'Voice Search', 'View Results', 'Select Stall', 'AR Navigation', 'Translate Menu']),
        sub('Key design decisions'),
        cards(2, [
          { tag: '01', title: 'Voice-first search', text: 'Visitors can search for stalls or products without typing, addressing situations where their hands may be occupied.' },
          { tag: '02', title: 'Contextual stall information', text: 'Relevant stall information allows visitors to compare options before deciding where to navigate.' },
          { tag: '03', title: 'AR navigation', text: 'A glowing directional route provides visual guidance toward the selected stall.' },
          { tag: '04', title: 'Contextual menu translation', text: 'Translated menu information is displayed within the experience, reducing the need to switch between applications.' }
        ]),
        sub('Visual design approach'),
        para('The interface uses **dark translucent panels, larger interaction targets, and a limited number of actions per view** to prioritize readability in a visually busy environment.'),
        pairs(['Low fidelity', 'High fidelity'], [
          ['**Main menu.** Three large targets, each labelled with its input mode (voice or gaze), so visitors always know how to act.', ['ar_lo_menu.webp', 'Low-fidelity main menu'], ['ar_hi_menu.webp', 'High-fidelity main menu']],
          ['**Voice search.** Speak a stall or item name. Category chips narrow the results without typing, and a dark translucent panel keeps text readable over the bright market.', ['ar_lo_search.webp', 'Low-fidelity voice search'], ['ar_hi_search.webp', 'High-fidelity voice search']]
        ])
      ] },
      { title: 'Evaluating the AR Experience', blocks: [
        para('We evaluated the high-fidelity Figma prototype through a **Wizard-of-Oz usability study with four participants.** Voice and gaze interactions were simulated during the evaluation.'),
        para('Participants completed tasks involving voice search, AR navigation, menu translation, and locating themselves on the market map.'),
        para('We collected think-aloud observations, interview responses, and NASA-TLX workload ratings.'),
        sub('Key findings'),
        stats([['4/4', 'Completed scenario'], ['4/4', 'Hesitated starting navigation'], ['4/4', 'Found voice search efficient'], ['3/4', 'Requested more filters']]),
        sub('Workload observations (NASA-TLX)'),
        stats([['9.25/20', 'Effort'], ['3.25/20', 'Physical demand']]),
        sub('The main insight'),
        para('Although all participants completed the scenario, **every participant hesitated when initiating AR navigation.**'),
        quote('Successful task completion did not necessarily mean that the interaction was intuitive.'),
        para('The interface needed clearer feedback when transitioning from search results into AR navigation.'),
        para('Note: this was an exploratory study with four participants; the results are not statistically generalizable.')
      ] },
      { title: 'Turning Usability Findings into Design Improvements', blocks: [
        para('Usability testing revealed a critical interaction issue: **all four participants hesitated when starting AR navigation,** and two participants also paused after the AR route appeared.'),
        para('Based on these observations, we proposed four improvements.'),
        cards(2, [
          { tag: '01', title: 'Explicit navigation start', text: 'Introduce a clear “Start Navigation” action to communicate when AR guidance begins.' },
          { tag: '02', title: 'Stronger directional feedback', text: 'Add more prominent directional arrows and guidance along the AR route.' },
          { tag: '03', title: 'Audio support', text: 'Explore audio navigation and translation to reduce reliance on visual information.' },
          { tag: '04', title: 'Improved search controls', text: 'Introduce additional filtering options based on participant feedback.' }
        ]),
        sub('Proposed iteration'),
        para('The revised concept introduces an **explicit navigation-start cue, available through voice or gaze,** alongside clearer directional arrows.'),
        para('These changes are proposed improvements and have not yet been validated through another usability study.')
      ] },
      { title: 'What I Learned', blocks: [
        para('This project strengthened my understanding of designing interactions beyond traditional screens.'),
        para('One of my biggest takeaways was that **successful task completion does not always indicate an intuitive user experience.** Although every participant completed the scenario, usability testing revealed hesitation at a critical interaction point.'),
        para('This reinforced the importance of clear feedback, understandable interaction cues, and iterative evaluation, especially when designing for emerging technologies such as augmented reality.'),
        sub('Next steps'),
        para('The next step would be to implement the proposed navigation improvements and conduct another usability study to evaluate whether the redesigned interactions reduce uncertainty and improve navigation clarity.')
      ] }
    ]
  },
  {
    id: 'muq', number: '03', name: 'muq. Smart Mug', pageName: 'muq.',
    noFacts: true,
    title: 'muq.: a connected companion app',
    subtitle: 'Designing a Connected Coffee Companion App',
    description: 'Designed the companion app interface for a BLE-enabled smart mug and documented a reusable design system, including design tokens and components.',
    lede: 'muq. is a portable coffee cup with an integrated brewing chamber. In collaboration with its founders, our team explored a connected version that allows users to monitor and control their coffee’s temperature through a mobile application. As the UX/UI Designer, I worked on transforming the product requirements into user flows, wireframes, high-fidelity mobile interfaces, interactive prototypes, and a reusable Figma design system.',
    tags: ['Mobile UI Design', 'IoT', 'Design Systems'],
    live: ['https://coffeemuq.com/', 'coffeemuq.com'],
    links: [['https://www.figma.com/design/M9WuO1kKemiRyL1h4tGdJ3/MUQ.?node-id=0-1', 'Figma file']],
    meta: [
      ['Role', 'UX/UI Designer'],
      ['Duration', 'April – July 2026'],
      ['Team', '4 students collaborating with muq.’s founders'],
      ['Project type', 'University Collaboration · Working Prototype'],
      ['Tools', 'Figma, Claude via Figma MCP, BLE'],
      ['Outcome', 'A working connected-mug prototype and Android companion application, demonstrated live with the founders.']
    ],
    hero: [img('muq_render.webp'), 'Render of the muq. smart mug', '**The muq. cup** (render by the muq. founders).'],
    headerImage: true,
    sections: [
      { title: 'Making Device Interactions Simple and Understandable', blocks: [
        split([
          sub('The challenge'),
          para('The companion app needed to clearly communicate the state of a connected physical device.'),
          para('Users should be able to understand **whether the cup is connected, whether heating is active, the current and target temperatures,** and when their coffee reaches the desired temperature.'),
        ], [
          quote('How might we make temperature control and device status understandable with minimal interaction?')
        ]),
        sub('Understanding user needs'),
        para('We explored product requirements through discussions with the founders, competitor reviews, and informal conversations about coffee-drinking habits with 3–5 students.'),
        para('These early insights helped establish three design priorities:'),
        cards(3, [
          { tag: '01', title: 'Clear device feedback', text: 'Make connection and heating status easy to recognize.' },
          { tag: '02', title: 'Simple temperature control', text: 'Keep essential temperature information prominent and understandable.' },
          { tag: '03', title: 'Minimal interaction', text: 'Allow users to manage heating without unnecessary steps.' }
        ]),
        sub('Core user flow'),
        flow(['01 · Welcome', '02 · Pair', '03 · Set Temp', '04 · Heating', '05 · Ready']),
        para('The experience focuses on one primary task: **reaching and maintaining the user’s desired coffee temperature.**')
      ] },
      { title: 'Designing Clear and Consistent Interactions', blocks: [
        para('I designed the companion app around four essential interface states, prioritizing clear visual hierarchy and immediate feedback.'),
        carousel([
          ['muq_ui_scan.webp', 'Device pairing screen', '**01 · Device pairing.** Displays available devices and their connection status, helping users identify and connect to their muq. cup.'],
          ['muq_ui_control.webp', 'Temperature control screen', '**02 · Temperature control.** Emphasizes the target temperature and provides controls for adjusting the desired heating level.'],
          ['muq_ui_heating.webp', 'Heating feedback screen', '**03 · Heating feedback.** Communicates that heating is active, displays progress, and provides a prominent Stop Heating action.'],
          ['muq_ui_ready.webp', 'Ready state screen', '**04 · Ready state.** Confirms when the desired temperature has been reached and displays the relevant device status.']
        ]),
        sub('Wireframes'),
        carousel([
          ['muq_wf_splash.webp', 'Welcome wireframe', '**1 · Welcome**'],
          ['muq_wf_scan.webp', 'Pair device wireframe', '**2 · Pair device**'],
          ['muq_wf_control.webp', 'Set temperature wireframe', '**3 · Set temperature**'],
          ['muq_wf_heating.webp', 'Heating wireframe', '**4 · Heating**'],
          ['muq_wf_ready.webp', 'Ready wireframe', '**5 · Ready**']
        ]),
        quote('Design principle: one primary task per screen, supported by clear visual hierarchy and understandable system feedback.'),
          sub('Iterating through founder feedback'),
          para('After reviewing early wireframes with the founders, I refined several interface elements.'),
          list([
            '**Temperature hierarchy:** made the target temperature the most prominent numerical element on the heating screen.',
            '**Action visibility:** changed the outlined Stop Heating button to a filled red action.',
            '**Simplified layouts:** refined the welcome screen and device-pairing experience.'
          ]),
          para('These changes were informed by stakeholder feedback and design review. Their usability benefits have not yet been formally evaluated.')
      ] },
      { title: 'Building a Maintainable Design System', blocks: [
        link('https://www.figma.com/design/M9WuO1kKemiRyL1h4tGdJ3/MUQ.?node-id=262-122', 'Design System page in Figma'),
        para('To support consistency across the application, I developed a reusable Figma design system with **primitive and semantic tokens, components, and documented variants.**'),
        para('The system separates raw design values from their functional meaning, making interface styling more consistent and easier to maintain.'),
        sub('Design system deliverables'),
        stats([['29', 'Semantic tokens'], ['12', 'Typography styles'], ['5', 'Components'], ['7', 'Issues corrected']]),
        figs(2, [
          ['muq_foundations.webp', 'Design system foundations: colour, typography, spacing and radius', '**Foundations:** colour, typography, spacing and radius tokens.'],
          ['muq_components.webp', 'Design system components', '**Components:** five documented components with do and don’t rules.']
        ]),
        sub('Auditing & improving components'),
        para('After designing the app, I audited the Figma component library with Claude via Figma MCP and identified seven issues involving **naming, variant properties, hard-coded colors, semantic token assignments, and component documentation.**'),
        para('I used Claude via Figma MCP to assist in identifying inconsistencies and automating repetitive updates. I reviewed the findings, made the design decisions, and manually verified the results.'),
        sub('Example: Status Badge refactoring'),
        table(null, [['Before', 'Multiple status variants incorrectly displayed “Connected” because they shared the same text property.'], ['After', 'I refactored the component so that Connected, Brewing, and Error states displayed their appropriate labels.']]),
        figs(2, [['muq_status_badge.webp', 'Status Badge component documentation', '**Status Badge:** each state now shows its own label.']]),
        quote('Key learning: a maintainable design system depends on meaningful naming, consistent tokens, and reliable component behavior, not simply the number of components.')
      ] },
      { title: 'From Interface Design to a Working Prototype', blocks: [
        split([
        sub('What we delivered'),
        para('Our team developed a **working prototype** consisting of the connected muq. cup, firmware, and Android companion app.'),
        para('The prototype was demonstrated live with the founders during the final presentation.'),
        para('My UX/UI deliverables included the mobile app interface, interactive prototypes, and a documented Figma design system.'),
        sub('Validation & limitations'),
        para('The team evaluated sensing accuracy and Bluetooth connection stability on the working prototype.'),
        para('Visitors interacted with the cup and companion app during the final presentation, but structured usability feedback was not recorded.'),
        para('As a result, the usability of the interface has not yet been formally validated.'),
        sub('What I learned'),
        para('This project strengthened my understanding of designing interactions for connected physical devices.'),
        para('It reinforced the importance of **clear system feedback, consistent interface states, and collaboration between design and technical development.**'),
        para('Building the design system also helped me better understand how reusable components, semantic tokens, and documentation support consistent interfaces.'),
        sub('Next steps'),
        para('If I continued the project, I would:'),
        list([
          'Conduct structured usability testing of the pairing and heating flows.',
          'Evaluate Bluetooth-disconnection and error states.',
          'Review interface contrast and accessibility.',
          'Explore saved temperature presets for repeated use.'
        ])
        ], [
          figs(1, [['muq_team.webp', 'Team at the final presentation', '**Final presentation** with the founders and the student team.']])
        ])
      ] }
    ]
  },
  {
    id: 'elearning', number: '04', name: 'The Dirty Dozen',
    noFacts: true,
    title: 'The Dirty Dozen: a 15-minute human factors e-learning module',
    subtitle: 'Designing a 15-minute human factors e-learning module for aircraft maintenance',
    description: 'Designed and built a 15-minute e-learning course on the Dirty Dozen human factors for aircraft maintenance technicians, using scenarios, a graded quiz and reviewer feedback.',
    lede: 'The Dirty Dozen is a 15-minute recurrent training course for B1/B2 aircraft maintenance technicians. It teaches the twelve human factors that lead to errors, such as fatigue, distraction and pressure, through a real incident, flashcards, decision scenarios and a graded quiz.',
    tags: ['E-Learning', 'Learning Design', 'Articulate Rise 360'],
    coverLabel: 'E-LEARNING',
    headerImage: true,
    live: ['https://dirty-dozen-hf-course.netlify.app/', 'dirty-dozen-hf-course.netlify.app'],
    hero: [img('dd_header.webp'), 'Live course cover: The Dirty Dozen, Human Factors in Maintenance', '**The live course:** the cover of the published Rise 360 course.'],
    meta: [
      ['My role', 'UX/UI Designer & e-learning developer (solo)'],
      ['Audience', 'B1/B2 aircraft maintenance technicians, recurrent training'],
      ['Format', '6 lessons, about 15 minutes, graded quiz'],
      ['Timeline', 'November 2026 · Personal project'],
      ['Team', 'Solo (me)'],
      ['Tools', 'Articulate Rise 360, Review 360, Claude'],
      ['Status', 'Published, version 2 after reviewer feedback']
    ],
    sections: [
      { title: 'My contribution', blocks: [
        para('I planned and built the whole course on my own: **learning objectives, lesson structure, the incident case, the decision scenarios and the quiz.** I used Claude for structure and first drafts, **checked the key facts against aviation sources,** built every lesson in Rise 360, and ran a review round in Review 360.')
      ] },
      { title: 'Why the Dirty Dozen?', blocks: [
        para('The Dirty Dozen is a well-known human factors model in aircraft maintenance: **twelve common conditions that lead to errors,** like fatigue, distraction or pressure. It is relevant for every technician and works well with scenarios, because these factors happen in everyday situations on a shift.'),
        para('It also let me show the full learning design process in a short course: a case, the facts, decisions and a quiz.')
      ] },
      { title: 'The challenge', blocks: [
        split([
          para('Most maintenance errors are made by **skilled, experienced technicians,** not careless ones, because of conditions around them such as tiredness, interruptions or pressure.'),
          para('Recurrent training on this topic can easily feel like a list of definitions.')
        ], [
          quote('How might we help technicians recognise the Dirty Dozen in real hangar situations, and know what to do, in only 15 minutes?')
        ])
      ] },
      { title: 'From objectives to a lesson plan', blocks: [
        sub('Three learning objectives'),
        para('Written with action verbs (Bloom’s taxonomy), from remembering to applying. After the course, learners can:'),
        list([
          '**01 Name** the 12 Dirty Dozen precursors.',
          '**02 Identify** them in a real incident.',
          '**03 Choose** a safety net that stops each one.'
        ]),
        quote('Design principle: each lesson serves one objective. The case makes it real, the cards teach, the decisions apply it, and a graded quiz checks it.'),
        figs(3, [
          ['dd_welcome.webp', 'Lesson 1: Welcome', '**1 · Welcome**'],
          ['dd_knowledge.webp', 'Lesson 5: Knowledge check', '**5 · Knowledge check**'],
          ['dd_habits.webp', 'Lesson 6: Three habits to keep', '**6 · Three habits**']
        ]),
        sub('Course structure'),
        table(['Lesson', 'What it does', 'Rise block', 'Objective'], [
          ['1 · Welcome', 'Explains why good technicians make errors, the 15-minute length and the three objectives.', 'Text, numbered list', 'Sets all'],
          ['2 · Case: Night shift, Hangar 3', 'The result comes first, an in-flight engine shutdown. A timeline then shows the small factors that lined up, followed by “Which factors contributed?”', 'Timeline, multiple response', '02'],
          ['3 · The Dirty Dozen', 'Short intro to Dupont’s model (Transport Canada, 1993), then 12 flashcards: factor on the front, explanation and safety net on the back.', 'Text, flashcards', '01, 03'],
          ['4 · Your shift: four calls', 'Learners make 4 decisions on a night shift (02:15, 04:30, 05:10, 05:50). Feedback names the factor and the safest action.', 'Knowledge checks with feedback', '02, 03'],
          ['5 · Knowledge check', '6 graded questions. Pass with 5 of 6, retakes allowed.', 'Quiz lesson', '01–03'],
          ['6 · Take it back to the hangar', 'Three habits for the next shift: mark where you stopped, speak up when tired or rushed, follow the procedure, not the shop habit.', 'Text, numbered list', '03']
        ])
      ] },
      { title: 'Making it feel like a real shift', blocks: [
        figs(3, [
          ['dd_case.webp', 'Lesson 2: case timeline', '**Lesson 2 · Case:** the timeline shows the small factors that lined up.'],
          ['dd_flashcards.webp', 'Lesson 3: flashcards', '**Lesson 3 · Flashcards:** factor on the front, safety net on the back.'],
          ['dd_calls.webp', 'Lesson 4: decision call', '**Lesson 4 · Four calls:** a decision at a real time, with feedback.']
        ]),
        cards(3, [
          { tag: 'Lesson 2 · Case', title: 'Result first, then the timeline', text: 'Learners see the engine shutdown before the night that led to it. Following the timeline, they discover how several small factors lined up, so the error isn’t blamed on one bad person.' },
          { tag: 'Lesson 3 · Flashcards', title: 'Every factor comes with a safety net', text: '12 cards keep many short facts out of long text. The back of each card pairs the factor with an action, for example distraction → mark where you stopped and restart a few steps back.' },
          { tag: 'Lesson 4 · Four calls', title: 'Decisions at real times', text: 'The four calls happen between 02:15 and 05:50, inside the Window of Circadian Low (about 02:00–06:00), when alertness is lowest. Each choice gets feedback that names the factor.' }
        ]),
        para('The case and the technician “Alex” are made up but realistic.')
      ] },
      { title: 'Using AI for speed, not for correctness', blocks: [
        cards(5, [
          { tag: 'Step 1', title: 'Draft', text: 'Claude for the course structure, first texts and quiz questions.' },
          { tag: 'Step 2', title: 'Fact-check', text: 'Key facts checked against aviation safety sources before I kept them.' },
          { tag: 'Step 3', title: 'Simplify', text: 'Read every lesson as a technician would and shortened long sentences.' },
          { tag: 'Step 4', title: 'Consistency', text: 'Checked that each safety net fits its factor and each feedback matches the right answer.' },
          { tag: 'Step 5', title: 'Build & review', text: 'Built in Rise 360 and shared in Review 360 for feedback.' }
        ]),
        cards(2, [
          { tag: 'Window of circadian low', title: 'Checked against SKYbrary', text: 'The quiz asks when human alertness is lowest. I checked the answer against SKYbrary, which gives about 02:00–06:00. I kept it, and used those times for the night-shift decisions in lesson 4.' },
          { tag: 'Origin of the model', title: 'Confirmed before writing', text: 'I confirmed that Gordon Dupont developed the Dirty Dozen at Transport Canada in 1993 before writing the lesson 3 intro.' }
        ]),
        sub('Why this matters in aviation training'),
        para('The biggest risk of AI here is **wrong information that sounds correct.** In safety training, a wrong value or step order could cause real harm, so I treated each AI draft like a draft from a new colleague: useful, but checked before I trusted it.'),
        quote('AI helps with speed. Humans are responsible for correctness. In a real project, a subject-matter expert would do the final content review.'),
        para('I used Claude outside Rise. I did not use Articulate’s built-in AI Assistant for this course.')
      ] },
      { title: 'Reviewer feedback and what I changed', blocks: [
        para('I published the course to Review 360 and shared it with **two reviewers,** who commented directly on the lesson blocks. I fixed **four issues** in Rise, published version 2 and resolved the comments. Reviewer names are hidden.'),
        table(['Where', 'Reviewer comment', 'Change'], [
          ['Lesson 2 · Case quiz', '“The feedback ties ‘short-staffed’ to fatigue. Short staffing is closer to lack of resources.”', 'Fixed: fatigue now linked to the third night shift.'],
          ['Lesson 3 · Flashcards', '“The intro says each card shows how the factor looks in the hangar, but the cards give only the definition and the safety net.”', 'Fixed: intro now matches the cards.'],
          ['Lesson 4 · Call 3', '“The wrench has an expired calibration label, yet one option says ‘It was in calibration last week.’”', 'Fixed: label expired yesterday, option reworded.'],
          ['Lesson 5 · Knowledge check', '“The intro says 5 out of 6 (80%) to pass, but 5/6 is 83%.”', 'Fixed: “You need 5 out of 6 to pass”.'],
          ['Lesson 4 · All calls', '“In all four calls the correct answer is the longest option. Learners could pass by picking the longest answer.”', 'Planned: similar-length options and more plausible distractors.']
        ]),
        quote('Key insight: three of the four fixes were consistency problems, a feedback, an intro or an option that didn’t match the rest. The longest-answer issue showed me that a quiz can test test-taking skill instead of knowledge if the options aren’t balanced.'),
        sub('Positive feedback'),
        list([
          '“Strong realistic case, and the timeline format makes the missed handover easy to see. The three habits are clear and memorable.”',
          '“The takeaway about speaking up when rushed or tired is especially crucial on night shifts.”'
        ])
      ] },
      { title: 'Delivered, reviewed, learned', blocks: [
        stats([['6', 'lessons, about 15 minutes'], ['12', 'flashcards with safety nets'], ['4', 'night-shift decisions'], ['4', 'reviewer issues fixed in v2']]),
        sub('Validation & limitations'),
        para('Two reviewers tested the course in Review 360, and their feedback led to version 2.'),
        para('However, the course **has not yet been tested with real maintenance technicians,** and no aviation subject-matter expert has reviewed it. There is no LMS data on completion or quiz results yet, so its learning effect has not been measured.'),
        sub('What I learned'),
        list([
          '**Objectives first.** Writing three clear objectives made every lesson and quiz question easier to plan.',
          '**Scenarios beat definitions.** The case and the four calls were the parts reviewers found most convincing.',
          '**AI drafts need a checker.** Fact-checking and consistency checks were where most of my time went, and where review still found issues.',
          '**Rise 360 basics.** I learned Rise for this project: timelines, flashcards, knowledge checks, a graded quiz and Review 360.'
        ]),
        sub('Next steps'),
        list([
          '**Balance answer options** in lesson 4, as planned from the review.',
          '**Try the Scenario block** for branching dialogue in the four calls.',
          '**Subject-matter expert review** of all content.',
          '**Pilot with technicians,** export via SCORM to an LMS and evaluate with Kirkpatrick: reaction, learning, behaviour.'
        ])
      ] }
    ]
  },
  {
    id: 'websites', number: '05', name: 'Website Designs',
    title: 'Website designs',
    description: 'A home services platform, a safety compliance platform, a construction and solar site, and the Sumato company and product websites.',
    lede: 'A home services platform, a safety compliance platform, a construction and solar site, and the Sumato company and product websites.',
    tags: ['Website Design'],
    noCover: true,
    meta: [],
    hero: [img('websites_cover.webp'), 'Website UI Design Collection: six responsive websites for electrical, services, ERP, SaaS and construction clients'],
    sections: [
      { title: 'All In One Electric', text: 'Freelance project, designed alone.', blocks: [
        facts([['Role', 'UX/UI Designer'], ['Timeline', 'October 2024'], ['Team', 'Freelance client, designed alone'], ['Tools', 'Figma']]),
        figs(2, [
          ['aio_home.webp', 'All In One Electric home page, full length', 'Home'],
          ['aio_about.webp', 'All In One Electric about page, full length', 'About'],
          ['aio_services.webp', 'All In One Electric services page, full length', 'Services'],
          ['aio_ev_charging.webp', 'All In One Electric EV charging page, full length', 'EV Charging']
        ], false, true)
      ] },
      { title: 'Beehive', text: 'Designed responsive marketing pages and interfaces for a home-services platform, including customer and admin views for job posting and proposal comparison. Focus: responsive UI, service discovery and workflow design.', blocks: [
        facts([['Role', 'UX/UI Designer'], ['Timeline', '2024'], ['Team', 'Sumato Solutions, with another UX/UI Designer'], ['Tools', 'Figma, Miro, Adobe Photoshop, Adobe Illustrator, Azure DevOps']]),
        figs(3, [
          ['bee_home.webp', 'Beehive home page, full length', 'Home'],
          ['bee_services.webp', 'Beehive services page, full length', 'Our Services'],
          ['bee_hvac.webp', 'Beehive HVAC service page, full length', 'HVAC'],
          ['bee_storage.webp', 'Beehive storage page, full length', 'Storage'],
          ['bee_about.webp', 'Beehive about page, full length', 'About'],
          ['bee_contact.webp', 'Beehive contact page, full length', 'Contact']
        ], false, true)
      ] },
      { title: 'Rememball', text: 'Safety compliance platform.', blocks: [
        facts([['Role', 'UX/UI Designer'], ['Timeline', '2024'], ['Team', 'Sumato Solutions, with another UX/UI Designer'], ['Tools', 'Figma, Miro, Adobe Photoshop, Adobe Illustrator, Azure DevOps']]),
        link('https://www.rememball.com/', 'rememball.com'),
        figs(3, [
          ['rem_home.webp', 'Rememball home page, full length', 'Home'],
          ['rem_about.webp', 'Rememball about page, full length', 'About'],
          ['rem_pricing.webp', 'Rememball pricing page, full length', 'Pricing'],
          ['rem_contact.webp', 'Rememball contact page, full length', 'Contact']
        ], false, true)
      ] },
      { title: 'RoGe Build', text: 'Construction & solar.', blocks: [
        facts([['Role', 'UX/UI Designer'], ['Timeline', '2024'], ['Team', 'Sumato Solutions, with another UX/UI Designer'], ['Tools', 'Figma, Miro, Adobe Photoshop, Adobe Illustrator, Azure DevOps']]),
        figs(3, [
          ['roge_home.webp', 'RoGe Build home page, full length', 'Home'],
          ['roge_about.webp', 'RoGe Build about page, full length', 'About'],
          ['roge_construction.webp', 'RoGe Build construction page, full length', 'Construction'],
          ['roge_portfolio.webp', 'RoGe Build portfolio page, full length', 'Portfolio'],
          ['roge_gallery.webp', 'RoGe Build gallery page, full length', 'Gallery'],
          ['roge_job.webp', 'RoGe Build job details page, full length', 'Job Details'],
          ['roge_contact.webp', 'RoGe Build contact page, full length', 'Contact']
        ], false, true)
      ] },
      { title: 'Sumato Solutions', text: 'Company website.', blocks: [
        facts([['Role', 'UX/UI Designer'], ['Timeline', '2024'], ['Team', 'Sumato Solutions, with another UX/UI Designer'], ['Tools', 'Figma, Miro, Adobe Photoshop, Adobe Illustrator, Azure DevOps']]),
        link('https://sumatosolutions.com/', 'sumatosolutions.com'),
        figs(3, [
          ['sum_home.webp', 'Sumato Solutions home page, full length', 'Home'],
          ['sum_product.webp', 'Sumato Solutions product page for Sumato ERP, full length', 'Our Product'],
          ['sum_careers.webp', 'Sumato Solutions careers page, full length', 'Careers'],
          ['sum_job_overview.webp', 'Sumato Solutions job overview page, full length', 'Job Overview'],
          ['sum_job_application.webp', 'Sumato Solutions job application page, full length', 'Job Application'],
          ['sum_contact.webp', 'Sumato Solutions contact page, full length', 'Contact']
        ], false, true)
      ] },
      { title: 'Sumato ERP', text: 'Designed website interfaces presenting Sumato ERP’s software features and business solutions. Focus: SaaS product communication, information hierarchy and visual consistency.', blocks: [
        facts([['Role', 'UX/UI Designer'], ['Timeline', '2024'], ['Team', 'Sumato Solutions, with another UX/UI Designer'], ['Tools', 'Figma, Miro, Adobe Photoshop, Adobe Illustrator, Azure DevOps']]),
        link('https://sumatoerp.com/', 'sumatoerp.com'),
        figs(3, [
          ['erp_home.webp', 'Sumato ERP home page, full length', 'Home'],
          ['erp_industries.webp', 'Sumato ERP industries page, full length', 'Industries'],
          ['erp_products.webp', 'Sumato ERP products page, full length', 'Products'],
          ['erp_blogs.webp', 'Sumato ERP blogs page, full length', 'Blogs'],
          ['erp_contact.webp', 'Sumato ERP contact page, full length', 'Contact']
        ], false, true)
      ] }
    ]
  },
  {
    id: 'eden', number: '06', name: 'EDEN Terrarium',
    title: 'EDEN: a smart dual-zone terrarium that people trust',
    description: 'Led the evaluation, video and documentation for EDEN, a smart dual-zone terrarium. A study with two users showed 4.1/5 trust in its sensing and led to zone-level alerts.',
    lede: 'EDEN is a smart dual-zone terrarium that monitors two zones and sends alerts when conditions need attention. In a team of five, I led the evaluation, video and documentation to test whether non-experts trust the terrarium’s alerts and act on them.',
    tags: ['Evaluation', 'User Research', 'IoT'],
    live: ['https://eden-terrarium.vercel.app/', 'eden-terrarium.vercel.app'],
    headerImage: true,
    hero: [img('eden_dash_home.webp'), 'EDEN dashboard, home view', '**The EDEN dashboard:** the home view of the terrarium monitor.'],
    meta: [
      ['My role', 'Evaluation lead, video & documentation'],
      ['Team', 'Team of 5'],
      ['Timeline', 'April 2026 – June 2026'],
      ['Type', 'Academic project']
    ],
    sections: [
      { title: 'Evaluation', text: 'The question was simple: do non-experts trust the terrarium’s alerts, and do they act on them?', blocks: [
        stats([['2', 'users in the study'], ['4.1/5', 'sensing trust'], ['6/6', 'soil readings correct']]),
        para('Participants rated how much they trusted the sensing and checked the soil readings against the reference values. The findings led to **zone-level alerts**, so users can see which zone needs attention.')
      ] },
      { title: 'Dashboard', blocks: [
        figs(2, [
          ['eden_dash_zones.webp', 'EDEN dashboard, zones view', 'Zones'],
          ['eden_architecture.webp', 'EDEN system architecture', 'Architecture']
        ])
      ] }
    ]
  },
  {
    id: 'pipeline', number: '07', name: 'Data Quality Pipeline',
    title: 'Product Data Quality Pipeline: clean data for Power BI',
    description: 'A Python pipeline that validates records against 14 rules and removes duplicates, so Power BI reports run on clean product data. Tested with pytest against ground truth.',
    lede: 'A Python pipeline that checks and cleans a product dataset of 2,496 records before it reaches Power BI. It validates each record against 14 rules, removes duplicates, and is tested with pytest against known, injected errors.',
    tags: ['Python', 'Data Quality', 'Testing'],
    coverLabel: 'PYTHON · DATA',
    links: [['https://github.com/msalmanbhatti/product-data-quality', 'GitHub repository']],
    meta: [
      ['My role', 'Built and tested the pipeline'],
      ['Timeline', 'October 2026'],
      ['Tools', 'Python, pandas, pytest, Power BI']
    ],
    impact: [['2,496', 'records validated and deduplicated'], ['14', 'validation rules'], ['94.9%', 'of injected errors found']],
    sections: [
      { title: 'Validation & cleaning', blocks: [
        para('Power BI reports are only as good as their data. The pipeline runs every record through **14 validation rules**, then removes duplicates so each product appears once.')
      ] },
      { title: 'Testing', text: 'The pipeline was tested against a ground-truth set with known errors.', blocks: [
        stats([['94.9%', 'of injected errors found'], ['100%', 'duplicate precision']])
      ] }
    ]
  },
  {
    id: 'applyd', number: '08', name: 'Applyd',
    title: 'Applyd: a job application tracker with a Kanban board',
    description: 'A full-stack job application tracker with a drag-and-drop Kanban board, so each application’s stage is visible at a glance.',
    lede: 'Applyd is a job application tracker built end to end with Next.js, TypeScript and Supabase. Applications move across a drag-and-drop Kanban board so each stage is visible at a glance, and Row Level Security keeps each user’s data private.',
    tags: ['Full-stack', 'UX Design', 'Next.js'],
    coverLabel: 'FULL-STACK',
    links: [['https://github.com/msalmanbhatti/application-tracker', 'GitHub repository']],
    meta: [
      ['My role', 'Designer & developer'],
      ['Timeline', 'October 2026'],
      ['Tools', 'Next.js, TypeScript, Supabase']
    ],
    sections: [
      { title: 'Design', text: 'Job searches involve many applications at different stages. The board makes the current stage of each one visible without opening it.', blocks: [
        list(['A drag-and-drop Kanban board: move an application to its next stage', 'Stage visible at a glance across all applications'])
      ] },
      { title: 'Build', blocks: [
        list(['Full-stack app with Next.js and TypeScript', 'Supabase backend with **Row Level Security**, so each user sees only their own applications'])
      ] }
    ]
  },
  {
    id: 'designcrafters', number: '09', name: 'Design Crafters',
    title: 'Design Crafters: a freelance marketplace for creatives',
    description: 'Bachelor thesis: designed the complete front end of a MERN freelance marketplace where creatives find clients, verified with unit tests.',
    lede: 'Design Crafters is a freelance marketplace where creatives find clients. For my bachelor thesis, I designed the complete front end in a team of two and built it on the MERN stack, verifying sign-up, gigs and orders with unit tests before integration.',
    tags: ['Bachelor Thesis', 'UI Design', 'MERN'],
    coverLabel: 'BACHELOR THESIS',
    meta: [
      ['My role', 'Front-end design & development'],
      ['Team', 'Team of 2'],
      ['Timeline', 'November 2023'],
      ['Stack', 'MongoDB, Express.js, React.js, Node.js']
    ],
    sections: [
      { title: 'Front end', blocks: [
        list(['Complete front end of the marketplace, designed and built', 'Bootstrap, HTML/CSS and React.js for the interface'])
      ] },
      { title: 'Testing', text: 'Sign-up, gigs and orders were verified with unit tests before the front end was integrated with the back end.', blocks: [] }
    ]
  }
];

export const testimonials = [
  { name: 'Manahil Zaki', role: 'Project Coordinator', photo: '/testimonials/minahil.webp', quote: 'I was lucky to collaborate with Salman at Sumato Solutions, and he impressed me every time based on his creativity and professionalism, as well as, in-depth knowledge of UI/UX design. He possesses some extraordinary skills of converting user needs into usable interfaces that are also visually interesting. He is a hardworking team player with a keen eye to details. An organization can only be lucky to get someone with talent and hardworking like Salman!' },
  { name: 'Maryam Nasir', role: 'Digital Marketing Manager', photo: '/testimonials/mariam.webp', quote: 'I had the pleasure of working closely with Salman during his internship at Mashkraft, and I can confidently say that he is exceptionally talented. What truly sets Salman apart is his remarkable creative eye for design to deliver visually captivating and user-friendly interfaces. His exceptional talent, diligence, and collaborative spirit make him a standout professional in his field and a valuable asset to any team.' },
  { name: 'Muhammad Waqas', role: 'Product Developer', photo: '/testimonials/waqas.webp', quote: 'I’ve worked with Salman Bhatti on multiple web design projects, and he has been a reliable and creative partner throughout. He has a knack for clean, user-friendly designs and always brings fresh ideas to the table. Salman listens carefully to project needs and ensures the final output aligns with the vision while being practical and visually appealing. If you’re looking for someone who can get the job done without overcomplicating things, Salman is a great choice.' },
  { name: 'Areeba Younas', role: 'Program Officer', photo: '/testimonials/areeba.webp', quote: 'Salman is an exceptional UI/UX designer who seamlessly blends creativity, analytical thinking, and user-centric design principles.' },
  { name: 'Asad Masood Chaudhry', role: 'Software Engineer', photo: '/testimonials/asad.webp', quote: 'I strongly recommend Salman as a UI/UX designer. He demonstrates professionalism and consistently contributes to improved user satisfaction.' }
];

export const experience = [
  { title: 'UX/UI Designer', org: 'Sumato Solutions', dates: 'June 2024 – May 2025', place: 'Pakistan', desc: 'I designed the POS module and redesigned eight ERP areas, working in Scrum sprints with a product manager, three developers and two QA testers. Busy screens slowed down cashiers and back-office users. So I built a shared component library with design tokens, set accessibility standards for ERP and POS, and compared UI variants with A/B tests before rollout. The redesigned modules went live, and the POS module now runs in more than 10 client deployments.' },
  { title: 'UX/UI Designer', org: 'D2Soft Intellicence', dates: 'January 2024 – June 2024', place: 'Pakistan', desc: 'I designed five modules of Belsio, a proptech platform for the Middle East real-estate market: dashboards for property, CRM, finance, HR and procurement. The product had to work on web and mobile, so I started with user flows and wireframes, then created the Belsio design system before the high-fidelity UI. This gave the team one consistent design language across both platforms and a smoother handoff to developers.' },
  { title: 'UX/UI Design Intern', org: 'Mashkraft', dates: 'October 2023 – January 2024', place: 'Pakistan', desc: 'I designed web and mobile app screens for caregivers and their families, plus flyers, posters and social media graphics. The brand needed a consistent look across all channels, so I created reusable templates and followed the corporate design in Photoshop, Illustrator and InDesign. In total I delivered more than 50 brand-consistent web and social media assets.' }
];

export const education = [
  { title: 'M.Sc. Media Informatics', org: 'Universität des Saarlandes', dates: 'Apr 2025 – Present', place: 'Germany', points: [
    'Relevant coursework: Human-Computer Interaction, Living “AI-ducation” Dashboard (data visualization), Media Art & Design Project, Designing Human Oversight of AI for “Good Work” (seminar), From Research Ideas to Empirical Study Designs in Human–AI Interaction (research seminar).'
  ] },
  { title: 'B.Sc. Computer Science', org: 'GC University', dates: 'Oct 2019 – Dec 2023', place: 'Lahore', points: [
    'Relevant coursework: Software Engineering, Advanced Software Engineering, Software Development Process, Artificial Intelligence & Neural Networks, Probability & Statistics, Database Systems, Communication & Presentation Skills, Technical & Business Writing.'
  ] }
];

export const certificates = [
  { title: 'Foundations of User Experience (UX) Design', issuer: 'Google, via Coursera', date: 'Jun 2024', file: 'google-ux-foundations.webp', verify: 'https://coursera.org/verify/N89A8QD6EC7R' },
  { title: 'Case Study Programm', issuer: 'Triathlon, Universität des Saarlandes', date: 'Summer 2026', file: 'case-study-programm.webp' },
  { title: 'FAB Spark Fellowship', issuer: 'FAB', date: 'Jun 2026', file: 'fab-spark-fellowship.webp' },
  { title: 'Social Media Manager', issuer: 'Pakistan Student Association Saarland', date: '2025–2026', file: 'psa-social-media-manager.webp' },
  { title: 'Co-Curricular Certificate of Distinction', issuer: 'GC University Lahore, Computer Science Society', date: '2023', file: 'gcu-cs-society-distinction.webp' },
  { title: 'A Thousand Rays of Light: Assistant Director', issuer: 'GC University Lahore & Khayaali Production', date: '2023', file: 'thousand-rays-of-light.webp' },
  { title: 'The Last Follower x Harry Potter Festival Year 2: Appreciation', issuer: 'GC University Lahore', date: '2023', file: 'gcu-festival-appreciation.webp' },
  { title: 'The Last Follower x Harry Potter Festival: Senior Ambassador', issuer: 'Khayaali Production', date: 'Nov 2022', file: 'festival-senior-ambassador.webp' },
  { title: 'The Last Follower x Harry Potter Festival: Event / Booth Manager', issuer: 'Khayaali Production', date: 'Nov – Dec 2021', file: 'festival-event-manager.webp' },
  { title: 'The Last Follower and the Resurrection of Voldemort: Volunteer / Actor', issuer: 'Khayaali Production', date: 'Dec 2020 – Feb 2021', file: 'last-follower-volunteer.webp' }
];

export const skills = [
  ['UX Research', 'research', [['User Interviews', 'icon:interviews'], ['Field Observations', 'icon:observe'], ['Usability Testing', 'icon:usability'], ['Think-Aloud', 'icon:thinkaloud'], ['A/B Testing', 'icon:ab'], ['NASA-TLX', 'icon:workload']]],
  ['UI & Interaction Design', 'ui', [['User Flows', 'icon:workflow'], ['Wireframing', 'icon:wireframe'], ['Interactive Prototypes', 'icon:prototype'], ['Visual Design', 'icon:visual'], ['Accessibility', 'icon:a11y'], ['Design Systems', 'icon:system']]],
  ['Design Tools', 'tools', [['Figma', 'figma.png'], ['Photoshop', 'photoshop.png'], ['Illustrator', 'illustrator.png'], ['InDesign', 'InDesign.svg'], ['Adobe XD', 'AdobeXD.svg'], ['Miro', 'Miro.svg'], ['Articulate Rise 360', 'Articulate.svg']]],
  ['Technical Skills', 'tech', [['HTML/CSS', 'HTML5.svg'], ['JavaScript', 'JavaScript.svg'], ['TypeScript', 'TypeScript.svg'], ['React', 'React.svg'], ['Python', 'Python.svg'], ['SQL', 'icon:database'], ['Git', 'Git.svg'], ['Jira', 'Jira.png'], ['Azure DevOps', 'AzureDevOps.svg'], ['Trello', 'Trello.svg'], ['Slack', 'Slack.svg'], ['ChatGPT', 'ChatGPT.svg'], ['Claude', 'Claude.webp'], ['Claude Code', 'Claude.webp'], ['Figma MCP', 'figma.png'], ['Midjourney', 'Midjourney.svg'], ['AI-Assisted Design Workflows', 'icon:ai']]]
];

export const toolkit = [
  ['Design', [['Figma', 'figma.png'], ['Adobe Photoshop', 'photoshop.png'], ['Adobe Illustrator', 'illustrator.png'], ['Adobe XD', 'AdobeXD.svg'], ['Adobe InDesign', 'InDesign.svg']]],
  ['Prototyping, No-code & E-Learning', [['ProtoPie', 'protopie.png'], ['Framer', 'framer.svg'], ['Webflow', 'Webflow.webp'], ['Bubble', 'bubble.png'], ['Articulate Rise 360', 'Articulate.svg']]],
  ['Frontend & Mobile', [['React', 'React.svg'], ['Next.js', 'Nextjs.svg'], ['TypeScript', 'TypeScript.svg'], ['JavaScript (ES6)', 'JavaScript.svg'], ['HTML5', 'HTML5.svg'], ['CSS3', 'CSS3.svg'], ['Tailwind CSS', 'Tailwind.svg'], ['Kotlin (Android)', 'Kotlin.svg'], ['Git', 'icon:git']]],
  ['Data & Analytics', [['Python (pandas, pytest)', 'Python.svg'], ['SQL', 'icon:database'], ['Power BI', 'icon:chart'], ['Tableau', 'Tableau.svg'], ['Excel (advanced)', 'icon:sheet'], ['Power Automate', 'icon:workflow']]],
  ['Planning & Productivity', [['Notion', 'Notion.png'], ['Jira', 'Jira.png'], ['Confluence', 'Confluence.png'], ['Miro', 'Miro.svg'], ['PowerPoint', 'icon:slides']]],
  ['Artificial Intelligence', [['Codex', 'Codex.webp'], ['Claude Code', 'Claude.webp'], ['Figma MCP', 'figma.png'], ['ChatGPT', 'icon:chat'], ['Midjourney', 'Midjourney.svg'], ['Cursor', 'Software.jfif']]]
];

export const methods = ['User interviews', 'Personas', 'Journey mapping', 'Usability testing', 'Wizard-of-Oz testing', 'Heuristic evaluation', 'SUS', 'NASA-TLX', 'Information architecture', 'Accessibility standards', 'Human-centred design', 'Literature reviews'];

export const languages = ['English (fluent)', 'German (A2, currently learning)', 'Urdu (native)'];

export const places = [['berlin', 'Berlin', 2026], ['cologne', 'Cologne', 2026], ['nuremberg', 'Nuremberg', 2026], ['brussels', 'Brussels', 2025], ['paris', 'Paris', 2025], ['metz', 'Metz', 2025], ['luxembourg', 'Luxembourg', 2025], ['heidelberg', 'Heidelberg', 2025], ['strasbourg', 'Strasbourg', 2025]];

export const clips = [['/clips/berlin-summers.mp4', 'Summers in Berlin'], ['/clips/wank-hike.mp4', 'Alpine hike in Bavaria'], ['/clips/cologne.mp4', 'Visit Cologne with me']];
