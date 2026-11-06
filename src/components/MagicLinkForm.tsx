import React, { useState } from 'react';
import { Wand2, ArrowLeft, Mail, CheckCircle2, ExternalLink } from 'lucide-react';
import { Language, User } from '../types/auth';
import { getTranslation } from '../utils/translations';
import { MOCK_USERS } from '../data/mockUsers';

interface MagicLinkFormProps {
  lang: Language;
  onBackToLogin: () => void;
  onSuccessLogin: (user: User) => void;
  onError: (msg: string) => void;
}

export const MagicLinkForm: React.FC<MagicLinkFormProps> = ({
  lang,
  onBackToLogin,
  onSuccessLogin,
  onError,
}) => {
  const t = getTranslation(lang);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      onError(lang === 'id' ? 'Masukkan alamat email resmi Anda.' : 'Enter your official email address.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
  };

  const handleSimulateClickLink = () => {
    const matched = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || MOCK_USERS[0];
    onSuccessLogin(matched);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Wand2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            AKSES INSTAN TANPA KATA SANDI
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.magicLinkHeading}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.magicLinkSubheading}
        </p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSend} className="space-y-4">
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
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{t.sendMagicLink}</span>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4 py-2">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <span className="font-semibold block">{t.magicLinkSent}</span>
              <p>Tautan otentikasi kriptografis satu kali pakai telah diterbitkan untuk <strong>{email}</strong>.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-mono">SIMULASI KOTAK MASUK EMAIL:</span>
            <button
              type="button"
              onClick={handleSimulateClickLink}
              className="w-full py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-indigo-500 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-indigo-500" />
              <span>{t.simulateOpenLink}</span>
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};
