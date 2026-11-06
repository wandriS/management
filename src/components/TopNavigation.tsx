import React from 'react';
import { Shield, Sun, Moon, Globe } from 'lucide-react';
import { Language, EnvironmentMode, User } from '../types/auth';
import { getTranslation } from '../utils/translations';

interface TopNavigationProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  environment: EnvironmentMode;
  onEnvironmentChange: (env: EnvironmentMode) => void;
  currentUser: User | null;
  onOpenModal: (type: 'help' | 'security' | 'privacy' | 'admin') => void;
  onSignOut?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  lang,
  onLanguageChange,
  isDark,
  onThemeToggle,
  environment,
  onEnvironmentChange,
  currentUser,
  onOpenModal,
  onSignOut,
}) => {
  const t = getTranslation(lang);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single element wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
            {t.brandTitle}
          </span>
        </div>

        {/* Zone 2: 4 nav links, single-line */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onOpenModal('help')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
          >
            {t.navHelp}
          </button>
          <button
            onClick={() => onOpenModal('security')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
          >
            {t.navSecurity}
          </button>
          <button
            onClick={() => onOpenModal('privacy')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
          >
            {t.navPrivacy}
          </button>
          <button
            onClick={() => onOpenModal('admin')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
          >
            {t.navAdmin}
          </button>
        </nav>

        {/* Zone 3: 1 primary action or clean utility control cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Environment selector */}
          <select
            value={environment}
            onChange={(e) => onEnvironmentChange(e.target.value as EnvironmentMode)}
            className="hidden sm:block text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-sky-500 whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Pilih Lingkungan Sistem"
          >
            <option value="production">{t.envProduction}</option>
            <option value="internal">{t.envInternal}</option>
            <option value="sandbox">{t.envSandbox}</option>
          </select>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(lang === 'id' ? 'en' : 'id')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="Ganti Bahasa / Switch Language"
            aria-label="Ganti Bahasa"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            aria-label="Beralih tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {currentUser && onSignOut && (
            <button
              onClick={onSignOut}
              className="ml-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {t.signOut}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
