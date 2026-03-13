import { createSignal } from 'solid-js'
import './LoginPage.css'

export default function LoginPage(props) {
    const [username, setUsername] = createSignal('')
    const [password, setPassword] = createSignal('')
    const [error, setError] = createSignal('')
    const [loading, setLoading] = createSignal(false)

    const handleLogin = (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Simple hardcoded check as requested (No account creation)
        setTimeout(() => {
            if (username().toLowerCase() === 'admin' && password() === 'admin') {
                props.setLoggedIn(true)
            } else {
                setError(props.lang() === 'ar' ? 'بيانات الاعتماد غير صحيحة' : 'Invalid credentials')
                setLoading(false)
            }
        }, 800)
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
                    <img src={`${import.meta.env.BASE_URL}static/img/G%20-%20Care-01.svg`} alt="Logo" class="login-logo" />
                    <h1>{props.lang() === 'ar' ? 'لوحة تحكم Deep' : 'Deep Control Panel'}</h1>
                    <p>{props.lang() === 'ar' ? 'يرجى تسجيل الدخول للمتابعة' : 'Please login to continue'}</p>
                </div>

                <form class="login-form" onSubmit={handleLogin}>
                    <div class="input-group">
                        <span class="input-icon"><Icon name="user" /></span>
                        <input
                            type="text"
                            placeholder={props.lang() === 'ar' ? 'اسم المستخدم' : 'Username'}
                            value={username()}
                            onInput={(e) => setUsername(e.target.value)}
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
