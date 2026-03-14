import { createSignal } from 'solid-js'
import { supabase, getAssetUrl } from './supabaseClient'
import './LoginPage.css'

export default function LoginPage(props) {
    const [email, setEmail] = createSignal('')
    const [password, setPassword] = createSignal('')
    const [error, setError] = createSignal('')
    const [loading, setLoading] = createSignal(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email(),
                password: password(),
            })

            if (authError) throw authError
            // Success: App.jsx listener will handle redirection/state
        } catch (err) {
            setError(props.lang() === 'ar' ? 'بيانات الاعتماد غير صحيحة أو الحساب غير موجود' : 'Invalid credentials or user not found')
            setLoading(false)
        }
    }

    const Icon = (iconProps) => {
        switch (iconProps.name) {
            case 'lock': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            case 'user': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            case 'arrow-right': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            default: return null
        }
    }

    return (
        <div class="login-page-wrapper" dir={props.lang() === 'ar' ? 'rtl' : 'ltr'}>
            <div class="login-card">
                <div class="login-header">
                    <img src={getAssetUrl('static/img/G - Care-01.svg')} alt="Logo" class="login-logo" />
                    <h1>{props.lang() === 'ar' ? 'تسجيل الدخول' : 'Login'}</h1>
                    <p>{props.lang() === 'ar' ? 'يرجى تسجيل الدخول للمتابعة' : 'Please login to continue'}</p>
                </div>

                <form class="login-form" onSubmit={handleLogin}>
                    <div class="input-group">
                        <span class="input-icon"><Icon name="user" /></span>
                        <input
                            type="email"
                            placeholder={props.lang() === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                            value={email()}
                            onInput={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div class="input-group">
                        <span class="input-icon"><Icon name="lock" /></span>
                        <input
                            type="password"
                            placeholder={props.lang() === 'ar' ? 'كلمة المرور' : 'Password'}
                            value={password()}
                            onInput={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error() && <div class="login-error">{error()}</div>}

                    <button type="submit" class="login-submit-btn" disabled={loading()}>
                        {loading() ? (
                            <span class="spinner"></span>
                        ) : (
                            <>
                                {props.lang() === 'ar' ? 'دخول' : 'Login'}
                                <span class="btn-icon"><Icon name="arrow-right" /></span>
                            </>
                        )}
                    </button>
                </form>

                <div class="login-footer">
                    <p>© 2026 G-Care Medical Company</p>
                </div>
            </div>
        </div>
    )
}
