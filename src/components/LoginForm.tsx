import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Fingerprint, Wand2, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { AuthMode, Language, User } from '../types/auth';
import { getTranslation } from '../utils/translations';
import { MOCK_USERS } from '../data/mockUsers';

interface LoginFormProps {
  lang: Language;
  onSuccessLogin: (user: User) => void;
  onNavigate: (mode: AuthMode) => void;
  onSSOLogin: (provider: string) => void;
  onError: (msg: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  lang,
  onSuccessLogin,
  onNavigate,
  onSSOLogin,
  onError,
}) => {
  const t = getTranslation(lang);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onError(lang === 'id' ? 'Mohon lengkapi email resmi dan kata sandi.' : 'Please enter official email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matchedUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedUser) {
        // If MFA enabled, transition to two-factor step
        if (matchedUser.mfaEnabled) {
          onNavigate('two_factor');
        } else {
          onSuccessLogin(matchedUser);
        }
      } else {
        // Allow login with generic newly entered credential for test flexibility
        const fallbackUser: User = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          email: email.trim(),
          nip: '199501012022031001',
          role: 'Staf Operasional',
          department: 'Unit Pelaksana Teknis',
          mfaEnabled: true,
          passkeyRegistered: false,
          lastLogin: new Date().toLocaleTimeString('id-ID'),
          status: 'Aktif',
          permissions: ['VIEW_DASHBOARD', 'SUBMIT_TICKETS'],
        };
        onNavigate('two_factor');
      }
    }, 600);
  };

  const handleSelectPreset = (user: User) => {
    setEmail(user.email);
    setPassword('Portal@1234');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.loginHeading}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.loginSubheading}
        </p>
      </div>

      {/* Quick Test Users Pill Container (Zero-pill text kicker with segmented buttons) */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            {t.quickTestUsers}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">1-Klik Isi Kredensial</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MOCK_USERS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleSelectPreset(u)}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-400 transition-colors shadow-2xs group"
            >
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400">
                {u.name.split(',')[0]}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {u.role.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {t.emailLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.passwordLabel}
            </label>
            <button
              type="button"
              onClick={() => onNavigate('forgot_password')}
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              {t.forgotPassword}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              className="w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-sm border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500/20 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {t.rememberMe}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{t.submitLogin}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Alternative SSO Sign-in */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">
            {t.orContinueWith}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onSSOLogin('Google Enterprise')}
          className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs whitespace-nowrap shrink-0"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{t.ssoGoogle}</span>
        </button>

        <button
          type="button"
          onClick={() => onSSOLogin('SSO Nasional')}
          className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs whitespace-nowrap shrink-0"
        >
          <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>{t.ssoGov}</span>
        </button>
      </div>

      {/* Passwordless / Biometric Access options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => onNavigate('passkey')}
          className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
        >
          <Fingerprint className="w-4 h-4 text-sky-500" />
          <span>{t.altPasskey}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('magic_link')}
          className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
        >
          <Wand2 className="w-4 h-4 text-indigo-500" />
          <span>{t.altMagicLink}</span>
        </button>
      </div>

      {/* Bottom Registration CTA */}
      <div className="text-center pt-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {t.noAccount}{' '}
        </span>
        <button
          type="button"
          onClick={() => onNavigate('register')}
          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
        >
          {t.requestAccount}
        </button>
      </div>
    </div>
  );
};
