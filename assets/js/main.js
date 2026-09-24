/* Mohammad Amin Karimi — portfolio runtime (no dependencies) */
(() => {
  'use strict';

  const CV = window.CV;
  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }
  };

  let lang = doc.lang === 'en' ? 'en' : 'fa';
  const t = (o) => (o == null ? '' : typeof o === 'string' ? o : o[lang] ?? o.en ?? '');
  const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  const num = (v) => (lang === 'fa' ? String(v).replace(/\d/g, (d) => FA_DIGITS[d]) : String(v));
  const pad = (v) => String(v).padStart(2, '0');
  const icon = (id, cls = '') => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const SECTIONS = ['about', 'skills', 'experience', 'work', 'contact'];
  const FILES = { about: 'about.md', skills: 'skills.json', experience: 'experience.log', work: 'projects/', contact: 'contact.sh' };
  const LEVELS = {
    5: { fa: 'مسلط', en: 'EXPERT' },
    4: { fa: 'پیشرفته', en: 'ADVANCED' },
    3: { fa: 'کاربردی', en: 'PROFICIENT' },
    2: { fa: 'آشنا', en: 'FAMILIAR' },
    1: { fa: 'مبتدی', en: 'LEARNING' }
  };

  const secHead = (i, id, title, lead) => `
    <div class="sec-head reveal">
      <div class="sec-label">
        <span class="num">${pad(i)}</span>
        <span class="file">${icon('file')}${FILES[id]}</span>
        <span class="rule"></span>
        <span>${t(CV.ui.nav[id])}</span>
      </div>
      <h2 class="sec-title">${title}</h2>
      ${lead ? `<p class="sec-lead">${lead}</p>` : ''}
    </div>`;

  /* ================= Code editor (hero) ================= */
  // Each line: array of [class, text]. Classes map to .sx-* syntax colours.
  const CODE = [
    [['c', '// amin.tsx — hello, world 👋']],
    [['k', 'import'], ['u', ' { '], ['p', 'Developer'], ['u', ' } '], ['k', 'from'], ['s', " '@/types'"], ['u', ';']],
    [],
    [['k', 'export const'], ['p', ' amin'], ['u', ': '], ['f', 'Developer'], ['u', ' = {']],
    [['p', '  name'], ['u', ': '], ['s', "'Mohammad Amin Karimi'"], ['u', ',']],
    [['p', '  role'], ['u', ': '], ['s', "'Front-End Engineer'"], ['u', ',']],
    [['p', '  stack'], ['u', ': ['], ['s', "'React'"], ['u', ', '], ['s', "'Next.js'"], ['u', ', '], ['s', "'TS'"], ['u', '],']],
    [['p', '  experience'], ['u', ': '], ['n', String(new Date().getFullYear() - CV.person.startYear)], ['u', ', '], ['c', '// years']],
    [['p', '  available'], ['u', ': '], ['b', 'true'], ['u', ',']],
    [['u', '};']],
    [],
    [['k', 'export default function'], ['f', ' Hire'], ['u', '() {']],
    [['k', '  return'], ['u', ' <'], ['f', 'Amin'], ['p', ' coffee'], ['u', '={'], ['n', 'Infinity'], ['u', '} />;']],
    [['u', '}']]
  ];
  const CODE_LEN = CODE.reduce((a, l) => a + l.reduce((b, [, s]) => b + [...s].length, 0) + 1, 0);

  function codeHTML(limit = Infinity) {
    let left = limit;
    const out = [];
    for (let i = 0; i < CODE.length; i++) {
      let html = '', stop = false;
      for (const [cls, text] of CODE[i]) {
        const chars = [...text], take = Math.min(chars.length, left);
        if (take > 0) html += `<span class="sx-${cls}">${esc(chars.slice(0, take).join(''))}</span>`;
        left -= take;
        if (take < chars.length) { stop = true; break; }
      }
      if (!stop && left <= 0 && limit !== Infinity) stop = true;
      if (stop) { out.push(`<span class="ln" data-n="${i + 1}">${html}<span class="type-caret"></span></span>`); break; }
      out.push(`<span class="ln" data-n="${i + 1}">${html || ' '}</span>`);
      left -= 1;
    }
    return out.join('');
  }

  let codeToken = 0;
  function typeCode() {
    const el = $('#code');
    if (!el) return;
    const my = ++codeToken;
    if (reduced) { el.innerHTML = codeHTML(); return; }
    let n = 0;
    const step = () => {
      if (my !== codeToken) return;
      n += 2;
      el.innerHTML = codeHTML(n);
      if (n < CODE_LEN) setTimeout(step, 16);
      else el.innerHTML = codeHTML();
    };
    setTimeout(step, 600);
  }

  /* ================= Renderers ================= */

  function renderNav() {
    const links = SECTIONS.map((id) => `<li><a href="#${id}" data-nav="${id}">${t(CV.ui.nav[id])}</a></li>`).join('');
    $('#nav-list').innerHTML = links;
    $('#dock-list').innerHTML = links;
    $('#lang-label').textContent = lang === 'fa' ? 'EN' : 'FA';
    $('#btn-lang').setAttribute('aria-label', lang === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی');
    $('#btn-theme').setAttribute('aria-label', t(doc.dataset.theme === 'dark' ? CV.ui.themeLight : CV.ui.themeDark));
    $('.skip-link').textContent = t(CV.ui.skip);
  }

  function stats() {
    const years = new Date().getFullYear() - CV.person.startYear;
    const tools = CV.skills.reduce((a, g) => a + g.items.length, 0) + CV.also.length;
    return [
      { v: years, suf: '+', label: CV.ui.yearsLabel },
      { v: CV.projects.length, suf: '+', label: CV.ui.projectsLabel },
      { v: tools, suf: '+', label: CV.ui.stackLabel }
    ];
  }

  function renderHero() {
    const p = CV.person;
    $('#hero').innerHTML = `
      <div class="wrap hero-grid">
        <div class="hero-main">
          <span class="hero-kicker reveal"><span class="dot pulse"></span>${t(p.availability)}</span>
          <p class="hero-hello reveal" style="--d:1">// ${lang === 'fa' ? 'سلام، من' : "hi there, I'm"}</p>
          <h1 class="hero-name">
            <span class="line"><span>${t(p.first)}</span></span>
            <span class="line"><span class="grad-text">${t(p.last)}</span></span>
          </h1>
          <p class="hero-role reveal" style="--d:2"><span class="prompt">~$</span><span id="typed" aria-live="off"></span><span class="caret" aria-hidden="true"></span></p>
          <p class="hero-lead reveal" style="--d:3">${t(CV.ui.heroLead)}</p>
          <div class="hero-cta reveal" style="--d:4">
            <a class="btn btn-primary" href="#work">${t(CV.ui.ctaWork)} ${icon('arrow', 'i-go')}</a>
            <button class="btn" type="button" data-action="terminal">${icon('terminal')} ${t(CV.ui.ctaTerminal)} <kbd>\`</kbd></button>
            <button class="btn" type="button" data-action="print">${icon('download')} ${t(CV.ui.ctaCv)}</button>
          </div>
          <div class="hero-stats reveal" style="--d:5">
            ${stats().map((s) => `<div class="stat"><b><span data-count="${s.v}">${num(s.v)}</span><sup>${s.suf}</sup></b><span>${t(s.label)}</span></div>`).join('')}
          </div>
        </div>
        <div class="hero-side">
          <div class="photo-card">
            <img src="assets/img/profile.webp" alt="${esc(t(p.name))}" width="900" height="900" fetchpriority="high">
            <span class="badge"><span class="dot pulse"></span><b>&lt;Amin /&gt;</b> online</span>
          </div>
          <span class="float-chip c1">${icon('react')} React 19</span>
          <span class="float-chip c2">${icon('code')} Next.js · TS</span>
          <div class="editor" aria-label="amin.tsx">
            <div class="editor-bar"><span class="lights"><i></i><i></i><i></i></span><span class="tab">${icon('react')}amin.tsx</span></div>
            <pre><code id="code"></code></pre>
            <div class="editor-status"><span>${icon('branch')} main</span><span>✓ 0 problems · TypeScript</span></div>
          </div>
        </div>
      </div>
      <a class="scroll-cue" href="#about" aria-label="${t(CV.ui.scroll)}"><span></span>${t(CV.ui.scroll)}</a>`;
    $('#marquee').innerHTML = [...CV.marquee, ...CV.marquee].map((m) => `<span>${m}</span>`).join('');
  }

  function renderAbout() {
    const p = CV.person;
    const widths = [92, 96, 88];
    $('#about').innerHTML = `
      <div class="wrap">
        ${secHead(1, 'about', t(CV.ui.aboutTitle))}
        <div class="bento">
          <article class="card about-text reveal">
            <div class="card-label">${icon('file')} README.md</div>
            ${CV.about.paragraphs.map((x) => `<p>${t(x)}</p>`).join('')}
          </article>
          <article class="card about-now reveal" style="--d:1">
            <div class="card-label">${icon('pin')} ${lang === 'fa' ? 'همین حالا' : 'Right now'}</div>
            <div class="now-row"><span>${lang === 'fa' ? 'وضعیت' : 'Status'}</span><b class="status"><span class="dot"></span>${t(p.availability)}</b></div>
            <div class="now-row"><span>${lang === 'fa' ? 'موقعیت' : 'Based in'}</span><b>${t(p.location)}</b></div>
            <div class="now-row"><span>${t(CV.ui.localTime)}</span><b class="mono" data-clock>--:--</b></div>
            <div class="now-row"><span>${lang === 'fa' ? 'زبان‌ها' : 'Languages'}</span><b>${lang === 'fa' ? 'فارسی (مادری) · انگلیسی' : 'Persian (native) · English'}</b></div>
          </article>
          <article class="card about-interests reveal" style="--d:2">
            <div class="card-label">${icon('bolt')} ${t(CV.ui.interestsTitle)}</div>
            <div class="chips">${CV.about.interests.map((x) => `<span class="chip">${icon(x.icon)}${t(x)}</span>`).join('')}</div>
          </article>
          <article class="card about-os reveal" style="--d:1">
            <div class="card-label">${icon('cpu')} personality.config</div>
            <div class="os-grid">
              ${CV.about.personality.map((x, i) => `
                <div class="os-item">
                  <span class="code">${x.code.replace(/^(\w)/, '<em>$1</em>')}</span>
                  <h4>${t(x.label)}</h4>
                  <p>${t(x.desc)}</p>
                  <span class="bar" style="--w:${widths[i]}%"></span>
                </div>`).join('')}
            </div>
          </article>
          <article class="card about-gh reveal" id="gh-card">
            <div class="gh-head">
              <div class="card-label">${icon('github')} ${t(CV.ui.githubTitle)}</div>
              <a class="link-go" href="https://github.com/Aminkrimi" target="_blank" rel="noopener">github.com/Aminkrimi ${icon('arrow', 'i-go')}</a>
            </div>
            <div class="gh-graph"><img src="https://ghchart.rshah.org/2563eb/Aminkrimi" alt="GitHub contributions of Aminkrimi" loading="lazy" onerror="document.getElementById('gh-card').remove()"></div>
          </article>
        </div>
        <h3 class="services-title reveal">${t(CV.ui.servicesTitle)}</h3>
        <div class="services">
          ${CV.services.map((s, i) => `
            <article class="card service reveal" style="--d:${i}">
              <span class="num">${pad(i + 1)} / ${pad(CV.services.length)}</span>
              <span class="ico">${icon(s.icon)}</span>
              <h3>${t(s.title)}</h3>
              <p>${t(s.desc)}</p>
            </article>`).join('')}
        </div>
      </div>`;
  }

  function renderSkills() {
    $('#skills').innerHTML = `
      <div class="wrap">
        ${secHead(2, 'skills', t(CV.ui.skillsTitle), t(CV.ui.skillsLead))}
        <div class="skills-grid">
          ${CV.skills.map((g, gi) => `
            <article class="card skill-group reveal" style="--d:${gi}">
              <h3>${t(g.group)} <small>${['core', 'ui', 'tooling', 'backend'][gi] || 'misc'}.ts</small></h3>
              ${g.items.map((s, si) => `
                <div class="skill">
                  <span class="skill-name">${s.name}</span>
                  <span style="display:flex;align-items:center;gap:12px">
                    <span class="meter" role="img" aria-label="${s.level}/5" style="--row:${si}">
                      ${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= s.level ? 'on' : ''}" style="--k:${k}"></i>`).join('')}
                    </span>
                    <span class="skill-level">${t(LEVELS[s.level])}</span>
                  </span>
                </div>`).join('')}
            </article>`).join('')}
        </div>
        <div class="card also reveal">
          <h4>${t(CV.ui.alsoTitle)}</h4>
          ${CV.also.map((a) => `<span class="chip">${a}</span>`).join('')}
        </div>
      </div>`;
  }

  const HASHES = ['a3f9c21', '7be04d9', '4c2e81f', '19d7a3b', 'e5b6f02'];
  function renderExperience() {
    const e = CV.education[0];
    $('#experience').innerHTML = `
      <div class="wrap">
        ${secHead(3, 'experience', t(CV.ui.experienceTitle))}
        <div class="timeline-wrap">
          <div class="timeline" id="timeline">
            ${CV.experience.map((j, i) => `
              <article class="card job reveal" style="--d:${i % 2}">
                <span class="hash">commit ${HASHES[i % HASHES.length]}${i === 0 ? ' (HEAD → main)' : ''}</span>
                <div class="job-head">
                  <div>
                    <h3>${t(j.title)}${i === 0 ? `<span class="live"><span class="dot"></span>HEAD</span>` : ''}</h3>
                    <div class="org">${t(j.org)}</div>
                  </div>
                  <span class="period">${t(j.period)}</span>
                </div>
                <ul>${t(j.points).map((pt) => `<li>${pt}</li>`).join('')}</ul>
                <div class="tags">${j.tags.map((x) => `<span class="tag-s">${x}</span>`).join('')}</div>
              </article>`).join('')}
          </div>
          <aside class="card edu reveal" style="--d:1">
            <div class="card-label">${icon('grad')} ${t(CV.ui.educationTitle)}</div>
            <span class="period">${t(e.period)}</span>
            <h3>${t(e.title)}</h3>
            <div class="org">${t(e.org)}</div>
            <p>${t(e.note)}</p>
          </aside>
        </div>
      </div>`;
  }

  const mockHTML = (url) => `
    <div class="mock" aria-hidden="true">
      <div class="mock-url"><span class="lights"><i></i><i></i><i></i></span><span>${esc(url)}</span></div>
      <div class="mock-body">
        <div class="mock-main">
          <div class="mock-kpis">${'<div><i></i><b></b></div>'.repeat(4)}</div>
          <div class="mock-chart">${[38, 52, 44, 70, 58, 66, 49, 82, 61, 74, 57, 92].map((h, k) => `<i style="--h:${h}%;--k:${k}"></i>`).join('')}</div>
          <div class="mock-rows">${'<div><span></span><span></span><span></span><span></span></div>'.repeat(4)}</div>
        </div>
        <div class="mock-side"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
    </div>`;

  const CODE_LINES = {
    search: 'const q = useDebounce(keyword, 500);',
    chart: 'const { data } = await axios.get(API);',
    brain: 'model.fit(X_train, y_train)',
    tree: 'huffman(freq).encode(text)'
  };

  function projectCard(p, i) {
    const host = (p.url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    const img = p.img ? `<img src="${p.img}" alt="${esc(t(p.title))}" loading="lazy" decoding="async" width="1100" height="520"${p.mock ? ' onerror="this.remove()"' : ''}>` : '';
    const media = p.mock
      ? mockHTML(host) + img
      : p.img
        ? img
        : `<div class="glyph">${icon(p.glyph)}<span class="code-line">${esc(CODE_LINES[p.glyph] || '')}</span></div>`;
    const link = p.url
      ? `<a class="link-go" href="${p.url}" target="_blank" rel="noopener">${t(CV.ui.visit)} ${icon('arrow', 'i-go')}</a>`
      : `<a class="link-go" href="${p.code}" target="_blank" rel="noopener">${icon('github')} ${t(CV.ui.source)}</a>`;
    return `
      <article class="card project reveal ${p.featured ? 'featured' : ''}" data-cat="${p.cat.join(' ')}" style="--d:${i % 3}">
        <div class="project-media">${media}${p.mock ? '' : `<span class="idx">#${pad(i + 1)}${host ? ` · ${host}` : ''}</span>`}</div>
        <div class="project-body">
          <h3>${t(p.title)}</h3>
          <p>${t(p.desc)}</p>
          <div class="project-foot">
            <div class="tags">${p.stack.map((s) => `<span class="tag-s">${s}</span>`).join('')}</div>
            ${link}
          </div>
        </div>
      </article>`;
  }

  let activeFilter = 'all';
  function renderWork() {
    const count = (id) => (id === 'all' ? CV.projects.length : CV.projects.filter((p) => p.cat.includes(id)).length);
    $('#work').innerHTML = `
      <div class="wrap">
        ${secHead(4, 'work', t(CV.ui.workTitle), t(CV.ui.workLead))}
        <div class="filters reveal" role="toolbar">
          ${CV.filters.map((f) => `<button class="filter" type="button" data-filter="${f.id}" aria-pressed="${f.id === activeFilter}">${f.id === 'all' ? t(CV.ui.filterAll) : t(f)}<sup>${num(count(f.id))}</sup></button>`).join('')}
        </div>
        <div class="projects" id="projects">${CV.projects.map(projectCard).join('')}</div>
      </div>`;
    applyFilter(activeFilter, false);
  }

  function renderContact() {
    const p = CV.person;
    $('#contact').innerHTML = `
      <div class="wrap">
        <div class="contact-box reveal">
          <div class="sec-label"><span class="num">05</span><span class="file">${icon('file')}${FILES.contact}</span><span class="rule"></span><span>${t(CV.ui.nav.contact)}</span></div>
          <h2 class="contact-title">${t(CV.ui.contactTitle)}</h2>
          <p class="contact-lead">${t(CV.ui.contactLead)}</p>
          <div class="cmd-line">
            <span class="cmd"><span class="p">$</span> mail <a href="mailto:${p.email}">${p.email}</a></span>
            <button class="ctrl" type="button" data-action="copy-email">${icon('copy')} <span>${t(CV.ui.copyEmail)}</span></button>
          </div>
          <div class="socials">
            ${p.social.map((s) => `
              <a class="social" href="${s.url}" ${s.id === 'mail' ? '' : 'target="_blank" rel="noopener"'}>
                <span class="l">${icon(s.id)}<span><b>${s.label}</b><small>${s.handle}</small></span></span>
                ${icon('arrow', 'i-go')}
              </a>`).join('')}
          </div>
          <div class="contact-meta">
            <span>${icon('pin')} ${t(p.location)}</span>
            <span>${icon('phone')} <a href="tel:${p.phone}" class="ltr">${t(p.phoneLabel)}</a></span>
            <span>${t(CV.ui.localTime)}: <b data-clock>--:--</b></span>
          </div>
        </div>
      </div>`;
  }

  function renderFooter() {
    $('#footer').innerHTML = `
      <div class="wrap">
        <p class="big" aria-hidden="true">&lt;Thanks /&gt;</p>
        <div class="footer-in">
          <span>© ${num(new Date().getFullYear())} ${t(CV.person.name)} — ${t(CV.ui.footer)}</span>
          <span>${t(CV.ui.builtWith)}</span>
          <span class="mono" style="font-size:.75rem">${t(CV.ui.shortcuts)}</span>
          <a class="to-top" href="#hero">${icon('up')} ${t(CV.ui.palette.top)}</a>
        </div>
      </div>`;
  }

  function renderPrint() {
    const p = CV.person;
    const L = (fa, en) => (lang === 'fa' ? fa : en);
    $('#print-cv').innerHTML = `
      <header class="pcv-head">
        <div><h1>${t(p.name)}</h1><div class="role">${t(p.role)} · React · Next.js · TypeScript</div><div>${t(p.location)}</div></div>
        <div class="pcv-contact"><span>${p.email}</span><span>${p.phone}</span><span>github.com/Aminkrimi</span><span>t.me/AminKrimi</span></div>
      </header>
      <h2>${L('درباره', 'Profile')}</h2>
      <p>${t(CV.about.paragraphs[0])} ${t(CV.about.paragraphs[1])}</p>
      <h2>${L('تجربه', 'Experience')}</h2>
      ${CV.experience.map((j) => `<div class="pcv-job"><div class="row">${t(j.title)} — ${t(j.org)}<span>${t(j.period)}</span></div><ul>${t(j.points).map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
      <h2>${L('مهارت‌ها', 'Skills')}</h2>
      <div class="pcv-skills">${CV.skills.map((g) => `<div><b>${t(g.group)}:</b> ${g.items.map((s) => s.name).join(' · ')}</div>`).join('')}</div>
      <h2>${L('نمونه‌کارها', 'Selected Projects')}</h2>
      <div class="pcv-proj">${CV.projects.map((x) => `<div><b>${t(x.title)}</b> — ${t(x.desc)} <span>${(x.url || x.code || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span></div>`).join('')}</div>
      <h2>${L('تحصیلات', 'Education')}</h2>
      <div class="pcv-job"><div class="row">${t(CV.education[0].period)} ${t(CV.education[0].title)} — ${t(CV.education[0].org)}</div></div>`;
  }

  function renderAll() {
    renderNav();
    renderHero();
    renderAbout();
    renderSkills();
    renderExperience();
    renderWork();
    renderContact();
    renderFooter();
    renderPrint();
    afterRender();
  }

  /* ================= Behaviours ================= */

  // --- Typing role rotator
  let typeToken = 0;
  function startTyping() {
    const el = $('#typed');
    if (!el) return;
    const roles = t(CV.person.roles);
    const my = ++typeToken;
    if (reduced) { el.textContent = roles[0]; return; }
    let r = 0, c = 0, del = false;
    const tick = () => {
      if (my !== typeToken) return;
      const word = roles[r];
      c += del ? -1 : 1;
      el.textContent = word.slice(0, c);
      let wait = del ? 35 : 70;
      if (!del && c === word.length) { del = true; wait = 1800; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 700);
  }

  // --- Counters
  function countUp(el) {
    const target = +el.dataset.count;
    if (reduced) { el.textContent = num(target); return; }
    const start = performance.now(), dur = 1400;
    const step = (now) => {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = num(Math.round(target * (1 - Math.pow(1 - k, 4))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // --- Reveal on scroll
  let revealIO;
  function observeReveals() {
    revealIO?.disconnect();
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(countUp);
        revealIO.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal, .job, .project').forEach((el) => revealIO.observe(el));
  }

  // --- Active nav
  let navIO;
  function observeSections() {
    navIO?.disconnect();
    navIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach((id) => navIO.observe($('#' + id)));
  }

  // --- Clocks
  function tickClocks() {
    const fmt = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: CV.person.timezone });
    const now = fmt.format(new Date());
    $$('[data-clock]').forEach((el) => { el.textContent = now; });
  }
  setInterval(tickClocks, 1000);

  // --- Project filter
  function applyFilter(id, animate = true) {
    activeFilter = id;
    const run = () => {
      $$('.filter').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
      $$('.project').forEach((p) => {
        const show = id === 'all' || p.dataset.cat.split(' ').includes(id);
        p.hidden = !show;
        if (show) p.classList.add('in');
      });
    };
    if (animate && document.startViewTransition && !reduced) document.startViewTransition(run);
    else run();
  }

  // --- Card spotlight
  function bindPointerFX() {
    if (!finePointer || reduced) return;
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // --- Scroll-driven bits
  let lastY = 0;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    $('.progress span').style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    $('.topbar').classList.toggle('hide', y > 500 && y > lastY);
    lastY = y;
    const tl = $('#timeline');
    if (tl) {
      const r = tl.getBoundingClientRect();
      tl.style.setProperty('--tl', Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height)));
    }
  }
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });

  // --- Toast
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.innerHTML = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  async function copyEmail() {
    const email = CV.person.email;
    try { await navigator.clipboard.writeText(email); }
    catch {
      const ta = Object.assign(document.createElement('textarea'), { value: email });
      document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast(`${icon('check')} ${t(CV.ui.copied)}`);
  }

  // --- Theme (circular reveal from the toggle)
  function setTheme(next, origin) {
    const apply = () => {
      doc.dataset.theme = next;
      store.set('cv-theme', next);
      $('#btn-theme').setAttribute('aria-label', t(next === 'dark' ? CV.ui.themeLight : CV.ui.themeDark));
    };
    if (!document.startViewTransition || reduced) return apply();
    const r = (origin || $('#btn-theme')).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      doc.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' });
    });
  }
  const toggleTheme = (o) => setTheme(doc.dataset.theme === 'dark' ? 'light' : 'dark', o);

  // --- Language
  function setLang(next) {
    if (next === lang) return;
    const anchor = SECTIONS.find((id) => { const r = $('#' + id).getBoundingClientRect(); return r.top < innerHeight / 2 && r.bottom > innerHeight / 2; });
    lang = next;
    doc.lang = lang;
    doc.dir = lang === 'fa' ? 'rtl' : 'ltr';
    store.set('cv-lang', lang);
    const u = new URL(location.href);
    if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
    history.replaceState(null, '', u);
    doc.classList.add('swap');
    renderAll();
    $$('.reveal').forEach((el) => el.classList.add('in'));
    if (anchor) $('#' + anchor).scrollIntoView({ behavior: 'instant' });
    setTimeout(() => doc.classList.remove('swap'), 600);
  }
  const toggleLang = () => setLang(lang === 'fa' ? 'en' : 'fa');

  /* ================= Terminal ================= */
  const term = { open: false, history: [], hpos: 0 };
  const L = (fa, en) => (lang === 'fa' ? fa : en);
  function tprint(html, cls = '') {
    const d = document.createElement('div');
    d.className = `out ${cls}`;
    d.innerHTML = html;
    $('#term-out').append(d);
    $('#term-body').scrollTop = $('#term-body').scrollHeight;
  }
  const faOut = (html) => tprint(html, lang === 'fa' ? 'fa' : '');

  const TERM_CMDS = {
    help() {
      tprint(`<span class="t-y">${L('فرمان‌های موجود', 'Available commands')}:</span>
  <span class="t-a">whoami</span>      ${L('من کی هستم', 'who am I')}
  <span class="t-a">about</span>       ${L('درباره من', 'short bio')}
  <span class="t-a">skills</span>      ${L('مهارت‌ها', 'tech stack')}
  <span class="t-a">experience</span>  ${L('سوابق کاری', 'work history (git log)')}
  <span class="t-a">projects</span>    ${L('نمونه‌کارها', 'list projects')}
  <span class="t-a">open</span> &lt;id&gt;   ${L('باز کردن پروژه', 'open a project')}
  <span class="t-a">contact</span>     ${L('راه‌های ارتباط', 'how to reach me')}
  <span class="t-a">theme</span>       ${L('تغییر تم', 'toggle theme')}
  <span class="t-a">lang</span>        ${L('تغییر زبان', 'switch language')}
  <span class="t-a">cv</span>          ${L('دانلود رزومه', 'print / save CV')}
  <span class="t-a">clear</span>       ${L('پاک کردن صفحه', 'clear screen')}
  <span class="t-a">exit</span>        ${L('بستن ترمینال', 'close terminal')}`);
    },
    whoami() { tprint(`<span class="t-w">${esc(CV.person.name.en)}</span> — ${esc(CV.person.role.en)} <span class="t-m">@ ${esc(CV.person.location.en)}</span>`); },
    about() { CV.about.paragraphs.forEach((x) => faOut(esc(t(x)))); },
    skills() {
      CV.skills.forEach((g) => {
        tprint(`<span class="t-y">▸ ${esc(g.group.en)}</span>`);
        g.items.forEach((s) => tprint(`  ${esc(s.name.padEnd(24))} <span class="t-d">${'█'.repeat(s.level)}</span><span class="t-m">${'░'.repeat(5 - s.level)}</span>`));
      });
    },
    experience() {
      CV.experience.forEach((j, i) => {
        tprint(`<span class="t-y">commit ${HASHES[i % HASHES.length]}</span>${i === 0 ? ' <span class="t-a">(HEAD → main)</span>' : ''}`);
        faOut(`<span class="t-w">${esc(t(j.title))}</span> — ${esc(t(j.org))} <span class="t-m">[${esc(t(j.period))}]</span>`);
      });
    },
    projects() {
      CV.projects.forEach((p) => tprint(`  <span class="t-a">${p.id.padEnd(13)}</span> ${esc(p.title.en)} <span class="t-m">${esc(p.stack.join(', '))}</span>`));
      tprint(`<span class="t-m">${L('برای باز کردن: open <id>', 'Try: open <id>')}</span>`.replace(/<id>/, '&lt;id&gt;'));
    },
    open(arg) {
      const p = CV.projects.find((x) => x.id === arg);
      if (!p) return tprint(`<span class="t-e">${L('پروژه پیدا نشد', 'project not found')}:</span> ${esc(arg || '')}`);
      const url = p.url || p.code;
      tprint(`${L('در حال باز کردن', 'opening')} <a href="${url}" target="_blank" rel="noopener">${esc(url)}</a> …`);
      window.open(url, '_blank', 'noopener');
    },
    contact() {
      CV.person.social.forEach((s) => tprint(`  ${s.label.padEnd(10)} <a href="${s.url}" target="_blank" rel="noopener">${esc(s.handle)}</a>`));
    },
    theme() { toggleTheme(); tprint(`<span class="t-p">✓</span> theme → ${doc.dataset.theme === 'dark' ? 'light' : 'dark'}`); },
    lang() { closeTerm(); toggleLang(); },
    cv() { closeTerm(); setTimeout(() => window.print(), 100); },
    clear() { $('#term-out').innerHTML = ''; },
    exit() { closeTerm(); },
    date() { tprint(new Date().toString()); },
    ls() { tprint(Object.values(FILES).map((f) => `<span class="${f.endsWith('/') ? 't-d' : 't-w'}">${f}</span>`).join('  ')); },
    sudo() { tprint(`<span class="t-e">${L('دسترسی رد شد 😄 ولی می‌تونی منو استخدام کنی:', "Permission denied 😄 — but you can hire me instead:")}</span> <a href="mailto:${CV.person.email}">${CV.person.email}</a>`); },
    echo(...a) { tprint(esc(a.join(' '))); }
  };
  const ALIASES = { exp: 'experience', work: 'projects', ls: 'ls', cat: 'about', '?': 'help', 'hire-me': 'sudo' };

  function runTerm(line) {
    const raw = line.trim();
    tprint(`<span class="t-p">amin@karimi</span><span class="t-m">:</span><span class="t-d">~</span><span class="t-m">$</span> <span class="t-w">${esc(raw)}</span>`);
    if (!raw) return;
    term.history.push(raw); term.hpos = term.history.length;
    const [cmd0, ...args] = raw.split(/\s+/);
    const cmd = ALIASES[cmd0.toLowerCase()] || cmd0.toLowerCase();
    const fn = TERM_CMDS[cmd];
    if (fn) fn(...args);
    else tprint(`<span class="t-e">command not found:</span> ${esc(cmd0)} — ${L('برای راهنما help را تایپ کن', 'type <span class="t-a">help</span>')}`);
  }

  function openTerm() {
    if (term.open) return;
    closePalette(false);
    $('#term').hidden = false; term.open = true;
    if (!$('#term-out').childElementCount) {
      tprint(`<span class="t-d">amin-karimi</span> <span class="t-m">v${new Date().getFullYear() - CV.person.startYear}.0.0 · ${new Date().toDateString()}</span>`);
      tprint(L('خوش اومدی! برای دیدن فرمان‌ها <span class="t-a">help</span> رو تایپ کن.', 'Welcome! Type <span class="t-a">help</span> to see what you can do.'), lang === 'fa' ? 'fa' : '');
    }
    setTimeout(() => $('#term-input').focus(), 20);
  }
  function closeTerm() { if (!term.open) return; $('#term').hidden = true; term.open = false; }

  $('#term-input').addEventListener('keydown', (e) => {
    const input = e.currentTarget;
    if (e.key === 'Enter') { runTerm(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (term.hpos > 0) input.value = term.history[--term.hpos]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); term.hpos = Math.min(term.history.length, term.hpos + 1); input.value = term.history[term.hpos] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value.toLowerCase();
      const [c, a] = v.split(/\s+/);
      if (c === 'open' && a !== undefined) { const m = CV.projects.find((p) => p.id.startsWith(a)); if (m) input.value = `open ${m.id}`; }
      else { const m = Object.keys(TERM_CMDS).find((k) => k.startsWith(v)); if (m) input.value = m; }
    }
    else if (e.key === 'Escape') closeTerm();
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); TERM_CMDS.clear(); }
  });
  $('#term').addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeTerm();
    else if (!e.target.closest('a') && !getSelection().toString()) $('#term-input').focus();
  });

  /* ================= Command palette ================= */
  const palette = { open: false, items: [], index: 0 };
  function commands() {
    const P = CV.ui.palette;
    const both = (o) => `${o.fa} ${o.en}`;
    const go = SECTIONS.map((id) => ({ label: `${t(P.goto)} ${t(CV.ui.nav[id])}`, kw: `${both(P.goto)} ${both(CV.ui.nav[id])}`, icon: 'arrow', run: () => $('#' + id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }) }));
    return [
      ...go,
      { label: t(P.terminal), kw: both(P.terminal) + ' terminal shell', icon: 'terminal', key: '`', run: openTerm },
      { label: t(P.theme), kw: both(P.theme), icon: doc.dataset.theme === 'dark' ? 'sun' : 'moon', key: 'T', run: () => toggleTheme() },
      { label: t(P.lang), kw: both(P.lang), icon: 'globe', key: 'L', run: toggleLang },
      { label: t(P.email), kw: both(P.email), icon: 'copy', run: copyEmail },
      { label: t(P.print), kw: both(P.print) + ' cv pdf', icon: 'download', run: () => window.print() },
      { label: t(P.github), kw: both(P.github), icon: 'github', run: () => open('https://github.com/Aminkrimi', '_blank', 'noopener') },
      { label: t(P.telegram), kw: both(P.telegram), icon: 'telegram', run: () => open('https://t.me/AminKrimi', '_blank', 'noopener') },
      { label: t(P.top), kw: both(P.top), icon: 'up', run: () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }
    ];
  }
  function drawPalette() {
    const q = $('#palette-input').value.trim().toLowerCase();
    palette.items = commands().filter((c) => !q || `${c.label} ${c.kw || ''}`.toLowerCase().includes(q));
    palette.index = Math.min(palette.index, Math.max(0, palette.items.length - 1));
    $('#palette-list').innerHTML = palette.items.length
      ? palette.items.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === palette.index}">${icon(c.icon)}<span>${c.label}</span>${c.key ? `<small>${c.key}</small>` : ''}</li>`).join('')
      : `<li class="empty">${t(CV.ui.palette.empty)}</li>`;
    $('[aria-selected="true"]', $('#palette-list'))?.scrollIntoView({ block: 'nearest' });
  }
  function openPalette() {
    closeTerm();
    $('#palette').hidden = false; palette.open = true; palette.index = 0;
    const input = $('#palette-input');
    input.value = ''; input.placeholder = t(CV.ui.palette.placeholder);
    $('#palette-foot').textContent = lang === 'fa' ? '↑↓ انتخاب · ↵ اجرا · esc بستن' : '↑↓ navigate · ↵ run · esc close';
    drawPalette();
    setTimeout(() => input.focus(), 10);
  }
  function closePalette(refocus = true) {
    if (!palette.open) return;
    $('#palette').hidden = true; palette.open = false;
    if (refocus) $('#btn-cmd').focus();
  }
  function runPalette(i) { const c = palette.items[i]; if (!c) return; closePalette(false); setTimeout(c.run, 60); }

  $('#palette-input').addEventListener('input', () => { palette.index = 0; drawPalette(); });
  $('#palette-list').addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) runPalette(+li.dataset.i); });
  $('#palette-list').addEventListener('pointermove', (e) => {
    const li = e.target.closest('li[data-i]');
    if (li && +li.dataset.i !== palette.index) { palette.index = +li.dataset.i; $$('li[data-i]', $('#palette-list')).forEach((x) => x.setAttribute('aria-selected', String(+x.dataset.i === palette.index))); }
  });
  $('#palette').addEventListener('click', (e) => { if (e.target.dataset.close !== undefined) closePalette(); });

  // --- Global keyboard
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.open ? closePalette() : openPalette(); return; }
    if (term.open) { if (e.key === 'Escape') closeTerm(); return; }
    if (palette.open) {
      if (e.key === 'Escape') closePalette();
      else if (e.key === 'ArrowDown') { e.preventDefault(); palette.index = (palette.index + 1) % Math.max(1, palette.items.length); drawPalette(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palette.index = (palette.index - 1 + palette.items.length) % Math.max(1, palette.items.length); drawPalette(); }
      else if (e.key === 'Enter') { e.preventDefault(); runPalette(palette.index); }
      return;
    }
    if (e.target.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === '`' || k === '~') { e.preventDefault(); openTerm(); }
    else if (k === 't') toggleTheme();
    else if (k === 'l') toggleLang();
    else if (k === '/') { e.preventDefault(); openPalette(); }
  });

  // --- Delegated clicks
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]');
    if (a) {
      const act = a.dataset.action;
      if (act === 'print') window.print();
      if (act === 'copy-email') copyEmail();
      if (act === 'terminal') openTerm();
    }
    const f = e.target.closest('[data-filter]');
    if (f) applyFilter(f.dataset.filter);
  });
  $('#btn-theme').addEventListener('click', (e) => toggleTheme(e.currentTarget));
  $('#btn-lang').addEventListener('click', toggleLang);
  $('#btn-cmd').addEventListener('click', openPalette);
  $('#btn-term').addEventListener('click', openTerm);
  addEventListener('beforeprint', renderPrint);

  function afterRender() {
    observeReveals();
    observeSections();
    startTyping();
    typeCode();
    bindPointerFX();
    tickClocks();
    onScroll();
  }

  // --- Boot intro (once per session)
  function boot() {
    let seen = false;
    try { seen = sessionStorage.getItem('cv-boot') === '1'; sessionStorage.setItem('cv-boot', '1'); } catch { /* ignore */ }
    if (seen || reduced) return;
    const el = document.createElement('div');
    el.className = 'boot';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<pre></pre>';
    document.body.append(el);
    const lines = [
      '<span class="dim">~/portfolio</span> <span class="acc">$</span> npm run dev',
      '<span class="dim">&gt; amin-karimi@latest dev</span>',
      '<span class="acc">▲</span> Next.js · ready in <span class="acc">312ms</span>',
      '<span class="ok">✓</span> Compiled successfully'
    ];
    const pre = $('pre', el);
    lines.forEach((l, i) => setTimeout(() => { pre.innerHTML += (i ? '\n' : '') + l; }, 120 + i * 220));
    setTimeout(() => el.classList.add('done'), 1350);
    setTimeout(() => el.remove(), 1900);
  }

  boot();
  renderAll();
  console.log('%c</> %cMohammad Amin Karimi — try ⌘K, T, L, or ` for the terminal', 'color:#4d8dff;font-weight:bold', 'color:inherit');
})();
