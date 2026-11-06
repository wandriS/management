import React, { useState } from 'react';
import { Key, ArrowLeft, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../types/auth';
import { getTranslation } from '../utils/translations';

interface ForgotPasswordFormProps {
  lang: Language;
  onBackToLogin: () => void;
  onNotify: (title: string, message: string) => void;
  onError: (msg: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  lang,
  onBackToLogin,
  onNotify,
  onError,
}) => {
  const t = getTranslation(lang);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onError(lang === 'id' ? 'Masukkan email resmi terdaftar Anda.' : 'Enter your registered official email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('reset');
      onNotify(
        lang === 'id' ? 'Kode Pemulihan Terkirim' : 'Recovery Code Dispatched',
        lang === 'id' ? `Tautan verifikasi telah dikirim ke ${email}. Gunakan kode demo: 889900` : `Verification link dispatched to ${email}. Demo token: 889900`
      );
    }, 700);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      onError(lang === 'id' ? 'Kata sandi baru minimal 8 karakter.' : 'New password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('done');
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <Key className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            PEMULIHAN KREDENSIAL RESMI
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.forgotHeading}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.forgotSubheading}
        </p>
      </div>

      {step === 'request' && (
        <form onSubmit={handleRequestRecovery} className="space-y-4">
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
                placeholder="nama.pegawai@portal.id"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{t.sendRecoveryLink}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-lg text-xs text-sky-800 dark:text-sky-300">
            {t.recoveryEmailSent}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Kode Token Pemulihan (Demo: 889900)
            </label>
            <input
              type="text"
              required
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="889900"
              className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.newPasswordLabel}
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter unik..."
              className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{t.saveNewPassword}</span>
            )}
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'id' ? 'Kata Sandi Berhasil Diperbarui!' : 'Password Successfully Updated!'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'id'
                ? 'Silakan masuk kembali menggunakan kata sandi baru Anda.'
                : 'Please sign in again using your new password.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'id' ? 'Lanjut ke Halaman Masuk' : 'Proceed to Sign In'}
          </button>
        </div>
      )}

      {step !== 'done' && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToLogin}</span>
          </button>
        </div>
      )}
    </div>
  );
};
