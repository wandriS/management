import React, { useState } from 'react';
import { Fingerprint, ArrowLeft, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { Language, User } from '../types/auth';
import { getTranslation } from '../utils/translations';
import { MOCK_USERS } from '../data/mockUsers';

interface PasskeyFormProps {
  lang: Language;
  onBackToLogin: () => void;
  onSuccessLogin: (user: User) => void;
}

export const PasskeyForm: React.FC<PasskeyFormProps> = ({
  lang,
  onBackToLogin,
  onSuccessLogin,
}) => {
  const t = getTranslation(lang);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handleStartScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        // Authenticate as Budi Santoso or Dr Raden Haryo
        onSuccessLogin(MOCK_USERS[0]);
      }, 700);
    }, 1200);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <Fingerprint className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            FIDO2 / WEBAUTHN HARDWARE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.passkeyHeading}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.passkeySubheading}
        </p>
      </div>

      {/* Sensor Interactive Area */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="relative">
          <button
            type="button"
            onClick={handleStartScan}
            disabled={status !== 'idle'}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              status === 'idle'
                ? 'bg-sky-600 text-white hover:bg-sky-700 hover:scale-105 cursor-pointer ring-4 ring-sky-500/20'
                : status === 'scanning'
                ? 'bg-amber-500 text-white animate-pulse ring-8 ring-amber-400/20'
                : 'bg-emerald-600 text-white scale-105 ring-4 ring-emerald-500/20'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : (
              <Fingerprint className="w-12 h-12" />
            )}
          </button>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            {status === 'idle' && (lang === 'id' ? 'Ketuk Sensor untuk Memindai' : 'Tap Sensor to Scan')}
            {status === 'scanning' && t.passkeyAuthenticating}
            {status === 'success' && t.passkeySuccess}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            {lang === 'id'
              ? 'Mendukung Touch ID, Windows Hello, YubiKey, atau sensor sidik jari perangkat.'
              : 'Supports Touch ID, Windows Hello, YubiKey, or device fingerprint sensor.'}
          </p>
        </div>

        <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>Kunci Kriptografis Tersimpan di Secure Enclave</span>
        </div>
      </div>

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
