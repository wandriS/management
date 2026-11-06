import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, CheckCircle2, Server } from 'lucide-react';
import { Language } from '../types/auth';
import { getTranslation } from '../utils/translations';

interface SecurityShowcaseProps {
  lang: Language;
}

export const SecurityShowcase: React.FC<SecurityShowcaseProps> = ({ lang }) => {
  const t = getTranslation(lang);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const backdropSrc = '/src/assets/images/portal_security_backdrop_1793980348294.jpg';

  return (
    <div className="relative h-full min-h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between p-8 text-white bg-slate-950">
      {/* Background image asset with fallback container */}
      {!imageError ? (
        <img
          src={backdropSrc}
          alt="Arsitektur Pusat Keamanan Sistem Portal Autentikasi"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            imageLoaded ? 'opacity-40' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* Measured contrast scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />

      {/* Top Section */}
      <div className="relative z-10 space-y-4">
        {/* Unboxed metadata kicker */}
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
          <span>KONSOL IDENTITAS TERPUSAT</span>
          <span aria-hidden="true">·</span>
          <span>FIPS 140-3 LEVEL 3</span>
          <span aria-hidden="true">·</span>
          <span>ZERO TRUST ARCHITECTURE</span>
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white max-w-md">
          {t.showcaseTitle}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-md">
          {t.showcaseDesc}
        </p>

        {/* Core Pillars */}
        <div className="pt-4 space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-md bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.feature1Title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{t.feature1Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-md bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.feature2Title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{t.feature2Desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-md bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t.feature3Title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{t.feature3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Compliance & Service Availability */}
      <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200">{t.liveStatus}</span>
          </div>
          <span className="text-sky-300 tabular-nums">{t.uptime}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Sertifikasi ISO/IEC 27001:2022 & Standar Kriptografi BSSN Terverifikasi</span>
        </div>
      </div>
    </div>
  );
};
