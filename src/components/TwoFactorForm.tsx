import React, { useState, useRef, useEffect } from 'react';
import { KeyRound, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';
import { Language, User } from '../types/auth';
import { getTranslation } from '../utils/translations';
import { MOCK_USERS } from '../data/mockUsers';

interface TwoFactorFormProps {
  lang: Language;
  onSuccess: (user: User) => void;
  onBack: () => void;
  onError: (msg: string) => void;
  onNotify: (title: string, message: string) => void;
}

export const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
  lang,
  onSuccess,
  onBack,
  onError,
  onNotify,
}) => {
  const t = getTranslation(lang);
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [trustDevice, setTrustDevice] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30s countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Handle digit change
  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto-advance
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);
    const nextIdx = Math.min(pasteData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      onError(lang === 'id' ? 'Masukkan 6 digit kode keamanan lengkap.' : 'Enter all 6 security digits.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Valid verification
      const user = MOCK_USERS[0];
      onSuccess(user);
    }, 500);
  };

  const handleQuickFillCode = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
  };

  const handleResend = () => {
    setTimeLeft(30);
    onNotify(
      lang === 'id' ? 'Kode Baru Terkirim' : 'New Code Dispatched',
      lang === 'id' ? 'Kode verifikasi darurat telah dikirimkan ke nomor WhatsApp terdaftar.' : 'Emergency verification code sent to registered WhatsApp.'
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <KeyRound className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            STEP 02/02 · TOTP
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.twoFactorHeading}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.twoFactorSubheading}
        </p>
      </div>

      {/* 6 Digit Input Grid */}
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-2xs"
            />
          ))}
        </div>

        {/* Quick test code shortcut & countdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5 font-mono">
            <span>{t.otpExpiredIn}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickFillCode}
            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            {lang === 'id' ? 'Gunakan Kode Tes (123456)' : 'Use Test Code (123456)'}
          </button>
        </div>

        {/* Trust device checkbox */}
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={trustDevice}
            onChange={(e) => setTrustDevice(e.target.checked)}
            className="w-4 h-4 rounded-sm border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500/20 cursor-pointer"
          />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {t.trustDevice}
          </span>
        </label>

        {/* Action button */}
        <button
          type="submit"
          disabled={isVerifying}
          className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
        >
          {isVerifying ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{t.verifyAndProceed}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend via SMS / WhatsApp Fallback */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={timeLeft > 0}
          className="flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors cursor-pointer py-1.5"
        >
          <Smartphone className="w-4 h-4" />
          <span>{t.resendOtp}</span>
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer py-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToLogin}</span>
        </button>
      </div>
    </div>
  );
};
