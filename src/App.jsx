import { createEffect, createSignal, onCleanup } from 'solid-js'
import './App.css'

// Shared social media helpers
const getSocialIcon = (key) => {
  const baseUrl = import.meta.env.BASE_URL
  const icons = {
    linkedin: 'in.svg',
    x: 'x.svg',
    whatsapp: 'whatsapp.svg',
    tiktok: 'tiktok.svg',
    instagram: 'insta.svg'
  }
  return icons[key] ? `${baseUrl}static/img/${icons[key]}` : null
}

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/goldencare-medical-company/' },
  { label: 'X', href: 'https://x.com/G_Careksa' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@g_careksa' },
  { label: 'Instagram', href: 'https://www.instagram.com/G_Careksa' }
]

function NavBar(props) {
  const [open, setOpen] = createSignal(false)
  const baseUrl = import.meta.env.BASE_URL
  return (
    <header class="navbar">
      <div class="container nav-inner">
        <a href="#hero" class="brand" aria-label={props.t('brand')}>
          <img class="brand-logo" src={`${baseUrl}static/img/G%20-%20Care-01.svg`} alt="" aria-hidden="true" />
        </a>

        <div class="nav-actions">
          <button
            class="lang-toggle"
            type="button"
            aria-label={props.lang() === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            onClick={() => {
              props.setLang((v) => (v === 'ar' ? 'en' : 'ar'))
              setOpen(false)
            }}
          >
            {props.lang() === 'ar' ? 'EN' : 'AR'}
          </button>

          <button
            class="menu-toggle"
            type="button"
            aria-label={props.t('menu')}
            aria-expanded={open() ? 'true' : 'false'}
            onClick={() => setOpen((v) => !v)}
          >
            <span class="bar" aria-hidden></span>
            <span class="bar" aria-hidden></span>
            <span class="bar" aria-hidden></span>
          </button>
        </div>

        <nav class={`nav-links ${open() ? 'open' : ''}`} aria-label={props.t('navLabel')}>
          <a href="#hero" onClick={() => setOpen(false)}>{props.t('navHome')}</a>
          <a href="#about-page" onClick={() => setOpen(false)}>{props.t('navAbout')}</a>
          <a href="#products" onClick={() => setOpen(false)}>{props.t('navProducts')}</a>
          <a href="#education-page" onClick={() => setOpen(false)}>{props.t('navEducation')}</a>
          <a href="#contact-page" onClick={() => setOpen(false)}>{props.t('navContact')}</a>
        </nav>
      </div>
    </header>
  )
}

function GlobalSearch(props) {
  const [query, setQuery] = createSignal('')
  const [results, setResults] = createSignal([])
  const [showResults, setShowResults] = createSignal(false)

  const searchableItems = [
    { key: 'navAbout', href: '#about' },
    { key: 'navProducts', href: '#products' },
    { key: 'navEducation', href: '#education-page' },
    { key: 'navContact', href: '#contact-page' },
    { key: 'catIVD', href: '#products' },
    { key: 'catIUD', href: '#products' },
    { key: 'catIUS', href: '#products' },
    { key: 'catWomanCare', href: '#products' },
    { key: 'educationTopic1Title', href: '#education-page' },
    { key: 'educationTopic2Title', href: '#education-page' },
    { key: 'educationTopic3Title', href: '#education-page' },
  ]

  createEffect(() => {
    const q = query().toLowerCase().trim()
    if (!q) {
      setResults([])
      return
    }
    const filtered = searchableItems.filter(item => {
      const label = props.t(item.key).toLowerCase()
      return label.includes(q)
    })
    setResults(filtered)
  })

  return (
    <div class="global-search-container">
      <div class="global-search-box">
        <svg class="search-icon-main" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          class="global-search-input"
          placeholder={props.t('searchGlobalPlaceholder')}
          onInput={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(query().length > 0)}
        />
        {showResults() && results().length > 0 && (
          <div class="search-results-dropdown shadow-lg">
            {results().map(item => (
              <a href={item.href} class="search-result-item" onClick={() => setShowResults(false)}>
                <span class="result-label">{props.t(item.key)}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Hero(props) {
  return (
    <section class="section hero" id="hero" role="banner" aria-label={props.t('heroAria')}>
      <div class="hero-overlay" />
      <div class="container hero-content">
        <HeroInfiniteSlider />
        <div class="hero-search-overlay">
          <h1 class="hero-main-title">{props.t('heroTitle')}</h1>
          <p class="hero-main-subtitle">{props.t('heroSubtitle')}</p>
          <GlobalSearch t={props.t} />
        </div>
      </div>
    </section>
  )
}

function HeroInfiniteSlider() {
  const baseUrl = import.meta.env.BASE_URL
  return (
    <div class="hero-gallery" aria-label="Hero video">
      <video
        class="hero-video"
        src={`${baseUrl}static/vid/intro.mp4`}
        autoplay
        loop
        muted
        playsinline
        aria-label="Intro video"
      />
    </div>
  )
}

function Products(props) {
  const categories = [
    { key: 'catIVD', count: 4 },
    { key: 'catIUD', count: 4 },
    { key: 'catIUS', count: 4 },
    { key: 'catWomanCare', count: 4 }
  ]

  const topRated = [
    {
      key: 'topSurgicalKit',
      href: 'https://gcare.sa/product/surgical-kit/',
      img: 'https://lemon.sa/image/cache/catalog/-SH-%20Products/9%20May/03114003%20G-Care%20Pregnany%20Test%20--700x700.jpg'
    },
    {
      key: 'topElectronicMonitor',
      href: 'https://gcare.sa/product/electronic-monitor/',
      img: 'https://lemon.sa/image/cache/catalog/-SH-%20Products/9%20May/03114003%20G-Care%20Pregnany%20Test%20--700x700.jpg'
    },
    {
      key: 'topPlasticEnema',
      href: 'https://gcare.sa/product/plastic-enema/',
      img: 'https://lemon.sa/image/cache/catalog/-SH-%20Products/9%20May/03114003%20G-Care%20Pregnany%20Test%20--700x700.jpg'
    },
    {
      key: 'catPregnancyTest',
      href: '#',
      img: 'https://lemon.sa/image/cache/catalog/-SH-%20Products/9%20May/03114003%20G-Care%20Pregnany%20Test%20--700x700.jpg'
    }
  ]

  return (
    <section class="section" id="products" aria-label={props.t('productsAria')}>
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">{props.t('productsTitle')}</h2>
          <span class="badge">{props.t('productsBadge')}</span>
        </div>

        <div class="products-layout">
          <main class="products-main" aria-label={props.t('productsMainAria')}>
            <div class="products-toolbar">
              <div class="products-toolbar-label">{props.t('sortLabel')}</div>
              <select class="select" aria-label={props.t('sortLabel')}>
                <option value="default">{props.t('sortDefault')}</option>
              </select>
            </div>

            <div class="products-grid" role="list">
              {categories.map((c) => (
                <div class="product-tile" role="listitem">
                  <div class="product-title">{props.t(c.key)}</div>
                  <div class="product-meta">({c.count})</div>
                </div>
              ))}
            </div>
          </main>

          <aside class="products-side" aria-label={props.t('productsSideAria')}>
            <div class="side-card search-card">
              <label class="side-label">{props.t('searchLabel')}</label>
              <div class="field search-field">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input type="search" placeholder={props.t('searchPlaceholder')} />
              </div>
            </div>

            <div class="side-card">
              <div class="side-title">{props.t('categoriesTitle')}</div>
              <ul class="side-list" aria-label={props.t('categoriesTitle')}>
                {categories.map((c) => (
                  <li>
                    <span class="side-item">{props.t(c.key)}</span>
                    <span class="side-count">({c.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div class="side-card">
              <div class="side-title">{props.t('topRatedTitle')}</div>
              <ul class="side-list" aria-label={props.t('topRatedTitle')}>
                {topRated.map((p) => (
                  <li>
                    <a class="top-rated" href={p.href} target="_blank" rel="noreferrer">
                      <img class="top-rated-thumb" src={p.img} alt={props.t(p.key)} loading="lazy" />
                      <span class="top-rated-title">{props.t(p.key)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function HomePage(props) {
  return (
    <>
      <Hero t={props.t} />
      <HomeAbout t={props.t} />
      <ClientsSlider t={props.t} />
      <Visitors t={props.t} />
      <Education t={props.t} lang={props.lang} />
      <Contact t={props.t} />
    </>
  )
}

function AboutPage(props) {
  return (
    <>
      <About t={props.t} />
      <Contact t={props.t} />
    </>
  )
}

function ProductsPage(props) {
  return (
    <>
      <Products t={props.t} />
      <Contact t={props.t} />
    </>
  )
}

function ContactPage(props) {
  return (
    <>
      <section class="section contact-page" id="contact-page" aria-label={props.t('contactAria')}>
        <div class="container">
          <div class="contact-page-block">
            <div class="contact-page-header">
              <div class="contact-page-intro">
                <p class="contact-page-text">{props.t('contactPageBody1')}</p>
                <p class="contact-page-text">{props.t('contactPageBody2')}</p>
              </div>
            </div>

            <div class="contact-main-grid">
              <div class="contact-appointment-side">
                <div class="contact-form-card">
                  <h3 class="contact-form-title">{props.t('contactTitle')}</h3>
                  <p class="contact-form-subtitle">{props.t('contactFormSubtitle')}</p>
                  <form class="contact-form-fields" onSubmit={(e) => e.preventDefault()}>
                    <div class="field">
                      <input type="text" id="contact-name" placeholder={props.t('contactName')} required />
                    </div>
                    <div class="field">
                      <input type="email" id="contact-email" placeholder={props.t('contactEmail')} required />
                    </div>
                    <div class="field">
                      <textarea id="contact-message" placeholder={props.t('contactMessage')} rows="4" required></textarea>
                    </div>
                    <button class="btn btn-primary contact-submit" type="submit">
                      {props.t('contactSend')}
                    </button>
                  </form>
                </div>
              </div>

              <div class="contact-form-side">
                <div class="appointment-card">
                  <div class="appointment-content">
                    <h3 class="appointment-title">{props.t('contactAppointmentTitle')}</h3>
                    <p class="appointment-sub">{props.t('contactAppointmentSub')}</p>
                  </div>
                  <a href="https://outlook.office.com/book/Bookings@gcare.sa/?ismsaljsauthenabled=true" class="btn appointment-btn" target="_blank" rel="noopener noreferrer">
                    {props.t('contactAppointmentBtn')}
                  </a>
                </div>
              </div>
            </div>



            <div class="contact-info-grid">
              {[
                { title: props.t('contactPhone'), value: props.t('contactPhoneValue'), href: 'tel:+966112145550', note: props.t('contactPhoneNote'), isLtr: true },
                { title: props.t('contactEmailLabel'), value: 'info@gcare.sa', href: 'mailto:info@gcare.sa', note: props.t('contactEmailNote'), isLtr: true },
                { title: props.t('contactEmailHealthLabel'), value: 'hep@gcare.sa', href: 'mailto:hep@gcare.sa', note: props.t('contactEmailHealthNote'), isLtr: true },
                { title: props.t('contactAddress'), value: props.t('contactAddressValue'), note: props.t('contactVisitNote'), isLtr: false }
              ].map((card) => (
                <div class="info-card">
                  <span class="info-card-title">{card.title}</span>
                  {card.href ? (
                    <a class="info-card-value" href={card.href} dir={card.isLtr ? 'ltr' : 'auto'}>
                      {card.value}
                    </a>
                  ) : (
                    <span class="info-card-value" dir={card.isLtr ? 'ltr' : 'auto'}>{card.value}</span>
                  )}
                  <p class="info-card-note">{card.note}</p>
                </div>
              ))}
            </div>

            <div class="contact-map-section">
              <div class="map-wrapper">
                <iframe
                  title="G-Care Location"
                  src="https://maps.google.com/maps?q=24.6869930,46.6866840&z=15&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Contact t={props.t} />
    </>
  )
}

function HomeAbout(props) {
  const baseUrl = import.meta.env.BASE_URL
  return (
    <section class="section" id="home-about">
      <div class="container">
        <div class="about-layout" style={{ alignItems: 'center' }}>
          <div class="about-text">
            <h2 class="section-title">{props.t('aboutTitle')}</h2>
            <div class="about-content">
              <p style={{ fontSize: '1.25rem', color: 'var(--muted)', lineHeight: '1.8' }}>{props.t('aboutP1')}</p>
              <a href="#about-page" class="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                {props.t('heroCtaSecondary')}
              </a>
            </div>
          </div>
          <div class="about-logo-v2">
            <img class="about-event-img" src={`${baseUrl}static/img/G%20-%20Care-01.svg`} alt="G-Care Logo" style={{ maxWidth: '280px', borderRadius: '0', boxShadow: 'none' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

function About(props) {
  const baseUrl = import.meta.env.BASE_URL
  return (
    <section class="section" id="about">
      <div class="container">
        <div class="about-layout">
          <div class="about-text">
            <h2 class="section-title">{props.t('aboutUsPageTitle')}</h2>
            <div class="about-content">
              <p>{props.t('aboutP1')}</p>
              <p>{props.t('aboutP2')}</p>
              <p>{props.t('aboutP3')}</p>
              <p>{props.t('aboutP4')}</p>
            </div>
          </div>
          <div class="about-logo-v2">
            <img class="about-event-img rounded-card" src={`${baseUrl}static/img/d263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg`} alt="G-Care Event" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ClientsSlider(props) {
  const baseUrl = import.meta.env.BASE_URL
  const clients = [
    `${baseUrl}static/img/partners/dallahrevampedLogo.svg`,
    `${baseUrl}static/img/partners/dkt.png`,
    `${baseUrl}static/img/partners/euro.png`,
    `${baseUrl}static/img/partners/Fakkeh.webp`,
    `${baseUrl}static/img/partners/logo_valmed_alt.svg`,
    `${baseUrl}static/img/partners/PCD.png`,
    `${baseUrl}static/img/partners/pregnalogo.png`,
    `${baseUrl}static/img/partners/saudi_german.svg`,
    `${baseUrl}static/img/partners/sulaiman.svg`
  ]

  return (
    <section class="section clients-section" aria-label={props.t('clientsAria')}>
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">{props.t('clientsTitle')}</h2>
        </div>
        <div class="clients-slider">
          <div class="clients-track" aria-hidden="true">
            <div class="clients-group">
              {clients.map((url) => (
                <div class="client-logo">
                  <img src={url} alt="" loading="lazy" />
                </div>
              ))}
            </div>
            <div class="clients-group">
              {clients.map((url) => (
                <div class="client-logo">
                  <img src={url} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Visitors(props) {
  const [visitorCount, setVisitorCount] = createSignal('...')

  // نظام تتبع الزوار باستخدام localStorage
  createEffect(() => {
    try {
      // الرقم الأساسي (يمكن تغييره)
      const baseCount = 1247

      // جلب عدد الزيارات المحفوظة
      const savedVisits = parseInt(localStorage.getItem('gcare-total-visits') || '0')

      // التحقق من آخر زيارة لهذا المتصفح
      const lastVisit = localStorage.getItem('gcare-last-visit')
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000 // 24 ساعة

      // إذا كانت زيارة جديدة (أول مرة أو بعد 24 ساعة)
      if (!lastVisit || (now - parseInt(lastVisit)) > oneDay) {
        const newTotal = baseCount + savedVisits + 1
        localStorage.setItem('gcare-total-visits', (savedVisits + 1).toString())
        localStorage.setItem('gcare-last-visit', now.toString())
        setVisitorCount(newTotal.toLocaleString('en-US'))
      } else {
        // زيارة من نفس المتصفح خلال 24 ساعة
        const currentTotal = baseCount + savedVisits
        setVisitorCount(currentTotal.toLocaleString('en-US'))
      }

    } catch (e) {
      // في حالة عدم دعم localStorage
      setVisitorCount('1,247+')
    }
  })

  return (
    <section class="section" aria-label={props.t('visitorsAria')}>
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">5+</div>
            <div class="stat-label">{props.t('partnersLabel')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{props.t('achievementsValue')}+</div>
            <div class="stat-label">{props.t('achievementsLabel')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{visitorCount()}+</div>
            <div class="stat-label">{props.t('visitorsLabel')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Education(props) {
  const baseUrl = import.meta.env.BASE_URL
  const galleryImages = [
    { src: `${baseUrl}static/img/d263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg`, alt: 'فعالية G-Care 1' },
    { src: `${baseUrl}static/img/45a473c7-debf-48cc-9a41-b9d61c38a0f1.jpg`, alt: 'فعالية G-Care 2' },
    { src: `${baseUrl}static/img/9c4be885-1bf0-4a93-ba83-9cafe6e79c91-591x456.jpg`, alt: 'مؤتمر G-Care' },
    { src: `${baseUrl}static/img/0c672357-323e-4792-8605-0e4f67c43db9.jpg`, alt: 'معرض G-Care' },
    { src: `${baseUrl}static/img/ba862794-b872-49ac-be68-d173678fcbed.jpg`, alt: 'مشاركة G-Care' },
    { src: `${baseUrl}static/img/b67d7fb0-5715-490d-8482-2d8252ea7ad3.jpg`, alt: 'حضور G-Care' }
  ]

  const [currentIndex, setCurrentIndex] = createSignal(0)

  // Auto-play every 3 seconds
  createEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 3000)
    onCleanup(() => clearInterval(timer))
  })

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <section class="section education-gallery-section" id="education">
      <div class="container gallery-container">
        <div class="gallery-header">
          <h2 class="gallery-main-title">{props.t('educationGalleryTitle')}</h2>
        </div>

        <div class="gallery-slider-wrapper">
          <button class="gallery-nav-btn prev" onClick={prevSlide} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="gallery-slider-container">
            <div
              class="gallery-slider-track"
              style={{
                transform: `translateX(-${currentIndex() * 100}%)`
              }}
            >
              {galleryImages.map((image) => (
                <div class="gallery-slide">
                  <img src={image.src} alt={image.alt} class="gallery-slide-img" />
                </div>
              ))}
            </div>
          </div>

          <button class="gallery-nav-btn next" onClick={nextSlide} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div class="gallery-dots">
            {galleryImages.map((_, index) => (
              <button
                class={`gallery-dot ${currentIndex() === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function EducationPage(props) {
  return (
    <>
      <section class="section education-page" id="education-page">
        <div class="container">
          <div class="section-head">
            <h2 class="section-title">{props.t('educationTitle')}</h2>
            <p class="muted">{props.t('educationSubtitle')}</p>
          </div>
          <div class="education-content">
            <div class="info-card">
              <h3 class="subsection-title">{props.t('educationContentTitle')}</h3>
              <p class="about-paragraph">{props.t('educationBody')}</p>
            </div>
            <div class="education-topics">
              <div class="info-card">
                <h4 class="side-title">{props.t('educationTopic1Title')}</h4>
                <p class="muted">{props.t('educationTopic1Body')}</p>
              </div>
              <div class="info-card">
                <h4 class="side-title">{props.t('educationTopic2Title')}</h4>
                <p class="muted">{props.t('educationTopic2Body')}</p>
              </div>
              <div class="info-card">
                <h4 class="side-title">{props.t('educationTopic3Title')}</h4>
                <p class="muted">{props.t('educationTopic3Body')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Contact t={props.t} />
    </>
  )
}

function Contact(props) {
  const baseUrl = import.meta.env.BASE_URL
  return (
    <footer class="footer" id="contact">
      <div class="footer-top-divider"></div>

      {/* <div class="footer-watermark">
        <img src={`${baseUrl}static/img/G%20-%20Care-50.svg`} alt="" aria-hidden="true" />
      </div> */}

      <div class="container foot-main">
        {/* Right Col: About & Brand */}
        <div class="foot-col foot-brand-col">
          <div class="footer-brand-logo">
            <img src={`${baseUrl}static/img/whitelogo.svg`} alt="G-Care Logo" aria-hidden="true" />
          </div>
          <p class="footer-about-text">
            {props.t('footerAbout')}
          </p>

          <div class="socials-links-grid">
            {socialLinks.map((item) => {
              const key = item.label.toLowerCase().replace(/\s+/g, '')
              return (
                <a class={`social-icon-link social-${key}`} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  {getSocialIcon(key) ? (
                    <img
                      class="social-icon"
                      src={getSocialIcon(key)}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : (
                    <span>*</span>
                  )}
                </a>
              )
            })}
          </div>
        </div>

        {/* Middle Col: Contact Info with Icons */}
        <div class="foot-col foot-info-col">
          <div class="info-group">
            <div class="info-label-row">
              <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span class="info-label">{props.t('contactAddress')}</span>
            </div>
            <address class="info-value-text">{props.t('footerAddress')}</address>
          </div>

          <div class="info-group">
            <div class="info-label-row">
              <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span class="info-label">{props.t('footerPhoneTitle')}</span>
            </div>
            <a href="tel:+966112145550" class="info-value phone-number">+966 11 214 5550</a>
          </div>

          <div class="info-group">
            <div class="info-label-row">
              <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span class="info-label">{props.t('footerInquiryTitle')}</span>
            </div>
            <a href={`mailto:info@gcare.sa`} class="info-value">info@gcare.sa</a>
          </div>
        </div>

        {/* Left Col: Newsletter & Socials */}
        <div class="foot-col foot-newsletter-col">
          <h3 class="footer-heading">{props.t('newsletterTitle')}</h3>
          <form class="newsletter-form">
            <div class="newsletter-input-group">
              <input type="email" placeholder={props.t('newsletterPlaceholder')} required />
              <button class="newsletter-btn" type="submit">
                <span>{props.t('newsletterSubmit')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p class="copyright-text">
            {props.t('footerRights')}
          </p>
        </div>
      </div>
    </footer>
  )
}

import translationsData from './data/translations.json'

export default function App() {
  const [lang, setLang] = createSignal('ar')
  const [route, setRoute] = createSignal('home')

  const translations = translationsData

  const t = (key) => translations[lang()]?.[key] ?? key

  createEffect(() => {
    const nextLang = lang()
    document.documentElement.lang = nextLang
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr'
  })

  const computeRoute = () => {
    const hash = window.location.hash
    if (hash === '#products') return 'products'
    if (hash === '#contact-page') return 'contact'
    if (hash === '#education-page') return 'education'
    if (hash === '#about-page') return 'about'
    return 'home'
  }

  createEffect(() => {
    const onHashChange = () => setRoute(computeRoute())
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    onCleanup(() => window.removeEventListener('hashchange', onHashChange))
  })

  createEffect(() => {
    if (route() !== 'home') return
    const hash = window.location.hash
    if (!hash || hash === '#products') return

    requestAnimationFrame(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  return (
    <div class="page">
      <NavBar t={t} lang={lang} setLang={setLang} />
      {route() === 'products' ? <ProductsPage t={t} /> : null}
      {route() === 'contact' ? <ContactPage t={t} /> : null}
      {route() === 'education' ? <EducationPage t={t} /> : null}
      {route() === 'about' ? <AboutPage t={t} /> : null}
      {route() === 'home' ? <HomePage t={t} lang={lang} /> : null}
    </div>
  )
}
