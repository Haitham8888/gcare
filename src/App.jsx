import { createEffect, createSignal, onCleanup, For, Show, createMemo } from 'solid-js'
import './App.css'
import { products } from './data/products'

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
  const [selectedProduct, setSelectedProduct] = createSignal(null)
  const [activeTab, setActiveTab] = createSignal('overview')
  const [mainImage, setMainImage] = createSignal('')
  const [selectedCategory, setSelectedCategory] = createSignal('All')

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category))]

  const filteredProducts = createMemo(() => {
    const cat = selectedCategory()
    if (cat === 'All') return products
    return products.filter(p => p.category === cat)
  })

  const openProduct = (p) => {
    setSelectedProduct(p)
    setMainImage(p.mainImage)
    setActiveTab('overview')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProduct = () => {
    setSelectedProduct(null)
  }

  return (
    <section class="section catalog-section" id="products">
      <div class="container">
        <Show when={!selectedProduct()}>
          <div class="section-head text-center">
            <h2 class="section-title">{props.t('productDigitalCatalog')}</h2>
            <p class="hero-subtitle-large">{props.t('productsSubtitle') || 'Integrated medical solutions & devices'}</p>
          </div>

          <div class="category-filter-bar">
            {uniqueCategories.map(cat => (
              <button
                class={`filter-btn ${selectedCategory() === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {props.t(`cat${cat}`)}
              </button>
            ))}
          </div>

          <div class="catalog-grid">
            <For each={filteredProducts()}>
              {(product) => (
                <div class="catalog-card">
                  <div class="catalog-card-img">
                    <img src={product.mainImage} alt={product.name} loading="lazy" />
                    <div class="catalog-card-overlay">
                      <button class="btn btn-brand-alt" onClick={() => openProduct(product)}>
                        {props.t('productViewDetails')}
                      </button>
                    </div>
                  </div>
                  <div class="catalog-card-info">
                    <span class="catalog-card-cat">{product.category}</span>
                    <h3 class="catalog-card-title">{product.name}</h3>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={selectedProduct()}>
          <div class="product-detail-page">
            <button class="back-link-v2 mb-8" onClick={closeProduct}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
              {props.t('productBackToList')}
            </button>

            <div class="product-detail-layout">
              <div class="product-visuals">
                <div class="product-main-stage">
                  <div class="stage-inner">
                    <img src={mainImage()} alt={selectedProduct().name} class="zoom-img" />
                  </div>
                </div>
                <div class="product-thumbs">
                  <For each={selectedProduct().images}>
                    {(img) => (
                      <div
                        class={`thumb-box ${mainImage() === img ? 'active' : ''}`}
                        onClick={() => setMainImage(img)}
                      >
                        <img src={img} alt="Thumbnail" />
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <div class="product-info-panel">
                <span class="detail-badge">{selectedProduct().category}</span>
                <h1 class="detail-title">{selectedProduct().name}</h1>

                <div class="detail-tabs">
                  <div class="tabs-nav">
                    <button
                      class={`tab-btn ${activeTab() === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      {props.t('productOverview')}
                    </button>
                    <button
                      class={`tab-btn ${activeTab() === 'specs' ? 'active' : ''}`}
                      onClick={() => setActiveTab('specs')}
                    >
                      {props.t('productSpecs')}
                    </button>
                    <button
                      class={`tab-btn ${activeTab() === 'features' ? 'active' : ''}`}
                      onClick={() => setActiveTab('features')}
                    >
                      {props.t('productFeatures')}
                    </button>
                  </div>

                  <div class="tab-content">
                    <Show when={activeTab() === 'overview'}>
                      <div class="tab-pane fade-in">
                        <p>{selectedProduct().overview}</p>
                      </div>
                    </Show>
                    <Show when={activeTab() === 'specs'}>
                      <div class="tab-pane fade-in">
                        <table class="specs-table">
                          <tbody>
                            <For each={selectedProduct().specifications}>
                              {(spec) => (
                                <tr>
                                  <td>{spec.label}</td>
                                  <td>{spec.value}</td>
                                </tr>
                              )}
                            </For>
                          </tbody>
                        </table>
                      </div>
                    </Show>
                    <Show when={activeTab() === 'features'}>
                      <div class="tab-pane fade-in">
                        <ul class="features-list">
                          <For each={selectedProduct().features}>
                            {(feature) => <li>{feature}</li>}
                          </For>
                        </ul>
                      </div>
                    </Show>
                  </div>
                </div>

                <div class="detail-actions">
                  <a href={selectedProduct().brochureUrl} class="btn btn-ghost w-full mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    {props.t('productDownloadBrochure')}
                  </a>
                  <button
                    class="btn btn-primary w-full"
                    onClick={() => {
                      const msgText = `${props.lang() === 'ar' ? 'أرغب في الاستفسار عن المنتج: ' : 'I would like to inquire about: '} ${selectedProduct().name}`;
                      props.setPrefilledMessage(msgText);
                      window.location.hash = '#contact-page';
                    }}
                  >
                    {props.t('productContactCTA')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Show>
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

      {/* Mission Section */}
      <section class="section our-msg" id="mission">
        <div class="container">
          <div class="coe-row">
            <div class="coe-content-col mission-content">
              <div class="msg-content-box">
                <span class="coe-label">{props.t('missionTitle')}</span>
                <p class="coe-text">{props.t('missionP1')}</p>
              </div>
            </div>
            <div class="coe-icon-col mission-icon">
              <div class="msg-img-box">
                {/* Paper plane / send icon */}
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section class="section about-vision" id="vision">
        <div class="container">
          <div class="coe-row">
            <div class="coe-icon-col vision-icon">
              <div class="vision-img-box">
                {/* Eye / vision icon */}
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
            </div>
            <div class="coe-content-col vision-content">
              <div class="vision-content-box">
                <span class="coe-label">{props.t('visionTitle')}</span>
                <p class="coe-text">{props.t('visionP1')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - 3 column cards grid */}
      <section class="section coe-values" id="values">
        <div class="container">
          <h2 class="coe-values-title">{props.t('valuesTitle')}</h2>
          <div class="coe-values-grid">

            <div class="coe-value-card coe-val-1">
              <div class="coe-value-icon-box">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div class="coe-value-content">
                <h4>{props.t('valueQualityTitle')}</h4>
                <p>{props.t('valueQualityDesc')}</p>
              </div>
            </div>

            <div class="coe-value-card coe-val-2">
              <div class="coe-value-icon-box">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18h6"></path>
                  <path d="M10 22h4"></path>
                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                </svg>
              </div>
              <div class="coe-value-content">
                <h4>{props.t('valueInnovationTitle')}</h4>
                <p>{props.t('valueInnovationDesc')}</p>
              </div>
            </div>

            <div class="coe-value-card coe-val-3">
              <div class="coe-value-icon-box">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3v18"></path>
                  <path d="M18 7l-6-4-6 4"></path>
                  <path d="M5 10l-3 7h6l-3-7"></path>
                  <path d="M19 10l-3 7h6l-3-7"></path>
                </svg>
              </div>
              <div class="coe-value-content">
                <h4>{props.t('valueIntegrityTitle')}</h4>
                <p>{props.t('valueIntegrityDesc')}</p>
              </div>
            </div>

            <div class="coe-value-card coe-val-4">
              <div class="coe-value-icon-box">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="coe-value-content">
                <h4>{props.t('valueTeamworkTitle')}</h4>
                <p>{props.t('valueTeamworkDesc')}</p>
              </div>
            </div>

            <div class="coe-value-card coe-val-5">
              <div class="coe-value-icon-box">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div class="coe-value-content">
                <h4>{props.t('valueServiceTitle')}</h4>
                <p>{props.t('valueServiceDesc')}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Contact t={props.t} />
    </>
  )
}

function ProductsPage(props) {
  return (
    <>
      <Products t={props.t} setRoute={props.setRoute} setPrefilledMessage={props.setPrefilledMessage} lang={props.lang} />
      <Contact t={props.t} />
    </>
  )
}

function ContactPage(props) {
  let messageRef;

  createEffect(() => {
    if (props.prefilledMessage() && messageRef) {
      messageRef.value = props.prefilledMessage();
      // Scroll to form?
      document.querySelector('.contact-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

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
                      <textarea
                        id="contact-message"
                        ref={messageRef}
                        placeholder={props.t('contactMessage')}
                        rows="4"
                        required
                        onInput={(e) => props.setPrefilledMessage(e.target.value)}
                      ></textarea>
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
                { title: props.t('contactPhone'), value: props.t('contactPhoneValue'), href: 'tel:+966552527862', note: props.t('contactPhoneNote'), isLtr: true },
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
  const images = [
    'd263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg',
    '45a473c7-debf-48cc-9a41-b9d61c38a0f1.jpg',
    '0c672357-323e-4792-8605-0e4f67c43db9.jpg',
    'ba862794-b872-49ac-be68-d173678fcbed.jpg',
    'b67d7fb0-5715-490d-8482-2d8252ea7ad3.jpg'
  ]
  const [current, setCurrent] = createSignal(0)

  createEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length)
    }, 3000)
    onCleanup(() => clearInterval(timer))
  })

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
            <img
              class="about-event-img rounded-card"
              src={`${baseUrl}static/img/${images[current()]}`}
              alt="G-Care Event"
              style={{ transition: 'opacity 0.5s ease-in-out' }}
            />
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
    { src: `${baseUrl}static/img/d263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg`, title: props.t('galleryItem1Title'), alt: 'MedGo Conference' },
    { src: `${baseUrl}static/img/45a473c7-debf-48cc-9a41-b9d61c38a0f1.jpg`, title: props.t('galleryItem2Title'), alt: 'Medical Tech Workshop' },
    { src: `${baseUrl}static/img/9c4be885-1bf0-4a93-ba83-9cafe6e79c91-591x456.jpg`, title: props.t('galleryItem3Title'), alt: 'Medical Delegation Visit' },
    { src: `${baseUrl}static/img/0c672357-323e-4792-8605-0e4f67c43db9.jpg`, title: props.t('galleryItem4Title'), alt: 'Global Health Exhibition' },
    { src: `${baseUrl}static/img/ba862794-b872-49ac-be68-d173678fcbed.jpg`, title: props.t('galleryItem5Title'), alt: 'Strategic Partnership' },
    { src: `${baseUrl}static/img/b67d7fb0-5715-490d-8482-2d8252ea7ad3.jpg`, title: props.t('galleryItem6Title'), alt: 'Medical Training Session' }
  ]

  const [currentIndex, setCurrentIndex] = createSignal(0)
  const [isHovered, setIsHovered] = createSignal(false)

  // Auto-play switch
  createEffect(() => {
    if (isHovered()) return
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    onCleanup(() => clearInterval(timer))
  })

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <section
      class="section education-gallery-section"
      id="media-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div class="container gallery-container">
        <div class="gallery-header text-center">
          <h2 class="gallery-main-title">{props.t('educationGalleryTitle')}</h2>
          <p class="gallery-subtitle">{props.t('eduGallerySubtitle')}</p>
        </div>

        <div class="gallery-slider-wrapper">
          <button class="gallery-nav-btn prev" onClick={prevSlide} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
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
                  <div class="slide-content-wrapper">
                    <img src={image.src} alt={image.alt} class="gallery-slide-img" />
                    <div class="slide-caption">
                      <h3>{image.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button class="gallery-nav-btn next" onClick={nextSlide} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
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

function LakiPage(props) {
  const baseUrl = import.meta.env.BASE_URL
  const [selectedImg, setSelectedImg] = createSignal(null)

  const contentSeries = [
    {
      id: 1,
      title: props.t('lakiSeries1Title'),
      subtitle: props.t('lakiSeries1Sub'),
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "#6b7280"
    },
    {
      id: 2,
      title: props.t('lakiSeries2Title'),
      subtitle: props.t('lakiSeries2Sub'),
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
      ),
      color: "#1093a5"
    },
    {
      id: 3,
      title: props.t('lakiSeries3Title'),
      subtitle: props.t('lakiSeries3Sub'),
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /><path d="M12 14v6" /><path d="M12 14L8 10" /><path d="M12 14l4-4" />
        </svg>
      ),
      color: "#f97316"
    }
  ]

  const latestAdditions = [
    { id: 1, title: props.t('lakiLatest1'), img: `${baseUrl}static/img/0c672357-323e-4792-8605-0e4f67c43db9.jpg` },
    { id: 2, title: props.t('lakiLatest2'), img: `${baseUrl}static/img/45a473c7-debf-48cc-9a41-b9d61c38a0f1.jpg` },
    { id: 3, title: props.t('lakiLatest3'), img: `${baseUrl}static/img/ba862794-b872-49ac-be68-d173678fcbed.jpg` }
  ]

  const posters = [
    { id: 1, title: props.t('lakiPoster1'), img: `${baseUrl}static/img/d263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg` },
    { id: 2, title: props.t('lakiPoster2'), img: `${baseUrl}static/img/b67d7fb0-5715-490d-8482-2d8252ea7ad3.jpg` },
    { id: 3, title: props.t('lakiPoster3'), img: `${baseUrl}static/img/9c4be885-1bf0-4a93-ba83-9cafe6e79c91-591x456.jpg` },
    { id: 4, title: props.t('lakiPoster4'), img: `${baseUrl}static/img/0c672357-323e-4792-8605-0e4f67c43db9.jpg` },
    { id: 5, title: props.t('lakiPoster5'), img: `${baseUrl}static/img/45a473c7-debf-48cc-9a41-b9d61c38a0f1.jpg` }
  ]

  return (
    <div class="laki-page-content">
      <section class="laki-hero">
        <div class="laki-hero-inner container">
          <div class="laki-hero-text">
            <div class="laki-logo-row">
              <img src={`${baseUrl}static/img/G%20-%20Care-01.svg`} alt="Laki Logo" class="laki-hero-logo" />
              <div class="laki-hero-badge">{props.t('lakiBadge')}</div>
            </div>
            <h1 class="laki-hero-title">{props.t('lakiHeroTitle')}</h1>
            <p class="laki-hero-subtitle">
              {props.t('lakiHeroSubtitle')}
            </p>
            <button class="back-link-v2" onClick={() => props.setEduRoute('main')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
              {props.t('lakiBreadcrumbHome')} {'>'} {props.t('lakiBreadcrumbEdu')} {'>'} {props.t('lakiBreadcrumbCurrent')}
            </button>
          </div>
          <div class="laki-hero-image">
            <img src={`${baseUrl}static/img/d263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg`} alt="Women Health" />
          </div>
        </div>
      </section>

      <section class="section laki-series">
        <div class="container">
          <div class="laki-section-layout">
            <div class="laki-section-intro">
              <h2 class="laki-section-title">{props.t('lakiContentSeriesTitle')}</h2>
              <p class="laki-section-subtitle">{props.t('lakiLearnMore')}</p>
              <button class="btn btn-primary laki-explore-btn">{props.t('lakiLearnMoreAction')}</button>
            </div>
            <div class="laki-series-grid">
              {contentSeries.map(item => (
                <div class="laki-series-card" style={{ "--card-color": item.color }}>
                  <div class="laki-series-icon">
                    {item.icon}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="section laki-latest">
        <div class="container">
          <h2 class="laki-section-title text-center mb-4">{props.t('lakiLatestAdditions')}</h2>
          <div class="laki-latest-grid">
            {latestAdditions.map(item => (
              <div class="laki-latest-card" onClick={() => setSelectedImg(item.img)}>
                <div class="laki-latest-thumb">
                  <img src={item.img} alt="" />
                </div>
                <div class="laki-latest-info">
                  <h3>{item.title}</h3>
                  <button class="laki-link">{props.t('lakiReadMore')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section laki-posters">
        <div class="container">
          <h2 class="laki-section-title text-center mb-4">{props.t('lakiPostersTitle')}</h2>
          <div class="resource-grid">
            {posters.map(item => (
              <div class="resource-card" onClick={() => setSelectedImg(item.img)}>
                <div class="resource-thumb"><img src={item.img} alt="" /></div>
                <h3>{item.title}</h3>
              </div>
            ))}
            <div class="resource-card more-card">
              <div class="resource-thumb more-placeholder"><span>{props.t('lakiMore')}</span></div>
              <h3>{props.t('lakiExploreMore')}</h3>
            </div>
          </div>
        </div>
      </section>

      <section class="section laki-signup">
        <div class="container">
          <div class="laki-signup-card">
            <h3>{props.t('lakiSignupTitle')}</h3>
            <form class="laki-signup-form" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder={props.t('lakiSignupName')} />
              <input type="email" placeholder={props.t('lakiSignupEmail')} />
              <button type="submit" class="btn btn-primary">{props.t('lakiSignupBtn')}</button>
            </form>
          </div>
        </div>
      </section>

      {selectedImg() && (
        <div class="lightbox" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg()} alt="" />
          <button class="close-lightbox">×</button>
        </div>
      )}
    </div>
  )
}

function ExpertPage(props) {
  const baseUrl = import.meta.env.BASE_URL

  const advantages = [
    {
      title: props.t('expertWhy1Title'),
      desc: props.t('expertWhy1Desc'),
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: props.t('expertWhy2Title'),
      desc: props.t('expertWhy2Desc'),
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    },
    {
      title: props.t('expertWhy3Title'),
      desc: props.t('expertWhy3Desc'),
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
        </svg>
      )
    }
  ]

  const steps = [
    { id: 1, title: props.t('expertStep1Title'), desc: props.t('expertStep1Desc') },
    { id: 2, title: props.t('expertStep2Title'), desc: props.t('expertStep2Desc') },
    { id: 3, title: props.t('expertStep3Title'), desc: props.t('expertStep3Desc') }
  ]

  const experts = [
    { name: props.t('expertDocName'), role: props.t('expertDocRole'), img: `${baseUrl}static/img/image.png` },
    { name: props.t('expertDocName'), role: props.t('expertDocRole'), img: `${baseUrl}static/img/image.png` },
    { name: props.t('expertDocName'), role: props.t('expertDocRole'), img: `${baseUrl}static/img/image.png` }
  ]

  return (
    <div class="expert-page-content">
      <section class="expert-hero">
        <div class="expert-hero-inner container">
          <div class="expert-hero-text">
            <button class="back-link-v2" onClick={() => props.setEduRoute('main')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
              {props.t('lakiBreadcrumbHome')} {'>'} {props.t('lakiBreadcrumbEdu')} {'>'} {props.t('expertHeroTitle')}
            </button>
            <h1 class="expert-hero-title">{props.t('expertHeroTitle')}</h1>
            <p class="expert-hero-subtitle">
              {props.t('expertHeroSubtitle')}
            </p>
            <a href="https://wa.me/966552527862" class="btn btn-primary expert-cta-btn">{props.t('expertJoinAction')}</a>
          </div>
          <div class="expert-hero-image">
            <img src={`${baseUrl}static/img/0c672357-323e-4792-8605-0e4f67c43db9.jpg`} alt="Medical Expert" />
          </div>
        </div>
      </section>

      <section class="section expert-why">
        <div class="container">
          <h2 class="expert-section-header">{props.t('expertWhyTitle')}</h2>
          <div class="expert-why-grid">
            {advantages.map(adv => (
              <div class="expert-why-card">
                <div class="expert-why-icon">{adv.icon}</div>
                <h3>{adv.title}</h3>
                <p>{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section expert-how">
        <div class="container">
          <h2 class="expert-section-header">{props.t('expertHowTitle')}</h2>
          <div class="expert-how-steps">
            {steps.map(step => (
              <div class="expert-step-card">
                <div class="expert-step-num">{step.id}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section expert-team">
        <div class="container">
          <h2 class="expert-section-header">{props.t('expertTeamTitle')}</h2>
          <div class="expert-team-grid">
            {experts.map(doc => (
              <div class="expert-doc-card">
                <div class="doc-img-box">
                  <img src={doc.img} alt={doc.name} />
                </div>
                <h3>{doc.name}</h3>
                <p>{doc.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section expert-footer-signup">
        <div class="container">
          <div class="laki-signup-card">
            <h3>{props.t('expertSignupTitle')}</h3>
            <p class="mb-4">{props.t('expertSignupSub')}</p>
            <form class="laki-signup-form" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder={props.t('expertSignupName')} />
              <input type="email" placeholder={props.t('expertSignupEmail')} />
              <button type="submit" class="btn btn-primary">{props.t('expertSignupBtn')}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

function EducationPage(props) {
  const [eduRoute, setEduRoute] = createSignal('main')

  return (
    <>
      <div class="education-page-wrapper">
        {eduRoute() === 'main' && (
          <section class="section education-page" id="education-page">
            <div class="container">
              <div class="section-head text-center">
                <h2 class="section-title">{props.t('educationTitle')}</h2>
                <p class="hero-subtitle-large">{props.t('educationSubtitle')}</p>
              </div>

              <div class="education-intro-block">
                <p>{props.t('educationBody')}</p>
              </div>

              <div class="education-programs-grid">
                <div class="program-card laki-card">
                  <div class="program-content">
                    <h3>{props.t('educationTopic2Title')}</h3>
                    <p>{props.t('educationTopic2Body')}</p>
                    <button class="btn btn-primary" onClick={() => setEduRoute('laki')}>
                      {props.t('eduLakiExploreBtn')}
                    </button>
                  </div>
                </div>

                <div class="program-card expert-card">
                  <div class="program-content">
                    <h3>{props.t('educationTopic1Title')}</h3>
                    <p>{props.t('educationTopic1Body')}</p>
                    <button class="btn btn-brand-alt" onClick={() => setEduRoute('expert')}>
                      {props.t('eduExpertJoinBtn')}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}
        {eduRoute() === 'laki' && <LakiPage t={props.t} setEduRoute={setEduRoute} />}
        {eduRoute() === 'expert' && <ExpertPage t={props.t} setEduRoute={setEduRoute} />}
      </div>
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
            <a href="tel:+966552527862" class="info-value phone-number">+966 55 252 7862</a>
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
  const [prefilledMessage, setPrefilledMessage] = createSignal('')

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
      {route() === 'products' ? <ProductsPage t={t} setRoute={setRoute} setPrefilledMessage={setPrefilledMessage} lang={lang} /> : null}
      {route() === 'contact' ? <ContactPage t={t} prefilledMessage={prefilledMessage} setPrefilledMessage={setPrefilledMessage} /> : null}
      {route() === 'education' ? <EducationPage t={t} /> : null}
      {route() === 'about' ? <AboutPage t={t} /> : null}
      {route() === 'home' ? <HomePage t={t} lang={lang} /> : null}
    </div>
  )
}
