import { createEffect, createSignal, onCleanup } from 'solid-js'
import './App.css'

// Shared social media helpers
const getSocialIcon = (key) => {
  const baseUrl = import.meta.env.BASE_URL
  const icons = {
    linkedin: 'linkedin-white.svg',
    x: 'x.svg',
    whatsapp: 'whatsapp.svg',
    tiktok: 'tiktok.svg',
    instagram: 'instagram.svg'
  }
  return icons[key] ? `${baseUrl}static/img/${icons[key]}` : null
}

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/goldencare-medical-company/' },
  { label: 'X', href: 'https://x.com/G_Careksa' },
  { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=966552527862' },
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
          <a href="#about" onClick={() => setOpen(false)}>{props.t('navAbout')}</a>
          <a href="#products" onClick={() => setOpen(false)}>{props.t('navProducts')}</a>
          <a href="#education-page" onClick={() => setOpen(false)}>{props.t('navEducation')}</a>
          <a href="#contact-page" onClick={() => setOpen(false)}>{props.t('navContact')}</a>
        </nav>
      </div>
    </header>
  )
}

function Hero(props) {
  return (
    <section class="hero" id="hero" role="banner" aria-label={props.t('heroAria')}>
      <div class="hero-overlay" />
      <div class="container hero-content">
        <HeroInfiniteSlider />
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
      img: 'https://gcare.sa/wp-content/uploads/2025/12/DSC04599-300x250.png'
    },
    {
      key: 'topElectronicMonitor',
      href: 'https://gcare.sa/product/electronic-monitor/',
      img: 'https://gcare.sa/wp-content/uploads/2025/12/DSC04598-300x250.png'
    },
    {
      key: 'topPlasticEnema',
      href: 'https://gcare.sa/product/plastic-enema/',
      img: 'https://gcare.sa/wp-content/uploads/2025/12/DSC04593-300x250.png'
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
      <About t={props.t} />
      <ClientsSlider t={props.t} />
      <Visitors t={props.t} />
      <Education t={props.t} />
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
  const infoCards = [
    { title: props.t('contactPhone'), value: props.t('contactPhoneValue'), href: 'tel:+966112145550', note: props.t('contactPhoneNote') },
    { title: props.t('contactEmailLabel'), value: 'info@gcare.sa', href: 'mailto:info@gcare.sa', note: props.t('contactEmailNote') },
    { title: props.t('contactEmailHealthLabel'), value: 'hep@gcare.sa', href: 'mailto:hep@gcare.sa', note: props.t('contactEmailHealthNote') },
    { title: props.t('contactAddress'), value: props.t('contactAddressValue'), note: props.t('contactVisitNote') }
  ]

  const tags = [props.t('contactTagSupport'), props.t('contactTagSupply'), props.t('contactTagPartners'), props.t('contactTagTraining')]

  return (
    <>
      <section class="section contact-page" id="contact-page" aria-label={props.t('contactAria')}>
        <div class="container">
          <div class="section-head">
            <h2 class="section-title">{props.t('contactPageTitle')}</h2>
            <p class="muted">{props.t('contactPageSubtitle')}</p>
          </div>
          <div class="contact contact-page-block">
            <div class="contact-page-logo-wrapper">
              <img class="contact-page-logo" src={`${import.meta.env.BASE_URL}static/img/G%20-%20Care-01.svg`} alt="G-Care" />
            </div>
            <div class="contact-page-intro">
              <p class="muted contact-page-text">{props.t('contactPageBody1')}</p>
              <p class="muted contact-page-text">{props.t('contactPageBody2')}</p>
            </div>
            <div class="contact-grid">
              <div class="contact-form">
                <label class="contact-form-title">{props.t('contactTitle')}</label>
                <p class="contact-form-subtitle">{props.t('contactFormSubtitle')}</p>
                <div class="field">
                  <input id="contact-name" placeholder={props.t('contactName')} />
                </div>
                <div class="field">
                  <textarea id="contact-message" placeholder={props.t('contactMessage')} rows="4"></textarea>
                </div>
                <a class="btn btn-primary contact-submit" href="mailto:info@gcare.sa" id="contact-submit">{props.t('contactSend')}</a>
              </div>
              <div class="socials" aria-label={props.t('socialsAria')}>
                <span class="socials-label">{props.t('socialsTitle')}</span>
                <div class="socials-links">
                  {socialLinks.map((item) => {
                    const key = item.label.toLowerCase().replace(/\s+/g, '')
                    return (
                      <a class={`social-item social-${key}`} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                        <span class="social-avatar" aria-hidden>
                          {getSocialIcon(key) ? (
                            <img
                              class="social-icon"
                              src={getSocialIcon(key)}
                              alt=""
                              aria-hidden="true"
                            />
                          ) : (
                            <span class="social-icon-badge">*</span>
                          )}
                        </span>
                        <span class="social-label">{item.label}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
            <div class="contact-info-grid" aria-label={props.t('contactHighlightsAria')}>
              {infoCards.map((card) => (
                <div class="info-card">
                  <div class="info-title">{card.title}</div>
                  {card.href ? (
                    <a class="info-value" href={card.href}>{card.value}</a>
                  ) : (
                    <div class="info-value">{card.value}</div>
                  )}
                  <div class="info-note">{card.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Contact t={props.t} />
    </>
  )
}

function About(props) {
  const baseUrl = import.meta.env.BASE_URL
  return (
    <section class="section" id="about">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">{props.t('aboutTitle')}</h2>
          <img class="brand-logo" src={`${baseUrl}static/img/G%20-%20Care-01.svg`} alt="" aria-hidden="true" style="width: 200px; height: 200px;" />
        </div>
        <div class="about-grid">
          <p>{props.t('aboutP1')}</p>
          <p>{props.t('aboutP2')}</p>
          <p>{props.t('aboutP3')}</p>
          <p>{props.t('aboutP4')}</p>
        </div>
      </div>
    </section>
  )
}

function ClientsSlider(props) {
  const clients = [
    'https://gcare.sa/wp-content/uploads/2025/12/c34c64d6-8ba7-46e8-b145-03f66a7356e9.jpg',
    'https://gcare.sa/wp-content/uploads/2025/12/b1ae1ef0-2f5f-4d60-86ca-fc61063e3001-370x324.jpg',
    'https://gcare.sa/wp-content/uploads/2025/12/242fac29-5f59-4d48-8f3f-1d3c88313536-370x101.jpg',
    'https://gcare.sa/wp-content/uploads/2025/12/5f1dd936-d330-45df-bcf1-10d835a35f61-370x146.jpg',
    'https://gcare.sa/wp-content/uploads/2025/12/5e78581e-a232-4b7e-9644-90b51a1ea6ec.jpg'
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
            <div class="stat-value">{visitorCount()}</div>
            <div class="stat-label">{props.t('visitorsLabel')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">5</div>
            <div class="stat-label">{props.t('partnersLabel')}</div>
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

  return (
    <section class="section education-gallery-section" id="education">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">{props.t('educationGalleryTitle')}</h2>
        </div>
      </div>
      <div class="education-gallery-fullwidth">
        <div class="education-gallery-slider">
          <div class="education-gallery-track">
            <div class="education-gallery-group">
              {galleryImages.map((image) => (
                <div class="education-gallery-item">
                  <img src={image.src} alt={image.alt} class="education-gallery-image" />
                </div>
              ))}
            </div>
            <div class="education-gallery-group" aria-hidden="true">
              {galleryImages.map((image) => (
                <div class="education-gallery-item">
                  <img src={image.src} alt={image.alt} class="education-gallery-image" />
                </div>
              ))}
            </div>
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
      <div class="container foot">
        <div>
          <div class="brand foot-brand">
            <img class="brand-logo" src={`${baseUrl}static/img/Golden-Care-41.png`} alt="" aria-hidden="true" />
            <span>{props.t('brand')}</span>
          </div>
          <p class="muted">{props.t('footerTagline')}</p>
          <p class="muted">{props.t('footerRights')}</p>
        </div>
        <ul class="foot-links" aria-label={props.t('footerLinksAria')}>
          <li><a href="#hero">{props.t('navHome')}</a></li>
          <li><a href="#about">{props.t('navAbout')}</a></li>
          <li><a href="#products">{props.t('navProducts')}</a></li>
          <li><a href="#education">{props.t('navEducation')}</a></li>
        </ul>
        <div class="contact">
          <label>{props.t('contactTitle')}</label>
          <div class="contact-grid">
            <div class="contact-form">
              <div class="foot-contact-info">
                <a href={`tel:${props.t('contactPhoneValue').replace(/\s+/g, '')}`} class="foot-phone">
                  <span class="label">{props.t('contactPhone')}:</span>
                  <span class="value">{props.t('contactPhoneValue')}</span>
                </a>
              </div>
              <div class="field"><input placeholder={props.t('contactName')} /></div>
              <div class="field"><input placeholder={props.t('contactEmail')} type="email" /></div>
              <button class="btn btn-primary" type="button">{props.t('contactSend')}</button>
            </div>
          </div>
        </div>
        <div class="socials-wrapper">
          <div class="socials" aria-label={props.t('socialsAria')}>
            <span class="socials-label">{props.t('socialsTitle')}</span>
            <div class="socials-links">
              {socialLinks.map((item) => {
                const key = item.label.toLowerCase().replace(/\s+/g, '')
                return (
                  <a class={`social-item social-${key}`} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                    <span class="social-avatar" aria-hidden>
                      {getSocialIcon(key) ? (
                        <img
                          class="social-icon"
                          src={getSocialIcon(key)}
                          alt=""
                          aria-hidden="true"
                        />
                      ) : (
                        <span class="social-icon-badge">*</span>
                      )}
                    </span>
                    <span class="social-label">{item.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [lang, setLang] = createSignal('ar')
  const [route, setRoute] = createSignal('home')

  const translations = {
    ar: {
      brand: 'G-Care',
      menu: 'فتح القائمة',
      navLabel: 'روابط رئيسية',
      navHome: 'الرئيسية',
      navAbout: 'من نحن',
      navProducts: 'المنتجات',
      navEducation: 'التثقيف الطبي',
      navContact: 'تواصل معنا',
      heroAria: 'الصفحة الرئيسية',
      heroTitle: 'أهلا بكم في الرعاية الذهبية',
      heroSubtitle: 'شركة رائدة في توريد الأجهزة الطبية والمكملات والمستحضرات الصيدلانية وبرامج التوعية الصحية منذ 2013',
      heroCtaPrimary: 'استعرض منتجاتنا',
      heroCtaSecondary: 'تعرف علينا',
      productsAria: 'صفحة المنتجات',
      productsTitle: 'المنتجات',
      productsBadge: 'Products',
      productsMainAria: 'قائمة المنتجات',
      productsSideAria: 'خيارات المنتجات',
      sortLabel: 'Default',
      sortDefault: 'Default',
      searchLabel: 'إبحث عن',
      searchPlaceholder: 'إبحث عن',
      categoriesTitle: 'المنتجات',
      topRatedTitle: 'الأكثر تقيماَ',
      catIVD: 'In Vitro Diagnostic (IVD)',
      catIUD: 'Intrauterine Device (IUD)',
      catIUS: 'Intrauterine System (IUS)',
      catWomanCare: 'Woman Care',
      topSurgicalKit: 'Surgical Kit',
      topElectronicMonitor: 'Electronic Monitor',
      topPlasticEnema: 'Plastic Enema',

      aboutTitle: 'نبذة عنا',
      aboutBadge: 'عن الرعاية الذهبية',
      aboutP1: 'تأسست شركة جي كير الطبية (G-Care Medical Co.) عام 2013، وتُعد من الشركات الرائدة المتخصصة في توريد الأجهزة الطبية، والمكملات الغذائية، والمستحضرات الصيدلانية، إضافة إلى برامج التوعية الصحية.',
      aboutP2: 'نركز حصريًا على التوزيع بالجملة، ونفخر بشراكاتنا مع كبرى المستشفيات في المملكة العربية السعودية.',
      aboutP3: 'نلتزم بتقديم منتجات عالية الجودة وخدمة متميزة لشركائنا في القطاع الصحي.',
      aboutP4: 'وبقيادة فريق من الخبراء والمتخصصين، نوفر حلولًا متكاملة من خلال شراكات استراتيجية مع أكبر الشركات العالمية المصنعة للمعدات الطبية.',

      valuesTitle: 'قيمنا الأساسية',
      valueQualityTitle: 'الجودة',
      valueQualityDesc: 'جودة تبني الثقة',
      valueInnovationTitle: 'الابتكار',
      valueInnovationDesc: 'حلول متقدمة ومتطورة',
      valueIntegrityTitle: 'النزاهة',
      valueIntegrityDesc: 'الصدق والشفافية',
      valueTeamworkTitle: 'العمل الجماعي',
      valueTeamworkDesc: 'فريق واحد، هدف واحد',
      valueServiceTitle: 'التميّز في الخدمة',
      valueServiceDesc: 'خدمة تتجاوز التوقعات',

      missionTitle: 'مهمتنا',
      missionP1: 'نلتزم بتقديم أحدث حلول الرعاية الصحية، بما يشمل الأجهزة الطبية، والمستحضرات الصيدلانية، والمكملات الغذائية، مدعومة ببرامج تعليمية وتوعوية رائدة.',
      missionP2: 'كما نركّز على بناء شراكات استراتيجية مع كبرى مؤسسات الرعاية الصحية، بما يسهم في تحسين الصحة العامة ودعم القطاع الصحي في المملكة.',

      visionTitle: 'رؤيتنا',
      visionP1: 'أن نكون روّادًا في قطاع الرعاية الصحية من خلال تقديم حلول طبية مبتكرة والمساهمة في تحسين جودة الحياة.',
      clientsAria: 'شركاء النجاح',
      clientsTitle: 'شركاء النجاح',
      visitorsAria: 'عدد الزوار',
      visitorsLabel: 'الزوار',
      partnersLabel: 'الشركاء',
      contactAria: 'تواصل معنا',
      contactPageTitle: 'تواصل معنا',
      contactPageSubtitle: 'نسعد بخدمتكم عبر القنوات التالية.',
      contactPageBody1: 'فريقنا جاهز للرد على استفساراتكم حول المنتجات، التوريد، أو الشراكات.',
      contactPageBody2: 'راسلونا عبر البريد أو تواصلوا معنا على قنوات التواصل الاجتماعي لنخدمكم بشكل أسرع.',
      contactPhone: 'هاتف الدعم',
      contactPhoneValue: '+966 11 214 5550',
      contactPhoneNote: 'من الأحد إلى الخميس من 9 ص حتى 5 م',
      contactEmailLabel: 'البريد الإلكتروني',
      contactEmailNote: 'نرد خلال يوم عمل واحد',
      contactEmailHealthLabel: 'بريد التثقيف الصحي',
      contactEmailHealthNote: 'للاستفسارات والمواد التوعوية',
      contactAddress: 'العنوان',
      contactAddressValue: 'الرياض، المملكة العربية السعودية',
      contactVisitNote: 'زيارات المكتب بمواعيد مسبقة',
      contactHours: 'أوقات العمل',
      contactHoursValue: 'الأحد - الخميس 9 ص - 5 م',
      contactHoursNote: 'الدعم الفني متاح إلكترونيًا خارج الساعات',
      contactHighlightsAria: 'معلومات الاتصال',
      contactServicesAria: 'خدمات يمكن طلبها',
      contactTagSupport: 'دعم فني',
      contactTagSupply: 'توريد ومشتريات',
      contactTagPartners: 'شراكات وتوزيع',
      contactTagTraining: 'تدريب وتعليم',
      educationTitle: 'التثقيف الطبي',
      educationSubtitle: 'نصوص، أدوات، وبرامج توعوية لخدمة الزوار.',
      educationBody: 'قسم تثقيفي يمكن توسيعه لاحقًا لعرض المقالات والأدلة والبرامج التوعوية.',
      educationGalleryTitle: 'معرض الصور',
      educationGallerySubtitle: 'تصاميم ومنتجات G-Care الطبية',
      educationContentTitle: 'محتوى التثقيف الطبي',
      educationTopic1Title: 'الوقاية والسلامة',
      educationTopic1Body: 'نوفر معلومات شاملة حول أهمية الوقاية من الأمراض والحفاظ على السلامة الصحية في المنشآت الطبية.',
      educationTopic2Title: 'الأجهزة الطبية',
      educationTopic2Body: 'دليل شامل لاستخدام وصيانة الأجهزة الطبية الحديثة وأفضل الممارسات في التعامل معها.',
      educationTopic3Title: 'برامج التدريب',
      educationTopic3Body: 'برامج تدريبية متخصصة للكوادر الطبية حول أحدث التقنيات والمعدات الطبية المتوفرة.',
      footerTagline: 'أهلا بكم في الرعاية الذهبية',
      footerRights: 'جميع الحقوق محفوظة لدى G-Care',
      footerLinksAria: 'روابط',
      socialsTitle: 'حساباتنا على التواصل',
      socialsAria: 'روابط التواصل الاجتماعي',
      contactTitle: 'تواصل معنا',
      contactFormSubtitle: 'أرسل لنا رسالتك وسنرد عليك في أقرب وقت',
      contactName: 'اسمك',
      contactMessage: 'رسالتك',
      contactEmail: 'بريدك الإلكتروني',
      contactSend: 'إرسال رسالة'
    },
    en: {
      brand: 'G-Care',
      menu: 'Open menu',
      navLabel: 'Primary navigation',
      navHome: 'Home',
      navAbout: 'About',
      navProducts: 'Products',
      navEducation: 'Medical Education',
      navContact: 'Contact',
      heroAria: 'Home',
      heroTitle: 'Welcome to Golden Care',
      heroSubtitle: 'A leading supplier of medical devices, supplements, pharmaceuticals, and health awareness programs since 2013.',
      heroCtaPrimary: 'View Products',
      heroCtaSecondary: 'About Us',
      productsAria: 'Products page',
      productsTitle: 'Products',
      productsBadge: 'Products',
      productsMainAria: 'Products list',
      productsSideAria: 'Products options',
      sortLabel: 'Sort',
      sortDefault: 'Default',
      searchLabel: 'Search',
      searchPlaceholder: 'Search',
      categoriesTitle: 'Categories',
      topRatedTitle: 'Top Rated',
      catIVD: 'In Vitro Diagnostic (IVD)',
      catIUD: 'Intrauterine Device (IUD)',
      catIUS: 'Intrauterine System (IUS)',
      catWomanCare: 'Woman Care',
      topSurgicalKit: 'Surgical Kit',
      topElectronicMonitor: 'Electronic Monitor',
      topPlasticEnema: 'Plastic Enema',

      aboutTitle: 'About Us',
      aboutBadge: 'About Golden Care',
      aboutP1: 'G-Care Medical Co. was founded in 2013 and is among the leading companies specializing in supplying medical devices, nutritional supplements, and pharmaceutical products, in addition to health awareness programs.',
      aboutP2: 'We focus exclusively on wholesale distribution and take pride in our partnerships with major hospitals across Saudi Arabia.',
      aboutP3: 'We are committed to delivering high-quality products and excellent service to our healthcare partners.',
      aboutP4: 'Led by a team of experts and specialists, we provide integrated solutions through strategic partnerships with top global manufacturers of medical equipment.',

      valuesTitle: 'Our Core Values',
      valueQualityTitle: 'Quality',
      valueQualityDesc: 'Quality that builds trust',
      valueInnovationTitle: 'Innovation',
      valueInnovationDesc: 'Advanced, forward-looking solutions',
      valueIntegrityTitle: 'Integrity',
      valueIntegrityDesc: 'Honesty and transparency',
      valueTeamworkTitle: 'Teamwork',
      valueTeamworkDesc: 'One team, one goal',
      valueServiceTitle: 'Service Excellence',
      valueServiceDesc: 'Service that exceeds expectations',

      missionTitle: 'Our Mission',
      missionP1: 'We are committed to delivering the latest healthcare solutions, including medical devices, pharmaceuticals, and nutritional supplements, supported by leading educational and awareness programs.',
      missionP2: 'We also focus on building strategic partnerships with major healthcare institutions, contributing to improving public health and supporting the healthcare sector in the Kingdom.',

      visionTitle: 'Our Vision',
      visionP1: 'To be leaders in healthcare by providing innovative medical solutions and contributing to improving quality of life.',
      clientsAria: 'Success Partners',
      clientsTitle: 'Success Partners',
      visitorsAria: 'Visitor count',
      visitorsLabel: 'Visitors',
      partnersLabel: 'Partners',
      contactAria: 'Contact us page',
      contactPageTitle: 'Contact Us',
      contactPageSubtitle: 'We’d love to hear from you.',
      contactPageBody1: 'Our team is ready to answer questions about products, supply, or partnerships.',
      contactPageBody2: 'Reach us by email or through our social channels for faster support.',
      contactPhone: 'Support phone',
      contactPhoneValue: '+966 11 214 5550',
      contactPhoneNote: 'Sunday to Thursday, 9am - 5pm',
      contactEmailLabel: 'Email',
      contactEmailNote: 'We reply within one business day',
      contactEmailHealthLabel: 'Health Education Email',
      contactEmailHealthNote: 'For awareness materials and inquiries',
      contactAddress: 'Address',
      contactAddressValue: 'Riyadh, Saudi Arabia',
      contactVisitNote: 'Office visits by appointment',
      contactHours: 'Hours',
      contactHoursValue: 'Sun - Thu, 9am - 5pm',
      contactHoursNote: 'Tech support is available online off hours',
      contactHighlightsAria: 'Contact information',
      contactServicesAria: 'Services you can request',
      contactTagSupport: 'Tech support',
      contactTagSupply: 'Supply & procurement',
      contactTagPartners: 'Partnerships & distribution',
      contactTagTraining: 'Training & education',
      educationTitle: 'Medical Education',
      educationSubtitle: 'Texts, tools, and awareness programs for visitors.',
      educationBody: 'An educational section that can be expanded later to include articles, guides, and awareness programs.',
      educationGalleryTitle: 'Image Gallery',
      educationGallerySubtitle: 'G-Care medical designs and products',
      educationContentTitle: 'Medical Education Content',
      educationTopic1Title: 'Prevention and Safety',
      educationTopic1Body: 'We provide comprehensive information about disease prevention and maintaining health safety in medical facilities.',
      educationTopic2Title: 'Medical Devices',
      educationTopic2Body: 'A comprehensive guide to using and maintaining modern medical devices and best practices in handling them.',
      educationTopic3Title: 'Training Programs',
      educationTopic3Body: 'Specialized training programs for medical staff on the latest technologies and medical equipment available.',
      footerTagline: 'Welcome to Golden Care',
      footerRights: 'All rights reserved © G-Care',
      footerLinksAria: 'Links',
      socialsTitle: 'Follow us',
      socialsAria: 'Social media links',
      contactTitle: 'Contact Us',
      contactFormSubtitle: 'Send us your message and we will respond as soon as possible',
      contactName: 'Your Name',
      contactMessage: 'Your Message',
      contactEmail: 'Your Email',
      contactSend: 'Send Message'
    }
  }

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
      {route() === 'home' ? <HomePage t={t} /> : null}
    </div>
  )
}
