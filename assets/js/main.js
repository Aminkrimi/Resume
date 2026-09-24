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
  const LEVELS = {
    5: { fa: 'مسلط', en: 'EXPERT' },
    4: { fa: 'پیشرفته', en: 'ADVANCED' },
    3: { fa: 'کاربردی', en: 'PROFICIENT' },
    2: { fa: 'آشنا', en: 'FAMILIAR' },
    1: { fa: 'مبتدی', en: 'LEARNING' }
  };

  const sceneHead = (i, id, title, lead) => `
    <div class="scene-head reveal">
      <div class="scene-label">
        <span class="num">SC-${pad(i)}</span>
        <span>${t(CV.ui.scene)} ${num(pad(i))} — ${t(CV.ui.nav[id])}</span>
        <span class="rule"></span>
        <span class="take">TAKE 01</span>
      </div>
      <h2 class="scene-title">${title}</h2>
      ${lead ? `<p class="scene-lead">${lead}</p>` : ''}
    </div>`;

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
          <span class="hero-kicker reveal"><span class="dot"></span>${t(CV.ui.heroKicker)} · ${t(p.availability)}</span>
          <h1 class="hero-name">
            <span class="line"><span>${t(p.first)}</span></span>
            <span class="line"><span class="outline">${t(p.last)}</span></span>
          </h1>
          <p class="hero-role reveal" style="--d:2"><span class="prompt">&gt;_</span><span id="typed" aria-live="off"></span><span class="caret" aria-hidden="true"></span></p>
          <p class="hero-lead reveal" style="--d:3">${t(CV.ui.heroLead)}</p>
          <div class="hero-cta reveal" style="--d:4">
            <a class="btn btn-primary magnetic" href="#work">${t(CV.ui.ctaWork)} ${icon('arrow', 'i-go')}</a>
            <a class="btn magnetic" href="#contact">${t(CV.ui.ctaContact)}</a>
            <button class="btn magnetic" type="button" data-action="print">${icon('download')} ${t(CV.ui.ctaCv)}</button>
          </div>
          <div class="hero-stats reveal" style="--d:5">
            ${stats().map((s) => `<div class="stat"><b><span data-count="${s.v}">${num(s.v)}</span><sup>${s.suf}</sup></b><span>${t(s.label)}</span></div>`).join('')}
          </div>
        </div>
        <div class="hero-side">
          <div class="viewfinder" id="vf">
            <div class="hero-photo"><img src="assets/img/profile.webp" alt="${esc(t(p.name))}" width="900" height="900" fetchpriority="high"></div>
            <div class="vf-overlay">
              <div class="vf-grid"></div>
              <div class="vf-focus" id="vf-focus"></div>
              <i class="vf-corner tl"></i><i class="vf-corner tr"></i><i class="vf-corner bl"></i><i class="vf-corner br"></i>
              <div class="vf-top"><span class="vf-rec"><span class="dot"></span>REC <span id="timecode">00:00:00:00</span></span><span>4K · 25P</span></div>
              <div class="vf-bottom"><span>f/1.8 &nbsp;1/250 &nbsp;ISO 200</span><span style="display:flex;gap:10px;align-items:center"><span class="vf-meter"><i></i><i></i><i></i><i></i></span><span class="vf-battery"><i></i><i></i><i></i><i></i></span></span></div>
            </div>
          </div>
          <div class="tag tag-1">${icon('code')} React · TypeScript</div>
          <div class="tag tag-2">${icon('camera')} ${lang === 'fa' ? 'با نگاه کارگردان' : "Director's eye"}</div>
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
        ${sceneHead(1, 'about', t(CV.ui.aboutTitle))}
        <div class="bento">
          <article class="card about-text reveal">
            <div class="card-label">${icon('film')} ${lang === 'fa' ? 'خلاصهٔ داستان' : 'Synopsis'}</div>
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
            <div class="card-label">${icon('cpu')} ${t(CV.ui.personalityTitle)}</div>
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
        </div>
        <h3 class="services-title reveal">${t(CV.ui.servicesTitle)}</h3>
        <div class="services">
          ${CV.services.map((s, i) => `
            <article class="card service reveal" style="--d:${i}">
              <span class="num">${num(pad(i + 1))} / ${num(pad(CV.services.length))}</span>
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
        ${sceneHead(2, 'skills', t(CV.ui.skillsTitle), t(CV.ui.skillsLead))}
        <div class="skills-grid">
          ${CV.skills.map((g, gi) => `
            <article class="card skill-group reveal" style="--d:${gi}">
              <h3>${t(g.group)} <small>CH-${pad(gi + 1)}</small></h3>
              ${g.items.map((s, si) => `
                <div class="skill">
                  <span class="skill-name">${s.name}</span>
                  <span style="display:flex;align-items:center;gap:12px">
                    <span class="meter" role="img" aria-label="${s.level}/5" style="--row:${si}">
                      ${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= s.level ? 'on' : ''} ${k === 5 && s.level === 5 ? 'peak' : ''}" style="--k:${k}"></i>`).join('')}
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

  function renderExperience() {
    const e = CV.education[0];
    $('#experience').innerHTML = `
      <div class="wrap">
        ${sceneHead(3, 'experience', t(CV.ui.experienceTitle))}
        <div class="timeline-wrap">
          <div class="timeline" id="timeline">
            ${CV.experience.map((j, i) => `
              <article class="card job reveal" style="--d:${i % 2}">
                <div class="job-head">
                  <div>
                    <h3>${t(j.title)}${i === 0 ? `<span class="live"><span class="dot"></span>LIVE</span>` : ''}</h3>
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

  const mockHTML = () => `
    <div class="mock" aria-hidden="true">
      <div class="mock-side"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="mock-main">
        <div class="mock-kpis">
          <div>Clinics<b>128</b></div><div>Dentists<b>1.4k</b></div><div>Jobs<b>312</b></div><div>Leads<b>86</b></div>
        </div>
        <div class="mock-chart">${[38, 52, 44, 70, 58, 66, 49, 82, 61, 74, 57, 92].map((h, k) => `<i style="--h:${h}%;--k:${k}"></i>`).join('')}</div>
        <div class="mock-rows">${'<div><span></span><span></span><span></span><span></span></div>'.repeat(4)}</div>
      </div>
    </div>`;

  const CODE_LINES = {
    search: 'const q = useDebounce(keyword, 500);',
    chart: 'const { data } = await axios.get(API);',
    brain: 'model.fit(X_train, y_train)',
    tree: 'huffman(freq).encode(text)'
  };

  function projectCard(p, i) {
    const media = p.mock
      ? mockHTML()
      : p.img
        ? `<img src="${p.img}" alt="${esc(t(p.title))}" loading="lazy" decoding="async" width="1100" height="520">`
        : `<div class="glyph">${icon(p.glyph)}<span class="code-line">${esc(CODE_LINES[p.glyph] || '')}</span></div>`;
    const link = p.url
      ? `<a class="link-go" href="${p.url}" target="_blank" rel="noopener">${t(CV.ui.visit)} ${icon('arrow')}</a>`
      : p.code
        ? `<a class="link-go" href="${p.code}" target="_blank" rel="noopener">${icon('github')} ${t(CV.ui.source)}</a>`
        : `<span class="nda">${icon('lock')} ${t(CV.ui.confidential)}</span>`;
    return `
      <article class="card project reveal ${p.featured ? 'featured' : ''}" data-cat="${p.cat.join(' ')}" style="--d:${i % 3}">
        <div class="project-media">${media}<span class="frame-no">FRAME ${pad(i + 1)}</span></div>
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
        ${sceneHead(4, 'work', t(CV.ui.workTitle), t(CV.ui.workLead))}
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
          <div class="scene-label"><span class="num">SC-05</span><span>${t(CV.ui.scene)} ${num('05')} — ${t(CV.ui.nav.contact)}</span><span class="rule"></span><span class="take">FINAL TAKE</span></div>
          <h2 class="contact-title">${t(CV.ui.contactTitle)}</h2>
          <p class="contact-lead">${t(CV.ui.contactLead)}</p>
          <div class="email-row">
            <a class="email-big" href="mailto:${p.email}">${p.email}</a>
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
        <p class="wrap-word" aria-hidden="true">${lang === 'fa' ? 'کات! برداشت آخر' : "That's a wrap."}</p>
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
        <div><h1>${t(p.name)}</h1><div class="role">${t(p.role)} · React · TypeScript</div><div>${t(p.location)}</div></div>
        <div class="pcv-contact"><span>${p.email}</span><span>${p.phone}</span><span>github.com/Aminkrimi</span><span>t.me/AminKrimi</span></div>
      </header>
      <h2>${L('درباره', 'Profile')}</h2>
      <p>${t(CV.about.paragraphs[0])} ${t(CV.about.paragraphs[1]).split(/[.؛]/)[0]}.</p>
      <h2>${L('تجربه', 'Experience')}</h2>
      ${CV.experience.map((j) => `<div class="pcv-job"><div class="row">${t(j.title)} — ${t(j.org)}<span>${t(j.period)}</span></div><ul>${t(j.points).map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
      <h2>${L('مهارت‌ها', 'Skills')}</h2>
      <div class="pcv-skills">${CV.skills.map((g) => `<div><b>${t(g.group)}:</b> ${g.items.map((s) => s.name).join(' · ')}</div>`).join('')}</div>
      <h2>${L('نمونه‌کارها', 'Selected Projects')}</h2>
      <div class="pcv-proj">${CV.projects.map((x) => `<div><b>${t(x.title)}</b> — ${t(x.desc)} <span>${(x.url || x.code || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span></div>`).join('')}</div>
      <h2>${L('تحصیلات', 'Education')}</h2>
      <div class="pcv-job"><div class="row">${t(CV.education[0].period)} ${t(CV.education[0].title)} — ${t(CV.education[0].org)}</div></div>
      <h2>${L('شخصیت', 'Personality')}</h2>
      <p>${CV.about.personality.map((x) => `${x.code} (${t(x.label)})`).join(' · ')}</p>`;
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

  // --- Clocks & timecode
  function tickClocks() {
    const fmt = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: CV.person.timezone });
    const now = fmt.format(new Date());
    $$('[data-clock]').forEach((el) => { el.textContent = now; });
  }
  setInterval(tickClocks, 1000);

  const t0 = performance.now();
  (function timecode() {
    const el = $('#timecode');
    if (el) {
      const ms = performance.now() - t0;
      const f = Math.floor((ms % 1000) / 40), s = Math.floor(ms / 1000);
      el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
    }
    requestAnimationFrame(timecode);
  })();

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

  // --- Viewfinder interactions
  function bindViewfinder() {
    const vf = $('#vf'), focus = $('#vf-focus');
    if (!vf) return;
    vf.addEventListener('pointermove', (e) => {
      const r = vf.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      vf.style.setProperty('--px', `${(0.5 - x) * 14}px`);
      vf.style.setProperty('--py', `${(0.5 - y) * 14}px`);
      vf.style.setProperty('--fx', `${x * 100}%`);
      vf.style.setProperty('--fy', `${y * 100}%`);
      focus.classList.remove('locked');
    });
    vf.addEventListener('pointerleave', () => {
      ['--px', '--py', '--fx', '--fy'].forEach((p) => vf.style.removeProperty(p));
    });
    vf.addEventListener('click', () => { focus.classList.add('locked'); shoot(); });
  }

  function shoot() {
    const f = $('.flash');
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    toast('📸 ' + (lang === 'fa' ? 'چیلیک! قاب ثبت شد' : 'Click! Frame captured'));
  }

  // --- Card spotlight + tilt, magnetic buttons
  function bindPointerFX() {
    if (!finePointer || reduced) return;
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
        if (card.classList.contains('project')) {
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        }
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
    $$('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  // --- Viewfinder cursor: follows the pointer, frames links & buttons
  function initCursor() {
    if (!finePointer || reduced) return;
    const c = $('.cursor');
    doc.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, w = 34, h = 34, tw = 34, th = 34, target = null;
    addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY; c.style.opacity = 1;
      const el = e.target.closest?.('a, button, .chip, input');
      target = el && !el.closest('.palette') ? el : null;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { c.style.opacity = 0; });
    const loop = () => {
      let gx = x, gy = y;
      if (target) {
        const r = target.getBoundingClientRect();
        tw = r.width + 14; th = r.height + 14; gx = r.left + r.width / 2; gy = r.top + r.height / 2;
        c.classList.add('snap');
      } else { tw = th = 34; c.classList.remove('snap'); }
      cx += (gx - cx) * 0.22; cy += (gy - cy) * 0.22; w += (tw - w) * 0.22; h += (th - h) * 0.22;
      c.style.width = w + 'px'; c.style.height = h + 'px';
      c.style.transform = `translate(${cx - w / 2}px, ${cy - h / 2}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  // --- Scroll-driven bits
  let lastY = 0;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    $('.progress span').style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const bar = $('.topbar');
    bar.classList.toggle('hide', y > 500 && y > lastY);
    lastY = y;
    if (y < innerHeight) $('#hero').style.setProperty('--scroll', y);
    const tl = $('#timeline');
    if (tl) {
      const r = tl.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      tl.style.setProperty('--tl', k);
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

  // --- Director mode (Konami code / palette)
  function toggleDirector() {
    doc.classList.toggle('director');
    toast(doc.classList.contains('director') ? t(CV.ui.easter) : (lang === 'fa' ? 'حالت عادی' : 'Back to normal'));
  }

  // --- Command palette
  const palette = { open: false, items: [], index: 0 };
  function commands() {
    const P = CV.ui.palette;
    const both = (o) => `${o.fa} ${o.en}`;
    const go = SECTIONS.map((id) => ({ label: `${t(P.goto)} ${t(CV.ui.nav[id])}`, kw: `${both(P.goto)} ${both(CV.ui.nav[id])}`, icon: 'arrow', run: () => $('#' + id).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }) }));
    const list = [
      ...go,
      { label: t(P.theme), icon: doc.dataset.theme === 'dark' ? 'sun' : 'moon', key: 'T', run: () => toggleTheme() },
      { label: t(P.lang), icon: 'globe', key: 'L', run: toggleLang },
      { label: t(P.email), icon: 'copy', run: copyEmail },
      { label: t(P.print), icon: 'download', run: () => window.print() },
      { label: t(P.github), icon: 'github', run: () => open('https://github.com/Aminkrimi', '_blank', 'noopener') },
      { label: t(P.telegram), icon: 'telegram', run: () => open('https://t.me/AminKrimi', '_blank', 'noopener') },
      { label: t(P.shoot), icon: 'camera', run: shoot },
      { label: lang === 'fa' ? 'حالت کارگردان 🎬' : 'Director mode 🎬', icon: 'film', run: toggleDirector },
      { label: t(P.top), kw: both(P.top), icon: 'up', run: () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }
    ];
    const kws = [P.theme, P.lang, P.email, P.print, P.github, P.telegram, P.shoot, { fa: 'حالت کارگردان', en: 'Director mode' }];
    list.slice(go.length, go.length + kws.length).forEach((c, i) => { c.kw = both(kws[i]); });
    return list;
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
    const el = $('#palette');
    el.hidden = false; palette.open = true; palette.index = 0;
    const input = $('#palette-input');
    input.value = ''; input.placeholder = t(CV.ui.palette.placeholder);
    $('#palette-foot').textContent = lang === 'fa' ? '↑↓ انتخاب · ↵ اجرا · esc بستن' : '↑↓ navigate · ↵ run · esc close';
    drawPalette();
    setTimeout(() => input.focus(), 10);
  }
  function closePalette() { $('#palette').hidden = true; palette.open = false; $('#btn-cmd').focus(); }
  function runPalette(i) { const c = palette.items[i]; if (!c) return; closePalette(); setTimeout(c.run, 60); }

  $('#palette-input').addEventListener('input', () => { palette.index = 0; drawPalette(); });
  $('#palette-list').addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) runPalette(+li.dataset.i); });
  $('#palette-list').addEventListener('pointermove', (e) => {
    const li = e.target.closest('li[data-i]');
    if (li && +li.dataset.i !== palette.index) { palette.index = +li.dataset.i; $$('li[data-i]', $('#palette-list')).forEach((x) => x.setAttribute('aria-selected', String(+x.dataset.i === palette.index))); }
  });
  $('#palette').addEventListener('click', (e) => { if (e.target.dataset.close !== undefined) closePalette(); });

  // --- Global keyboard
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kpos = 0;
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.open ? closePalette() : openPalette(); return; }
    if (palette.open) {
      if (e.key === 'Escape') closePalette();
      else if (e.key === 'ArrowDown') { e.preventDefault(); palette.index = (palette.index + 1) % Math.max(1, palette.items.length); drawPalette(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palette.index = (palette.index - 1 + palette.items.length) % Math.max(1, palette.items.length); drawPalette(); }
      else if (e.key === 'Enter') { e.preventDefault(); runPalette(palette.index); }
      return;
    }
    kpos = e.key === KONAMI[kpos] || e.key.toLowerCase() === KONAMI[kpos] ? kpos + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kpos === KONAMI.length) { kpos = 0; toggleDirector(); }
    if (e.target.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 't') toggleTheme();
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
    }
    const f = e.target.closest('[data-filter]');
    if (f) applyFilter(f.dataset.filter);
  });
  $('#btn-theme').addEventListener('click', (e) => toggleTheme(e.currentTarget));
  $('#btn-lang').addEventListener('click', toggleLang);
  $('#btn-cmd').addEventListener('click', openPalette);
  addEventListener('beforeprint', renderPrint);

  function afterRender() {
    observeReveals();
    observeSections();
    startTyping();
    bindViewfinder();
    bindPointerFX();
    tickClocks();
    onScroll();
  }

  // --- Slate intro (once per session)
  function slate() {
    let seen = false;
    try { seen = sessionStorage.getItem('cv-slate') === '1'; sessionStorage.setItem('cv-slate', '1'); } catch { /* ignore */ }
    if (seen || reduced) return;
    const d = new Date();
    const el = document.createElement('div');
    el.className = 'slate';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<div class="slate-board"><div class="slate-top"></div><div class="slate-body">
      <div class="full"><small>PRODUCTION</small><b>PORTFOLIO — ${d.getFullYear()}</b></div>
      <div><small>SCENE</small><b>01</b></div><div><small>TAKE</small><b>01</b></div>
      <div><small>DIRECTOR</small><b>M. A. KARIMI</b></div><div><small>DATE</small><b>${pad(d.getDate())}.${pad(d.getMonth() + 1)}</b></div>
    </div></div>`;
    document.body.append(el);
    setTimeout(() => el.classList.add('done'), 1250);
    setTimeout(() => el.remove(), 2000);
  }

  slate();
  renderAll();
  initCursor();
  console.log('%c● REC %c Mohammad Amin Karimi — try ⌘K, T, L … or the Konami code 🎬', 'color:#ff3b2f;font-weight:bold', 'color:inherit');
})();
