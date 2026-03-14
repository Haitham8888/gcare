import { createSignal, createMemo, For, Show } from 'solid-js'
import { supabase } from './supabaseClient'
import './Dashboard.css'

export default function Dashboard(props) {
    const [activeTab, setActiveTab] = createSignal('overview')
    const [sidebarOpen, setSidebarOpen] = createSignal(false)
    const [isModalOpen, setIsModalOpen] = createSignal(false)
    const [modalType, setModalType] = createSignal('') // 'product', 'doctor', 'user'
    const [editingItem, setEditingItem] = createSignal(null)
    const [isUploading, setIsUploading] = createSignal(false)
    const [uploadURL, setUploadURL] = createSignal('')
    const [uploadProgress, setUploadProgress] = createSignal(0)
    const [loading, setLoading] = createSignal(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen())

    const handleFileUpload = async (file) => {
        if (!file) return
        setIsUploading(true)
        setUploadProgress(0)
        
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('fileName', file.name)
            formData.append('useUniqueFileName', 'true')
            formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY)
            
            // Note: For real security, signature should be generated server-side.
            // For this project's scale, we'll use the direct upload approach.
            // ImageKit requires a signature for client-side uploads. 
            // We'll use a simple fetch to their upload endpoint.
            
            const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (response.ok) {
                setUploadURL(result.url)
                setUploadProgress(100)
            } else {
                throw new Error(result.message || 'Upload failed')
            }

            setTimeout(() => {
                setIsUploading(false)
                setUploadProgress(0)
            }, 1000)
        } catch (error) {
            console.error('ImageKit Upload Error:', error)
            alert(props.lang() === 'ar' ? 'فشل الرفع. تأكد من صحة مفاتيح ImageKit في ملف .env' : 'Upload failed. Check ImageKit keys in .env')
            setIsUploading(false)
        }
    }

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
        setUploadURL(item?.mainImage || item?.image || item?.img || '')
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

        // Map fields back to Supabase columns
        let finalData = { ...data }
        
        if (modalType() === 'product') {
            finalData = {
                id: editingItem()?.id || data.name_en.toLowerCase().replace(/\s+/g, '-'), // Basic slug logic for new items
                name_ar: data.name_ar,
                name_en: data.name_en,
                category: data.category,
                main_image: data.mainImage,
                overview_ar: data.overview_ar || '',
                overview_en: data.overview_en || ''
            }
        } else if (modalType() === 'doctor') {
            finalData = {
                name_ar: data.name_ar,
                name_en: data.name_en,
                role_ar: data.role_ar, // match col name
                role_en: data.role_en,
                img: data.img
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

    const FileUploadZone = () => (
        <div 
            class={`upload-dropzone ${isUploading() ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
            onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('dragging');
                const file = e.dataTransfer.files[0];
                handleFileUpload(file);
            }}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input 
                type="file" 
                id="fileInput" 
                style="display:none" 
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <Show when={!uploadURL()} fallback={<img src={uploadURL()} class="upload-preview-thumb" />}>
                <div class="upload-icon-big"><Icon name="package" stroke={2.5} /></div>
                <p>{props.lang() === 'ar' ? 'اسحب الصورة هنا أو ' : 'Drag image here or '} <b>{props.lang() === 'ar' ? 'تصفح' : 'browse'}</b></p>
            </Show>
            <Show when={isUploading()}>
                <div class="upload-progress">
                    <div class="upload-progress-fill" style={{width: `${uploadProgress()}%`}}></div>
                </div>
            </Show>
        </div>
    )

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
                            <div class="table-actions-header">
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
                                        <Show when={activeTab() === 'products' ? props.products : (activeTab() === 'experts' ? props.experts : props.profiles)} fallback={
                                            <tr><td colspan="3" style={{"text-align":"center", padding: "40px"}}>{props.lang() === 'ar' ? 'جاري التحميل...' : 'Loading...'}</td></tr>
                                        }>
                                            {(list) => (
                                                <Show when={list.length > 0} fallback={
                                                    <tr><td colspan="3" style={{"text-align":"center", padding: "40px"}}>{props.lang() === 'ar' ? 'لا يوجد بيانات حالياً' : 'No data found'}</td></tr>
                                                }>
                                                    <For each={list}>
                                                        {(item) => (
                                                            <tr>
                                                                <td>
                                                                    <div style={{display: 'flex', 'align-items': 'center', gap: '12px'}}>
                                                                        {(item.mainImage || item.image) ? <img src={`${import.meta.env.BASE_URL}${item.mainImage || item.image}`} class="table-img" /> : <div class="table-img" style={{display:'flex','align-items':'center','justify-content':'center',background:'#f1f5f9'}}><Icon name="users" /></div>}
                                                                        <span style={{"font-weight": 700}}>
                                                                            {item.name ? (props.lang() === 'ar' ? item.name.ar : item.name.en) : (item.full_name || 'No Name')}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td class="dash-text-muted">{item.category || (item.role && (typeof item.role === 'object' ? (props.lang() === 'ar' ? item.role.ar : item.role.en) : item.role)) || '---'}</td>
                                                                <td>
                                                                    <button class="action-icon-btn edit" onClick={() => openModal(activeTab().slice(0, -1), item)}><Icon name="edit" /></button>
                                                                    <button class="action-icon-btn delete" onClick={() => handleDelete(activeTab() === 'products' ? 'products' : (activeTab() === 'experts' ? 'doctors' : 'profiles'), item.id)}><Icon name="trash" /></button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </For>
                                                </Show>
                                            )}
                                        </Show>
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
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'صورة المنتج' : 'Product Image'}</label>
                                    <FileUploadZone />
                                    <input type="hidden" name="mainImage" value={uploadURL()} />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الفئة' : 'Category'}</label>
                                    <input name="category" value={editingItem()?.category || ''} placeholder="e.g. skin, hair" required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'رابط خارجي للصورة (اختياري)' : 'External Image URL (Optional)'}</label>
                                    <input value={uploadURL()} onInput={(e) => setUploadURL(e.target.value)} placeholder="https://..." />
                                </div>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'}</label>
                                    <textarea name="overview_ar" rows="3" value={editingItem()?.overview?.ar || editingItem()?.overview_ar || ''}></textarea>
                                </div>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'الوصف (English)' : 'Description (EN)'}</label>
                                    <textarea name="overview_en" rows="3" value={editingItem()?.overview?.en || editingItem()?.overview_en || ''}></textarea>
                                </div>
                            </Show>
                            
                            <Show when={modalType() === 'doctor'}>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'صورة الخبير' : 'Expert Image'}</label>
                                    <FileUploadZone />
                                    <input type="hidden" name="img" value={uploadURL()} />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الرتبة (عربي)' : 'Role (AR)'}</label>
                                    <input name="role_ar" value={(typeof editingItem()?.role === 'object' ? editingItem()?.role?.ar : editingItem()?.role) || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الرتبة (English)' : 'Role (EN)'}</label>
                                    <input name="role_en" value={(typeof editingItem()?.role === 'object' ? editingItem()?.role?.en : editingItem()?.role) || ''} required />
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
