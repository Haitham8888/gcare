import { createSignal } from 'solid-js';
import { supabase, getAssetUrl } from './supabaseClient';
import './LoginPage.css';

export default function LoginPage(props) {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: email(),
                password: password()
            });

            if (loginError) {
                setError(props.lang() === 'ar' ? 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.' : 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError(props.lang() === 'ar' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="login-page-wrapper" dir={props.lang() === 'ar' ? 'rtl' : 'ltr'}>
            <div class="login-card">
                <img
                    class="login-logo"
                    src={getAssetUrl('static/img/G - Care-01.svg')}
                    alt="G-Care Logo"
                />

                <div class="login-header">
                    <h1>{props.lang() === 'ar' ? 'مرحباً بك' : 'Welcome Back'}</h1>
                    <p>{props.lang() === 'ar' ? 'سجل الدخول لإدارة موقع G-Care' : 'Sign in to manage G-Care website'}</p>
                </div>

                <form class="login-form" onSubmit={handleLogin}>
                    <div class="input-group">
                        <span class="input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </span>
                        <input
                            type="email"
                            placeholder={props.lang() === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                            value={email()}
                            onInput={(e) => setEmail(e.currentTarget.value)}
                            required
                        />
                    </div>

                    <div class="input-group">
                        <span class="input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                        <input
                            type="password"
                            placeholder={props.lang() === 'ar' ? 'كلمة المرور' : 'Password'}
                            value={password()}
                            onInput={(e) => setPassword(e.currentTarget.value)}
                            required
                        />
                    </div>

                    {error() && <div class="login-error">{error()}</div>}

                    <button class="login-submit-btn" type="submit" disabled={loading()}>
                        {loading() ? (
                            <span class="spinner"></span>
                        ) : (
                            <span>{props.lang() === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                        )}
                        {!loading() && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                {props.lang() === 'ar' ? <path d="M19 12H5m7 7-7-7 7-7" /> : <path d="M5 12h14m-7-7 7 7-7 7" />}
                            </svg>
                        )}
                    </button>
                </form>

                <div class="login-footer">
                    <p>{props.lang() === 'ar' ? 'جَميع الحقوق محفوظة لشركة G-Care © ٢٠٢٦' : 'All Rights Reserved for G-Care © 2026'}</p>
                </div>
            </div>
        </div>
    );
}
