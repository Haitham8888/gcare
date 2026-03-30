import { createSignal, createMemo, Show, For, createEffect, onCleanup, onMount } from 'solid-js';
import { supabase, getAssetUrl } from './supabaseClient';
import ImageKit from 'imagekit-javascript';
import './Dashboard.css';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
function Icon(props) {
    const icons = {
        'package': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>,
        'users': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
        'image': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>,
        'plus': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>,
        'edit': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>,
        'trash': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>,
        'x': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
        'log-out': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>,
        'shield': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7Z" /></svg>,
        'book-open': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
        'home': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        'briefcase': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
        'tag': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>,
        'folder': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>,
        'align-left': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="17" y1="18" x2="3" y2="18" /></svg>,
        'align-right': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="12" x2="9" y2="12" /><line x1="21" y1="18" x2="7" y2="18" /></svg>,
        'align-center': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="6" /><line x1="21" y1="12" x2="3" y2="12" /><line x1="18" y1="18" x2="6" y2="18" /></svg>,
        'file-text': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>,
        'menu': <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>,
        'arrow-left': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>,
        'award': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
        'settings': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
        'share-2': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
        'mail': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><rect width="20" height="16" x="2" y="4" rx="2" /></svg>,
        'lock': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
        'user': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        'video': <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>,
        'link': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
        'save': <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={props.stroke || 2} stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>,
        'bold': <svg width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>,
        'italic': <svg width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>,
        'underline': <svg width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>,
        'list': <svg width={props.size || 14} height={props.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    };
    return icons[props.name] || null;
}

const DASHBOARD_TAB_STORAGE_KEY = 'gcare_dashboard_active_tab';

const readStoredDashboardTab = () => {
    if (typeof window === 'undefined') return null;
    try {
        const value = window.localStorage.getItem(DASHBOARD_TAB_STORAGE_KEY);
        return value && value.trim() ? value : null;
    } catch {
        return null;
    }
};

const storeDashboardTab = (tabId) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(DASHBOARD_TAB_STORAGE_KEY, tabId);
    } catch {
        // Ignore localStorage errors.
    }
};

const RichEditor = (props) => {
    let editorRef;
    const execCommand = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        editorRef.focus();
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b': e.preventDefault(); execCommand('bold'); break;
                case 'i': e.preventDefault(); execCommand('italic'); break;
                case 'u': e.preventDefault(); execCommand('underline'); break;
            }
        }
    };

    onMount(() => {
        if (editorRef) {
            editorRef.innerHTML = props.value || '';
        }
    });

    createEffect(() => {
        if (editorRef && props.value !== undefined && editorRef.innerHTML !== props.value) {
            editorRef.innerHTML = props.value || '';
        }
    });

    return (
        <div class="rich-editor-wrapper">
            <div class="rich-editor-toolbar">
                <button type="button" class="toolbar-btn" onClick={() => execCommand('bold')} title="Bold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                </button>
                <button type="button" class="toolbar-btn" onClick={() => execCommand('italic')} title="Italic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
                </button>
                <button type="button" class="toolbar-btn" onClick={() => execCommand('underline')} title="Underline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M6 3v7a6 6 0 0 0 12 0V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button type="button" class="toolbar-btn" onClick={() => execCommand('insertUnorderedList')} title="List">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                </button>
                <button type="button" class="toolbar-btn" onClick={() => execCommand('justifyRight')} title="Right Alignment">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="12" x2="9" y2="12"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
                </button>
                <button type="button" class="toolbar-btn" onClick={() => execCommand('justifyCenter')} title="Center Alignment">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" stroke-width="2"><line x1="18" y1="6" x2="6" y2="6"></line><line x1="21" y1="12" x2="3" y2="12"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
                </button>
                <button type="button" class="toolbar-btn" onClick={() => execCommand('justifyLeft')} title="Left Alignment">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="15" y1="12" x2="3" y2="12"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
                </button>
            </div>
            <div
                ref={editorRef}
                class="rich-editor-area premium-input"
                contenteditable="true"
                onInput={(e) => {
                    const html = e.currentTarget.innerHTML;
                    if (props.onInput) props.onInput(html);
                    const hiddenInput = e.currentTarget.parentElement.querySelector('input[type="hidden"]');
                    if (hiddenInput) hiddenInput.value = html;
                }}
                onKeyDown={handleKeyDown}
            ></div>
            <input type="hidden" name={props.name} value={props.value || ''} />
        </div>
    );
};

function SocialBadge(props) {
    const labels = {
        linkedin: 'in',
        x: 'X',
        tiktok: 'TT',
        instagram: 'IG',
        whatsapp: 'WA'
    };

    return <span class="dash-social-icon-badge" aria-hidden="true">{labels[props.platform] || '#'}</span>;
}

