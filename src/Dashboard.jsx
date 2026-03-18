import { createSignal, createMemo, Show, For, createEffect } from 'solid-js';
import { supabase, getAssetUrl } from './supabaseClient';
import './Dashboard.css';

function Icon(props) {
    const icons = {
        'package': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
        'users': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        'image': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
        'plus': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
        'edit': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
        'trash': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
        'x': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
        'log-out': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
        'shield': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7Z"/></svg>,
        'book-open': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
        'home': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
        'briefcase': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    };
    return icons[props.name] || null;
}

export default function Dashboard(props) {
    const productCategoryOptions = ['IVD', 'IUD', 'IUS', 'WomanCare'];
    const socialIconMap = {
        linkedin: 'static/img/in.svg',
        x: 'static/img/x.svg',
        tiktok: 'static/img/tiktok.svg',
        instagram: 'static/img/insta.svg',
        whatsapp: 'static/img/whatsapp.svg'
    };
    const defaultContactSettings = {
        social_links: [
            { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/goldencare-medical-company/', enabled: true },
            { key: 'x', label: 'X', href: 'https://x.com/G_Careksa', enabled: true },
            { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@g_careksa', enabled: true },
            { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/G_Careksa', enabled: true },
            { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/966552527862', enabled: false }
        ],
        phones: [
            { label: 'Primary', value: '+966552527862', enabled: true },
            { label: 'Secondary', value: '+966555849237', enabled: true }
        ],
        emails: [
            { label: 'General', value: 'info@gcare.sa', enabled: true },
            { label: 'Health Education', value: 'hep@gcare.sa', enabled: true }
        ],
        booking_url: 'https://outlook.office.com/book/Bookings@gcare.sa/?ismsaljsauthenabled=true'
    };
    const normalizeContactSettings = (raw) => {
        const source = raw || {};
        const sourceSocial = Array.isArray(source.social_links) ? source.social_links : [];
        const socialMap = new Map(sourceSocial.map(item => [String(item?.key || '').toLowerCase(), item]));

        const social_links = defaultContactSettings.social_links.map((fallback) => {
            const current = socialMap.get(fallback.key) || {};
            return {
                key: fallback.key,
                label: current.label || fallback.label,
                href: current.href || fallback.href,
                enabled: typeof current.enabled === 'boolean' ? current.enabled : fallback.enabled
            };
        });

        const phones = defaultContactSettings.phones.map((fallback, index) => {
            const current = (Array.isArray(source.phones) ? source.phones : [])[index] || {};
            return {
                label: current.label || fallback.label,
                value: current.value || fallback.value,
                enabled: typeof current.enabled === 'boolean' ? current.enabled : fallback.enabled
            };
        });

        const emails = defaultContactSettings.emails.map((fallback, index) => {
            const current = (Array.isArray(source.emails) ? source.emails : [])[index] || {};
            return {
                label: current.label || fallback.label,
                value: current.value || fallback.value,
                enabled: typeof current.enabled === 'boolean' ? current.enabled : fallback.enabled
            };
        });

        return {
            social_links,
            phones,
            emails,
            booking_url: source.booking_url || defaultContactSettings.booking_url
        };
    };

    const [activeTab, setActiveTab] = createSignal('overview');
    const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
    const [isModalOpen, setIsModalOpen] = createSignal(false);
    const [modalType, setModalType] = createSignal('product'); 
    const [editingItem, setEditingItem] = createSignal(null);
    const [loading, setLoading] = createSignal(false);
    const [uploadURL, setUploadURL] = createSignal('');
    const [uploadURLs, setUploadURLs] = createSignal([]); // Support for multiple images
    const [uploadProgress, setUploadProgress] = createSignal(0);
    const [isUploading, setIsUploading] = createSignal(false);
    const [contactForm, setContactForm] = createSignal(normalizeContactSettings(props.contactSettings));

    const isPublisher = createMemo(() => props.currentUserRole === 'publisher');

    const allTabs = createMemo(() => [
        { id: 'overview', label: props.lang() === 'ar' ? 'الإحصائيات' : 'Overview', icon: 'home' },
        { id: 'products', label: props.lang() === 'ar' ? 'المنتجات' : 'Products', icon: 'package' },
        { id: 'experts', label: props.lang() === 'ar' ? 'فريق العمل' : 'Team', icon: 'briefcase' },
        { id: 'articles', label: props.lang() === 'ar' ? 'إدارة المقالات' : 'Articles Management', icon: 'book-open' },
        { id: 'media', label: props.lang() === 'ar' ? 'المركز الإعلامي' : 'Media Center', icon: 'image' },
        { id: 'contact', label: props.lang() === 'ar' ? 'التواصل' : 'Contact', icon: 'users' },
        { id: 'partners', label: props.lang() === 'ar' ? 'شركاء النجاح' : 'Partners', icon: 'users' },
        { id: 'users', label: props.lang() === 'ar' ? 'المستخدمين' : 'Users', icon: 'shield' }
    ]);

    const tabs = createMemo(() => {
        if (!isPublisher()) return allTabs();
        return allTabs().filter(tab => ['articles', 'media', 'contact'].includes(tab.id));
    });

    createEffect(() => {
        setContactForm(normalizeContactSettings(props.contactSettings));
    });

    createEffect(() => {
        const allowed = tabs().map(tab => tab.id);
        if (!allowed.includes(activeTab())) {
            setActiveTab(allowed[0] || 'articles');
        }
    });

    const handleFileUploadBulk = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        setUploadProgress(10);
        
        const urls = [];
        const total = files.length;
        
        try {
            for (let i = 0; i < total; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `uploads/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('gcare-assets')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;
                
                const { data: { publicUrl } } = supabase.storage
                    .from('gcare-assets')
                    .getPublicUrl(filePath);

                urls.push(publicUrl);
                setUploadProgress(10 + ((i + 1) / total) * 80);
            }

            setUploadURLs([...uploadURLs(), ...urls]);
            if (urls.length > 0) setUploadURL(urls[0]); // Set first for single preview
            setUploadProgress(100);
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        } catch (error) {
            console.error('Error uploading:', error.message);
            alert(props.lang() === 'ar' ? 'فشل تحميل بعض الملفات' : 'Upload failed for some files');
            setIsUploading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setIsUploading(true);
        setUploadProgress(10);
        
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            setUploadProgress(30);
            const { error: uploadError } = await supabase.storage
                .from('gcare-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;
            
            setUploadProgress(70);
            const { data: { publicUrl } } = supabase.storage
                .from('gcare-assets')
                .getPublicUrl(filePath);

            setUploadURL(publicUrl);
            setUploadURLs([publicUrl]);
            setUploadProgress(100);
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        } catch (error) {
            console.error('Error uploading:', error.message);
            alert(props.lang() === 'ar' ? 'فشل تحميل الملف' : 'Upload failed');
            setIsUploading(false);
        }
    };

    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        setUploadURL(item?.img || item?.main_image || '');
        setUploadURLs(item?.img ? [item.img] : []);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const table = {
            'product': 'products',
            'expert': 'doctors',
            'user': 'profiles',
            'article': 'articles',
            'poster': 'posters',
            'partner': 'partners',
            'intro': 'posters'
        }[modalType()] || 'products';

        try {
            if (modalType() === 'user') {
                const password = (data.password || '').trim();

                if (editingItem()?.id) {
                    const { error } = await supabase.rpc('admin_update_dashboard_user', {
                        p_user_id: editingItem().id,
                        p_email: data.email,
                        p_full_name: data.full_name,
                        p_role: data.role,
                        p_new_password: password || null
                    });
                    if (error) throw error;
                } else {
                    if (password.length < 6) {
                        throw new Error(props.lang() === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
                    }

                    const { error } = await supabase.rpc('admin_create_dashboard_user', {
                        p_email: data.email,
                        p_password: password,
                        p_full_name: data.full_name,
                        p_role: data.role
                    });
                    if (error) throw error;
                }

                setIsModalOpen(false);
                props.refreshAll();
                return;
            }

            if (modalType() === 'poster' && !editingItem() && uploadURLs().length > 1) {
                // Bulk insert for posters
                const inserts = uploadURLs().map(url => ({
                    title_ar: 'IMAGE',
                    title_en: 'IMAGE',
                    img: url
                }));
                const { error } = await supabase.from(table).insert(inserts);
                if (error) throw error;
            } else {
                let finalData = { ...data };
                
                if (modalType() === 'product') {
                    const normalizedCategory = productCategoryOptions.includes(data.category) ? data.category : 'IVD';
                    finalData = {
                        id: editingItem()?.id || data.name_en.toLowerCase().replace(/\s+/g, '-'),
                        name_ar: data.name_ar,
                        name_en: data.name_en,
                        category: normalizedCategory,
                        main_image: uploadURL(),
                        overview_ar: data.overview_ar || '',
                        overview_en: data.overview_en || '',
                        brochure_url: data.brochure_url || ''
                    };
                } else if (modalType() === 'expert') {
                    finalData = {
                        name_ar: data.name_ar,
                        name_en: data.name_en,
                        role_ar: data.role_ar, 
                        role_en: data.role_en,
                        img: uploadURL()
                    };
                } else if (modalType() === 'user') {
                    finalData = {
                        full_name: data.full_name,
                        email: data.email,
                        role: data.role
                    };
                    if (editingItem()?.id) finalData.id = editingItem().id;
                } else if (modalType() === 'article') {
                    finalData = {
                        title_ar: data.title_ar,
                        title_en: data.title_en,
                        category_ar: data.category_ar,
                        category_en: data.category_en,
                        excerpt_ar: data.excerpt_ar,
                        excerpt_en: data.excerpt_en,
                        link_url: data.link_url || '',
                        img: uploadURL()
                    };
                } else if (modalType() === 'poster') {
                    finalData = {
                        title_ar: 'IMAGE',
                        title_en: 'IMAGE',
                        img: uploadURL()
                    };
                } else if (modalType() === 'intro') {
                    finalData = {
                        title_ar: 'MAIN',
                        title_en: 'MAIN',
                        img: uploadURL()
                    };
                } else if (modalType() === 'partner') {
                    finalData = {
                        name: data.name,
                        img: uploadURL()
                    };
                }

                if (editingItem() && editingItem().id && editingItem().id !== 'intro-fixed') {
                    const { error } = await supabase.from(table).update(finalData).eq('id', editingItem().id);
                    if (error) throw error;
                } else if (modalType() === 'intro' && editingItem()?.id === 'intro-fixed') {
                    const { data: exist } = await supabase.from('posters').select('*').or('title_ar.eq.MAIN,title_ar.eq.INTRO').single();
                    if (exist) {
                        const { error } = await supabase.from('posters').update(finalData).eq('id', exist.id);
                        if (error) throw error;
                    } else {
                        const { error } = await supabase.from('posters').insert([finalData]);
                        if (error) throw error;
                    }
                } else {
                    const { error } = await supabase.from(table).insert([finalData]);
                    if (error) throw error;
                }
            }
            setIsModalOpen(false);
            props.refreshAll();
        } catch (error) {
            console.error('Save error:', error);
            alert(error?.message || (props.lang() === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving data'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (table, id) => {
        if (!confirm(props.lang() === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            props.refreshAll();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting');
        }
    };

    const updateContactField = (section, index, field, value) => {
        setContactForm((prev) => {
            const next = {
                ...prev,
                [section]: [...prev[section]]
            };
            next[section][index] = {
                ...next[section][index],
                [field]: value
            };
            return next;
        });
    };

    const updateBookingUrl = (value) => {
        setContactForm((prev) => ({ ...prev, booking_url: value }));
    };

    const saveContactSettings = async () => {
        setLoading(true);
        try {
            const payload = contactForm();
            const { error } = await supabase
                .from('site_contact_settings')
                .upsert({
                    id: 1,
                    social_links: payload.social_links,
                    phones: payload.phones,
                    emails: payload.emails,
                    booking_url: payload.booking_url
                }, { onConflict: 'id' });

            if (error) throw error;
            props.refreshAll();
            alert(props.lang() === 'ar' ? 'تم حفظ بيانات التواصل بنجاح' : 'Contact settings saved successfully');
        } catch (error) {
            console.error('Contact settings save error:', error);
            alert(error?.message || (props.lang() === 'ar' ? 'تعذر حفظ بيانات التواصل' : 'Failed to save contact settings'));
        } finally {
            setLoading(false);
        }
    };

    const FileUploadZone = (propsSub) => (
        <div 
            class={`upload-dropzone ${isUploading() ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
            onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('dragging');
                if (propsSub.multiple) {
                    handleFileUploadBulk(e.dataTransfer.files);
                } else {
                    handleFileUpload(e.dataTransfer.files[0]);
                }
            }}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input 
                type="file" 
                id="fileInput" 
                style="display:none" 
                multiple={propsSub.multiple}
                onChange={(e) => {
                    if (propsSub.multiple) {
                        handleFileUploadBulk(e.target.files);
                    } else {
                        handleFileUpload(e.target.files[0]);
                    }
                }}
            />
            <Show when={uploadURLs().length === 0} fallback={
                <div class="upload-preview-container">
                    <For each={uploadURLs().slice(0, 4)}>
                        {(url) => (
                            <div class="preview-mini-item">
                                {(url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm')) ? 
                                    <div class="video-preview-box-mini">VID</div> : 
                                    <img src={getAssetUrl(url)} class="upload-preview-thumb-bulk" />
                                }
                            </div>
                        )}
                    </For>
                    <Show when={uploadURLs().length > 4}>
                        <div class="preview-more-count">+{uploadURLs().length - 4}</div>
                    </Show>
                </div>
            }>
                <div class="upload-icon-big"><Icon name="package" stroke={2.5} /></div>
                <p>{props.lang() === 'ar' ? 'اسحب الملفات هنا أو ' : 'Drag files here or '} <b>{props.lang() === 'ar' ? 'تصفح' : 'browse'}</b></p>
            </Show>
            <Show when={isUploading()}>
                <div class="upload-progress">
                    <div class="upload-progress-fill" style={{width: `${uploadProgress()}%`}}></div>
                </div>
            </Show>
        </div>
    );

    const listData = createMemo(() => {
        const tab = activeTab();
        let raw = [];
        if (tab === 'products') raw = props.products;
        else if (tab === 'experts') raw = props.experts;
        else if (tab === 'articles') raw = (props.education || {}).articles;
        else if (tab === 'media') {
            const posters = (props.education || {}).posters || [];
            raw = posters.filter(p => p.title_ar !== 'MAIN' && p.title_ar !== 'INTRO');
        }
        else if (tab === 'partners') raw = props.partners;
        else if (tab === 'users') raw = props.profiles;
        return Array.isArray(raw) ? raw : [];
    });

    const activeTabLabel = () => tabs().find(t => t.id === activeTab())?.label || '';

    return (
        <div class={`dash-container ${props.lang() === 'ar' ? 'rtl' : 'ltr'}`}>
            <aside class={`dash-sidebar ${isSidebarOpen() ? 'open' : 'closed'}`}>
                <div class="dash-sidebar-header">
                    <img src={getAssetUrl('static/img/G - Care-01.svg')} alt="Logo" class="dash-logo" />
                </div>
                <nav class="dash-nav">
                    <For each={tabs()}>
                        {(tab) => (
                            <button 
                                class={`dash-nav-item ${activeTab() === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon name={tab.icon} />
                                <span>{tab.label}</span>
                            </button>
                        )}
                    </For>
                </nav>
                <div class="dash-sidebar-footer">
                    <button class="dash-nav-item logout" onClick={props.onLogout}>
                        <Icon name="log-out" />
                        <span>{props.lang() === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                    </button>
                </div>
            </aside>

            <main class="dash-main">
                <header class="dash-top-bar">
                    <div style={{display: 'flex', 'align-items': 'center', gap: '15px'}}>
                        <h2 class="dash-page-title">{activeTabLabel()}</h2>
                    </div>
                    <div class="dash-top-actions">
                        <button class="dash-lang-btn" onClick={() => props.setLang(l => l === 'ar' ? 'en' : 'ar')}>
                            {props.lang() === 'ar' ? 'English' : 'العربية'}
                        </button>
                    </div>
                </header>

                <div class="dash-content-area">
                    {activeTab() !== 'overview' && activeTab() !== 'contact' && (
                        <div class="dash-table-container fade-in">
                            <div class="dash-table-header">
                                <h3>{activeTabLabel()}</h3>
                                <button class="btn-add" onClick={() => {
                                    const type = activeTab() === 'media' ? 'poster' : 
                                                 activeTab() === 'partners' ? 'partner' : 
                                                 activeTab() === 'articles' ? 'article' :
                                                 activeTab().slice(0, -1);
                                    openModal(type);
                                }}>
                                    <Icon name="plus" />
                                    <span>{props.lang() === 'ar' ? 'إضافة جديد' : 'Add New'}</span>
                                </button>
                            </div>
                            <div class="table-responsive">
                                <table class="dash-table">
                                    <thead>
                                        <tr>
                                            <th>{props.lang() === 'ar' ? 'الاسم/العنوان' : 'Name/Title'}</th>
                                            <th>{activeTab() === 'users' ? (props.lang() === 'ar' ? 'المسمى الوظيفي' : 'Job Title') : (props.lang() === 'ar' ? 'التفاصيل' : 'Details')}</th>
                                            <th>{props.lang() === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <For each={listData()}>
                                            {(item) => {
                                                 const isIntro = item.title_ar === 'MAIN' || item.title_ar === 'INTRO';
                                                 const imageUrl = item.main_image || item.img || item.image || '';
                                                 let displayName = props.lang() === 'ar' ? 
                                                    (isIntro ? 'المقطع الرئيسي للموقع' : (item.title_ar || item.name_ar || item.full_name || item.name || '---')) : 
                                                    (isIntro ? 'Site Main Clip' : (item.title_en || item.name_en || item.full_name || item.name || '---'));
                                                 
                                                 if (displayName === 'IMAGE' || displayName === 'MAIN' || displayName === 'INTRO') {
                                                     if (isIntro) {
                                                        displayName = props.lang() === 'ar' ? 'المقطع الرئيسي للموقع' : 'Site Main Clip';
                                                     } else {
                                                        displayName = props.lang() === 'ar' ? 'صورة (بدون عنوان)' : 'Image (No Title)';
                                                     }
                                                 }
                                                 
                                                 const details = activeTab() === 'users' ? (props.lang() === 'ar' ? (item.role === 'admin' ? 'مدير' : 'ناشر') : item.role) : 
                                                                 isIntro ? (props.lang() === 'ar' ? 'ميديا الموقع الرئيسية' : 'Main Site Media') :
                                                                 activeTab() === 'media' ? (props.lang() === 'ar' ? 'بند في المركز الإعلامي' : 'Media Center Item') :
                                                                 activeTab() === 'experts' ? (props.lang() === 'ar' ? item.role_ar : item.role_en) :
                                                                 (props.lang() === 'ar' ? (item.category_ar || item.category || '---') : (item.category_en || item.category || '---'));

                                                 return (
                                                     <tr>
                                                         <td>
                                                             <div style={{display: 'flex', 'align-items': 'center', gap: '12px'}}>
                                                                 <Show when={activeTab() !== 'users'}>
                                                                     <div class="table-img-box">
                                                                       {imageUrl.toLowerCase().endsWith('.mp4') || imageUrl.toLowerCase().endsWith('.webm') ? 
                                                                         <div class="table-video-icon"><Icon name="image" /></div> :
                                                                         <img src={getAssetUrl(imageUrl)} class="table-img" />
                                                                       }
                                                                     </div>
                                                                 </Show>
                                                                 <span style={{"font-weight": 700}}>{displayName}</span>
                                                             </div>
                                                         </td>
                                                         <td class="dash-text-muted">{details}</td>
                                                         <td>
                                                             <div style={{display: 'flex', gap: '8px', 'justify-content': 'center'}}>
                                                                 <button class="action-icon-btn edit" onClick={() => openModal(isIntro ? 'intro' : (activeTab() === 'media' ? 'poster' : (activeTab() === 'articles' ? 'article' : activeTab().slice(0,-1))), item)}>
                                                                      <Icon name="edit" />
                                                                      <span>{props.lang() === 'ar' ? 'تعديل' : 'Edit'}</span>
                                                                  </button>
                                                                  <button 
                                                                    class="action-icon-btn delete" 
                                                                    disabled={isIntro}
                                                                    style={{opacity: isIntro ? 0.3 : 1}}
                                                                    onClick={() => handleDelete(isIntro ? 'posters' : (activeTab() === 'media' ? 'posters' : (activeTab() === 'articles' ? 'articles' : (activeTab() === 'experts' ? 'doctors' : (activeTab() === 'users' ? 'profiles' : activeTab())))), item.id)}
                                                                  >
                                                                      <Icon name="trash" />
                                                                      <span>{props.lang() === 'ar' ? 'حذف' : 'Delete'}</span>
                                                                  </button>
                                                             </div>
                                                         </td>
                                                     </tr>
                                                 )
                                            }}
                                        </For>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab() === 'contact' && (
                        <div class="dash-contact-container fade-in">
                            <div class="dash-contact-card">
                                <h3>{props.lang() === 'ar' ? 'برامج التواصل الاجتماعي' : 'Social Platforms'}</h3>
                                <p class="dash-text-muted">{props.lang() === 'ar' ? 'فعّل البرنامج عبر الشيك بوكس ثم أضف الرابط.' : 'Enable each platform with the checkbox, then set its link.'}</p>

                                <div class="dash-contact-grid">
                                    <For each={contactForm().social_links}>
                                        {(item, index) => (
                                            <div class="dash-contact-row">
                                                <div class="dash-contact-label-box">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.enabled}
                                                        onChange={(e) => updateContactField('social_links', index(), 'enabled', e.currentTarget.checked)}
                                                    />
                                                    <img src={getAssetUrl(socialIconMap[item.key])} alt="" class="dash-social-icon" />
                                                    <span>{item.label}</span>
                                                </div>
                                                <input
                                                    class="dash-contact-input"
                                                    type="url"
                                                    value={item.href}
                                                    placeholder="https://"
                                                    onInput={(e) => updateContactField('social_links', index(), 'href', e.currentTarget.value)}
                                                />
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="dash-contact-card">
                                <h3>{props.lang() === 'ar' ? 'البريد الإلكتروني' : 'Emails'}</h3>
                                <div class="dash-contact-grid">
                                    <For each={contactForm().emails}>
                                        {(item, index) => (
                                            <div class="dash-contact-row">
                                                <div class="dash-contact-label-box">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.enabled}
                                                        onChange={(e) => updateContactField('emails', index(), 'enabled', e.currentTarget.checked)}
                                                    />
                                                    <span>{item.label}</span>
                                                </div>
                                                <input
                                                    class="dash-contact-input"
                                                    type="email"
                                                    value={item.value}
                                                    placeholder="name@example.com"
                                                    onInput={(e) => updateContactField('emails', index(), 'value', e.currentTarget.value)}
                                                />
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="dash-contact-card">
                                <h3>{props.lang() === 'ar' ? 'أرقام الجوال' : 'Phone Numbers'}</h3>
                                <div class="dash-contact-grid">
                                    <For each={contactForm().phones}>
                                        {(item, index) => (
                                            <div class="dash-contact-row">
                                                <div class="dash-contact-label-box">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.enabled}
                                                        onChange={(e) => updateContactField('phones', index(), 'enabled', e.currentTarget.checked)}
                                                    />
                                                    <span>{item.label}</span>
                                                </div>
                                                <input
                                                    class="dash-contact-input"
                                                    value={item.value}
                                                    placeholder="+9665..."
                                                    onInput={(e) => updateContactField('phones', index(), 'value', e.currentTarget.value)}
                                                />
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>

                            <div class="dash-contact-card">
                                <h3>{props.lang() === 'ar' ? 'رابط حجز الموعد' : 'Appointment Booking URL'}</h3>
                                <input
                                    class="dash-contact-input full"
                                    type="url"
                                    value={contactForm().booking_url}
                                    placeholder="https://"
                                    onInput={(e) => updateBookingUrl(e.currentTarget.value)}
                                />
                            </div>

                            <div class="dash-contact-actions">
                                <button class="btn-save" onClick={saveContactSettings} disabled={loading()}>
                                    {loading() ? '...' : (props.lang() === 'ar' ? 'حفظ بيانات التواصل' : 'Save Contact Settings')}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab() === 'overview' && (
                        <div class="dash-stats-grid fade-in">
                            <div class="dash-stat-dash-card">
                                <Icon name="package" stroke={2.5} />
                                <div class="dash-stat-info">
                                    <span class="dash-stat-label">{props.lang() === 'ar' ? 'المنتجات' : 'Products'}</span>
                                    <span class="dash-stat-value">{(props.products || []).length}</span>
                                </div>
                            </div>
                            <div class="dash-stat-dash-card">
                                <Icon name="briefcase" stroke={2.5} />
                                <div class="dash-stat-info">
                                    <span class="dash-stat-label">{props.lang() === 'ar' ? 'فريق العمل' : 'Team'}</span>
                                    <span class="dash-stat-value">{(props.experts || []).length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Show when={isModalOpen()}>
                <div class="modal-overlay">
                    <div class="modal-content fade-in">
                        <div class="modal-header">
                            <h3>{editingItem() ? (props.lang() === 'ar' ? 'تعديل' : 'Edit') : (props.lang() === 'ar' ? 'إضافة' : 'Add')}</h3>
                            <button class="close-modal" onClick={() => setIsModalOpen(false)}><Icon name="x" /></button>
                        </div>
                        <form class="form-grid" onSubmit={handleSave}>
                            <Show when={modalType() === 'product' || modalType() === 'expert'}>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                                    <input name="name_ar" value={editingItem()?.name_ar || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الاسم (English)' : 'Name (EN)'}</label>
                                    <input name="name_en" value={editingItem()?.name_en || ''} required />
                                </div>
                            </Show>

                            <Show when={modalType() === 'product'}>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'صورة المنتج' : 'Product Image'}</label>
                                    <FileUploadZone multiple={false} />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'الفئة' : 'Category'}</label>
                                    <select name="category" value={editingItem()?.category || 'IVD'} required>
                                        <For each={productCategoryOptions}>
                                            {(cat) => (
                                                <option value={cat}>{props.t(`cat${cat}`)}</option>
                                            )}
                                        </For>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'رابط البروشور' : 'Brochure URL'}</label>
                                    <input name="brochure_url" value={editingItem()?.brochure_url || ''} />
                                </div>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'الوصف (عربي)' : 'Overview (AR)'}</label>
                                    <textarea name="overview_ar" rows="3" value={editingItem()?.overview_ar || ''}></textarea>
                                </div>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'الوصف (English)' : 'Overview (EN)'}</label>
                                    <textarea name="overview_en" rows="3" value={editingItem()?.overview_en || ''}></textarea>
                                </div>
                            </Show>

                            <Show when={modalType() === 'expert'}>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'صورة العضو' : 'Member Image'}</label>
                                    <FileUploadZone multiple={false} />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'المسمى الوظيفي (عربي)' : 'Job Title (AR)'}</label>
                                    <input name="role_ar" value={editingItem()?.role_ar || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'المسمى الوظيفي (English)' : 'Job Title (EN)'}</label>
                                    <input name="role_en" value={editingItem()?.role_en || ''} required />
                                </div>
                            </Show>

                            <Show when={modalType() === 'article'}>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'صورة المقالة' : 'Article Image'}</label>
                                    <FileUploadZone multiple={false} />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'العنوان (عربي)' : 'Title (AR)'}</label>
                                    <input name="title_ar" value={editingItem()?.title_ar || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'العنوان (English)' : 'Title (EN)'}</label>
                                    <input name="title_en" value={editingItem()?.title_en || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'القسم (عربي)' : 'Category (AR)'}</label>
                                    <input name="category_ar" value={editingItem()?.category_ar || ''} required />
                                </div>
                                <div class="form-group">
                                    <label>{props.lang() === 'ar' ? 'القسم (English)' : 'Category (EN)'}</label>
                                    <input name="category_en" value={editingItem()?.category_en || ''} required />
                                </div>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'مقتطف (عربي)' : 'Excerpt (AR)'}</label>
                                    <textarea name="excerpt_ar" rows="3" value={editingItem()?.excerpt_ar || ''}></textarea>
                                </div>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'مقتطف (English)' : 'Excerpt (EN)'}</label>
                                    <textarea name="excerpt_en" rows="3" value={editingItem()?.excerpt_en || ''}></textarea>
                                </div>
                                <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                    <label>{props.lang() === 'ar' ? 'رابط المقال' : 'Article Link URL'}</label>
                                    <input name="link_url" type="url" value={editingItem()?.link_url || ''} placeholder="https://example.com" />
                                </div>
                            </Show>

                             <Show when={modalType() === 'poster' || modalType() === 'intro'}>
                                 <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                     <label>{modalType() === 'intro' ? (props.lang() === 'ar' ? 'فيديو أو صورة الواجهة' : 'Welcome Screen File') : (props.lang() === 'ar' ? 'صور المركز الإعلامي' : 'Media Images')}</label>
                                     <FileUploadZone multiple={modalType() === 'poster' && !editingItem()} />
                                 </div>
                             </Show>

                             <Show when={modalType() === 'partner'}>
                                 <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                     <label>{props.lang() === 'ar' ? 'شعار الشريك' : 'Partner Logo'}</label>
                                     <FileUploadZone multiple={false} />
                                 </div>
                                 <div class="form-group" style={{"grid-column": "1 / -1"}}>
                                     <label>{props.lang() === 'ar' ? 'اسم الشريك' : 'Partner Name'}</label>
                                     <input name="name" value={editingItem()?.name || ''} required />
                                 </div>
                             </Show>

                             <Show when={modalType() === 'user'}>
                                 <div class="form-group">
                                     <label>{props.lang() === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                     <input name="full_name" value={editingItem()?.full_name || ''} required />
                                 </div>
                                 <div class="form-group">
                                     <label>{props.lang() === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                     <input name="email" type="email" value={editingItem()?.email || ''} required />
                                 </div>
                                 <div class="form-group">
                                     <label>{props.lang() === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                                     <input
                                        name="password"
                                        type="password"
                                        placeholder={editingItem() ? (props.lang() === 'ar' ? 'اتركها فارغة إذا لا تريد التغيير' : 'Leave blank to keep current password') : (props.lang() === 'ar' ? 'أدخل كلمة المرور' : 'Enter password')}
                                        required={!editingItem()}
                                        minLength="6"
                                     />
                                 </div>
                                 <div class="form-group">
                                     <label>{props.lang() === 'ar' ? 'الرتبة' : 'Role'}</label>
                                     <select name="role" value={editingItem()?.role || 'publisher'}>
                                         <option value="admin">{props.lang() === 'ar' ? 'مدير' : 'Admin'}</option>
                                         <option value="publisher">{props.lang() === 'ar' ? 'ناشر' : 'Publisher'}</option>
                                     </select>
                                 </div>
                             </Show>

                            <div class="form-actions">
                                <button type="button" class="btn-cancel" onClick={() => setIsModalOpen(false)}>{props.lang() === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" class="btn-save" disabled={loading()}>
                                    {loading() ? '...' : (props.lang() === 'ar' ? 'حفظ البيانات' : 'Save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Show>
        </div>
    );
}
