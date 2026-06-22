function HomeAbout(props) {
    const baseUrl = import.meta.env.BASE_URL
    return (
        <section class="section" id="home-about">
            <div class="container">
                <div class="about-layout" style={{ alignItems: 'center' }}>
                    <div class="about-text">
                        <h2 class="section-title">{props.t('aboutTitle')}</h2>
                        <div class="about-content">
                            <p style={{ fontSize: '1.1rem', color: 'var(--muted)' }}>{props.t('aboutP1')}</p>
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