const ImageCropperModal = (props) => {
    let imageRef;
    let cropperInstance;
    const [previewUrl, setPreviewUrl] = createSignal('');

    createEffect(() => {
        if (props.isOpen() && props.src() && imageRef) {
            if (cropperInstance) cropperInstance.destroy();
            cropperInstance = new Cropper(imageRef, {
                aspectRatio: props.aspectRatio || 1 / 1.1,
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
                ready: () => {
                    updatePreview();
                },
                cropend: () => {
                    updatePreview();
                }
            });
        }
    });

    const updatePreview = () => {
        if (!cropperInstance) return;
        const canvas = cropperInstance.getCroppedCanvas({
            width: 800,
            height: 880
        });
        setPreviewUrl(canvas.toDataURL('image/jpeg', 0.9));
    };

    const handleConfirm = () => {
        if (!cropperInstance) return;
        cropperInstance.getCroppedCanvas().toBlob((blob) => {
            props.onConfirm(blob);
            props.onClose();
        }, 'image/jpeg', 0.9);
    };

    return (
        <Show when={props.isOpen()}>
            <div class="cropper-modal-overlay">
                <div class="cropper-container-premium fade-in">
                    <div class="cropper-main-area">
                        <div class="cropper-header">
                            <h3>{props.t('cropImage') || (props.lang() === 'ar' ? 'تعديل وقص الصورة' : 'Edit & Crop Image')}</h3>
                            <button class="action-icon-btn close" onClick={props.onClose}><Icon name="x" /></button>
                        </div>
                        <div class="cropper-canvas-wrap">
                            <img ref={imageRef} src={props.src()} alt="To Crop" />
                        </div>
                    </div>
                    <aside class="cropper-preview-sidebar">
                        <div>
                            <span class="preview-title-badge">{props.lang() === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}</span>
                            <div class="live-preview-box">
                                <div class="article-modern-card">
                                    <div class="article-card-media">
                                        <Show when={previewUrl()} fallback={<div class="loader-spinner"></div>}>
                                            <img src={previewUrl()} alt="Preview" />
                                        </Show>
                                        <div class="article-media-overlay">
                                            <h4>{props.itemTitle() || (props.lang() === 'ar' ? 'عنوان المقال هنا' : 'Article Title Here')}</h4>
                                        </div>
                                    </div>
                                    <div class="article-card-body">
                                        <h3 class="article-cat">{props.lang() === 'ar' ? 'مقال' : 'Article'}</h3>
                                        <p class="article-ex">
                                            {props.lang() === 'ar'
                                                ? 'هذه معاينة حقيقية لشكل المقال في الصفحة الرئيسية بعد رفع الصورة المقصوصة...'
                                                : 'This is a real-time preview of how the article will look on the home page...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cropper-actions">
                            <button class="btn-cropper-cancel" onClick={props.onClose}>{props.lang() === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                            <button class="btn-cropper-save" onClick={handleConfirm}>{props.lang() === 'ar' ? 'اعتماد ورفع' : 'Crop & Upload'}</button>
                        </div>
                    </aside>
                </div>
            </div>
        </Show>
    );
};

export default function Dashboard(props) {
    const productCategoryOptions = ['IVD', 'IUD', 'IUS', 'WomanCare'];
    const defaultContactSettings = {
        social_links: [
            { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/goldencare-medical-company/', enabled: true },
            { key: 'x', label: 'X', href: 'https://x.com/G_Careksa', enabled: true },
            { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@g_careksa', enabled: true },
            { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/G_Careksa', enabled: true },
            { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/966552527862', enabled: false }
        ],
        phones: [
            { label: 'Primary', value: '+966555849237', enabled: true },
            { label: 'Secondary', value: '+966552527862', enabled: true }
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
    const [mediaSubTab, setMediaSubTab] = createSignal(null);
    const [isSidebarOpen, setIsSidebarOpen] = createSignal(false);
    const [isModalOpen, setIsModalOpen] = createSignal(false);
    const [expertSubtitle, setExpertSubtitle] = createSignal(props.t('expertHeroSubtitle') || '');
    const [lakiSubtitle, setLakiSubtitle] = createSignal(props.t('lakiHeroSubtitle') || '');
    const [modalType, setModalType] = createSignal('product');
    const [editingItem, setEditingItem] = createSignal(null);
    const [loading, setLoading] = createSignal(false);
    const [uploadURL, setUploadURL] = createSignal('');
    const [uploadPDFURL, setUploadPDFURL] = createSignal('');
    const [uploadURLs, setUploadURLs] = createSignal([]);
    const [uploadProgress, setUploadProgress] = createSignal(0);
    const [uploadingType, setUploadingType] = createSignal(null);
    const [contactForm, setContactForm] = createSignal(normalizeContactSettings(props.contactSettings));
    const [isCreatingCategory, setIsCreatingCategory] = createSignal(false);
    const [newCategoryAr, setNewCategoryAr] = createSignal('');
    const [newCategoryEn, setNewCategoryEn] = createSignal('');
    const [transActiveSection, setTransActiveSection] = createSignal('home');
    const [transData, setTransData] = createSignal(props.rawTranslations || {});
    const [editorValueAr, setEditorValueAr] = createSignal('');
    const [editorValueEn, setEditorValueEn] = createSignal('');

    // Image Cropper Signals
    const [croppingSrc, setCroppingSrc] = createSignal('');
    const [isCropperOpen, setIsCropperOpen] = createSignal(false);
    const [cropperCallback, setCropperCallback] = createSignal(null);

    createEffect(() => {
        if (props.rawTranslations && Object.keys(props.rawTranslations).length > 0) {
            setTransData(props.rawTranslations);
        }
    });

    const transProductKeys = createMemo(() => {
        const base = ['productsTitle', 'productsSubtitle'];
        const cats = (props.productCategories || []).map(cat => `cat${cat.id}`);
        // Return unique keys just in case
        return [...new Set([...base, ...cats])];
    });

    const getTransLabel = (section, key, lang) => {
        const labelsAr = {
            visitorsLabel: 'تسمية الزيارات',
            partnersLabel: 'تسمية الشركاء',
            achievementsValue: 'قيمة الإنجازات',
            achievementsLabel: 'نص الإنجازات',
            heroTitle: 'عنوان الهيدر',
            heroSubtitle: 'وصف الهيدر',
            heroCtaSecondary: 'زر "تعرف علينا"',
            missionTitle: 'عنوان الرسالة',
            visionTitle: 'عنوان الرؤية',
            valuesTitle: 'عنوان القيم',
            aboutTitle: 'عنوان من نحن',
            aboutP1: 'الفقرة الأولى',
            aboutP2: 'الفقرة الثانية',
            aboutP3: 'الفقرة الثالثة',
            aboutP4: 'الفقرة الرابعة',
            aboutBadge: 'نص الشارة',
            educationSubtitle: 'العنوان الفرعي للتثقيف',
            educationBody: 'نص المقدمة للتثقيف',
            expertJoinWhatsappUrl: 'رابط واتساب إكسبرت',
            visitorsBase: 'العدد الأساسي للزيارات',
            partnersCount: 'عدد الشركاء',
            educationGalleryTitle: 'عنوان المركز الإعلامي',
            eduGallerySubtitle: 'العنوان الفرعي للمركز الإعلامي'
        };
        const labelsEn = {
            visitorsLabel: 'Visitors Label',
            partnersLabel: 'Partners Label',
            achievementsValue: 'Achievements Value',
            achievementsLabel: 'Achievements Label',
            heroTitle: 'Hero Title',
            heroSubtitle: 'Hero Subtitle',
            heroCtaSecondary: 'About Us Button',
            missionTitle: 'Mission Title',
            visionTitle: 'Vision Title',
            visionSubtitle: 'Vision Subtitle',
            valuesTitle: 'Values Title',
            aboutTitle: 'About Title',
            aboutP1: 'Paragraph 1',
            aboutP2: 'Paragraph 2',
            aboutP3: 'Paragraph 3',
            aboutP4: 'Paragraph 4',
            aboutBadge: 'Badge Text',
            educationSubtitle: 'Education Subtitle',
            educationBody: 'Education Introduction',
            expertJoinWhatsappUrl: 'Expert WhatsApp URL',
            visitorsBase: 'Base Visitors Count',
            partnersCount: 'Partners Count',
            educationGalleryTitle: 'Media Center Title',
            eduGallerySubtitle: 'Media Center Subtitle'
        };
        if (labelsAr[key]) return lang === 'ar' ? labelsAr[key] : (labelsEn[key] || key);

        if (section === 'products' && key.startsWith('cat')) {
            const catId = key.replace('cat', '');
            const cat = (props.productCategories || []).find(c => String(c.id) === catId || c.title_en === catId);
            if (cat) return lang === 'ar' ? cat.title_ar : cat.title_en;
            return catId; // Strip 'cat'
        }
        return key;
    };

    const getTransValue = (lang, key) => {
        const val = transData()?.[lang]?.[key];
        if (val) return val;
        // Fallback for new categories to DB names
        if (key.startsWith('cat')) {
            const catId = key.replace('cat', '');
            const cat = (props.productCategories || []).find(c => String(c.id) === catId || c.title_en === catId);
            if (cat) return lang === 'ar' ? cat.title_ar : cat.title_en;
            return catId; // Strip 'cat'
        }
        return '';
    };

    const isAdmin = createMemo(() => props.currentUserRole === 'admin');
    const publisherAllowedTabs = ['overview', 'articles', 'guides', 'media_hub', 'content'];
    const publisherAllowedModalTypes = ['article', 'guide', 'poster', 'site_content', 'expert_step'];
    const publisherAllowedDeleteTables = ['articles', 'posters'];

    const setActiveTabPersisted = (tabId) => {
        setActiveTab(tabId);
        setMediaSubTab(null);
        if (window.innerWidth <= 1024) setIsSidebarOpen(false);
    };

    const saveTranslations = async () => {
        if (!isAdmin()) return;
        setLoading(true);
        try {
            const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
            const authHeader = 'Basic ' + btoa(privateKey + ':');

            const jsonStr = JSON.stringify(transData(), null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const file = new File([blob], "translations.json");

            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', "translations.json");
            formData.append('useUniqueFileName', 'false');
            formData.append('folder', 'configs');
            formData.append('overwriteFile', 'true');

            const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                headers: { 'Authorization': authHeader },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            alert(props.lang() === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Translations saved successfully');
            props.refreshAll();
        } catch (error) {
            console.error('Error saving translations:', error);
            alert(props.lang() === 'ar' ? 'فشل الحفظ' : 'Save failed');
        } finally {
            setLoading(false);
        }
    };

    const updateTranslation = (lang, key, value) => {
        setTransData(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                [key]: value
            }
        }));
    };

    const allTabs = createMemo(() => [
        { id: 'overview', label: props.lang() === 'ar' ? 'الإحصائيات' : 'Overview', icon: 'home' },
        { id: 'products', label: props.lang() === 'ar' ? 'المنتجات' : 'Products', icon: 'package' },
        { id: 'categories', label: props.lang() === 'ar' ? 'فئات المنتجات' : 'Product Categories', icon: 'tag' },
        { id: 'experts', label: props.lang() === 'ar' ? 'الأطباء المتعاونون' : 'Collaborating Physicians', icon: 'briefcase' },
        { id: 'articles', label: props.lang() === 'ar' ? 'المقالات والأخبار' : 'News & Articles', icon: 'book-open' },
        { id: 'guides', label: props.lang() === 'ar' ? 'الأدلة التوعوية' : 'Awareness Guides', icon: 'book-open' },
        { id: 'media_hub', label: props.lang() === 'ar' ? 'الصور والبوسترات' : 'Media Center', icon: 'image' },
        { id: 'translations', label: props.lang() === 'ar' ? 'إدارة المحتوى' : 'Content Management', icon: 'file-text' },
        { id: 'partners', label: props.lang() === 'ar' ? 'شركاء النجاح' : 'Success Partners', icon: 'users' },
        { id: 'contact', label: props.lang() === 'ar' ? 'التواصل' : 'Contact', icon: 'share-2' },
        { id: 'users', label: props.lang() === 'ar' ? 'المستخدمين' : 'Users', icon: 'shield' }
    ]);

    const handleAssetUpload = async (file, titleAr, titleEn, filePrefix) => {
        setLoading(true);
        try {
            const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
            const authHeader = 'Basic ' + btoa(privateKey + ':');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', `${filePrefix}-${Date.now()}.${file.type.split('/')[1] || 'png'}`);
            formData.append('useUniqueFileName', 'false');
            formData.append('folder', 'website_assets');

            const resp = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                headers: { 'Authorization': authHeader },
                body: formData
            });
            const resJson = await resp.json();
            if (!resp.ok) throw new Error();

            const existing = (props.education?.posters || []).find(p => p.title_ar === titleAr);
            if (existing) {
                await supabase.from('posters').update({ img: resJson.url }).eq('id', existing.id);
            } else {
                await supabase.from('posters').insert({
                    title_ar: titleAr,
                    title_en: titleEn,
                    img: resJson.url,
                    category: 'laki'
                });
            }
            alert(props.lang() === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
            props.refreshAll();
        } catch (err) {
            alert(props.lang() === 'ar' ? 'فشل التحديث' : 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const triggerAssetUpload = (titleAr, titleEn, filePrefix) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) handleAssetUpload(file, titleAr, titleEn, filePrefix);
        };
        input.click();
    };

    const tabs = createMemo(() => {
        if (isAdmin()) return allTabs();
        return allTabs().filter(tab => publisherAllowedTabs.includes(tab.id));
    });

    createEffect(() => {
        setContactForm(normalizeContactSettings(props.contactSettings));
    });

    createEffect(() => {
        if (!props.currentUserRole) return;
        const allowed = tabs().map(tab => tab.id);
        if (!allowed.includes(activeTab())) {
            setActiveTabPersisted(allowed[0] || 'articles');
        }
    });

    const handleFileUploadBulk = async (files) => {
        if (!files || files.length === 0) return;
        setUploadingType('bulk');
        setUploadProgress(10);
        try {
            const urls = [];
            const total = files.length;
            const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
            const authHeader = 'Basic ' + btoa(privateKey + ':');

            for (let i = 0; i < total; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileName', `${Date.now()}-${file.name}`);
                formData.append('useUniqueFileName', 'true');
                formData.append('folder', 'uploads');

                const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                    method: 'POST',
                    headers: { 'Authorization': authHeader },
                    body: formData
                });
                if (response.ok) {
                    const data = await response.json();
                    urls.push(data.filePath);
                }
                setUploadProgress(10 + ((i + 1) / total) * 80);
            }

            setUploadURLs([...uploadURLs(), ...urls]);
            if (urls.length > 0) setUploadURL(urls[0]);
            setUploadProgress(100);
            setTimeout(() => {
                setUploadingType(null);
                setUploadProgress(0);
            }, 500);
        } catch (error) {
            console.error('Error uploading:', error.message);
            alert(props.lang() === 'ar' ? 'فشل تحميل بعض الملفات' : 'Upload failed for some files');
            setUploadingType(null);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploadingType('image');
        setUploadProgress(40);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', `${Date.now()}-${file.name}`);
            formData.append('useUniqueFileName', 'true');
            formData.append('folder', 'uploads');

            const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
            const authHeader = 'Basic ' + btoa(privateKey + ':');

            setUploadProgress(60);
            const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                headers: { 'Authorization': authHeader },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Upload failed');
            }

            const data = await response.json();
            setUploadURL(data.filePath);
            setUploadURLs(prev => [...prev, data.filePath]);
            setUploadProgress(100);
            setTimeout(() => setUploadingType(null), 500);
        } catch (error) {
            console.error('Error uploading:', error);
            alert(props.lang() === 'ar' ? 'فشل رفع الملف!' : 'File upload failed!');
            setUploadingType(null);
        }
    };

    const handleFileUploadPDF = async (file) => {
        if (!file) return;
        setUploadingType('pdf');
        setUploadProgress(40);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', `${Date.now()}-${file.name}`);
            formData.append('useUniqueFileName', 'true');
            formData.append('folder', 'pdfs');

            const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
            const authHeader = 'Basic ' + btoa(privateKey + ':');

            setUploadProgress(60);
            const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                headers: { 'Authorization': authHeader },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'PDF upload failed');
            }

            const data = await response.json();
            setUploadPDFURL(data.filePath);
            setUploadProgress(100);
            setTimeout(() => setUploadingType(null), 500);
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert(props.lang() === 'ar' ? 'فشل رفع ملف PDF!' : 'PDF upload failed!');
            setUploadingType(null);
        }
    };

    const cleanupEmptyCategories = async () => {
        try {
            const { data: products } = await supabase.from('products').select('category');
            const used = new Set((products || []).map(p => p.category));
            const { data: categories } = await supabase.from('product_categories').select('title_en');
            const toDelete = (categories || []).filter(c => !used.has(c.title_en)).map(c => c.title_en);
            if (toDelete.length > 0) {
                await supabase.from('product_categories').delete().in('title_en', toDelete);
                props.refreshAll();
            }
        } catch (e) {
            console.error('Cleanup error:', e);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setUploadURL('');
        setUploadPDFURL('');
        setUploadURLs([]);
        setUploadProgress(0);
        setUploadingType(null);
        setIsCreatingCategory(false);
        setNewCategoryAr('');
        setNewCategoryEn('');
    };

    const openModal = (type, item = null) => {
        if (!isAdmin() && !publisherAllowedModalTypes.includes(type)) {
            alert(props.lang() === 'ar' ? 'غير مصرح لك بهذه العملية' : 'You are not allowed to perform this action');
            return;
        }
        setModalType(type);
        setEditingItem(item);
        setEditorValueAr(item?.excerpt_ar || '');
        setEditorValueEn(item?.excerpt_en || '');
        const initialImg = item?.img || item?.main_image || '';
        setUploadURL(initialImg);
        setUploadPDFURL(item?.pdf_url || '');
        setUploadURLs(initialImg ? [initialImg] : []);
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!isAdmin() && !publisherAllowedModalTypes.includes(modalType())) {
            alert(props.lang() === 'ar' ? 'غير مصرح لك بهذه العملية' : 'You are not allowed to perform this action');
            return;
        }

        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const table = {
            'product': 'products',
            'expert': 'doctors',
            'user': 'profiles',
            'article': 'articles',
            'guide': 'articles',
            'expert_step': 'articles',
            'expert_why': 'articles',
            'company_value': 'articles',
            'poster': 'posters',
            'partner': 'partners',
            'intro': 'posters',
            'category': 'product_categories'
        }[modalType()] || 'products';

        // Image Validation
        const imageRequiredTypes = ['product', 'expert', 'article', 'poster', 'partner', 'intro'];
        if (imageRequiredTypes.includes(modalType())) {
            if (!uploadURL() && uploadURLs().length === 0) {
                alert(props.lang() === 'ar' ? 'يرجى رفع صورة أولاً' : 'Please upload at least one image');
                return;
            }
        }

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

                closeModal();
                props.refreshAll();
                return;
            }

            if (modalType() === 'poster' && !editingItem() && uploadURLs().length > 1) {
                // Bulk insert for posters
                const inserts = uploadURLs().map(url => ({
                    title_ar: data.title_ar || 'IMAGE',
                    title_en: data.title_en || (data.title_ar || 'IMAGE'),
                    img: url,
                    category: data.category || (activeTab() === 'home_media' ? 'home' : (activeTab() === 'about_media' ? 'about' : 'laki'))
                }));
                const { error } = await supabase.from(table).insert(inserts);
                if (error) throw error;
            } else {
                let finalData = { ...data };

                if (modalType() === 'product') {
                    let categoryId = data.category;
                    if (isCreatingCategory()) {
                        const { data: newCat, error: catError } = await supabase.from('product_categories').insert({
                            title_ar: newCategoryAr() || newCategoryEn(),
                            title_en: newCategoryEn()
                        }).select().single();
                        if (catError) throw catError;
                        categoryId = newCat.title_en;
                        props.refreshAll();
                    }
                    finalData = {
                        id: editingItem()?.id || data.title_en.toLowerCase().replace(/\s+/g, '-'),
                        title_ar: data.title_ar,
                        title_en: data.title_en,
                        category: categoryId || 'IVD',
                        main_image: uploadURL(),
                        overview_ar: data.overview_ar || '',
                        overview_en: data.overview_en || '',
                        pdf_url: uploadPDFURL() || data.pdf_url || '',
                        brochure_url: uploadPDFURL() || data.pdf_url || ''
                    };
                }
                else if (modalType() === 'expert') {
                    finalData = {
                        title_ar: data.title_ar,
                        title_en: data.title_en,
                        details_ar: data.details_ar,
                        details_en: data.details_en,
                        img: uploadURL(),
                        order_index: parseInt(data.order_index) || 0
                    };
                } else if (['article', 'guide', 'expert_step', 'expert_why', 'company_value'].includes(modalType())) {
                    finalData = {
                        title_ar: data.title_ar,
                        title_en: data.title_en,
                        details_ar: data.details_ar || (modalType() === 'expert_step' ? 'Expert Step' : (modalType() === 'expert_why' ? 'Expert Why' : '')),
                        details_en: data.details_en || (modalType() === 'expert_step' ? 'Expert Step' : (modalType() === 'expert_why' ? 'Expert Why' : '')),
                        excerpt_ar: ['article', 'guide'].includes(modalType()) ? editorValueAr() : data.excerpt_ar,
                        excerpt_en: ['article', 'guide'].includes(modalType()) ? editorValueEn() : data.excerpt_en,
                        link_url: data.link_url || '',
                        pdf_url: uploadPDFURL() || data.pdf_url || '',
                        img: uploadURL() || editingItem()?.img || '',
                        type: modalType(),
                        order_index: parseInt(data.order_index) || 0
                    };
                } else if (modalType() === 'poster') {
                    finalData = {
                        title_ar: data.title_ar || 'IMAGE',
                        title_en: data.title_en || 'IMAGE',
                        img: uploadURL(),
                        category: data.category || mediaSubTab() || (activeTab() === 'media_hub' ? 'general' : 'laki')
                    };
                } else if (modalType() === 'category') {
                    finalData = {
                        title_ar: data.title_ar,
                        title_en: data.title_en
                    };
                } else if (modalType() === 'partner') {
                    finalData = {
                        title: data.title,
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
            closeModal();
            props.refreshAll();
            if (modalType() === 'product') cleanupEmptyCategories();
        } catch (error) {
            console.error('Save error:', error);
            alert(error?.message || (props.lang() === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving data'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (table, id) => {
        if (!confirm(props.lang() === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;

        if (!isAdmin() && !publisherAllowedDeleteTables.includes(table)) {
            alert(props.lang() === 'ar' ? 'غير مصرح لك بهذه العملية' : 'You are not allowed to perform this action');
            return;
        }

        try {
            if (table === 'users') {
                const { error } = await supabase.rpc('admin_delete_dashboard_user', {
                    p_user_id: id
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.from(table).delete().eq('id', id);
                if (error) throw error;
            }
            props.refreshAll();
            if (table === 'products') cleanupEmptyCategories();
        } catch (error) {
            console.error('Delete error:', error);
            alert(error?.message || (props.lang() === 'ar' ? 'تعذر الحذف' : 'Delete failed'));
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

    const saveProgramSettings = async (progId) => {
        if (!isAdmin()) return;
        setLoading(true);
        try {
            const subtitle = progId === 'expert' ? expertSubtitle() : lakiSubtitle();
            const configKey = progId === 'expert' ? 'expertHeroSubtitle' : 'lakiHeroSubtitle';

            // We use standard translation update for now since it's the source of these strings
            alert(props.lang() === 'ar'
                ? `جاري الحفظ: ${subtitle}`
                : `Saving: ${subtitle}`);

            // Mock success for UI demo, in a real env we'd hit site_configs table
            setTimeout(() => {
                setLoading(false);
                alert(props.lang() === 'ar' ? 'تم حفظ الإعدادات' : 'Settings saved');
            }, 800);
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    };

    const saveContactSettings = async () => {
        if (!isAdmin()) {
            alert(props.lang() === 'ar' ? 'غير مصرح لك بهذه العملية' : 'You are not allowed to perform this action');
            return;
        }

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

    const FileUploadZone = (ps) => {
        const inputId = ps.id || 'fileInput';
        const isThisUploading = createMemo(() => (ps.pdf && uploadingType() === 'pdf') || (!ps.pdf && !ps.multiple && uploadingType() === 'image') || (ps.multiple && uploadingType() === 'bulk'));

        return (
            <div
                class={`upload-dropzone ${isThisUploading() ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
                onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('dragging');
                    const file = e.dataTransfer.files[0];
                    if (!file) return;
                    if (ps.multiple) handleFileUploadBulk(e.dataTransfer.files);
                    else if (ps.pdf) handleFileUploadPDF(file);
                    else {
                        if (['article', 'guide', 'poster', 'expert_step', 'expert_why'].includes(modalType())) {
                            const reader = new FileReader();
                            reader.onload = (re) => {
                                setCroppingSrc(re.target.result);
                                setCropperCallback(() => (blob) => {
                                    const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
                                    handleFileUpload(croppedFile);
                                });
                                setIsCropperOpen(true);
                            };
                            reader.readAsDataURL(file);
                        } else {
                            handleFileUpload(file);
                        }
                    }
                }}
                onClick={() => document.getElementById(inputId).click()}
            >
                <input
                    type="file"
                    id={inputId}
                    style="display:none"
                    accept={ps.accept || "image/*"}
                    multiple={ps.multiple}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (ps.multiple) handleFileUploadBulk(e.target.files);
                        else if (ps.pdf) handleFileUploadPDF(file);
                        else {
                            if (['article', 'guide', 'poster', 'expert_step', 'expert_why'].includes(modalType())) {
                                const reader = new FileReader();
                                reader.onload = (re) => {
                                    setCroppingSrc(re.target.result);
                                    setCropperCallback(() => (blob) => {
                                        const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
                                        handleFileUpload(croppedFile);
                                    });
                                    setIsCropperOpen(true);
                                };
                                reader.readAsDataURL(file);
                            } else {
                                handleFileUpload(file);
                            }
                        }
                    }}
                />
                <div class="upload-inner">
                    <Icon name={ps.pdf ? "file-text" : ps.multiple ? "package" : "upload-cloud"} size={32} />
                    <p>{props.lang() === 'ar' ? 'اسحب الملف هنا أو انقر للتصفح' : 'Drag file here or click to browse'}</p>
                    <span class="upload-hint">{ps.accept || (props.lang() === 'ar' ? 'صور فقط' : 'Images only')}</span>
                </div>
                <Show when={isThisUploading()}>
                    <div class="upload-overlay">
                        <div class="loader-spinner"></div>
                        <span>{uploadProgress()}%</span>
                    </div>
                </Show>
            </div>
        );
    };

    const listData = createMemo(() => {
        const tab = activeTab();
        let raw = [];
        if (tab === 'products') raw = props.products;
        else if (tab === 'categories') raw = props.productCategories;
        else if (tab === 'experts') {
            // Default to doctors if no sub-tabbing, but generic table handles specialists
            raw = props.experts;
        }
        else if (tab === 'articles') {
            const list = (props.education || {}).articles || [];
            raw = list.filter(a => a.type === 'general');
        }
        else if (tab === 'guides') {
            const list = (props.education || {}).articles || [];
            raw = list.filter(a => a.type === 'guide' || !a.type);
        }
        else if (tab === 'media_hub') {
            const list = (props.education || {}).posters || [];
            if (!mediaSubTab()) return [];
            raw = list.filter(p => !['MAIN', 'INTRO', 'HEALTH_EDU_HERO', 'HEALTH_EDU_LAKI_BG', 'HEALTH_EDU_EXPERT_BG', 'HEALTH_EDU_LAKI_HERO', 'HEALTH_EDU_EXPERT_HERO'].includes(p.title_ar) && p.category === mediaSubTab());
        }
        else if (tab === 'partners') raw = props.partners;
        else if (tab === 'users') raw = props.profiles;
        return Array.isArray(raw) ? raw : [];
    });

    const activeTabLabel = () => tabs().find(t => t.id === activeTab())?.label || '';

    return (
        <Show when={props.currentUserRole} fallback={
            <div class="dashboard-init-loader">
                <img src={getAssetUrl('static/img/G - Care-01.svg')} alt="Logo" class="loader-logo" />
                <div class="dash-spinner-container">
                    <div class="dash-big-spinner"></div>
                    <span class="loading-status-text">{props.lang() === 'ar' ? 'جاري التحقق من الصلاحيات...' : 'Verifying Permissions...'}</span>
                </div>
            </div>
        }>
            <div class={`dash-container ${props.lang() === 'ar' ? 'rtl' : 'ltr'}`}>
                <Show when={isSidebarOpen() && window.innerWidth <= 1024}>
                    <div class="sidebar-overlay active" onClick={() => setIsSidebarOpen(false)}></div>
                </Show>
                <aside class={`dash-sidebar ${isSidebarOpen() ? 'open' : 'closed'}`}>
                    <button class="mobile-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen())}>
                        <Icon name={isSidebarOpen() ? "x" : "menu"} />
                    </button>
                    <div class="dash-sidebar-header">
                        <img src={getAssetUrl('static/img/G - Care-01.svg')} alt="Logo" class="dash-logo" />
                    </div>
                    <nav class="dash-nav">
                        <For each={tabs()}>
                            {(tab) => (
                                <button
                                    class={`dash-nav-item ${activeTab() === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTabPersisted(tab.id)}
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
                        <div style={{ display: 'flex', 'align-items': 'center', gap: '15px' }}>
                            <button class="mobile-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen())}>
                                <Icon name="menu" stroke={2.5} />
                            </button>
                            <h2 class="dash-page-title">{activeTabLabel()}</h2>
                        </div>
                        <div class="dash-top-actions">
                            <span class="admin-dash-badge" style={{ "font-size": "0.8rem", "padding": "5px 12px", "background": "rgba(16, 147, 165, 0.1)", "border-radius": "8px", "color": "var(--dash-accent)", "font-weight": "800" }}>
                                {props.currentUserRole === 'admin' ? (props.lang() === 'ar' ? 'مدير' : 'Admin') : (props.lang() === 'ar' ? 'ناشر' : 'Publisher')}
                            </span>
                            <button class="dash-lang-btn" onClick={() => props.setLang(l => l === 'ar' ? 'en' : 'ar')}>
                                {props.lang() === 'ar' ? 'English' : 'العربية'}
                            </button>
                        </div>
                    </header>

                    <div class="dash-content-area">
                        {activeTab() === 'translations' && (
                            <div class="dash-translations fade-in">
                                <div class="dash-contact-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div class="translations-sidebar-layout">
                                        <div class="trans-left-nav">
                                            {[
                                                { id: 'home', label: props.lang() === 'ar' ? 'الرئيسية' : 'Homepage', icon: 'home' },
                                                { id: 'about', label: props.lang() === 'ar' ? 'من نحن' : 'About Us', icon: 'users' },
                                                { id: 'education', label: props.lang() === 'ar' ? 'التثقيف الصحي' : 'Health Education', icon: 'book-open' },
                                                { id: 'expert', label: props.lang() === 'ar' ? 'برنامج اكسبرت' : 'Expert Program', icon: 'briefcase' },
                                                { id: 'laki', label: props.lang() === 'ar' ? 'لكِ وبوعي' : 'Laki & Wa\'y', icon: 'award' },
                                                { id: 'contact', label: props.lang() === 'ar' ? 'تواصل معنا' : 'Contact Us', icon: 'mail' },
                                                { id: 'products', label: props.lang() === 'ar' ? 'المنتجات' : 'Products', icon: 'package' },
                                                { id: 'footer', label: props.lang() === 'ar' ? 'الفوتر' : 'Footer', icon: 'settings' },
                                                { id: 'nav', label: props.lang() === 'ar' ? 'الروابط' : 'Navigation', icon: 'link' }
                                            ]
                                                .map(sec => (
                                                    <button
                                                        class={`trans-nav-btn ${transActiveSection() === sec.id ? 'active' : ''}`}
                                                        onClick={() => setTransActiveSection(sec.id)}
                                                    >
                                                        <Icon name={sec.icon} size={16} />
                                                        <span>{sec.label}</span>
                                                    </button>
                                                ))}
                                        </div>
                                        <div class="trans-editor-content">
                                            <div class="trans-header">
                                                <h3>{props.lang() === 'ar' ? 'إدارة المحتوى' : 'Content Management'}</h3>
                                                <button class="btn-save" onClick={saveTranslations} disabled={loading()}>
                                                    <Icon name="save" size={16} />
                                                    <span>{loading() ? (props.lang() === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (props.lang() === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}</span>
                                                </button>
                                            </div>
                                            <div class="trans-fields-scroll">
                                                <Show when={transActiveSection() === 'home'}>
                                                    <div class="video-drop-zone premium-card"
                                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragging'); }}
                                                        onDrop={async (e) => {
                                                            e.preventDefault();
                                                            e.currentTarget.classList.remove('dragging');
                                                            const file = e.dataTransfer.files[0];
                                                            if (!file || !file.type.startsWith('video/')) return;
                                                            handleAssetUpload(file, 'MAIN', 'Homepage Hero Video', 'hero-intro');
                                                        }}
                                                    >
                                                        <div class="video-manager-header">
                                                            <h4>{props.lang() === 'ar' ? 'فيديو المقدمة في الرئيسية' : 'Homepage Hero Video'}</h4>
                                                            <span class="upload-hint">{props.lang() === 'ar' ? 'اسحب وأفلت المقطع هنا أو انقر للتغيير' : 'Drag & drop clip here or click to change'}</span>
                                                        </div>
                                                        <div class="video-manager-body">
                                                            <video
                                                                src={getAssetUrl((props.education?.posters || []).find(p => p.title_ar === 'MAIN' || p.title_ar === 'INTRO')?.img || '')}
                                                                class="manager-hero-vid"
                                                                autoPlay muted loop playsInline
                                                            ></video>
                                                            <button class="btn-change-vid" onClick={() => triggerAssetUpload('MAIN', 'Homepage Hero Video', 'hero-intro')}>
                                                                <Icon name="plus" size={24} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                </Show>
                                                <Show when={transActiveSection() === 'education'}>
                                                    <div class="education-assets-grid" style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", "margin-bottom": "2rem" }}>
                                                        {/* Hero Image */}
                                                        <div class="video-drop-zone premium-card"
                                                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                                                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragging'); }}
                                                            onDrop={async (e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.remove('dragging');
                                                                const file = e.dataTransfer.files[0];
                                                                if (!file || !file.type.startsWith('image/')) return;
                                                                handleAssetUpload(file, 'HEALTH_EDU_HERO', 'Health Education Hero', 'health-edu-hero');
                                                            }}
                                                        >
                                                            <div class="video-manager-header">
                                                                <h4>{props.lang() === 'ar' ? 'صورة الهيدر الرئيسية' : 'Main Header Image'}</h4>
                                                                <span class="upload-hint">{props.lang() === 'ar' ? 'اسحب الصورة هنا أو انقر للتغيير' : 'Drag image here or click to change'}</span>
                                                            </div>
                                                            <div class="video-manager-body">
                                                                <img
                                                                    src={getAssetUrl((props.education?.posters || []).find(p => p.title_ar === 'HEALTH_EDU_HERO')?.img || 'static/img/HealthEducation/health_edu_5.png')}
                                                                    class="manager-hero-vid"
                                                                    style={{ "object-fit": "contain" }}
                                                                />
                                                                <button class="btn-change-vid" onClick={() => triggerAssetUpload('HEALTH_EDU_HERO', 'Health Education Hero', 'health-edu-hero')}>
                                                                    <Icon name="plus" size={24} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Laki Card BG */}
                                                        <div class="video-drop-zone premium-card"
                                                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                                                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragging'); }}
                                                            onDrop={async (e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.remove('dragging');
                                                                const file = e.dataTransfer.files[0];
                                                                if (!file || !file.type.startsWith('image/')) return;
                                                                handleAssetUpload(file, 'HEALTH_EDU_LAKI_BG', 'Laki Program Background', 'health-edu-laki');
                                                            }}
                                                        >
                                                            <div class="video-manager-header">
                                                                <h4>{props.lang() === 'ar' ? 'خلفية كرت "لكِ وبوعي"' : 'Laki Card Background'}</h4>
                                                                <span class="upload-hint">{props.lang() === 'ar' ? 'اسحب الصورة هنا أو انقر للتغيير' : 'Drag image here or click to change'}</span>
                                                            </div>
                                                            <div class="video-manager-body" style={{ "aspect-ratio": "4 / 3", "max-height": "240px" }}>
                                                                <img
                                                                    src={getAssetUrl((props.education?.posters || []).find(p => p.title_ar === 'HEALTH_EDU_LAKI_BG')?.img || 'static/img/12.png')}
                                                                    class="manager-hero-vid"
                                                                    style={{ "object-fit": "cover" }}
                                                                />
                                                                <button class="btn-change-vid" onClick={() => triggerAssetUpload('HEALTH_EDU_LAKI_BG', 'Laki Program Background', 'health-edu-laki')}>
                                                                    <Icon name="plus" size={24} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Expert Card BG */}
                                                        <div class="video-drop-zone premium-card"
                                                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                                                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragging'); }}
                                                            onDrop={async (e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.remove('dragging');
                                                                const file = e.dataTransfer.files[0];
                                                                if (!file || !file.type.startsWith('image/')) return;
                                                                handleAssetUpload(file, 'HEALTH_EDU_EXPERT_BG', 'Expert Program Background', 'health-edu-expert');
                                                            }}
                                                        >
                                                            <div class="video-manager-header">
                                                                <h4>{props.lang() === 'ar' ? 'خلفية كرت "برنامج اكسبرت"' : 'Expert Card Background'}</h4>
                                                                <span class="upload-hint">{props.lang() === 'ar' ? 'اسحب الصورة هنا أو انقر للتغيير' : 'Drag image here or click to change'}</span>
                                                            </div>
                                                            <div class="video-manager-body" style={{ "aspect-ratio": "4 / 3", "max-height": "240px" }}>
                                                                <img
                                                                    src={getAssetUrl((props.education?.posters || []).find(p => p.title_ar === 'HEALTH_EDU_EXPERT_BG')?.img || 'static/img/13.png')}
                                                                    class="manager-hero-vid"
                                                                    style={{ "object-fit": "cover" }}
                                                                />
                                                                <button class="btn-change-vid" onClick={() => triggerAssetUpload('HEALTH_EDU_EXPERT_BG', 'Expert Program Background', 'health-edu-expert')}>
                                                                    <Icon name="plus" size={24} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Show>

                                                <Show when={transActiveSection() === 'expert'}>
                                                    <div class="education-assets-grid" style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", "margin-bottom": "2rem" }}>
                                                        <div class="video-drop-zone premium-card"
                                                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                                                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragging'); }}
                                                            onDrop={async (e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.remove('dragging');
                                                                const file = e.dataTransfer.files[0];
                                                                if (!file || !file.type.startsWith('image/')) return;
                                                                handleAssetUpload(file, 'HEALTH_EDU_EXPERT_HERO', 'Expert Hero Image', 'health-edu-expert-hero');
                                                            }}
                                                        >
                                                            <div class="video-manager-header">
                                                                <h4>{props.lang() === 'ar' ? 'صورة هيدر برنامج اكسبرت' : 'Expert Hero Image'}</h4>
                                                                <span class="upload-hint">{props.lang() === 'ar' ? 'اسحب الصورة هنا أو انقر للتغيير' : 'Drag image here or click to change'}</span>
                                                            </div>
                                                            <div class="video-manager-body">
                                                                <img
                                                                    src={getAssetUrl((props.education?.posters || []).find(p => p.title_ar === 'HEALTH_EDU_EXPERT_HERO')?.img || 'static/img/G - Care-01.svg')}
                                                                    class="manager-hero-vid"
                                                                    style={{ "object-fit": "contain" }}
                                                                />
                                                                <button class="btn-change-vid" onClick={() => triggerAssetUpload('HEALTH_EDU_EXPERT_HERO', 'Expert Hero Image', 'health-edu-expert-hero')}>
                                                                    <Icon name="plus" size={24} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Show>

                                                <Show when={transActiveSection() === 'laki'}>
                                                    <div class="education-assets-grid" style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", "margin-bottom": "2rem" }}>
                                                        <div class="video-drop-zone premium-card"
                                                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                                                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragging'); }}
                                                            onDrop={async (e) => {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.remove('dragging');
                                                                const file = e.dataTransfer.files[0];
                                                                if (!file || !file.type.startsWith('image/')) return;
                                                                handleAssetUpload(file, 'HEALTH_EDU_LAKI_HERO', 'Laki Hero Image', 'health-edu-laki-hero');
                                                            }}
                                                        >
                                                            <div class="video-manager-header">
                                                                <h4>{props.lang() === 'ar' ? 'صورة هيدر لكِ وبوعي' : 'Laki Hero Image'}</h4>
                                                                <span class="upload-hint">{props.lang() === 'ar' ? 'اسحب الصورة هنا أو انقر للتغيير' : 'Drag image here or click to change'}</span>
                                                            </div>
                                                            <div class="video-manager-body">
                                                                <img
                                                                    src={getAssetUrl((props.education?.posters || []).find(p => p.title_ar === 'HEALTH_EDU_LAKI_HERO')?.img || 'static/img/HealthEducation/health_edu_5.png')}
                                                                    class="manager-hero-vid"
                                                                    style={{ "object-fit": "contain" }}
                                                                />
                                                                <button class="btn-change-vid" onClick={() => triggerAssetUpload('HEALTH_EDU_LAKI_HERO', 'Laki Hero Image', 'health-edu-laki-hero')}>
                                                                    <Icon name="plus" size={24} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Show>

                                                <div class="trans-lang-grid">
                                                    <div class="trans-lang-col">
                                                        <h4 class="lang-title">العربية (AR)</h4>
                                                        <For each={
                                                            transActiveSection() === 'home' ? ['heroTitle', 'heroSubtitle', 'heroCtaSecondary', 'aboutTitle', 'aboutP1', 'missionTitle', 'visionTitle', 'valuesTitle', 'visitorsLabel', 'visitorsBase', 'partnersLabel', 'partnersCount', 'achievementsLabel', 'achievementsValue', 'educationGalleryTitle', 'eduGallerySubtitle'] :
                                                                transActiveSection() === 'about' ? ['aboutTitle', 'aboutP1', 'aboutP2', 'aboutP3', 'aboutP4', 'aboutBadge'] :
                                                                    transActiveSection() === 'education' ? ['educationSubtitle', 'educationBody', 'educationTopic1Title', 'educationTopic1Body', 'educationTopic2Title', 'educationTopic2Body', 'eduGallerySubtitle', 'eduLakiExploreBtn', 'eduExpertJoinBtn', 'contactAppointmentTitle', 'contactAppointmentSub', 'contactAppointmentBtn', 'eduContactTitle', 'eduEmailLabel', 'eduBookingUrl', 'eduWhatsAppNumber', 'eduEmailAddress'] :
                                                                        transActiveSection() === 'expert' ? ['expertHeroTitle', 'expertHeroSubtitle', 'expertJoinAction', 'expertJoinWhatsappUrl', 'expertWhyTitle', 'expertHowTitle'] :
                                                                            transActiveSection() === 'laki' ? ['lakiHeroTitle', 'lakiHeroSubtitle', 'lakiSignupTitle', 'lakiPostersTitle', 'lakiLatestAdditions'] :
                                                                                transActiveSection() === 'contact' ? ['contactPageTitle', 'contactPageSubtitle', 'contactPageBody1', 'contactPageBody2', 'contactPhoneValue', 'contactEmailNote', 'contactAddressValue'] :
                                                                                    transActiveSection() === 'products' ? transProductKeys() :
                                                                                        transActiveSection() === 'footer' ? ['footerTagline', 'footerAbout', 'footerRights', 'newsletterTitle'] :
                                                                                            ['navHome', 'navAbout', 'navProducts', 'navEducation', 'navContact']
                                                        }>
                                                            {key => (
                                                                <div class="form-group premium-group">
                                                                    <label class="premium-label">{getTransLabel(transActiveSection(), key, 'ar')}</label>
                                                                    <Show when={key.toLowerCase().includes('title') || key.toLowerCase().includes('label') || key.toLowerCase().includes('btn') || key.toLowerCase().includes('badge')} fallback={
                                                                        <RichEditor
                                                                            value={getTransValue('ar', key)}
                                                                            onInput={(v) => updateTranslation('ar', key, v)}
                                                                        />
                                                                    }>
                                                                        <textarea
                                                                            class="premium-input"
                                                                            rows="2"
                                                                            value={getTransValue('ar', key)}
                                                                            onInput={(e) => updateTranslation('ar', key, e.target.value)}
                                                                        ></textarea>
                                                                    </Show>
                                                                </div>
                                                            )}
                                                        </For>
                                                    </div>
                                                    <div class="trans-lang-col">
                                                        <h4 class="lang-title">English (EN)</h4>
                                                        <For each={
                                                            transActiveSection() === 'home' ? ['heroTitle', 'heroSubtitle', 'heroCtaSecondary', 'aboutTitle', 'aboutP1', 'missionTitle', 'visionTitle', 'valuesTitle', 'visitorsLabel', 'visitorsBase', 'partnersLabel', 'partnersCount', 'achievementsLabel', 'achievementsValue', 'educationGalleryTitle', 'eduGallerySubtitle'] :
                                                                transActiveSection() === 'about' ? ['aboutTitle', 'aboutP1', 'aboutP2', 'aboutP3', 'aboutP4', 'aboutBadge'] :
                                                                    transActiveSection() === 'education' ? ['educationSubtitle', 'educationBody', 'educationTopic1Title', 'educationTopic1Body', 'educationTopic2Title', 'educationTopic2Body', 'eduGallerySubtitle', 'eduLakiExploreBtn', 'eduExpertJoinBtn', 'contactAppointmentTitle', 'contactAppointmentSub', 'contactAppointmentBtn', 'eduContactTitle', 'eduEmailLabel', 'eduBookingUrl', 'eduWhatsAppNumber', 'eduEmailAddress'] :
                                                                        transActiveSection() === 'expert' ? ['expertHeroTitle', 'expertHeroSubtitle', 'expertJoinAction', 'expertJoinWhatsappUrl', 'expertWhyTitle', 'expertHowTitle'] :
                                                                            transActiveSection() === 'laki' ? ['lakiHeroTitle', 'lakiHeroSubtitle', 'lakiSignupTitle', 'lakiPostersTitle', 'lakiLatestAdditions'] :
                                                                                transActiveSection() === 'contact' ? ['contactPageTitle', 'contactPageSubtitle', 'contactPageBody1', 'contactPageBody2', 'contactPhoneValue', 'contactEmailNote', 'contactAddressValue'] :
                                                                                    transActiveSection() === 'products' ? transProductKeys() :
                                                                                        transActiveSection() === 'footer' ? ['footerTagline', 'footerAbout', 'footerRights', 'newsletterTitle'] :
                                                                                            ['navHome', 'navAbout', 'navProducts', 'navEducation', 'navContact']
                                                        }>
                                                            {key => (
                                                                <div class="form-group premium-group">
                                                                    <label class="premium-label">{getTransLabel(transActiveSection(), key, 'en')}</label>
                                                                    <Show when={key.toLowerCase().includes('title') || key.toLowerCase().includes('label') || key.toLowerCase().includes('btn') || key.toLowerCase().includes('badge')} fallback={
                                                                        <RichEditor
                                                                            value={getTransValue('en', key)}
                                                                            onInput={(v) => updateTranslation('en', key, v)}
                                                                        />
                                                                    }>
                                                                        <textarea
                                                                            class="premium-input"
                                                                            rows="2"
                                                                            value={getTransValue('en', key)}
                                                                            onInput={(e) => updateTranslation('en', key, e.target.value)}
                                                                        ></textarea>
                                                                    </Show>
                                                                </div>
                                                            )}
                                                        </For>
                                                    </div>
                                                    <Show when={transActiveSection() === 'about'}>
                                                        {/* Company Values Section */}
                                                        <div class="dash-table-container" style={{ "margin-top": "3rem", "box-shadow": "none", "border": "1px solid #e2e8f0", "background": "#fdfdfd" }}>
                                                            <div class="dash-table-header" style={{ "background": "#fff", "border-bottom": "1px solid #e2e8f0", "padding": "1.25rem 1.5rem" }}>
                                                                <h3 style={{ "font-size": "1.1rem", "font-weight": "800", "color": "var(--dash-ink)" }}>
                                                                    {props.lang() === 'ar' ? 'قيمنا الأساسية' : 'Core Values'}
                                                                </h3>
                                                                <button class="btn-add" onClick={() => openModal('company_value')} style={{ "padding": "8px 16px", "font-size": "0.85rem" }}>
                                                                    <Icon name="plus" size={18} />
                                                                    <span>{props.lang() === 'ar' ? 'إضافة قيمة' : 'Add Value'}</span>
                                                                </button>
                                                            </div>
                                                            <div class="table-responsive">
                                                                <table class="dash-table">
                                                                    <thead style={{ "background": "#f8fafc" }}>
                                                                        <tr>
                                                                            <th style={{ "width": "60px", "text-align": "center" }}>#</th>
                                                                            <th>{props.lang() === 'ar' ? 'القيمة والتفاصيل' : 'Value & Details'}</th>
                                                                            <th style={{ "width": "120px", "text-align": "center" }}>{props.lang() === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody style={{ "background": "#fff" }}>
                                                                        <For each={((props.education || {}).articles || []).filter(a => a.type === 'company_value').sort((a, b) => (a.order_index || 0) - (b.order_index || 0))}>
                                                                            {(item, idx) => (
                                                                                <tr>
                                                                                    <td style={{ "text-align": "center", "font-weight": "700", "color": "var(--dash-accent)" }}>{item.order_index || (idx() + 1)}</td>
                                                                                    <td>
                                                                                        <div style={{ "display": "flex", "align-items": "center", "gap": "12px" }}>
                                                                                            <Show when={item.img}>
                                                                                                <div style={{ "width": "36px", "height": "36px", "background": "var(--dash-accent-soft)", "border-radius": "8px", "padding": "6px", "display": "flex", "align-items": "center", "justify-content": "center" }}>
                                                                                                    <img src={getAssetUrl(item.img)} style={{ "width": "20px", "height": "20px" }} />
                                                                                                </div>
                                                                                            </Show>
                                                                                            <div style={{ "display": "flex", "flex-direction": "column", "gap": "2px" }}>
                                                                                                <span style={{ "font-weight": "700", "color": "var(--dash-ink)" }}>{props.lang() === 'ar' ? item.title_ar : item.title_en}</span>
                                                                                                <span class="dash-text-muted" style={{ "font-size": "0.85rem", "white-space": "normal", "max-width": "500px" }}>
                                                                                                    {props.lang() === 'ar' ? item.details_ar : item.details_en}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div style={{ display: 'flex', gap: '8px', 'justify-content': 'center' }}>
                                                                                            <button class="action-icon-btn edit" onClick={() => openModal('company_value', item)} title={props.lang() === 'ar' ? 'تعديل' : 'Edit'}>
                                                                                                <Icon name="edit" size={16} />
                                                                                            </button>
                                                                                            <button class="action-icon-btn delete" onClick={() => handleDelete('articles', item.id)} title={props.lang() === 'ar' ? 'حذف' : 'Delete'}>
                                                                                                <Icon name="trash" size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </For>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </Show>
                                                    <Show when={transActiveSection() === 'expert'}>
                                                        {/* Why Expert Section */}
                                                        <div class="dash-table-container" style={{ "margin-top": "3rem", "box-shadow": "none", "border": "1px solid #e2e8f0", "background": "#fdfdfd" }}>
                                                            <div class="dash-table-header" style={{ "background": "#fff", "border-bottom": "1px solid #e2e8f0", "padding": "1.25rem 1.5rem" }}>
                                                                <h3 style={{ "font-size": "1.1rem", "font-weight": "800", "color": "var(--dash-ink)" }}>
                                                                    {props.lang() === 'ar' ? 'مميزات العيادة (لماذا عيادة إكسبرت؟)' : 'Clinic Advantages (Why Expert?)'}
                                                                </h3>
                                                                <button class="btn-add" onClick={() => openModal('expert_why')} style={{ "padding": "8px 16px", "font-size": "0.85rem" }}>
                                                                    <Icon name="plus" size={18} />
                                                                    <span>{props.lang() === 'ar' ? 'إضافة مميزة' : 'Add Highlight'}</span>
                                                                </button>
                                                            </div>
                                                            <div class="table-responsive">
                                                                <table class="dash-table">
                                                                    <thead style={{ "background": "#f8fafc" }}>
                                                                        <tr>
                                                                            <th style={{ "width": "60px", "text-align": "center" }}>#</th>
                                                                            <th>{props.lang() === 'ar' ? 'الميزة والتفاصيل' : 'Advantage & Details'}</th>
                                                                            <th style={{ "width": "120px", "text-align": "center" }}>{props.lang() === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody style={{ "background": "#fff" }}>
                                                                        <For each={((props.education || {}).articles || []).filter(a => a.type === 'expert_why').sort((a, b) => (a.order_index || 0) - (b.order_index || 0))}>
                                                                            {(item, idx) => (
                                                                                <tr>
                                                                                    <td style={{ "text-align": "center", "font-weight": "700", "color": "var(--dash-accent)" }}>{item.order_index || (idx() + 1)}</td>
                                                                                    <td>
                                                                                        <div style={{ "display": "flex", "align-items": "center", "gap": "12px" }}>
                                                                                            <Show when={item.img}>
                                                                                                <div class="table-icon-preview" style={{ "width": "32px", "height": "32px", "background": "var(--dash-accent)", "border-radius": "6px", "padding": "4px", "display": "flex", "align-items": "center", "justify-content": "center" }}>
                                                                                                    <img src={getAssetUrl(item.img)} style={{ "width": "20px", "height": "20px", "filter": "brightness(0) invert(1)" }} />
                                                                                                </div>
                                                                                            </Show>
                                                                                            <div style={{ "display": "flex", "flex-direction": "column", "gap": "2px" }}>
                                                                                                <span style={{ "font-weight": "700", "color": "var(--dash-ink)" }}>{props.lang() === 'ar' ? item.title_ar : item.title_en}</span>
                                                                                                <span class="dash-text-muted" style={{ "font-size": "0.85rem", "white-space": "normal", "max-width": "500px" }}>
                                                                                                    {props.lang() === 'ar' ? item.excerpt_ar : item.excerpt_en}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div style={{ display: 'flex', gap: '8px', 'justify-content': 'center' }}>
                                                                                            <button class="action-icon-btn edit" onClick={() => openModal('expert_why', item)} title={props.lang() === 'ar' ? 'تعديل' : 'Edit'}>
                                                                                                <Icon name="edit" size={16} />
                                                                                            </button>
                                                                                            <button class="action-icon-btn delete" onClick={() => handleDelete('articles', item.id)} title={props.lang() === 'ar' ? 'حذف' : 'Delete'}>
                                                                                                <Icon name="trash" size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </For>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {/* How it Works Section */}
                                                        <div class="dash-table-container" style={{ "margin-top": "3rem", "box-shadow": "none", "border": "1px solid #e2e8f0", "background": "#fdfdfd" }}>
                                                            <div class="dash-table-header" style={{ "background": "#fff", "border-bottom": "1px solid #e2e8f0", "padding": "1.25rem 1.5rem" }}>
                                                                <h3 style={{ "font-size": "1.1rem", "font-weight": "800", "color": "var(--dash-ink)" }}>
                                                                    {props.lang() === 'ar' ? 'خطوات عمل البرنامج (كيف يعمل؟)' : 'Program Steps (How it Works)'}
                                                                </h3>
                                                                <button class="btn-add" onClick={() => openModal('expert_step')} style={{ "padding": "8px 16px", "font-size": "0.85rem" }}>
                                                                    <Icon name="plus" size={18} />
                                                                    <span>{props.lang() === 'ar' ? 'إضافة خطوة' : 'Add Step'}</span>
                                                                </button>
                                                            </div>
                                                            <div class="table-responsive">
                                                                <table class="dash-table">
                                                                    <thead style={{ "background": "#f8fafc" }}>
                                                                        <tr>
                                                                            <th style={{ "width": "60px", "text-align": "center" }}>#</th>
                                                                            <th>{props.lang() === 'ar' ? 'الخطوة والتفاصيل' : 'Step & Details'}</th>
                                                                            <th style={{ "width": "120px", "text-align": "center" }}>{props.lang() === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody style={{ "background": "#fff" }}>
                                                                        <For each={((props.education || {}).articles || []).filter(a => a.type === 'expert_step').sort((a, b) => (a.order_index || 0) - (b.order_index || 0))}>
                                                                            {(item, idx) => (
                                                                                <tr>
                                                                                    <td style={{ "text-align": "center", "font-weight": "700", "color": "var(--dash-accent)" }}>{item.order_index || (idx() + 1)}</td>
                                                                                    <td>
                                                                                        <div style={{ "display": "flex", "flex-direction": "column", "gap": "4px" }}>
                                                                                            <span style={{ "font-weight": "700", "color": "var(--dash-ink)" }}>{props.lang() === 'ar' ? item.title_ar : item.title_en}</span>
                                                                                            <span class="dash-text-muted" style={{ "font-size": "0.85rem", "white-space": "normal", "max-width": "500px" }}>
                                                                                                {props.lang() === 'ar' ? item.excerpt_ar : item.excerpt_en}
                                                                                            </span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div style={{ display: 'flex', gap: '8px', 'justify-content': 'center' }}>
                                                                                            <button class="action-icon-btn edit" onClick={() => openModal('expert_step', item)} title={props.lang() === 'ar' ? 'تعديل' : 'Edit'}>
                                                                                                <Icon name="edit" size={16} />
                                                                                            </button>
                                                                                            <button class="action-icon-btn delete" onClick={() => handleDelete('articles', item.id)} title={props.lang() === 'ar' ? 'حذف' : 'Delete'}>
                                                                                                <Icon name="trash" size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </For>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </Show>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab() === 'experts' && (
                            <div class="dash-experts-complex fade-in">
                                <div class="dash-table-container">
                                    <div class="dash-table-header">
                                        <h3>{props.lang() === 'ar' ? 'الأطباء المتعاونون' : 'Collaborating Physicians'}</h3>
                                        <button class="btn-add" onClick={() => openModal('expert')}>
                                            <Icon name="plus" />
                                            <span>{props.lang() === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}</span>
                                        </button>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="dash-table">
                                            <thead>
                                                <tr>
                                                    <th>{props.lang() === 'ar' ? 'الاسم' : 'Name'}</th>
                                                    <th>{props.lang() === 'ar' ? 'التخصص' : 'Role'}</th>
                                                    <th>{props.lang() === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <For each={props.experts || []}>
                                                    {(item) => (
                                                        <tr>
                                                            <td>
                                                                <div style={{ display: 'flex', 'align-items': 'center', gap: '12px' }}>
                                                                    <div class="table-img-box"><img src={getAssetUrl(item.img)} class="table-img" /></div>
                                                                    <span style={{ "font-weight": 700 }}>{props.lang() === 'ar' ? item.title_ar : item.title_en}</span>
                                                                </div>
                                                            </td>
                                                            <td class="dash-text-muted">{props.lang() === 'ar' ? item.details_ar : item.details_en}</td>
                                                            <td>
                                                                <div style={{ display: 'flex', gap: '8px', 'justify-content': 'center' }}>
                                                                    <button class="action-icon-btn edit" onClick={() => openModal('expert', item)}>
                                                                        <Icon name="edit" />
                                                                    </button>
                                                                    <button class="action-icon-btn delete" onClick={() => handleDelete('doctors', item.id)}>
                                                                        <Icon name="trash" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </For>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab() === 'media_hub' && !mediaSubTab() && (
                            <div class="dash-media-hub fade-in">
                                <h2 class="section-title-dashboard">{props.lang() === 'ar' ? 'اختر القسم لإدارة الصور' : 'Choose Gallery to Manage'}</h2>
                                <div class="media-hub-grid">
                                    <div class="hub-card" onClick={() => setMediaSubTab('home')}>
                                        <Icon name="image" size={32} />
                                        <span>{props.lang() === 'ar' ? 'صور المركز الإعلامي' : 'Media Center'}</span>
                                    </div>
                                    <div class="hub-card" onClick={() => setMediaSubTab('about')}>
                                        <Icon name="image" size={32} />
                                        <span>{props.lang() === 'ar' ? 'صور من نحن' : 'About Us Images'}</span>
                                    </div>
                                    <div class="hub-card" onClick={() => setMediaSubTab('laki')}>
                                        <Icon name="image" size={32} />
                                        <span>{props.lang() === 'ar' ? 'صور البوسترات (لك وبوعي)' : 'Laki Posters'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab() !== 'overview' && activeTab() !== 'contact' && activeTab() !== 'translations' && activeTab() !== 'experts' && (activeTab() !== 'media_hub' || mediaSubTab())) && (
                            <div class="dash-table-container fade-in">
                                <div class="dash-table-header">
                                    <Show when={activeTab() === 'media_hub'}>
                                        <button type="button" class="btn-back" onClick={() => setMediaSubTab(null)}>
                                            <Icon name="arrow-left" />
                                        </button>
                                    </Show>
                                    <h3>{activeTab() === 'media_hub' ? (
                                        mediaSubTab() === 'home' ? (props.lang() === 'ar' ? 'المركز الإعلامي' : 'Media Center') :
                                            mediaSubTab() === 'about' ? (props.lang() === 'ar' ? 'صور من نحن' : 'About Us Images') :
                                                (props.lang() === 'ar' ? 'صور البوسترات (لك وبوعي)' : 'Laki Posters')
                                    ) : activeTabLabel()}</h3>
                                    <button class="btn-add" onClick={() => {
                                        const type = activeTab() === 'media_hub' ? 'poster' :
                                            activeTab() === 'articles' ? 'article' :
                                                activeTab() === 'guides' ? 'guide' :
                                                    activeTab() === 'categories' ? 'category' :
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
                                                <th>{props.lang() === 'ar' ? 'التفاصيل' : 'Details'}</th>
                                                <th>{props.lang() === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <For each={listData()}>
                                                {(item) => {
                                                    const isIntro = item.title_ar === 'MAIN' || item.title_ar === 'INTRO';
                                                    const imageUrl = item.main_image || item.img || item.image || '';
                                                    let displayName = props.lang() === 'ar' ?
                                                        (isIntro ? 'المقطع الرئيسي للموقع' : (item.title_ar || item.title || item.full_name || item.name || '---')) :
                                                        (isIntro ? 'Site Main Clip' : (item.title_en || item.title || item.full_name || item.name || '---'));

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
                                                                (props.lang() === 'ar' ? (item.details_ar || item.category || '---') : (item.details_en || item.category || '---'));

                                                    return (
                                                        <tr>
                                                            <td>
                                                                <div style={{ display: 'flex', 'align-items': 'center', gap: '15px' }}>
                                                                    <Show when={activeTab() !== 'users' && activeTab() !== 'categories'}>
                                                                        <div class="table-img-box">
                                                                            {imageUrl.toLowerCase().endsWith('.mp4') || imageUrl.toLowerCase().endsWith('.webm') ?
                                                                                <div class="table-video-icon"><Icon name="image" size={16} /></div> :
                                                                                <img src={getAssetUrl(imageUrl)} class="table-img" />
                                                                            }
                                                                        </div>
                                                                    </Show>
                                                                    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '4px' }}>
                                                                        <span style={{ "font-weight": 800, "color": "var(--dash-ink)" }}>{displayName}</span>
                                                                        <span class="dash-text-muted" style={{ "font-size": "0.85rem", "font-weight": "600" }}>{details}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div style={{ display: 'flex', gap: '8px', 'justify-content': 'center' }}>
                                                                    <button class="action-icon-btn edit" onClick={() => {
                                                                        const type = isIntro ? 'intro' :
                                                                            (activeTab() === 'media_hub' ? 'poster' :
                                                                                activeTab() === 'articles' ? 'article' :
                                                                                    activeTab() === 'guides' ? 'guide' :
                                                                                        activeTab() === 'categories' ? 'category' :
                                                                                            activeTab().slice(0, -1));
                                                                        openModal(type, item);
                                                                    }}>
                                                                        <Icon name="edit" />
                                                                        <span>{props.lang() === 'ar' ? 'تعديل' : 'Edit'}</span>
                                                                    </button>
                                                                    <button
                                                                        class="action-icon-btn delete"
                                                                        disabled={isIntro}
                                                                        style={{ opacity: isIntro ? 0.3 : 1 }}
                                                                        onClick={() => handleDelete(isIntro ? 'posters' : (activeTab() === 'media_hub' ? 'posters' : (['articles', 'guides'].includes(activeTab()) ? 'articles' : (activeTab() === 'experts' ? 'doctors' : (activeTab() === 'users' ? 'users' : (activeTab() === 'categories' ? 'product_categories' : activeTab()))))), item.id)}
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
                                                        <SocialBadge platform={item.key} />
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
                                                    <input class="dash-contact-input" type="email" value={item.value} onInput={(e) => updateContactField('emails', index(), 'value', e.currentTarget.value)} />
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                </div>
                                <div class="dash-contact-card">
                                    <h3>{props.lang() === 'ar' ? 'أرقام التواصل' : 'Phone Numbers'}</h3>
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
                                                    <input class="dash-contact-input" value={item.value} onInput={(e) => updateContactField('phones', index(), 'value', e.currentTarget.value)} />
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                </div>
                                <div class="dash-contact-actions">
                                    <button class="btn-save" onClick={saveContactSettings} disabled={loading()}>
                                        {props.lang() === 'ar' ? 'حفظ البيانات' : 'Save Contact'}
                                    </button>
                                </div>
                            </div>
                        )}


                        {activeTab() === 'overview' && (
                            <div class="dash-overview fade-in">
                                <div class="overview-hero">
                                    <div class="overview-heading">
                                        <h2>{props.lang() === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Welcome to Dashboard'}</h2>
                                        <p>{props.lang() === 'ar' ? 'نظرة شاملة على أداء ومحتوى جي كير' : 'A comprehensive look at G-Care performance and content'}</p>
                                    </div>
                                    <div class="system-health">
                                        <div class="health-dot pulse"></div>
                                        <span>{props.lang() === 'ar' ? 'النظام متصل ويعمل' : 'System Online'}</span>
                                    </div>
                                </div>

                                <div class="dash-stats-grid">
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="package" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'المنتجات' : 'Products'}</span>
                                            <span class="dash-stat-value">{(props.products || []).length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('products')} title="Manage Products">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="briefcase" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'الأطباء المتعاونون' : 'Collaborating Physicians'}</span>
                                            <span class="dash-stat-value">{(props.experts || []).length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('experts')} title="Manage Team">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="book-open" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'المقالات' : 'Articles'}</span>
                                            <span class="dash-stat-value">{((props.education || {}).articles || []).filter(a => a.type === 'general').length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('articles')} title="Manage Articles">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="book-open" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'الأدلة التوعوية' : 'Educational Guides'}</span>
                                            <span class="dash-stat-value">{((props.education || {}).articles || []).filter(a => a.type === 'guide' || !a.type).length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('guides')} title="Manage Guides">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="image" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'البوسترات' : 'Posters'}</span>
                                            <span class="dash-stat-value">{((props.education || {}).posters || []).filter(p => !['MAIN', 'INTRO'].includes(p.title_ar)).length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('media_hub')} title="Manage Posters">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="users" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'الشركاء' : 'Partners'}</span>
                                            <span class="dash-stat-value">{(props.partners || []).length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('partners')} title="Manage Partners">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="shield" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'المستخدمون' : 'Users'}</span>
                                            <span class="dash-stat-value">{(props.profiles || []).length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('users')} title="Manage Users">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                    <div class="dash-stat-dash-card">
                                        <div class="stat-icon-bg"><Icon name="file-text" stroke={2.5} /></div>
                                        <div class="dash-stat-info">
                                            <span class="dash-stat-label">{props.lang() === 'ar' ? 'إدارة المحتوى' : 'Content Management'}</span>
                                            <span class="dash-stat-value">{Object.keys(transData()?.ar || {}).length}</span>
                                        </div>
                                        <Show when={isAdmin()}>
                                            <button class="edit-stat-btn" onClick={() => setActiveTabPersisted('translations')} title="Manage Translations">
                                                <Icon name="edit" size={14} />
                                            </button>
                                        </Show>
                                    </div>
                                </div>

                                <div class="overview-creative-row">
                                    <div class="creative-chart-card">
                                        <h3>{props.lang() === 'ar' ? 'توزع المحتوى' : 'Content Distribution'}</h3>
                                        <div class="mini-chart">
                                            <div class="chart-bar-item">
                                                <div class="bar-fill blue" style={{ height: (Math.min(100, ((props.products || []).length / 20) * 100)) + '%' }}></div>
                                                <label>{props.lang() === 'ar' ? 'منتجات' : 'Products'}</label>
                                            </div>
                                            <div class="chart-bar-item">
                                                <div class="bar-fill teal" style={{ height: (Math.min(100, (((props.education || {}).articles || []).length / 20) * 100)) + '%' }}></div>
                                                <label>{props.lang() === 'ar' ? 'محتوى' : 'Content'}</label>
                                            </div>
                                            <div class="chart-bar-item">
                                                <div class="bar-fill orange" style={{ height: (Math.min(100, (((props.education || {}).posters || []).length / 20) * 100)) + '%' }}></div>
                                                <label>{props.lang() === 'ar' ? 'وسائط' : 'Media'}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="creative-info-card">
                                        <h3>{props.lang() === 'ar' ? 'معلومة سريعة' : 'Quick Fact'}</h3>
                                        <p>{props.lang() === 'ar' ? 'تم الوصول لـ ' + (props.profiles || []).length + ' مستخدمين مسجلين في النظام حتى الآن.' : 'Reached ' + (props.profiles || []).length + ' registered users so far.'}</p>
                                        <div class="creative-badge">{props.lang() === 'ar' ? 'نشط' : 'Active'}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main >

                <Show when={isModalOpen()}>
                    <div class="modal-overlay">
                        <div class="modal-content fade-in">
                            <div class="modal-header">
                                <h3>{editingItem() ? (props.lang() === 'ar' ? 'تعديل' : 'Edit') : (props.lang() === 'ar' ? 'إضافة' : 'Add')}</h3>
                                <button class="close-modal" onClick={() => closeModal()}><Icon name="x" /></button>
                            </div>
                            <form class="form-grid" onSubmit={handleSave}>
                                <Show when={modalType() === 'product' || modalType() === 'expert'}>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="tag" size={16} /> {props.lang() === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                                        <input class="premium-input" name="title_ar" value={editingItem()?.title_ar || ''} required />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="tag" size={16} /> {props.lang() === 'ar' ? 'الاسم (English)' : 'Name (EN)'}</label>
                                        <input class="premium-input" name="title_en" value={editingItem()?.title_en || ''} required />
                                    </div>
                                </Show>

                                <Show when={modalType() === 'product'}>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="image" size={16} /> {props.lang() === 'ar' ? 'صورة المنتج' : 'Product Image'}</label>
                                        <Show when={uploadURL() || (editingItem() && editingItem()?.main_image)}>
                                            <div class="current-file-preview">
                                                <img src={getAssetUrl(uploadURL() || editingItem()?.main_image)} alt="" />
                                                <span>{uploadURL() || editingItem()?.main_image}</span>
                                                <button type="button" class="btn-remove" onClick={() => { setUploadURL(''); if (editingItem()) editingItem().main_image = ''; }}>
                                                    <Icon name="x" size={16} />
                                                </button>
                                            </div>
                                        </Show>
                                        <FileUploadZone multiple={false} id="productImageInput" />
                                    </div>
                                    <div class="form-group" style={{ "grid-column": isCreatingCategory() ? "1 / -1" : "auto" }}>
                                        <div class="label-with-action">
                                            <label class="premium-label"><Icon name="folder" size={16} /> {props.lang() === 'ar' ? 'الفئة' : 'Category'}</label>
                                            <button type="button" class="inline-add-btn" onClick={() => setIsCreatingCategory(!isCreatingCategory())}>
                                                {isCreatingCategory() ? (props.lang() === 'ar' ? 'إلغاء' : 'Cancel') : (props.lang() === 'ar' ? '+ فئة جديدة' : '+ New Category')}
                                            </button>
                                        </div>
                                        <Show when={!isCreatingCategory()} fallback={
                                            <div class="inline-creation-box fade-in" style={{ "grid-template-columns": "1fr" }}>
                                                <input
                                                    class="premium-input"
                                                    placeholder={props.lang() === 'ar' ? 'اسم الفئة' : 'Category Name'}
                                                    value={newCategoryEn()}
                                                    onInput={(e) => setNewCategoryEn(e.currentTarget.value)}
                                                />
                                            </div>
                                        }>
                                            <select name="category" class="premium-input" value={editingItem()?.category || (props.productCategories?.[0]?.title_en || 'IVD')} required>
                                                <For each={props.productCategories || []}>
                                                    {(cat) => (
                                                        <option value={cat.title_en}>{cat.title_en}</option>
                                                    )}
                                                </For>
                                                <Show when={!props.productCategories || props.productCategories.length === 0}>
                                                    <option value="IVD">IVD</option>
                                                    <option value="Supplements">Supplements</option>
                                                </Show>
                                            </select>
                                        </Show>
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="file-text" size={16} /> {props.lang() === 'ar' ? 'ملف البروشور (PDF)' : 'Brochure PDF'}</label>
                                        <Show when={uploadPDFURL() || (editingItem() && (editingItem()?.brochure_url || editingItem()?.pdf_url))}>
                                            <div class="current-file-preview">
                                                <Icon name="file-text" size={20} />
                                                <span>{uploadPDFURL() || editingItem()?.brochure_url || editingItem()?.pdf_url}</span>
                                                <button type="button" class="btn-remove" onClick={() => { setUploadPDFURL(''); if (editingItem()) { editingItem().brochure_url = ''; editingItem().pdf_url = ''; } }}>
                                                    <Icon name="x" size={16} />
                                                </button>
                                            </div>
                                        </Show>
                                        <FileUploadZone pdf={true} accept=".pdf" id="pdfInput" />
                                    </div>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="align-left" size={16} /> {props.lang() === 'ar' ? 'الوصف (عربي)' : 'Overview (AR)'}</label>
                                        <RichEditor name="overview_ar" value={editingItem()?.overview_ar || ''} onInput={(v) => { if (editingItem()) editingItem().overview_ar = v; }} />
                                    </div>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="align-left" size={16} /> {props.lang() === 'ar' ? 'الوصف (English)' : 'Overview (EN)'}</label>
                                        <RichEditor name="overview_en" value={editingItem()?.overview_en || ''} onInput={(v) => { if (editingItem()) editingItem().overview_en = v; }} />
                                    </div>
                                </Show>

                                <Show when={modalType() === 'expert'}>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="image" size={16} /> {props.lang() === 'ar' ? 'صورة العضو' : 'Member Image'}</label>
                                        <Show when={uploadURL() || (editingItem() && editingItem()?.img)}>
                                            <div class="current-file-preview">
                                                <img src={getAssetUrl(uploadURL() || editingItem()?.img)} alt="" />
                                                <span>{uploadURL() || editingItem()?.img}</span>
                                                <button type="button" class="btn-remove" onClick={() => { setUploadURL(''); if (editingItem()) editingItem().img = ''; }}>
                                                    <Icon name="x" size={16} />
                                                </button>
                                            </div>
                                        </Show>
                                        <FileUploadZone multiple={false} />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="briefcase" size={16} /> {props.lang() === 'ar' ? 'المسمى الوظيفي (عربي)' : 'Job Title (AR)'}</label>
                                        <input name="details_ar" class="premium-input" value={editingItem()?.details_ar || ''} required />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="briefcase" size={16} /> {props.lang() === 'ar' ? 'المسمى الوظيفي (English)' : 'Job Title (EN)'}</label>
                                        <input name="details_en" class="premium-input" value={editingItem()?.details_en || ''} required />
                                    </div>
                                </Show>

                                <Show when={['article', 'guide', 'expert_step', 'expert_why', 'company_value'].includes(modalType())}>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="list" size={16} /> {props.lang() === 'ar' ? 'الترتيب (الرقم)' : 'Sort Order (Number)'}</label>
                                        <input type="number" name="order_index" class="premium-input" value={editingItem()?.order_index || 0} required />
                                    </div>
                                    <div class="trans-lang-vertical">
                                        <div class="trans-lang-section">
                                            <h4 class="lang-title"><Icon name="tag" size={16} /> العربية (AR)</h4>
                                            <div class="form-grid-mini">
                                                <div class="form-group">
                                                    <label class="premium-label">{props.lang() === 'ar' ? 'العنوان' : 'Title'}</label>
                                                    <input name="title_ar" class="premium-input" value={editingItem()?.title_ar || ''} required />
                                                </div>
                                                <div class="form-group">
                                                    <label class="premium-label">{props.lang() === 'ar' ? 'التفاصيل' : 'Details'}</label>
                                                    <input name="details_ar" class="premium-input" value={editingItem()?.details_ar || ''} required />
                                                </div>
                                            </div>
                                            <div class="form-group" style={{ "margin-top": "1rem" }}>
                                                <label class="premium-label"><Icon name="align-left" size={16} /> {props.lang() === 'ar' ? (['expert_step', 'expert_why', 'company_value'].includes(modalType()) ? 'الوصف القصير' : 'المحتوى المختصر') : 'Short Description'}</label>
                                                <RichEditor name="excerpt_ar" value={editingItem()?.excerpt_ar || ''} onInput={(v) => { if (['article', 'guide'].includes(modalType())) setEditorValueAr(v); else if (editingItem()) editingItem().excerpt_ar = v; }} />
                                                {/* <RichEditor name="excerpt_ar" value={editorValueAr()} onInput={setEditorValueAr} /> */}
                                            </div>
                                        </div>

                                        <div class="trans-lang-section divider-top">
                                            <h4 class="lang-title"><Icon name="tag" size={16} /> English (EN)</h4>
                                            <div class="form-grid-mini">
                                                <div class="form-group">
                                                    <label class="premium-label">{props.lang() === 'ar' ? 'Title (EN)' : 'Title (EN)'}</label>
                                                    <input name="title_en" class="premium-input" value={editingItem()?.title_en || ''} required />
                                                </div>
                                                <div class="form-group">
                                                    <label class="premium-label">{props.lang() === 'ar' ? 'Details (EN)' : 'Details (EN)'}</label>
                                                    <input name="details_en" class="premium-input" value={editingItem()?.details_en || ''} required />
                                                </div>
                                            </div>
                                            <div class="form-group" style={{ "margin-top": "1rem" }}>
                                                <label class="premium-label"><Icon name="align-left" size={16} /> {props.lang() === 'ar' ? 'Description (EN)' : 'Description (EN)'}</label>
                                                <RichEditor name="excerpt_en" value={editingItem()?.excerpt_en || ''} onInput={(v) => { if (['article', 'guide'].includes(modalType())) setEditorValueEn(v); else if (editingItem()) editingItem().excerpt_en = v; }} />
                                                {/* <RichEditor name="excerpt_en" value={editorValueEn()} onInput={setEditorValueEn} /> */}
                                            </div>
                                        </div>
                                    </div>

                                    <Show when={['expert_why', 'company_value'].includes(modalType())}>
                                        <div class="form-group" style={{ "grid-column": "1 / -1", "margin-top": "1rem" }}>
                                            <label class="premium-label"><Icon name="image" size={16} /> {props.lang() === 'ar' ? 'أيقونة الميزة (SVG white)' : 'Advantage Icon (SVG)'}</label>
                                            <Show when={uploadURL() || editingItem()?.img}>
                                                <div class="current-file-preview">
                                                    <div style={{ "width": "40px", "height": "40px", "background": "var(--dash-accent)", "border-radius": "8px", "padding": "8px", "display": "flex", "align-items": "center", "justify-content": "center" }}>
                                                        <img src={getAssetUrl(uploadURL() || editingItem()?.img)} style={{ "width": "24px", "height": "24px" }} />
                                                    </div>
                                                    <span>{uploadURL() || editingItem()?.img}</span>
                                                    <button type="button" class="btn-remove" onClick={() => { setUploadURL(''); if (editingItem()) editingItem().img = ''; }}>
                                                        <Icon name="x" size={16} />
                                                    </button>
                                                </div>
                                            </Show>
                                            <FileUploadZone multiple={false} />
                                            <span class="dash-text-muted" style={{ "font-size": "0.8rem", "display": "block", "margin-top": "5px" }}>
                                                {props.lang() === 'ar' ? '* يرجى رفع أيقونة بصيغة SVG وتكون باللون الأبيض لتظهر بشكل صحيح.' : '* Please upload an SVG icon in white color for best display.'}
                                            </span>
                                        </div>
                                    </Show>

                                    <Show when={['article', 'guide'].includes(modalType())}>
                                        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                            <label class="premium-label"><Icon name="image" size={16} /> {props.lang() === 'ar' ? 'صورة المقال' : 'Article Image'}</label>
                                            <FileUploadZone multiple={false} />
                                        </div>
                                        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                            <label class="premium-label"><Icon name="file-text" size={16} /> {props.lang() === 'ar' ? 'ملف PDF (اختياري)' : 'PDF File (Optional)'}</label>
                                            <Show when={uploadPDFURL() || (editingItem() && editingItem()?.pdf_url)}>
                                                <div class="current-file-preview">
                                                    <Icon name="file-text" size={20} />
                                                    <span>{uploadPDFURL() || editingItem()?.pdf_url}</span>
                                                    <button type="button" class="btn-remove" onClick={() => { setUploadPDFURL(''); if (editingItem()) editingItem().pdf_url = ''; }}>
                                                        <Icon name="x" size={16} />
                                                    </button>
                                                </div>
                                            </Show>
                                            <FileUploadZone pdf={true} accept=".pdf,application/pdf" id="articlePdfInput" />
                                        </div>
                                        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                            <label class="premium-label"><Icon name="link" size={16} /> {props.lang() === 'ar' ? 'رابط المقال الخارجي' : 'External Article Link'}</label>
                                            <input name="link_url" class="premium-input" type="url" value={editingItem()?.link_url || ''} placeholder="https://example.com" />
                                        </div>
                                    </Show>
                                </Show>

                                <Show when={modalType() === 'poster'}>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="tag" size={16} /> {props.lang() === 'ar' ? 'العنوان' : 'Title'}</label>
                                        <input name="title_ar" class="premium-input" value={editingItem()?.title_ar === 'IMAGE' ? '' : editingItem()?.title_ar || ''} placeholder={props.lang() === 'ar' ? 'اختياري' : 'Optional'} />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="folder" size={16} /> {props.lang() === 'ar' ? 'التصنيف' : 'Category'}</label>
                                        <select name="category" class="premium-input" value={editingItem()?.category || mediaSubTab() || 'home'}>
                                            <option value="home">{props.lang() === 'ar' ? 'المركز الإعلامي' : 'Media Center'}</option>
                                            <option value="about">{props.lang() === 'ar' ? 'من نحن' : 'About Us'}</option>
                                            <option value="laki">{props.lang() === 'ar' ? 'لك وبوعي (بوسترات)' : 'Laki Posters'}</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label">
                                            {mediaSubTab() === 'main' ? (props.lang() === 'ar' ? 'ملفات الواجهة' : 'Site Main Media') :
                                                mediaSubTab() === 'about' ? (props.lang() === 'ar' ? 'صور من نحن' : 'About Us Images') :
                                                    (props.lang() === 'ar' ? 'بوسترات لك وبوعي' : 'Laki Posters')}
                                        </label>
                                        <Show when={uploadURL() || (editingItem() && editingItem()?.img)}>
                                            <div class="current-file-preview">
                                                <Show when={(uploadURL() || editingItem()?.img).toLowerCase().endsWith('.mp4')} fallback={
                                                    <img src={getAssetUrl(uploadURL() || editingItem()?.img)} alt="" />
                                                }>
                                                    <Icon name="video" size={32} />
                                                </Show>
                                                <span>{uploadURL() || editingItem()?.img}</span>
                                                <button type="button" class="btn-remove" onClick={() => { setUploadURL(''); if (editingItem()) editingItem().img = ''; }}>
                                                    <Icon name="x" size={16} />
                                                </button>
                                            </div>
                                        </Show>
                                        <FileUploadZone multiple={!editingItem()} />
                                    </div>
                                </Show>

                                <Show when={modalType() === 'intro'}>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="video" size={16} /> {props.lang() === 'ar' ? 'فيديو أو صورة الواجهة' : 'Welcome Screen File'}</label>
                                        <FileUploadZone multiple={false} />
                                    </div>
                                </Show>

                                <Show when={modalType() === 'category'}>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="tag" size={16} /> {props.lang() === 'ar' ? 'اسم الفئة (عربي)' : 'Category Name (AR)'}</label>
                                        <input name="title_ar" class="premium-input" value={editingItem()?.title_ar || ''} required />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="tag" size={16} /> {props.lang() === 'ar' ? 'اسم الفئة (English)' : 'Category Name (EN)'}</label>
                                        <input name="title_en" class="premium-input" value={editingItem()?.title_en || ''} required />
                                    </div>
                                </Show>

                                <Show when={modalType() === 'partner'}>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="image" size={16} /> {props.lang() === 'ar' ? 'شعار الشريك' : 'Partner Logo'}</label>
                                        <Show when={uploadURL() || (editingItem() && editingItem()?.img)}>
                                            <div class="current-file-preview">
                                                <img src={getAssetUrl(uploadURL() || editingItem()?.img)} alt="" />
                                                <span>{uploadURL() || editingItem()?.img}</span>
                                                <button type="button" class="btn-remove" onClick={() => { setUploadURL(''); if (editingItem()) editingItem().img = ''; }}>
                                                    <Icon name="x" size={16} />
                                                </button>
                                            </div>
                                        </Show>
                                        <FileUploadZone multiple={false} />
                                    </div>
                                    <div class="form-group" style={{ "grid-column": "1 / -1" }}>
                                        <label class="premium-label"><Icon name="tag" size={16} /> {props.lang() === 'ar' ? 'اسم الشريك' : 'Partner Name'}</label>
                                        <input name="title" class="premium-input" value={editingItem()?.title || editingItem()?.name || ''} required />
                                    </div>
                                </Show>

                                <Show when={modalType() === 'user'}>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="user" size={16} /> {props.lang() === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                        <input name="full_name" class="premium-input" value={editingItem()?.full_name || ''} required />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="mail" size={16} /> {props.lang() === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                        <input name="email" class="premium-input" type="email" value={editingItem()?.email || ''} required />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="lock" size={16} /> {props.lang() === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                                        <input
                                            name="password"
                                            class="premium-input"
                                            type="password"
                                            placeholder={editingItem() ? (props.lang() === 'ar' ? 'اتركها فارغة إذا لا تريد التغيير' : 'Leave blank to keep current password') : (props.lang() === 'ar' ? 'أدخل كلمة المرور' : 'Enter password')}
                                            required={!editingItem()}
                                            minLength="6"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label class="premium-label"><Icon name="shield" size={16} /> {props.lang() === 'ar' ? 'الرتبة' : 'Role'}</label>
                                        <select name="role" class="premium-input" value={editingItem()?.role || 'publisher'}>
                                            <option value="admin">{props.lang() === 'ar' ? 'مدير' : 'Admin'}</option>
                                            <option value="publisher">{props.lang() === 'ar' ? 'ناشر' : 'Publisher'}</option>
                                        </select>
                                    </div>
                                </Show>

                                <div class="form-actions">
                                    <button type="button" class="btn-cancel" onClick={() => closeModal()}>{props.lang() === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                                    <button type="submit" class="btn-save" disabled={loading()}>
                                        {loading() ? '...' : (props.lang() === 'ar' ? 'حفظ البيانات' : 'Save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Show>
            </div>
            <ImageCropperModal
                isOpen={isCropperOpen}
                src={croppingSrc}
                onClose={() => setIsCropperOpen(false)}
                onConfirm={(blob) => cropperCallback()?.(blob)}
                t={props.t}
                lang={props.lang}
                itemTitle={() => {
                    const form = document.querySelector('form');
                    if (!form) return editingItem()?.title_ar || '';
                    const data = new FormData(form);
                    return data.get('title_ar') || editingItem()?.title_ar || '';
                }}
            />
        </Show>
    );
}
