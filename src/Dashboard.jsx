import { createSignal, createMemo, For, Show } from 'solid-js'
import { supabase } from './supabaseClient'
import './Dashboard.css'

export default function Dashboard(props) {
    const [activeTab, setActiveTab] = createSignal('overview')
    const [sidebarOpen, setSidebarOpen] = createSignal(false)
    const [isModalOpen, setIsModalOpen] = createSignal(false)
    const [modalType, setModalType] = createSignal('') // 'product', 'doctor', 'user'
    const [editingItem, setEditingItem] = createSignal(null)
    const [loading, setLoading] = createSignal(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen())

    // UI Icons
    const Icon = (iconProps) => {
        const strokeWidth = iconProps.stroke || 2
        switch (iconProps.name) {
            case 'layout': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            case 'package': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            case 'users': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            case 'file-text': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7 20 7"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            case 'shield': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            case 'log-out': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            case 'plus': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            case 'edit': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            case 'trash': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            case 'x': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            case 'menu': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            default: return null
        }
    }

    const openModal = (type, item = null) => {
        setModalType(type)
        setEditingItem(item)
        setIsModalOpen(true)
    }

    const handleDelete = async (table, id) => {
        if (!confirm(props.lang() === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) alert(error.message)
        else window.location.reload()
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        // Handle JSON fields for products/doctors
        let finalData = { ...data }
        if (modalType() === 'product' || modalType() === 'doctor') {
            finalData.name = { ar: data.name_ar, en: data.name_en }
            delete finalData.name_ar
            delete finalData.name_en
            if (modalType() === 'doctor') {
                finalData.specialty = { ar: data.spec_ar, en: data.spec_en }
                delete finalData.spec_ar
                delete finalData.spec_en
            }
        }

        const table = modalType() === 'product' ? 'products' : (modalType() === 'doctor' ? 'doctors' : 'profiles')
        
        let error;
        if (editingItem()?.id) {
            ({ error } = await supabase.from(table).update(finalData).eq('id', editingItem().id))
        } else {
            ({ error } = await supabase.from(table).insert(finalData))
        }

        if (error) alert(error.message)
        else {
            setIsModalOpen(false)
            window.location.reload()
        }
        setLoading(false)
    }

    const tabs = [
        { id: 'overview', label: props.lang() === 'ar' ? 'نظرة عامة' : 'Overview', icon: 'layout' },
        { id: 'products', label: props.lang() === 'ar' ? 'المنتجات' : 'Products', icon: 'package' },
        { id: 'experts', label: props.lang() === 'ar' ? 'الخبراء' : 'Experts', icon: 'users' },
        { id: 'users', label: props.lang() === 'ar' ? 'المدراء' : 'Admins', icon: 'shield' }
    ]

    return (
        <div class="dashboard-wrapper" dir={props.lang() === 'ar' ? 'rtl' : 'ltr'}>
            <div class={`sidebar-overlay ${sidebarOpen() ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />
            
            <aside class={`dashboard-sidebar ${sidebarOpen() ? 'open' : ''}`}>
                <div class="sidebar-header">
                    <img src={`${import.meta.env.BASE_URL}static/img/G%20-%20Care-01.svg`} alt="Logo" class="sidebar-logo" />
                    <span class="sidebar-title">{props.lang() === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                </div>
                <nav class="sidebar-nav">
                    <For each={tabs}>
                        {(tab) => (
                            <button class={activeTab() === tab.id ? 'active' : ''} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}>
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
                            <button class="mobile-menu-btn" onClick={toggleSidebar}><Icon name="menu" /></button>
                            <h2>{tabs.find(t => t.id === activeTab())?.label}</h2>
                        </div>
                        <p>{props.lang() === 'ar' ? 'أهلاً بك في لوحة التحكم' : 'Welcome to the Control Panel'}</p>
                    </div>
                    <div class="user-profile">
                        <button class="lang-toggle-dash" onClick={() => props.setLang(l => l === 'ar' ? 'en' : 'ar')}>{props.lang() === 'ar' ? 'English' : 'العربية'}</button>
                        <span class="admin-dash-badge">{props.lang() === 'ar' ? 'مسؤول النظام' : 'System Admin'}</span>
                    </div>
                </header>

                <div class="dashboard-content">
                    {/* TABLE VIEW FOR PRODUCTS / EXPERTS / USERS */}
                    {(activeTab() === 'products' || activeTab() === 'experts' || activeTab() === 'users') && (
                        <div class="fade-in">
                            <div style={{display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', 'margin-bottom': '2rem'}}>
                                <h3>{props.lang() === 'ar' ? 'القائمة الحالية' : 'Current List'}</h3>
                                <button class="add-new-btn" onClick={() => openModal(activeTab().slice(0, -1))}>
                                    <Icon name="plus" /> {props.lang() === 'ar' ? 'إضافة جديد' : 'Add New'}
                                </button>
                            </div>

                            <div class="dash-table-container">
                                <table class="dash-table">
                                    <thead>
                                        <tr>
                                            <th>{props.lang() === 'ar' ? 'العنصر' : 'Item'}</th>
                                            <th>{props.lang() === 'ar' ? 'التفاصيل' : 'Details'}</th>
                                            <th>{props.lang() === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <For each={activeTab() === 'products' ? props.products : (activeTab() === 'experts' ? props.experts : props.profiles)}>
                                            {(item) => (
                                                <tr>
                                                    <td>
                                                        <div style={{display: 'flex', 'align-items': 'center', gap: '12px'}}>
                                                            {(item.mainImage || item.image) ? <img src={`${import.meta.env.BASE_URL}${item.mainImage || item.image}`} class="table-img" /> : <div class="table-img" style={{display:'flex','align-items':'center','justify-content':'center',background:'#f1f5f9'}}><Icon name="users" /></div>}
                                                            <span style={{"font-weight": 700}}>{typeof item.name === 'object' ? (props.lang() === 'ar' ? item.name.ar : item.name.en) : (item.full_name || 'No Name')}</span>
                                                        </div>
                                                    </td>
                                                    <td class="dash-text-muted">{item.category || item.role || '---'}</td>
                                                    <td>
                                                        <button class="action-icon-btn edit" onClick={() => openModal(activeTab().slice(0, -1), item)}><Icon name="edit" /></button>
                                                        <button class="action-icon-btn delete" onClick={() => handleDelete(activeTab() === 'products' ? 'products' : (activeTab() === 'experts' ? 'doctors' : 'profiles'), item.id)}><Icon name="trash" /></button>
                                                    </td>
                                                </tr>
                                            )}
                                        </For>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* OVERVIEW (Dashboard Stats) */}
                    {activeTab() === 'overview' && (
                        <div class="dash-stats-grid fade-in">
                            <div class="dash-stat-dash-card">
                                <div class="dash-stat-icon-wrapper"><Icon name="package" stroke={2.5} /></div>
                                <div class="dash-stat-info">
                                    <span class="dash-stat-label">{props.lang() === 'ar' ? 'المنتجات' : 'Products'}</span>
                                    <span class="dash-stat-value">{(props.products || []).length}</span>
                                </div>
                            </div>
                            <div class="dash-stat-dash-card">
                                <div class="dash-stat-icon-wrapper"><Icon name="users" stroke={2.5} /></div>
                                <div class="dash-stat-info">
                                    <span class="dash-stat-label">{props.lang() === 'ar' ? 'الخبراء' : 'Experts'}</span>
                                    <span class="dash-stat-value">{(props.experts || []).length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL SYSTEM */}
            <Show when={isModalOpen()}>
                <div class="modal-overlay">
                    <div class="modal-content fade-in">
                        <div class="modal-header">
                            <h3>{editingItem() ? (props.lang() === 'ar' ? 'تعديل' : 'Edit') : (props.lang() === 'ar' ? 'إضافة' : 'Add')}</h3>
                            <button class="close-modal" onClick={() => setIsModalOpen(false)}><Icon name="x" /></button>
                        </div>
                        <form class="form-grid" onSubmit={handleSave}>
                            <Show when={modalType() === 'product' || modalType() === 'doctor'}>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                                    <input name="name_ar" value={editingItem()?.name?.ar || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الاسم (English)' : 'Name (EN)'}</label>
                                    <input name="name_en" value={editingItem()?.name?.en || ''} required />
                                </div>
                            </Show>
                            
                            <Show when={modalType() === 'product'}>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الفئة' : 'Category'}</label>
                                    <input name="category" value={editingItem()?.category || ''} placeholder="e.g. skin, hair" required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'رابط الصورة' : 'Image Path'}</label>
                                    <input name="mainImage" value={editingItem()?.mainImage || ''} placeholder="static/img/product.webp" required />
                                </div>
                            </Show>

                            <Show when={modalType() === 'user'}>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                    <input name="full_name" value={editingItem()?.full_name || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الرتبة' : 'Role'}</label>
                                    <select name="role" value={editingItem()?.role || 'writer'}>
                                        <option value="admin">Admin</option>
                                        <option value="publisher">Publisher</option>
                                        <option value="writer">Writer</option>
                                    </select>
                                </div>
                            </Show>

                            <div class="form-actions">
                                <button type="button" class="btn-cancel" onClick={() => setIsModalOpen(false)}>{props.lang() === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" class="btn-save" disabled={loading()}>
                                    {loading() ? '...' : (props.lang() === 'ar' ? 'حفظ البيانات' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Show>
        </div>
    )
}
