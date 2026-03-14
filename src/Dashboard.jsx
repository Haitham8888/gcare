import { createSignal, createMemo, For } from 'solid-js'
import { supabase } from './supabaseClient'
import './Dashboard.css'
// Data is now passed via props from App.jsx

export default function Dashboard(props) {
    const [activeTab, setActiveTab] = createSignal('overview')

    const stats = createMemo(() => [
        { label: props.lang() === 'ar' ? 'إجمالي المنتجات' : 'Total Products', value: (props.products || []).length, icon: 'package', color: 'var(--brand)' },
        { label: props.lang() === 'ar' ? 'الخبراء' : 'Experts', value: (props.experts || []).length, icon: 'users', color: '#6366f1' },
        { label: props.lang() === 'ar' ? 'الزيارات' : 'Visitors', value: '1,247+', icon: 'activity', color: '#F67C71' },
        { label: props.lang() === 'ar' ? 'حالة النظام' : 'System Status', value: props.lang() === 'ar' ? 'ممتاز' : 'Healthy', icon: 'check-circle', color: '#10b981' }
    ])

    const Icon = (iconProps) => {
        switch (iconProps.name) {
            case 'package': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
            case 'activity': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            case 'users': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            case 'check-circle': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            case 'layout': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
            case 'file-text': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14.5 2 14.5 7 20 7" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
            case 'settings': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
            case 'github': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            case 'log-out': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            case 'external-link': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            default: return null
        }
    }

    const tabs = [
        { id: 'overview', label: props.lang() === 'ar' ? 'نظرة عامة' : 'Overview', icon: 'layout' },
        { id: 'cms', label: props.lang() === 'ar' ? 'إدارة المحتوى' : 'Manage Content', icon: 'file-text' },
        { id: 'products', label: props.lang() === 'ar' ? 'المنتجات' : 'Products', icon: 'package' }
    ]

    const cmsLinks = createMemo(() => [
        { label: props.lang() === 'ar' ? 'تعديل الترجمات والنصوص' : 'Edit Translations', collection: 'translations' },
        { label: props.lang() === 'ar' ? 'إدارة الخبراء والأطباء' : 'Manage Experts', collection: 'experts' },
        { label: props.lang() === 'ar' ? 'إدارة المنتجات' : 'Manage Products', collection: 'products' },
        { label: props.lang() === 'ar' ? 'إدارة قسم التثقيف الصحي' : 'Manage Education', collection: 'education' }
    ])

    return (
        <div class="dashboard-wrapper" dir={props.lang() === 'ar' ? 'rtl' : 'ltr'}>
            <aside class="dashboard-sidebar">
                <div class="sidebar-header">
                    <img src={`${import.meta.env.BASE_URL}static/img/G%20-%20Care-01.svg`} alt="Logo" class="sidebar-logo" />
                    <span class="sidebar-title">G-Care Deep</span>
                </div>
                <nav class="sidebar-nav">
                    <For each={tabs}>
                        {(tab) => (
                            <button
                                class={activeTab() === tab.id ? 'active' : ''}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span class="nav-icon"><Icon name={tab.icon} /></span> {tab.label}
                            </button>
                        )}
                    </For>
                </nav>
                <div class="sidebar-footer">
                    <a href="https://github.com/Haitham8888/gcare" target="_blank" class="github-dash-btn">
                        <Icon name="github" /> GitHub
                    </a>
                </div>
            </aside>

            <main class="dashboard-main">
                <header class="dashboard-topbar">
                    <h2>{tabs.find(t => t.id === activeTab())?.label}</h2>
                    <div class="user-profile">
                        <button class="lang-toggle-dash" onClick={() => props.setLang(l => l === 'ar' ? 'en' : 'ar')}>
                            {props.lang() === 'ar' ? 'EN' : 'AR'}
                        </button>
                        <span class="admin-dash-badge">{props.lang() === 'ar' ? 'مسؤول' : 'Admin'}</span>
                        <button class="logout-dash-btn" onClick={() => supabase.auth.signOut()}>
                            <Icon name="log-out" /> {props.lang() === 'ar' ? 'خروج' : 'Exit'}
                        </button>
                    </div>
                </header>

                <div class="dashboard-content">
                    {activeTab() === 'overview' && (
                        <div class="overview-section">
                            <div class="dash-stats-grid">
                                <For each={stats()}>
                                    {(stat) => (
                                        <div class="dash-stat-dash-card" style={{ '--accent': stat.color }}>
                                            <div class="dash-stat-icon-wrapper" style={{ color: stat.color }}>
                                                <Icon name={stat.icon} />
                                            </div>
                                            <div class="dash-stat-info">
                                                <span class="dash-stat-label">{stat.label}</span>
                                                <span class="dash-stat-value">{stat.value}</span>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>

                            <div class="quick-cms-grid">
                                <div class="dash-card">
                                    <h3>{props.lang() === 'ar' ? 'الوصول السريع للمحرر' : 'CMS Quick Access'}</h3>
                                    <div class="cms-links-list">
                                        <For each={cmsLinks()}>
                                            {(link) => (
                                                <a href={`https://supabase.com/dashboard/project/_/editor?table=${link.collection}`} target="_blank" rel="noopener noreferrer" class="cms-link-item">
                                                    <span>{link.label}</span>
                                                    <Icon name="external-link" />
                                                </a>
                                            )}
                                        </For>
                                    </div>
                                </div>

                                <div class="dash-card">
                                    <h3>{props.lang() === 'ar' ? 'حالة الموقع' : 'Site Health'}</h3>
                                    <div class="health-status">
                                        <div class="status-indicator online"></div>
                                        <span>{props.lang() === 'ar' ? 'الموقع يعمل بشكل ممتاز' : 'Site is live and healthy'}</span>
                                    </div>
                                    <p class="status-desc">
                                        {props.lang() === 'ar' ? 'جميع البيانات متزامنة مع GitHub.' : 'All data is synced with GitHub repository.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab() === 'cms' && (
                        <div class="cms-manager-section dash-card">
                            <div class="cms-hero">
                                <h3>{props.lang() === 'ar' ? 'نظام إدارة المحتوى (Supabase)' : 'Supabase Manager'}</h3>
                                <p>{props.lang() === 'ar' ? 'تحكم كامل في جميع أقسام الموقع من خلال واجهة واحدة.' : 'Full control over all site sections through a unified interface.'}</p>
                                <a href="https://supabase.com/dashboard/project/_/editor" target="_blank" rel="noopener noreferrer" class="dash-btn dash-dash-btn-primary dash-dash-btn-large">
                                    {props.lang() === 'ar' ? 'فتح لوحة التحكم الكاملة' : 'Open Full Supabase Panel'}
                                </a>
                            </div>
                            <div class="cms-collections-grid">
                                <div class="mini-dash-card">
                                    <h4>{props.lang() === 'ar' ? 'الترجمات' : 'Translations'}</h4>
                                    <p>{props.lang() === 'ar' ? 'تعديل النصوص الأساسية.' : 'Edit main site strings.'}</p>
                                </div>
                                <div class="mini-dash-card">
                                    <h4>{props.lang() === 'ar' ? 'الخبراء' : 'Experts'}</h4>
                                    <p>{props.lang() === 'ar' ? 'إضافة وتعديل الأطباء.' : 'Add or edit medical staff.'}</p>
                                </div>
                                <div class="mini-dash-card">
                                    <h4>{props.lang() === 'ar' ? 'التثقيف' : 'Education'}</h4>
                                    <p>{props.lang() === 'ar' ? 'المقالات والبوسترات.' : 'Articles and posters.'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab() === 'products' && (
                        <div class="products-list dash-card">
                            <div class="dash-table-header">
                                <h3>{props.lang() === 'ar' ? 'قائمة المنتجات' : 'Product List'}</h3>
                                <a href="https://supabase.com/dashboard/project/_/editor" target="_blank" rel="noopener noreferrer" class="dash-btn dash-dash-btn-secondary dash-dash-btn-sm">
                                    {props.lang() === 'ar' ? 'تعديل في قاعدة البيانات' : 'Edit in Supabase'}
                                </a>
                            </div>
                            <div class="dashboard-table-wrapper">
                                <table class="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>{props.lang() === 'ar' ? 'الصورة' : 'Image'}</th>
                                            <th>{props.lang() === 'ar' ? 'الاسم' : 'Name'}</th>
                                            <th>{props.lang() === 'ar' ? 'الفئة' : 'Category'}</th>
                                            <th>{props.lang() === 'ar' ? 'الحالة' : 'Status'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <For each={(props.products || []).slice(0, 5)}>
                                            {(product) => (
                                                <tr>
                                                    <td><img src={`${import.meta.env.BASE_URL}${product.mainImage}`} alt="" class="table-img" /></td>
                                                    <td>{props.lang() === 'ar' ? (product.name.ar || product.name.en) : product.name.en}</td>
                                                    <td>{product.category}</td>
                                                    <td><span class="dash-badge dash-status-active">{props.lang() === 'ar' ? 'نشط' : 'Active'}</span></td>
                                                </tr>
                                            )}
                                        </For>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
