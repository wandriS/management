import React, { useState, useEffect } from 'react';
import {
  AuthMode,
  EnvironmentMode,
  Language,
  User,
  ToastNotification,
} from './types/auth';
import { TopNavigation } from './components/TopNavigation';
import { SecurityShowcase } from './components/SecurityShowcase';
import { LoginForm } from './components/LoginForm';
import { TwoFactorForm } from './components/TwoFactorForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { MagicLinkForm } from './components/MagicLinkForm';
import { PasskeyForm } from './components/PasskeyForm';
import { AuthenticatedConsole } from './components/AuthenticatedConsole';
import { ModalDialog } from './components/ModalDialog';
import { ToastContainer } from './components/ToastContainer';
import { MOCK_USERS, INITIAL_AUDIT_LOGS } from './data/mockUsers';

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('id');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<EnvironmentMode>('production');
  const [modalType, setModalType] = useState<'help' | 'security' | 'privacy' | 'admin' | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync dark mode class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSuccessLogin = (user: User) => {
    setCurrentUser(user);
    setAuthMode('authenticated_dashboard');
    addToast(
      'success',
      lang === 'id' ? 'Autentikasi Berhasil' : 'Authentication Successful',
      lang === 'id'
        ? `Selamat datang kembali, ${user.name}. Sesi aman Anda telah aktif.`
        : `Welcome back, ${user.name}. Your secure session is now active.`
    );
  };

  const handleSSOLogin = (provider: string) => {
    addToast(
      'info',
      lang === 'id' ? 'Menghubungkan ke SSO' : 'Connecting to SSO',
      lang === 'id'
        ? `Memverifikasi tiket otorisasi melalui gateway ${provider}...`
        : `Verifying token handshake via ${provider}...`
    );

    setTimeout(() => {
      const targetUser = provider.includes('Google') ? MOCK_USERS[1] : MOCK_USERS[2];
      handleSuccessLogin(targetUser);
    }, 900);
  };

  const handleSuccessRegister = (email: string) => {
    setAuthMode('login');
    addToast(
      'success',
      lang === 'id' ? 'Permohonan Terkirim' : 'Application Submitted',
      lang === 'id'
        ? `Permohonan akun untuk ${email} sedang diverifikasi oleh Administrator.`
        : `Account request for ${email} is pending verification by Administrator.`
    );
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthMode('login');
    addToast(
      'info',
      lang === 'id' ? 'Sesi Diakhiri' : 'Session Terminated',
      lang === 'id'
        ? 'Anda telah keluar dari Portal Autentikasi dengan aman.'
        : 'You have safely signed out of the Authentication Portal.'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Strict 3-zone Top Bar Contract */}
      <TopNavigation
        lang={lang}
        onLanguageChange={setLang}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        currentUser={currentUser}
        onOpenModal={(type) => setModalType(type)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {authMode === 'authenticated_dashboard' && currentUser ? (
          <AuthenticatedConsole
            user={currentUser}
            lang={lang}
            onSignOut={handleSignOut}
            onNotify={(title, msg) => addToast('info', title, msg)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Form Card Container */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
              <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
                {authMode === 'login' && (
                  <LoginForm
                    lang={lang}
                    onSuccessLogin={handleSuccessLogin}
                    onNavigate={setAuthMode}
                    onSSOLogin={handleSSOLogin}
                    onError={(msg) => addToast('error', lang === 'id' ? 'Kesalahan Masuk' : 'Sign-In Error', msg)}
                  />
                )}

                {authMode === 'two_factor' && (
                  <TwoFactorForm
                    lang={lang}
                    onSuccess={handleSuccessLogin}
                    onBack={() => setAuthMode('login')}
                    onError={(msg) => addToast('error', lang === 'id' ? 'Verifikasi Gagal' : 'Verification Failed', msg)}
                    onNotify={(title, msg) => addToast('info', title, msg)}
                  />
                )}

                {authMode === 'register' && (
                  <RegisterForm
                    lang={lang}
                    onBackToLogin={() => setAuthMode('login')}
                    onSuccessRegister={handleSuccessRegister}
                    onError={(msg) => addToast('error', lang === 'id' ? 'Registrasi Gagal' : 'Registration Failed', msg)}
                  />
                )}

                {authMode === 'forgot_password' && (
                  <ForgotPasswordForm
                    lang={lang}
                    onBackToLogin={() => setAuthMode('login')}
                    onNotify={(title, msg) => addToast('info', title, msg)}
                    onError={(msg) => addToast('error', lang === 'id' ? 'Kesalahan' : 'Error', msg)}
                  />
                )}

                {authMode === 'magic_link' && (
                  <MagicLinkForm
                    lang={lang}
                    onBackToLogin={() => setAuthMode('login')}
                    onSuccessLogin={handleSuccessLogin}
                    onError={(msg) => addToast('error', lang === 'id' ? 'Kesalahan' : 'Error', msg)}
                  />
                )}

                {authMode === 'passkey' && (
                  <PasskeyForm
                    lang={lang}
                    onBackToLogin={() => setAuthMode('login')}
                    onSuccessLogin={handleSuccessLogin}
                  />
                )}
              </div>
            </div>

            {/* Right Column: High-Fidelity Security & Compliance Showcase */}
            <div className="lg:col-span-6 xl:col-span-7 flex">
              <SecurityShowcase lang={lang} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Portal Autentikasi Terpadu</span>
            <span aria-hidden="true">·</span>
            <span>Hak Cipta Dilindungi Undang-Undang</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setModalType('security')}
              className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              ISO/IEC 27001
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              UU PDP No. 27/2022
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setModalType('admin')}
              className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              SOC Desk 24/7
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <ModalDialog
        type={modalType}
        onClose={() => setModalType(null)}
        lang={lang}
      />

      {/* Floating System Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
}
