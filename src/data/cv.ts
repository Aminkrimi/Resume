/*
 * همهٔ محتوای رزومه اینجاست — برای ویرایش فقط همین فایل را تغییر بده.
 * All résumé content lives here. Every text field is { fa, en }.
 */
import type { CV } from './types';

export const cv = {
  person: {
    name: { fa: 'محمد امین کریمی', en: 'Mohammad Amin Karimi' },
    first: { fa: 'محمد امین', en: 'Mohammad Amin' },
    last: { fa: 'کریمی', en: 'Karimi' },
    role: { fa: 'توسعه‌دهندهٔ فرانت‌اند', en: 'Front-End Engineer' },
    roles: {
      fa: ['توسعه‌دهندهٔ فرانت‌اند', 'توسعه‌دهندهٔ React و Next.js', 'عاشق TypeScript', 'مهندس رابط کاربری', 'حل‌کنندهٔ مسئله'],
      en: ['Front-End Engineer', 'React & Next.js Developer', 'TypeScript Enthusiast', 'UI Engineer', 'Problem Solver']
    },
    location: { fa: 'تهران، ایران', en: 'Tehran, Iran' },
    timezone: 'Asia/Tehran',
    email: 'm.amiin.krimi@gmail.com',
    phone: '+989391899523',
    phoneLabel: { fa: '۰۹۳۹ ۱۸۹ ۹۵۲۳', en: '+98 939 189 9523' },
    available: true,
    availability: { fa: 'آمادهٔ همکاری در پروژه‌های جدید', en: 'Open to new projects & roles' },
    startYear: 2019,
    social: [
      { id: 'github', label: 'GitHub', url: 'https://github.com/Aminkrimi', handle: '@Aminkrimi' },
      { id: 'telegram', label: 'Telegram', url: 'https://t.me/AminKrimi', handle: '@AminKrimi' },
      { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/amiin_krimi', handle: '@amiin_krimi' },
      { id: 'mail', label: 'Email', url: 'mailto:m.amiin.krimi@gmail.com', handle: 'm.amiin.krimi@gmail.com' }
    ]
  },

  ui: {
    nav: {
      about: { fa: 'درباره', en: 'About' },
      skills: { fa: 'مهارت‌ها', en: 'Skills' },
      experience: { fa: 'تجربه', en: 'Experience' },
      work: { fa: 'نمونه‌کار', en: 'Work' },
      contact: { fa: 'تماس', en: 'Contact' }
    },
    heroKicker: { fa: 'در حال کدنویسی از تهران', en: 'Shipping code from Tehran' },
    heroLead: {
      fa: 'رابط‌های کاربری سریع، تمیز و دقیق با React، Next.js و TypeScript می‌سازم؛ از پلتفرم‌های پیچیدهٔ چندماژوله تا وب‌سایت‌هایی که از اولین اسکرول دیده می‌شوند.',
      en: 'I build fast, clean and precise interfaces with React, Next.js and TypeScript — from complex multi-module platforms to websites that get noticed from the first scroll.'
    },
    ctaWork: { fa: 'دیدن نمونه‌کارها', en: 'See the work' },
    ctaContact: { fa: 'شروع همکاری', en: "Let's talk" },
    ctaTerminal: { fa: 'باز کردن ترمینال', en: 'Open terminal' },
    ctaCv: { fa: 'دانلود رزومه (PDF)', en: 'Download CV (PDF)' },
    scroll: { fa: 'اسکرول', en: 'Scroll' },
    yearsLabel: { fa: 'سال تجربه', en: 'Years shipping' },
    projectsLabel: { fa: 'پروژهٔ تحویل‌شده', en: 'Projects shipped' },
    stackLabel: { fa: 'تکنولوژی در جعبه‌ابزار', en: 'Tools in the kit' },
    aboutTitle: { fa: 'کدی که تمیز است، محصولی که دیده می‌شود', en: 'Clean code, products that get noticed' },
    githubTitle: { fa: 'فعالیت گیت‌هاب', en: 'GitHub activity' },
    personalityTitle: { fa: 'سیستم‌عامل شخصیتی', en: 'Personality OS' },
    interestsTitle: { fa: 'خارج از کد', en: 'Off the clock' },
    servicesTitle: { fa: 'کارهایی که انجام می‌دهم', en: 'What I do' },
    skillsTitle: { fa: 'جعبه‌ابزار', en: 'The rig' },
    skillsLead: {
      fa: 'ابزارهایی که هر روز با آن‌ها محصول می‌سازم — مرتب‌شده بر اساس میزان تسلط.',
      en: 'The tools I ship with every day — grouped and ranked by depth.'
    },
    alsoTitle: { fa: 'آشنا با', en: 'Also comfortable with' },
    experienceTitle: { fa: 'تایم‌لاین', en: 'The timeline' },
    educationTitle: { fa: 'تحصیلات', en: 'Education' },
    workTitle: { fa: 'نمونه‌کارهای منتخب', en: 'Selected work' },
    workLead: {
      fa: 'بخشی از پروژه‌هایی که طراحی، توسعه یا در آن‌ها مشارکت داشته‌ام.',
      en: 'A cut of the projects I have designed, built or contributed to.'
    },
    filterAll: { fa: 'همه', en: 'All' },
    visit: { fa: 'مشاهدهٔ سایت', en: 'Visit site' },
    source: { fa: 'سورس‌کد', en: 'Source' },
    confidential: { fa: 'محرمانه (NDA)', en: 'Under NDA' },
    contactTitle: { fa: 'پروژهٔ بعدی رو با هم بسازیم', en: "Let's build the next thing together" },
    contactLead: {
      fa: 'ایده‌ای داری، تیمت به یک فرانت‌اند کار دقیق نیاز داره یا فقط می‌خوای سلام کنی؟ پیام بده؛ معمولاً همون روز جواب می‌دم.',
      en: 'Got an idea, need a detail-obsessed front-end engineer on your team, or just want to say hi? Drop a line — I usually reply the same day.'
    },
    copyEmail: { fa: 'کپی ایمیل', en: 'Copy email' },
    copied: { fa: 'کپی شد!', en: 'Copied!' },
    localTime: { fa: 'ساعت محلی', en: 'Local time' },
    footer: { fa: 'ساخته‌شده با ☕ و کد تمیز', en: 'Built with ☕ and clean code' },
    builtWith: { fa: 'طراحی و کدنویسی دستی — بدون فریم‌ورک، فقط HTML, CSS و JS', en: 'Designed & hand-coded — no framework, just HTML, CSS & JS' },
    palette: {
      placeholder: { fa: 'یک فرمان تایپ کن…', en: 'Type a command…' },
      hint: { fa: 'فرمان‌ها', en: 'Commands' },
      empty: { fa: 'چیزی پیدا نشد', en: 'Nothing found' },
      goto: { fa: 'برو به', en: 'Go to' },
      theme: { fa: 'تغییر تم (روشن / تاریک)', en: 'Toggle theme (light / dark)' },
      lang: { fa: 'Switch to English', en: 'تغییر زبان به فارسی' },
      email: { fa: 'کپی ایمیل', en: 'Copy email address' },
      print: { fa: 'چاپ / ذخیرهٔ PDF رزومه', en: 'Print / save CV as PDF' },
      github: { fa: 'باز کردن گیت‌هاب', en: 'Open GitHub' },
      telegram: { fa: 'پیام در تلگرام', en: 'Message on Telegram' },
      terminal: { fa: 'باز کردن ترمینال', en: 'Open terminal' },
      top: { fa: 'برگشت به بالا', en: 'Back to top' }
    },
    shortcuts: { fa: 'میانبرها: T تم · L زبان · ` ترمینال · ⌘K فرمان', en: 'Shortcuts: T theme · L language · ` terminal · ⌘K commands' },
    themeLight: { fa: 'تم روشن', en: 'Light theme' },
    themeDark: { fa: 'تم تاریک', en: 'Dark theme' },
    skip: { fa: 'پرش به محتوا', en: 'Skip to content' }
  },

  about: {
    paragraphs: [
      {
        fa: 'سلام! من محمد امین کریمی‌ام؛ توسعه‌دهندهٔ فرانت‌اند، متولد ۲۸ آذر ۱۳۷۸ و فارغ‌التحصیل کارشناسی علوم کامپیوتر از دانشگاه قم. از سال ۱۳۹۸ رابط کاربری می‌سازم — از وب‌سایت‌های شرکتی تا پلتفرم‌های پیچیدهٔ چندماژوله با React، Next.js و TypeScript.',
        en: "Hi! I'm Mohammad Amin Karimi — a front-end engineer born in December 1999, with a B.Sc. in Computer Science from the University of Qom. I've been shipping interfaces since 2019, from company websites to complex multi-module platforms built with React, Next.js and TypeScript."
      },
      {
        fa: 'کمال‌گرایی‌ام را مستقیم وارد کد می‌کنم: کامپوننت‌های قابل استفادهٔ مجدد، تایپ‌های دقیق، رابط‌های RTL-first و ریسپانسیو، و توجه وسواس‌گونه به جزئیات UI و پرفورمنس. برایم مهم است که کد هم برای کاربر خوب کار کند و هم برای تیم خوانا بماند.',
        en: 'I pour my perfectionism straight into code: reusable components, precise types, RTL-first responsive interfaces and an obsessive eye for UI detail and performance. Code should work beautifully for users and stay readable for the team.'
      },
      {
        fa: 'برون‌گرا، خون‌گرم و اهل کار تیمی‌ام. حل مسئله، کارهای چالشی و یادگیری مداوم انرژی‌ام را تأمین می‌کنند — و این روزها با ابزارهای هوش مصنوعی، سریع‌تر و دقیق‌تر از همیشه می‌سازم.',
        en: "Extroverted, warm and a true team player. Problem-solving, hard challenges and constant learning are what fuel me — and these days, with AI-augmented tooling, I build faster and sharper than ever."
      }
    ],
    personality: [
      { code: 'ENTJ', label: { fa: 'MBTI — فرمانده', en: 'MBTI — The Commander' }, desc: { fa: 'قاطع، استراتژیک و نتیجه‌محور', en: 'Decisive, strategic, outcome-driven' } },
      { code: 'Type 1', label: { fa: 'انیاگرام — کمال‌گرا', en: 'Enneagram — The Perfectionist' }, desc: { fa: 'استانداردهای بالا، جزئیات بی‌نقص', en: 'High standards, flawless details' } },
      { code: 'D / I', label: { fa: 'DISC — سلطه‌گر / تأثیرگذار', en: 'DISC — Dominant / Influential' }, desc: { fa: 'رهبری پرانرژی با مهارت ارتباطی بالا', en: 'High-energy lead with people skills' } }
    ],
    interests: [
      { icon: 'cpu', fa: 'تکنولوژی', en: 'Technology' },
      { icon: 'camera', fa: 'عکاسی', en: 'Photography' },
      { icon: 'music', fa: 'موسیقی', en: 'Music' },
      { icon: 'palette', fa: 'هنر', en: 'Art' },
      { icon: 'bolt', fa: 'ورزش', en: 'Sport' },
      { icon: 'users', fa: 'کار گروهی', en: 'Teamwork' }
    ]
  },

  services: [
    {
      icon: 'code',
      title: { fa: 'مهندسی فرانت‌اند', en: 'Front-End Engineering' },
      desc: { fa: 'اپلیکیشن‌ها و پنل‌های مدیریتی با React، Next.js و TypeScript؛ معماری تمیز، کامپوننت‌های قابل استفادهٔ مجدد و اتصال دقیق به API.', en: 'Apps and admin panels in React, Next.js & TypeScript — clean architecture, reusable components and tight API integration.' }
    },
    {
      icon: 'layout',
      title: { fa: 'طراحی وب و UI', en: 'Web Design & UI' },
      desc: { fa: 'صفحات پیکسل‌پرفکت، ریسپانسیو و RTL-first که روی هر صفحه‌نمایشی درست دیده می‌شوند.', en: 'Pixel-perfect, responsive, RTL-first interfaces that look right on every screen.' }
    },
    {
      icon: 'gauge',
      title: { fa: 'بهینه‌سازی و توسعه', en: 'Performance & Evolution' },
      desc: { fa: 'ریفکتور، رفع باگ، افزودن ماژول‌های جدید به کدبیس‌های موجود و بهینه‌سازی سرعت و تجربهٔ کاربری.', en: 'Refactoring, bug-hunting, adding new modules to existing codebases and tuning speed and UX.' }
    },
    {
      icon: 'chart',
      title: { fa: 'داده‌کاوی و یادگیری ماشین', en: 'Data & Machine Learning' },
      desc: { fa: 'تحلیل داده و پروژه‌های یادگیری ماشین با Python، Pandas و scikit-learn.', en: 'Data analysis and ML projects with Python, Pandas and scikit-learn.' }
    }
  ],

  skills: [
    {
      group: { fa: 'هستهٔ فرانت‌اند', en: 'Front-End Core' },
      items: [
        { name: 'HTML5 & Semantics', level: 5 },
        { name: 'CSS3 / Sass', level: 5 },
        { name: 'JavaScript (ES2024+)', level: 5 },
        { name: 'TypeScript', level: 4 },
        { name: 'Responsive & RTL', level: 5 },
        { name: 'Accessibility (a11y)', level: 4 }
      ]
    },
    {
      group: { fa: 'فریم‌ورک و UI', en: 'Frameworks & UI' },
      items: [
        { name: 'React 18 / 19', level: 5 },
        { name: 'Next.js', level: 4 },
        { name: 'Hooks & State', level: 5 },
        { name: 'Tailwind CSS', level: 4 },
        { name: 'Bootstrap', level: 5 },
        { name: 'jQuery & Ajax', level: 4 }
      ]
    },
    {
      group: { fa: 'ابزار و ورک‌فلو', en: 'Tooling & Workflow' },
      items: [
        { name: 'Git & GitHub', level: 5 },
        { name: 'Vite / npm', level: 4 },
        { name: 'REST API · Axios', level: 5 },
        { name: 'ESLint · Prettier', level: 4 },
        { name: 'PWA', level: 3 },
        { name: 'AI-assisted dev', level: 5 }
      ]
    },
    {
      group: { fa: 'بک‌اند و داده', en: 'Backend & Data' },
      items: [
        { name: 'C# · ASP.NET Core', level: 3 },
        { name: 'SQL', level: 3 },
        { name: 'Python', level: 3 },
        { name: 'Pandas · NumPy', level: 3 },
        { name: 'scikit-learn', level: 3 },
        { name: 'Azure · Plesk', level: 3 }
      ]
    }
  ],
  also: ['SSR / SSG', 'ASP.NET MVC', 'RBAC', 'i18n', 'UI / UX', 'Figma', 'SEO', 'Web Vitals', 'Jupyter', 'Matplotlib', 'Algorithms & DS', 'Clean Code'],
  marquee: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vite', 'Tailwind', 'Sass', 'HTML5', 'CSS3', 'Bootstrap', 'Git', 'REST', 'PWA', 'Python', 'Pandas', 'scikit-learn', 'ASP.NET', 'SQL', 'Figma'],

  experience: [
    {
      period: { fa: '۱۴۰۴ — اکنون', en: '2025 — Now' },
      title: { fa: 'توسعه‌دهندهٔ فرانت‌اند', en: 'Front-End Developer' },
      org: { fa: 'سیدو (sido.ir) — پلتفرم کلینیک‌های دندان‌پزشکی', en: 'Sido (sido.ir) — dental-clinic platform' },
      current: true,
      points: {
        fa: [
          'طراحی و پیاده‌سازی فلوی چندمرحله‌ای ثبت‌نام دندان‌پزشکان با آپلود مدارک، لوگو و مجوز نظام پزشکی و اعتبارسنجی کامل فرم‌ها.',
          'توسعهٔ ماژول استخدام: آگهی‌های شغلی، پیش‌نویس، مراحل جذب، آگهی‌های ردشده و بهینه‌سازی داشبورد با endpointهای شمارش وضعیت.',
          'پیاده‌سازی مدیریت نقش‌ها و دسترسی‌ها (RBAC) و ساخت اشتراک با انتخاب ماژول.',
          'توسعهٔ بک‌آفیس: تاریخچهٔ فعالیت‌ها، برنامهٔ شیفت‌ها، پنل تماس و مدیریت لیدها، گالری مجموعه‌ها و نمایشگر نوبت‌دهی تلویزیونی کلینیک.'
        ],
        en: [
          'Designed and built a multi-step dentist onboarding flow with document, logo and medical-license uploads plus full form validation.',
          'Developed the recruitment module — job postings, drafts, hiring stages and rejected listings — and sped up its dashboard with status-count endpoints.',
          'Implemented role & permission management (RBAC) and subscription creation with per-module selection.',
          'Shipped back-office features: activity history, shift schedules, a call-center lead panel, clinic image collections and a TV queue display for waiting rooms.'
        ]
      },
      tags: ['React', 'Next.js', 'TypeScript', 'REST API', 'RBAC', 'RTL']
    },
    {
      period: { fa: '۱۳۹۸ — اکنون', en: '2019 — Now' },
      title: { fa: 'طراح و توسعه‌دهندهٔ وب', en: 'Web Designer & Developer' },
      org: { fa: 'فریلنس و همکاری با شرکت‌های معتبر', en: 'Freelance & agency collaborations' },
      current: true,
      points: {
        fa: [
          'طراحی و توسعهٔ وب‌سایت برای آژانس‌های تبلیغاتی، نرم‌افزارهای سازمانی (CRM و مدیریت پروژه)، سامانهٔ آزمون‌های روان‌سنجی و خبرگزاری شهرداری.',
          'کدنویسی تمیز و بهینه، منطق برنامه‌نویسی قوی و تحویل صفحات ریسپانسیو و سئو-فرندلی.',
          'نگهداری، اصلاح و افزودن بخش‌های جدید به پروژه‌های موجود متناسب با تکنولوژی هر پروژه.'
        ],
        en: [
          'Designed and built websites for advertising agencies, enterprise software (CRM & project management), a psychometric testing platform and a municipal news agency.',
          'Clean, efficient code with strong programming logic — shipping responsive, SEO-friendly pages.',
          'Maintained and extended existing projects, adding new sections to fit each stack.'
        ]
      },
      tags: ['JavaScript', 'jQuery', 'Ajax', 'Bootstrap', 'ASP.NET MVC']
    },
    {
      period: { fa: '۱۴۰۲ — اکنون', en: '2023 — Now' },
      title: { fa: 'داده‌کاوی و یادگیری ماشین', en: 'Data Mining & ML' },
      org: { fa: 'پروژه‌های شخصی و آموزشی', en: 'Personal & academic projects' },
      current: true,
      points: {
        fa: [
          'پیش‌بینی ریزش مشتری (Churn) با EDA، پیش‌پردازش، مصورسازی و آموزش مدل در scikit-learn.',
          'تسلط بر مفاهیم پایهٔ داده‌کاوی و کتابخانه‌های Pandas، NumPy، Matplotlib و Seaborn.'
        ],
        en: [
          'Customer-churn prediction: EDA, preprocessing, visualization and model training with scikit-learn.',
          'Solid grasp of data-mining fundamentals and Pandas, NumPy, Matplotlib and Seaborn.'
        ]
      },
      tags: ['Python', 'Pandas', 'scikit-learn', 'Jupyter']
    }
  ],

  education: [
    {
      period: { fa: 'کارشناسی پیوسته', en: "Bachelor's degree" },
      title: { fa: 'علوم کامپیوتر', en: 'Computer Science' },
      org: { fa: 'دانشگاه قم', en: 'University of Qom' },
      note: { fa: 'پروژه‌های الگوریتمی: کدگذاری هافمن و بلندترین زیررشتهٔ مشترک (LCS)', en: 'Algorithm projects: Huffman coding and Longest Common Subsequence (LCS)' }
    }
  ],

  projects: [
    {
      id: 'sido',
      cat: ['react', 'web'],
      featured: true,
      title: { fa: 'سیدو — پلتفرم کلینیک‌های دندان‌پزشکی', en: 'Sido — Dental-Clinic Platform' },
      desc: { fa: 'پلتفرم چندماژوله با Next.js: ثبت‌نام دندان‌پزشکان، ماژول استخدام، نقش و دسترسی، اشتراک‌ها، شیفت‌ها، لیدها و نمایشگر نوبت کلینیک.', en: 'A multi-module Next.js platform: dentist onboarding, recruitment, roles & permissions, subscriptions, shifts, leads and a clinic queue display.' },
      img: '/img/sido.webp',
      url: 'https://sido.ir/',
      stack: ['Next.js', 'React', 'TypeScript', 'RBAC'],
      mock: true
    },
    {
      id: 'testsho',
      cat: ['web'],
      title: { fa: 'تست‌شو', en: 'Testsho' },
      desc: { fa: 'سامانهٔ جامع آزمون‌های خودشناسی و توسعهٔ فردی و سازمانی.', en: 'A psychometric testing platform for self-discovery and personal & organizational growth.' },
      img: '/img/testsho.webp',
      url: 'https://testsho.com/',
      stack: ['ASP.NET', 'JavaScript', 'Bootstrap']
    },
    {
      id: 'ordibehesht',
      cat: ['web'],
      title: { fa: 'پردیس دیجیتال اردیبهشت', en: 'Ordibehesht Digital' },
      desc: { fa: 'وب‌سایت آژانس تبلیغات دیجیتال با هویت بصری سینمایی و تیره.', en: 'Website for a digital advertising agency with a dark, cinematic identity.' },
      img: '/img/ordibehesht.webp',
      url: 'https://ordibeheesht.ir',
      stack: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 'asanegar',
      cat: ['web'],
      title: { fa: 'گروه تبلیغاتی آسانگار', en: 'Asanegar Group' },
      desc: { fa: 'وب‌سایت آژانس تبلیغات محیطی — مترو، بیلبورد و فروشگاه‌های زنجیره‌ای.', en: 'Out-of-home advertising agency site — metro, billboard and retail media.' },
      img: '/img/asanegar.webp',
      url: 'https://asanegar.com/',
      stack: ['HTML', 'jQuery', 'Bootstrap']
    },
    {
      id: 'arses',
      cat: ['web'],
      title: { fa: 'نرم‌افزار مدیریت پروژهٔ آرسس', en: 'Arses Project Management' },
      desc: { fa: 'وب‌سایت محصول نرم‌افزار سازمانی مدیریت پروژه.', en: 'Product website for an enterprise project-management suite.' },
      img: '/img/arses.webp',
      url: 'http://www.arsesproject.com/',
      stack: ['ASP.NET MVC', 'jQuery', 'Bootstrap']
    },
    {
      id: 'sahand',
      cat: ['web'],
      title: { fa: 'نرم‌افزار CRM سهند', en: 'Sahand CRM' },
      desc: { fa: 'وب‌سایت نرم‌افزار مدیریت ارتباط با مشتری.', en: 'Product website for a customer-relationship-management platform.' },
      img: '/img/sahand.webp',
      url: 'http://www.sahandcrm.com/',
      stack: ['ASP.NET MVC', 'jQuery', 'Ajax']
    },
    {
      id: 'mahdasht',
      cat: ['web'],
      title: { fa: 'خبرگزاری شهرداری ماهدشت', en: 'Mahdasht Municipality News' },
      desc: { fa: 'پورتال خبری مدیریت شهری ماهدشت.', en: 'News portal for the Mahdasht municipality.' },
      img: '/img/mahdasht.webp',
      url: 'http://www.mahdasht.org/',
      stack: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 'smartsearch',
      cat: ['react', 'oss'],
      title: { fa: 'Smart Search', en: 'Smart Search' },
      desc: { fa: 'جست‌وجوی هوشمند درون متن فارسی با debounce، هایلایت و پیمایش بین نتایج — به‌صورت PWA.', en: 'In-text smart search for Persian content with debounce, highlighting and match navigation — shipped as a PWA.' },
      code: 'https://github.com/Aminkrimi/SmartSearch_Fiotrix',
      stack: ['React 19', 'TypeScript', 'Vite', 'PWA'],
      glyph: 'search'
    },
    {
      id: 'crypto',
      cat: ['react', 'oss'],
      title: { fa: 'Crypto Market', en: 'Crypto Market' },
      desc: { fa: 'جدول قیمت لحظه‌ای رمزارزها با جست‌وجو و اتصال به API.', en: 'Live crypto price table with search, powered by a public API.' },
      code: 'https://github.com/Aminkrimi/CryptoMarket',
      stack: ['React', 'Axios', 'REST'],
      glyph: 'chart'
    },
    {
      id: 'churn',
      cat: ['data', 'oss'],
      title: { fa: 'پیش‌بینی ریزش مشتری', en: 'Customer Churn ML' },
      desc: { fa: 'پایپ‌لاین کامل یادگیری ماشین از EDA تا ارزیابی مدل.', en: 'An end-to-end ML pipeline, from EDA to model evaluation.' },
      code: 'https://github.com/Aminkrimi/ML_Churn',
      stack: ['Python', 'Pandas', 'scikit-learn'],
      glyph: 'brain'
    },
    {
      id: 'algo',
      cat: ['oss'],
      title: { fa: 'Huffman و LCS', en: 'Huffman & LCS' },
      desc: { fa: 'پیاده‌سازی الگوریتم‌های کلاسیک فشرده‌سازی و برنامه‌نویسی پویا.', en: 'Classic compression and dynamic-programming algorithm implementations.' },
      code: 'https://github.com/Aminkrimi/HuffmanCode',
      stack: ['Algorithms', 'DP', 'Trees'],
      glyph: 'tree'
    }
  ],
  filters: [
    { id: 'all' },
    { id: 'web', fa: 'وب‌سایت', en: 'Websites' },
    { id: 'react', fa: 'React / Next', en: 'React / Next' },
    { id: 'data', fa: 'داده', en: 'Data' },
    { id: 'oss', fa: 'اوپن‌سورس', en: 'Open source' }
  ]
} satisfies CV;
