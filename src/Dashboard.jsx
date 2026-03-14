import { createSignal, createMemo, For } from 'solid-js'
import { supabase } from './supabaseClient'
import './Dashboard.css'

export default function Dashboard(props) {
    const [activeTab, setActiveTab] = createSignal('overview')
    const [sidebarOpen, setSidebarOpen] = createSignal(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen())

    // Professional SVG Icons
    const Icon = (iconProps) => {
        const strokeWidth = iconProps.stroke || 2
        switch (iconProps.name) {
            case 'layout': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            case 'package': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            case 'users': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            case 'file-text': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7 20 7"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            case 'shield': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            case 'activity': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            case 'log-out': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            case 'plus': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            case 'external-link': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            default: return null
        }
    }

    const stats = createMemo(() => [
        { label: props.lang() === 'ar' ? 'إجمالي المنتجات' : 'Total Products', value: (props.products || []).length, icon: 'package' },
        { label: props.lang() === 'ar' ? 'الخبراء والأطباء' : 'Experts & Doctors', value: (props.experts || []).length, icon: 'users' },
        { label: props.lang() === 'ar' ? 'عمليات الرفع' : 'Success Deploys', value: '98%', icon: 'activity' }
    ])

    const tabs = [
        { id: 'overview', label: props.lang() === 'ar' ? 'نظرة عامة' : 'Overview', icon: 'layout' },
        { id: 'cms', label: props.lang() === 'ar' ? 'إدارة المحتوى' : 'Manage Content', icon: 'file-text' },
        { id: 'users', label: props.lang() === 'ar' ? 'صلاحيات المدراء' : 'User Roles', icon: 'shield' }
    ]

    const cmsModules = createMemo(() => [
        { label: props.lang() === 'ar' ? 'إدارة المنتجات' : 'Products Manager', table: 'products', icon: 'package' },
        { label: props.lang() === 'ar' ? 'إدارة الخبراء' : 'Experts Manager', table: 'doctors', icon: 'users' },
        { label: props.lang() === 'ar' ? 'المقالات الطبية' : 'Health Articles', table: 'articles', icon: 'file-text' },
        { label: props.lang() === 'ar' ? 'البوسترات التوعوية' : 'Edu Posters', table: 'posters', icon: 'layout' }
    ])

    return (
        <div class="dashboard-wrapper" dir={props.lang() === 'ar' ? 'rtl' : 'ltr'}>
            <div 
                class={`sidebar-overlay ${sidebarOpen() ? 'active' : ''}`} 
                onClick={() => setSidebarOpen(false)} 
            />
            
            <aside class={`dashboard-sidebar ${sidebarOpen() ? 'open' : ''}`}>
                <div class="sidebar-header">
                    <img src={`${import.meta.env.BASE_URL}static/img/G%20-%20Care-01.svg`} alt="Logo" class="sidebar-logo" />
                    <span class="sidebar-title">{props.lang() === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                </div>
                <nav class="sidebar-nav">
                    <For each={tabs}>
                        {(tab) => (
                            <button
                                class={activeTab() === tab.id ? 'active' : ''}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSidebarOpen(false);
                                }}
                            >
                                <span class="nav-icon"><Icon name={tab.icon} /></span> {tab.label}
                            </button>
                        )}
                    </For>
                </nav>
                <div class="sidebar-footer">
                    <button class="logout-dash-btn" onClick={() => supabase.auth.signOut()} style={{width: '100%', "justify-content": 'center'}}>
                        <Icon name="log-out" /> {props.lang() === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                </div>
            </aside>

            <main class="dashboard-main">
                <header class="dashboard-topbar">
                    <div class="topbar-left">
                        <div style={{display: 'flex', 'align-items': 'center', gap: '12px'}}>
                            <button class="mobile-menu-btn" onClick={toggleSidebar}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                            </button>
                            <h2>{tabs.find(t => t.id === activeTab())?.label}</h2>
                        </div>
                        <p style={{color: 'var(--dash-text-muted)', "margin-top": '4px'}}>
                            {props.lang() === 'ar' ? 'أهلاً بك في لوحة التحكم العميقة' : 'Welcome to the deep control panel'}
                        </p>
                    </div>
                    <div class="user-profile">
                        <button class="lang-toggle-dash" onClick={() => props.setLang(l => l === 'ar' ? 'en' : 'ar')}>
                            {props.lang() === 'ar' ? 'English' : 'العربية'}
                        </button>
                        <span class="admin-dash-badge">{props.lang() === 'ar' ? 'رتبة: مدير نظام' : 'Role: System Admin'}</span>
                    </div>
                </header>

                <div class="dashboard-content">
                    {/* OVERVIEW TAB */}
                    {activeTab() === 'overview' && (
                        <div class="fade-in">
                            <div class="dash-stats-grid">
                                <For each={stats()}>
                                    {(stat) => (
                                        <div class="dash-stat-dash-card">
                                            <div class="dash-stat-icon-wrapper">
                                                <Icon name={stat.icon} stroke={2.5} />
                                            </div>
                                            <div class="dash-stat-info">
                                                <span class="dash-stat-label">{stat.label}</span>
                                                <span class="dash-stat-value">{stat.value}</span>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>

                            <div class="section-title-row" style={{display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', 'margin-bottom': '1rem'}}>
                                <h3 style={{"font-weight": 700}}>{props.lang() === 'ar' ? 'المنتجات المضافة حديثاً' : 'Recently Added Products'}</h3>
                            </div>

                            <div class="dash-table-container">
                                <table class="dash-table">
                                    <thead>
                                        <tr>
                                            <th>{props.lang() === 'ar' ? 'الصورة' : 'Img'}</th>
                                            <th>{props.lang() === 'ar' ? 'المنتج' : 'Name'}</th>
                                            <th>{props.lang() === 'ar' ? 'الفئة' : 'Category'}</th>
                                            <th>{props.lang() === 'ar' ? 'الحالة' : 'Status'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <For each={(props.products || []).slice(0, 5)}>
                                            {(product) => (
                                                <tr>
                                                    <td><img src={`${import.meta.env.BASE_URL}${product.mainImage}`} alt="" class="table-img" /></td>
                                                    <td style={{"font-weight": 600}}>{props.lang() === 'ar' ? (product.name.ar || product.name.en) : product.name.en}</td>
                                                    <td>{product.category}</td>
                                                    <td><span class="dash-badge dash-status-active">{props.lang() === 'ar' ? 'منشور' : 'Live'}</span></td>
                                                </tr>
                                            )}
                                        </For>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* MANAGE CONTENT TAB */}
                    {activeTab() === 'cms' && (
                        <div class="cms-grid fade-in">
                            <For each={cmsModules()}>
                                {(module) => (
                                    <div class="cms-premium-card">
                                        <div class="cms-card-icon">
                                            <Icon name={module.icon} stroke={2.5} />
                                        </div>
                                        <h3>{module.label}</h3>
                                        <p style={{color: 'var(--dash-text-muted)', "margin-bottom": '1.5rem', "font-size": '0.9rem'}}>
                                            {props.lang() === 'ar' ? `تعديل وإضافة محتوى في جدول ${module.table}` : `Edit and add content in ${module.table} table`}
                                        </p>
                                        <a 
                                          href={`https://supabase.com/dashboard/project/jszubagkmmrjafseooft/editor/${module.table}`} 
                                          target="_blank" 
                                          class="cms-action-btn"
                                        >
                                            <Icon name="external-link" /> {props.lang() === 'ar' ? 'فتح المحرر المباشر' : 'Open Live Editor'}
                                        </a>
                                    </div>
                                )}
                            </For>
                        </div>
                    )}

                    {/* USERS / ROLES TAB */}
                    {activeTab() === 'users' && (
                        <div class="fade-in">
                            <div class="dash-stat-dash-card" style={{"margin-bottom": '2rem', "border-right": '4px solid var(--dash-accent)'}}>
                                <div class="dash-stat-info">
                                    <h3 style={{"margin-bottom": '4px'}}>{props.lang() === 'ar' ? 'إدارة الأدوار والمستخدمين' : 'Roles & Access Control'}</h3>
                                    <p style={{color: 'var(--dash-text-muted)'}}>{props.lang() === 'ar' ? 'يمكنك إضافة أعضاء لفريق العمل وتعيين صلاحياتهم' : 'Define who can view or edit the system'}</p>
                                </div>
                            </div>

                            <div class="dash-table-container">
                                <table class="dash-table">
                                    <thead>
                                        <tr>
                                            <th>{props.lang() === 'ar' ? 'المستخدم' : 'User'}</th>
                                            <th>{props.lang() === 'ar' ? 'الصلاحية' : 'Role'}</th>
                                            <th>{props.lang() === 'ar' ? 'تاريخ البدء' : 'Started At'}</th>
                                            <th>{props.lang() === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <For each={props.profiles || []}>
                                            {(profile) => (
                                                <tr>
                                                    <td>
                                                        <div style={{display: 'flex', 'align-items': 'center', gap: '10px'}}>
                                                            <div style={{width: '32px', height: '32px', background: 'var(--dash-accent)', "border-radius": '50%', display: 'flex', 'align-items': 'center', 'justify-content': 'center', color: 'white', "font-weight": 700}}>
                                                                {(profile.full_name || 'U')[0].toUpperCase()}
                                                            </div>
                                                            <span>{profile.full_name || 'G-Care User'}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span class="dash-badge" style={{
                                                            background: profile.role === 'admin' ? '#e0f2fe' : (profile.role === 'publisher' ? '#fef3c7' : '#f1f5f9'),
                                                            color: profile.role === 'admin' ? '#0369a1' : (profile.role === 'publisher' ? '#92400e' : '#475569')
                                                        }}>
                                                            {profile.role?.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td class="dash-text-muted">{new Date(profile.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <button class="lang-toggle-dash" onClick={() => {
                                                            const newRole = prompt('Enter new role (admin, publisher, writer):', profile.role);
                                                            if (newRole && ['admin', 'publisher', 'writer'].includes(newRole)) {
                                                                supabase.from('profiles').update({ role: newRole }).eq('id', profile.id).then(() => window.location.reload());
                                                            }
                                                        }} style={{color: 'var(--dash-accent)'}}>
                                                            {props.lang() === 'ar' ? 'تعديل الرتبة' : 'Change Role'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </For>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{"margin-top": '1.5rem'}}>
                               <a 
                                  href="https://supabase.com/dashboard/project/jszubagkmmrjafseooft/auth/users" 
                                  target="_blank" 
                                  class="cms-action-btn"
                                  style={{"max-width": '280px'}}
                                >
                                    <Icon name="plus" /> {props.lang() === 'ar' ? 'دعوة عضو جديد' : 'Invite New Member'}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
