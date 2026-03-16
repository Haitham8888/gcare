import { createEffect, createSignal, onCleanup, For, Show, createMemo, createResource } from 'solid-js'
import './App.css'
import { supabase, getAssetUrl } from './supabaseClient'
import Dashboard from './Dashboard'
import LoginPage from './LoginPage'

// Shared social media helpers
const getSocialIcon = (key) => {
  const icons = {
    linkedin: 'static/img/in.svg',
    x: 'static/img/x.svg',
    whatsapp: 'static/img/whatsapp.svg',
    tiktok: 'static/img/tiktok.svg',
    instagram: 'static/img/insta.svg'
  }
  return icons[key] ? getAssetUrl(icons[key]) : null
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
        <a href={baseUrl} class="brand" aria-label={props.t('brand')}>
          <img class="brand-logo" src={getAssetUrl('static/img/G - Care-01.svg')} alt="" aria-hidden="true" />
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
          <a href={baseUrl} onClick={() => setOpen(false)}>{props.t('navHome')}</a>
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

    // Search regular pages/items
    const pages = searchableItems.filter(item => {
      const label = props.t(item.key).toLowerCase()
      return label.includes(q)
    }).map(p => ({ ...p, type: 'page', label: props.t(p.key) }))

    // Search products
    const prods = (props.products || []).filter(p => {
      const nameMatch = p.name.en.toLowerCase().includes(q)
      const catMatch = props.t(`cat${p.category}`).toLowerCase().includes(q)
      return nameMatch || catMatch
    }).map(p => ({
      label: p.name.en,
      href: '#products',
      type: 'product',
      img: p.mainImage,
      category: props.t(`cat${p.category}`),
      productData: p
    }))

    setResults([...pages, ...prods].slice(0, 8))
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
            {results().map(item => {
              const baseUrl = import.meta.env.BASE_URL
              return (
                <a href={item.href} class="search-result-item" onClick={() => {
                  setShowResults(false);
                  if (item.type === 'product' && props.setActiveProduct) {
                    props.setActiveProduct(item.productData);
                  }
                }}>
                  <div class="item-visual">
                    {item.type === 'product' ? (
                      <div class="result-thumb-mini">
                        <img
                          src={`${baseUrl}${item.img}`}
                          alt=""
                        />
                      </div>
                    ) : (
                      <div class="result-icon-mini">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div class="result-text-box">
                    <span class="result-label">{item.label}</span>
                    {item.type === 'product' && <span class="result-sub"> - {item.category}</span>}
                  </div>
                  <svg class="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </a>
              )
            })}
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
          <GlobalSearch t={props.t} setActiveProduct={props.setActiveProduct} products={props.products} />
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
  const [activeTab, setActiveTab] = createSignal('overview')
  const [mainImage, setMainImage] = createSignal('')
  const [selectedCategory, setSelectedCategory] = createSignal('All')
  const [zoomPos, setZoomPos] = createSignal({ x: 50, y: 50, active: false })
  const [searchQuery, setSearchQuery] = createSignal('')
  const [showSuggestions, setShowSuggestions] = createSignal(false)
  const baseUrl = import.meta.env.BASE_URL

  // Handle opening product from global search or internal selection
  createEffect(() => {
    const p = props.activeProduct ? props.activeProduct() : null;
    if (p) {
      setMainImage(`${baseUrl}${p.mainImage}`);
      setActiveTab('overview');
    }
  });

  const uniqueCategories = createMemo(() => ['All', ...new Set((props.products || []).map(p => p.category))])

  // Independent suggestions list for better performance
  const suggestionResults = createMemo(() => {
    const query = searchQuery().toLowerCase().trim()
    if (query.length < 1) return []
    return (props.products || []).filter(p => p.name.en.toLowerCase().includes(query)).slice(0, 6)
  })

  // Filtered productsData.products for the grid - with a slight debounce/delay if needed, 
  // but for now just decoupling it from the immediate suggestions
  const filteredProducts = createMemo(() => {
    const cat = selectedCategory()
    const query = searchQuery().toLowerCase().trim()

    return (props.products || []).filter(p => {
      const matchCat = (cat === 'All' || p.category === cat)
      const matchQuery = p.name.en.toLowerCase().includes(query)
      return matchCat && matchQuery
    })
  })

  const openProduct = (p) => {
    if (props.setActiveProduct) {
      props.setActiveProduct(p);
    }
    setMainImage(`${baseUrl}${p.mainImage}`)
    setActiveTab('overview')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProduct = () => {
    if (props.setActiveProduct) {
      props.setActiveProduct(null);
    }
  }

  return (
    <section class="section catalog-section" id="products">
      <div class="container">
        <Show when={!(props.activeProduct ? props.activeProduct() : false)}>
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

          <div class="catalog-search-wrapper">
            <div class="search-input-box">
              <svg class="unique-catalog-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder={props.t('searchPlaceholder')}
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              <Show when={searchQuery().length > 0}>
                <button class="clear-search" onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}>×</button>
              </Show>

              {/* Suggestions Dropdown */}
              <Show when={showSuggestions() && suggestionResults().length > 0}>
                <div class="search-suggestions-dropdown">
                  <For each={suggestionResults()}>
                    {(product) => (
                      <div class="suggestion-item" onClick={() => {
                        openProduct(product);
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}>
                        <div class="suggestion-thumb">
                          <img src={`${baseUrl}${product.mainImage}`} alt="" />
                        </div>
                        <div class="suggestion-info">
                          <div class="suggestion-name">{product.name.en}</div>
                          <div class="suggestion-cat">{props.t(`cat${product.category}`)}</div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>

          <div class="catalog-grid">
            <For each={filteredProducts()}>
              {(product) => (
                <div class="catalog-card">
                  <div class="catalog-card-img">
                    <img src={`${baseUrl}${product.mainImage}`} alt={product.name.en} loading="lazy" />
                    <div class="catalog-card-overlay">
                      <button class="btn btn-brand-alt" onClick={() => openProduct(product)}>
                        {props.t('productViewDetails')}
                      </button>
                    </div>
                  </div>
                  <div class="catalog-card-info">
                    <span class="catalog-card-cat">{props.t(`cat${product.category}`)}</span>
                    <h3 class="catalog-card-title">{product.name.en}</h3>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={props.activeProduct ? props.activeProduct() : false}>
          <div class="product-detail-page">
            <button class="back-link-v2 mb-8" onClick={closeProduct}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
              {props.t('productBackToList')}
            </button>

            <div class="product-detail-layout">
              <div class="product-visuals">
                <div
                  class="product-main-stage"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setZoomPos({ x, y, active: true });
                  }}
                  onMouseLeave={() => setZoomPos({ x: 50, y: 50, active: false })}
                >
                  <div class="stage-inner">
                    <img
                      src={mainImage()}
                      alt={props.activeProduct().name.en}
                      style={{
                        transform: zoomPos().active ? `scale(2.5)` : `scale(1)`,
                        "transform-origin": `${zoomPos().x}% ${zoomPos().y}%`,
                        display: 'block'
                      }}
                    />
                  </div>
                </div>
                <div class="product-thumbs">
                  <For each={props.activeProduct().images}>
                    {(img) => (
                      <div
                        class={`thumb-box ${mainImage() === `${baseUrl}${img}` ? 'active' : ''}`}
                        onClick={() => setMainImage(`${baseUrl}${img}`)}
                      >
                        <img
                          src={`${baseUrl}${img}`}
                          alt="Thumbnail"
                        />
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <div class="product-info-panel">
                <span class="detail-badge">{props.t(`cat${props.activeProduct().category}`)}</span>
                <h1 class="detail-title">{props.activeProduct().name.en}</h1>

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
                        <p>{props.activeProduct().overview[props.lang()]}</p>
                      </div>
                    </Show>
                    <Show when={activeTab() === 'specs'}>
                      <div class="tab-pane fade-in">
                        <table class="specs-table">
                          <tbody>
                            <For each={props.activeProduct().specifications}>
                              {(spec) => (
                                <tr>
                                  <td>{spec.label[props.lang()]}</td>
                                  <td>{spec.value[props.lang()]}</td>
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
                          <For each={props.activeProduct().features[props.lang()]}>
                            {(feature) => <li>{feature}</li>}
                          </For>
                        </ul>
                      </div>
                    </Show>
                  </div>
                </div>

                <div class="detail-actions">
                  <a href={props.activeProduct().brochureUrl} class="btn btn-ghost w-full mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    {props.t('productDownloadBrochure')}
                  </a>
                  <button
                    class="btn btn-primary w-full"
                    onClick={() => {
                      const msgText = `${props.lang() === 'ar' ? 'أرغب في الاستفسار عن المنتج: ' : 'I would like to inquire about: '} ${props.activeProduct().name.en}`;
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
      </div >
    </section >
  )
}

function SectionDivider() {
  return <div class="section-divider" aria-hidden="true"></div>
}

function HomePage(props) {
  return (
    <>
      <Hero t={props.t} setActiveProduct={props.setActiveProduct} products={props.products} />
      <SectionDivider />
      <HomeAbout t={props.t} />
      <SectionDivider />
      <ClientsSlider t={props.t} lang={props.lang} />
      <SectionDivider />
      <Visitors t={props.t} />
      <SectionDivider />
      <Education t={props.t} lang={props.lang} />
      <SectionDivider />
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
      <Products t={props.t} setRoute={props.setRoute} setPrefilledMessage={props.setPrefilledMessage} lang={props.lang} activeProduct={props.activeProduct} setActiveProduct={props.setActiveProduct} />
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

              <div class="contact-form-side" style={{ display: 'flex', "flex-direction": 'column', height: '100%' }}>
                <a
                  href="https://www.google.com/maps/place/24%C2%B041'13.2%22N+46%C2%B041'12.1%22E/@24.686993,46.686684,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="map-wrapper"
                  style={{ flex: '1', "min-height": '400px', height: '100%', display: 'block', "text-decoration": 'none', cursor: 'pointer' }}
                  aria-label="Open G-Care location in Google Maps"
                >
                  <iframe
                    title="G-Care Location"
                    src="https://maps.google.com/maps?q=24.6869930,46.6866840&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, "border-radius": "20px", "pointer-events": 'none' }}
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </a>
              </div>
            </div>



            <div class="contact-info-grid">
              {[
                { title: props.t('contactPhone'), value: props.t('contactPhoneValue'), href: 'tel:+966552527862', note: props.t('contactPhoneNote'), isLtr: true },
                { title: props.t('contactEmailLabel'), value: 'info@gcare.sa', href: 'mailto:info@gcare.sa', note: props.t('contactEmailNote'), isLtr: true },
                { title: props.t('contactEmailHealthLabel'), value: 'hep@gcare.sa', href: 'mailto:hep@gcare.sa', note: props.t('contactEmailHealthNote'), isLtr: true },
                { title: props.t('contactAddress'), value: props.t('contactAddressValue'), href: 'https://www.google.com/maps/place/24%C2%B041\'13.2%22N+46%C2%B041\'12.1%22E/@24.686993,46.686684,17z', note: props.t('contactVisitNote'), isLtr: false }
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
            <h2 class="section-title" style={{ "margin-bottom": "2.5rem" }}>{props.t('aboutTitle')}</h2>
            <div class="about-content">
              <p style={{ fontSize: '1.25rem', color: 'var(--muted)', lineHeight: '1.8', "margin-top": "1rem" }}>{props.t('aboutP1')}</p>
              <a href="#about-page" class="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                {props.t('heroCtaSecondary')}
              </a>
            </div>
          </div>
          <div class="about-logo-v2">
            <img class="about-event-img" src={getAssetUrl('static/img/G - Care-01.svg')} alt="G-Care Logo" style={{ maxWidth: '280px', borderRadius: '0', boxShadow: 'none' }} />
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
              <ul class="about-bullets">
                <li>{props.t('aboutP1')}</li>
                <li>{props.t('aboutP2')}</li>
                <li>{props.t('aboutP3')}</li>
                <li>{props.t('aboutP4')}</li>
              </ul>
            </div>
          </div>
          <div class="about-logo-v2">
            <img
              class="about-event-img rounded-card"
              src={getAssetUrl(`static/img/${images[current()]}`)}
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
    getAssetUrl('static/img/partners/dallahrevampedLogo.svg'),
    getAssetUrl('static/img/partners/dkt.png'),
    getAssetUrl('static/img/partners/euro.png'),
    getAssetUrl('static/img/partners/Fakkeh.webp'),
    getAssetUrl('static/img/partners/logo_valmed_alt.svg'),
    getAssetUrl('static/img/partners/PCD.png'),
    getAssetUrl('static/img/partners/pregnalogo.png'),
    getAssetUrl('static/img/partners/saudi_german.svg'),
    getAssetUrl('static/img/partners/sulaiman.svg')
  ]

  return (
    <section class="section clients-section" aria-label={props.t('clientsAria')}>
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">{props.t('clientsTitle')}</h2>
        </div>
        <div class="clients-slider">
          <div class="clients-track" classList={{
            'en': (props.lang ? props.lang() === 'en' : document.documentElement.dir === 'ltr'),
            'ar': (props.lang ? props.lang() === 'ar' : document.documentElement.dir === 'rtl')
          }}>
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
    { src: getAssetUrl('static/img/d263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg'), title: props.t('galleryItem1Title'), alt: 'MedGo Conference' },
    { src: getAssetUrl('static/img/45a473c7-debf-48cc-9a41-b9d61c38a0f1.jpg'), title: props.t('galleryItem2Title'), alt: 'Medical Tech Workshop' },
    { src: getAssetUrl('static/img/9c4be885-1bf0-4a93-ba83-9cafe6e79c91-591x456.jpg'), title: props.t('galleryItem3Title'), alt: 'Medical Delegation Visit' },
    { src: getAssetUrl('static/img/0c672357-323e-4792-8605-0e4f67c43db9.jpg'), title: props.t('galleryItem4Title'), alt: 'Global Health Exhibition' },
    { src: getAssetUrl('static/img/ba862794-b872-49ac-be68-d173678fcbed.jpg'), title: props.t('galleryItem5Title'), alt: 'Strategic Partnership' },
    { src: getAssetUrl('static/img/b67d7fb0-5715-490d-8482-2d8252ea7ad3.jpg'), title: props.t('galleryItem6Title'), alt: 'Medical Training Session' }
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

  const contentSeries = createMemo(() => (props.education?.articles || []).map(item => ({
    ...item,
    title: props.t(item.title_key),
    category: props.t(item.category_key),
    excerpt: props.t(item.excerpt_key),
    img: `${baseUrl}${item.img}`
  })))

  const latestAdditions = createMemo(() => (props.education?.posters || []).map(item => ({
    ...item,
    title: props.t(item.title_key),
    img: getAssetUrl(item.img)
  })))

  const posters = [
    { id: 1, title: props.t('lakiPoster1'), img: getAssetUrl('static/img/d263efc0-0a5b-4029-aa7d-a12a399dfd5e.jpg') },
    { id: 2, title: props.t('lakiPoster2'), img: getAssetUrl('static/img/b67d7fb0-5715-490d-8482-2d8252ea7ad3.jpg') },
    { id: 3, title: props.t('lakiPoster3'), img: getAssetUrl('static/img/9c4be885-1bf0-4a93-ba83-9cafe6e79c91-591x456.jpg') }
  ]

  return (
    <div class="laki-page-content">
      <section class="laki-hero">
        <div class="laki-hero-inner container">
          <div class="laki-hero-text">
            <div class="laki-logo-row">
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
            <img src={getAssetUrl('static/img/ HealthEducation/health_edu_1.png')} alt="Women Health" />
          </div>
        </div>
      </section>

      <section class="section laki-articles-section">
        <div class="container">
          <div class="articles-header">
            <div class="articles-title-block">
              <h2 class="laki-section-title large">{props.t('lakiContentSeriesTitle')}</h2>
            </div>
          </div>

          <div class="articles-slider-container">
            <div class="laki-articles-grid">
              {contentSeries().map(item => (
                <div class="article-modern-card" onClick={() => setSelectedImg(item.img)}>
                  <div class="article-card-media">
                    <img src={item.img} alt="" />
                    <div class="article-media-overlay">
                      <h4>{item.title}</h4>
                    </div>
                  </div>
                  <div class="article-card-body">
                    <h3 class="article-cat">{item.category}</h3>
                    <p class="article-ex">{item.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>

            <button class="article-nav-arrow next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          <div class="laki-articles-footer">
            <button class="btn btn-pink laki-explore-btn-lower">{props.t('lakiLearnMoreAction')}</button>
          </div>
        </div>
      </section>

      <section class="section laki-guides-v2">
        <div class="container">
          <div class="guides-premium-layout">
            <div class="guides-info-col">
              <h2 class="laki-section-title">{props.t('lakiLatestAdditions')}</h2>
              <p class="laki-section-subtitle-v2">{props.t('lakiGuidesDesc')}</p>
              <button class="btn btn-pink laki-explore-btn mt-6">{props.t('lakiBrowseGuides')}</button>
            </div>

            <div class="guides-gallery-col">
              <div class="guides-slider-wrapper-v2">
                <button class="guide-nav-btn prev">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6" /></svg>
                </button>

                <div class="guides-portrait-grid">
                  {latestAdditions().map(item => (
                    <div class="port-guide-card" onClick={() => setSelectedImg(item.img)}>
                      <div class="port-guide-visual">
                        <img src={item.img} alt="" />
                        <div class="port-guide-overlay"></div>
                      </div>
                      <div class="port-guide-footer">
                        <span class="port-read-more">{props.t('lakiReadMore')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button class="guide-nav-btn next">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
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
  const [stepIndex, setStepIndex] = createSignal(0)

  const advantages = createMemo(() => [
    {
      title: props.t('expertWhy1Title'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      title: props.t('expertWhy2Title'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      title: props.t('expertWhy3Title'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      title: props.t('expertWhy4Title'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: props.t('expertWhy5Title'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    },
    {
      title: props.t('expertWhy6Title'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }
  ])

  const steps = createMemo(() => [
    { id: 1, title: props.t('expertStep1Title'), desc: props.t('expertStep1Desc') },
    { id: 2, title: props.t('expertStep2Title'), desc: props.t('expertStep2Desc') },
    { id: 3, title: props.t('expertStep3Title'), desc: props.t('expertStep3Desc') },
    { id: 4, title: props.t('expertStep4Title'), desc: props.t('expertStep4Desc') },
    { id: 5, title: props.t('expertStep5Title'), desc: props.t('expertStep5Desc') },
    { id: 6, title: props.t('expertStep6Title'), desc: props.t('expertStep6Desc') }
  ])

  const experts = createMemo(() => (props.experts || []).map(doc => ({
    name: props.lang() === 'ar' ? doc.name_ar : doc.name_en,
    role: props.lang() === 'ar' ? doc.role_ar : doc.role_en,
    img: `${baseUrl}${doc.img}`
  })))

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
            <img src={getAssetUrl('static/img/HealthEducation/health_edu_2.png')} alt="Medical Expert" />
          </div>
        </div>
      </section>

      <section class="section expert-why">
        <div class="container">
          <h2 class="expert-section-header">{props.t('expertWhyTitle')}</h2>
          <p class="expert-section-subheader">{props.t('expertWhySub')}</p>
          <div class="expert-why-list">
            {advantages().map(adv => (
              <div class="expert-why-item">
                <div class="expert-check-box">
                  {adv.icon}
                </div>
                <h3>{adv.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section expert-how">
        <div class="container">
          <h2 class="expert-section-header">{props.t('expertHowTitle')}</h2>

          <div class="expert-how-slider">
            <div class="expert-slider-container">
              <button class="expert-nav-btn prev" onClick={() => setStepIndex((prev) => (prev - 1 + steps().length) % steps().length)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6" /></svg>
              </button>

              <div class="expert-step-display">
                <For each={steps()}>
                  {(step, index) => (
                    <div class={`expert-step-slide ${stepIndex() === index() ? 'active' : ''}`}>
                      <div class="expert-step-number-heavy">{step.id}</div>
                      <div class="expert-step-info-large">
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              <button class="expert-nav-btn next" onClick={() => setStepIndex((prev) => (prev + 1) % steps().length)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            <div class="expert-dots">
              {steps().map((_, i) => (
                <button
                  class={`expert-dot ${stepIndex() === i ? 'active' : ''}`}
                  onClick={() => setStepIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="section expert-team">
        <div class="container">
          <h2 class="expert-section-header">{props.t('expertTeamTitle')}</h2>
          <div class="expert-team-grid">
            {experts().map(doc => (
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
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <div class="education-page-wrapper">
        {eduRoute() === 'main' && (
          <section class="section education-page" id="education-page">
            <div class="container">
              <div class="section-head edu-header-inline">
                <img src={getAssetUrl('static/img/HealthEducation/health_edu_5.png')} alt="Laki Wa Biwai Logo" class="edu-logo-inline" />
                <h2 class="edu-tagline-text">{props.t('educationSubtitle')}</h2>
              </div>

              <div class="education-intro-block">
                <p>{props.t('educationBody')}</p>
              </div>

              <div class="education-programs-grid">
                <div class="program-card laki-card">
                  <div class="program-card-overlay"></div>
                  <div class="program-content">
                    <h3>{props.t('educationTopic2Title')}</h3>
                    <p>{props.t('educationTopic2Body')}</p>
                    <button class="btn btn-pink" onClick={() => setEduRoute('laki')}>
                      {props.t('eduLakiExploreBtn')}
                    </button>
                  </div>
                </div>

                <div class="program-card expert-card">
                  <div class="program-card-overlay"></div>
                  <div class="program-content">
                    <h3>{props.t('educationTopic1Title')}</h3>
                    <p>{props.t('educationTopic1Body')}</p>
                    <button class="btn btn-brand-alt" onClick={() => setEduRoute('expert')}>
                      {props.t('eduExpertJoinBtn')}
                    </button>
                  </div>
                </div>

              </div>

              <div class="education-footer-booking mt-12">
                <div class="edu-booking-premium-row">
                  <div class="booking-premium-card">
                    <div class="booking-card-body">
                      <h3 class="booking-card-title">{props.t('contactAppointmentTitle')}</h3>
                      <p class="booking-card-desc">{props.t('contactAppointmentSub')}</p>
                      <a class="btn btn-booking-main" href="https://outlook.office.com/book/Bookings@gcare.sa/?ismsaljsauthenabled=true" target="_blank" rel="noopener noreferrer">
                        {props.t('contactAppointmentBtn')}
                      </a>
                    </div>
                  </div>

                  <div class="edu-contacts-premium-card">
                    <div class="edu-contact-card-body">
                      <h4 class="edu-contact-card-title">{props.t('eduContactTitle')}</h4>
                      <div class="edu-contact-methods-v2">
                        <a href="https://wa.me/966555849237" target="_blank" rel="noopener noreferrer" class="wa-premium-action">
                          <img src={getAssetUrl('static/img/whatsapp.svg')} alt="" class="wa-mid-icon" />
                          <span class="wa-number-mid" dir="ltr">0555849237</span>
                        </a>
                        <div class="edu-email-box">
                          <span class="email-label">{props.t('eduEmailLabel')}</span>
                          <a href="mailto:hep@gcare.sa" class="email-link-v2">hep@gcare.sa</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {eduRoute() === 'laki' && <LakiPage t={props.t} setEduRoute={setEduRoute} education={props.education} />}
        {eduRoute() === 'expert' && <ExpertPage t={props.t} setEduRoute={setEduRoute} experts={props.experts} lang={props.lang} />}
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

      <div class="footer-watermark">
        <img src={getAssetUrl('static/img/G - Care-50.svg')} alt="" aria-hidden="true" />
      </div>

      <div class="container foot-main">
        {/* Right Col: About & Brand */}
        <div class="foot-col foot-brand-col">
          <div class="footer-brand-logo">
            <img src={getAssetUrl('static/img/whitelogo.svg')} alt="G-Care Logo" aria-hidden="true" />
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
          <a href="https://www.google.com/maps/place/24%C2%B041\'13.2%22N+46%C2%B041\'12.1%22E/@24.686993,46.686684,17z" target="_blank" rel="noopener noreferrer" class="info-group" style={{ "text-decoration": 'none' }}>
            <div class="info-label-row">
              <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span class="info-label">{props.t('contactAddress')}</span>
            </div>
            <address class="info-value-text">{props.t('footerAddress')}</address>
          </a>

          <div class="info-group">
            <div class="info-label-row">
              <svg class="info-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span class="info-label">{props.t('footerPhoneTitle')}</span>
            </div>
            <a href="tel:+966552527862" class="info-value phone-number">{props.t('contactPhoneValue')}</a>
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
  const [activeProduct, setActiveProduct] = createSignal(null)
  const [session, setSession] = createSignal(null)
  const isLoggedIn = () => !!session()

  const [products] = createResource(async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Supabase fetch error:', error);
        return [];
      }
      const mapped = data?.map(p => ({
        ...p,
        name: { ar: p.name_ar, en: p.name_en },
        mainImage: p.main_image,
        images: p.images || [],
        overview: { ar: p.overview_ar, en: p.overview_en }
      })) || [];
      console.log('Fetched products:', mapped.length);
      if (mapped.length === 0) {
          // Diagnostic alert for the user to help me debug
          // window.alert('Products fetched: 0. Check console for fetch logs.');
      }
      return mapped;
    } catch (e) {
      console.error('Fetch exception:', e);
      return [];
    }
  });

  const [experts] = createResource(async () => {
    try {
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) return [];
      const mapped = data?.map(d => ({
        ...d,
        name: { ar: d.name_ar, en: d.name_en },
        role: { ar: d.role_ar, en: d.role_en },
        image: d.img
      })) || [];
      console.log('Fetched experts:', mapped.length);
      return mapped;
    } catch (e) {
      console.error('Experts fetch exception:', e);
      return [];
    }
  });

  const [profiles] = createResource(async () => {
    const { data } = await supabase.from('profiles').select('*');
    return data || [];
  });

  const [education] = createResource(async () => {
    const { data: articles } = await supabase.from('articles').select('*');
    const { data: posters } = await supabase.from('posters').select('*');
    return { articles: articles || [], posters: posters || [] };
  });

  const translations = translationsData

  const t = (key) => translations[lang()]?.[key] ?? key

  createEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    onCleanup(() => subscription.unsubscribe())
  })

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
    if (hash === '#dashboard') return 'dashboard'
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
      {route() !== 'dashboard' && <NavBar t={t} lang={lang} setLang={setLang} />}
      {route() === 'products' ? <ProductsPage t={t} setRoute={setRoute} setPrefilledMessage={setPrefilledMessage} lang={lang} activeProduct={activeProduct} setActiveProduct={setActiveProduct} products={products()} /> : null}
      {route() === 'contact' ? <ContactPage t={t} prefilledMessage={prefilledMessage} setPrefilledMessage={setPrefilledMessage} /> : null}
      {route() === 'education' ? <EducationPage t={t} education={education()} experts={experts()} lang={lang} /> : null}
      {route() === 'about' ? <AboutPage t={t} /> : null}
      {route() === 'dashboard' ? (
        <Show when={isLoggedIn()} fallback={<LoginPage t={t} lang={lang} />}>
          <Dashboard t={t} setRoute={setRoute} lang={lang} setLang={setLang} products={products()} experts={experts()} profiles={profiles()} />
        </Show>
      ) : null}
      {route() === 'home' ? <HomePage t={t} lang={lang} setActiveProduct={setActiveProduct} products={products()} education={education()} /> : null}
    </div>
  )
}
