import React, { useState } from 'react';
import {
  ShieldCheck,
  User as UserIcon,
  Laptop,
  Smartphone,
  LogOut,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  KeyRound,
  Fingerprint,
  RefreshCw,
  Clock,
  MapPin,
  Globe,
} from 'lucide-react';
import { User, ActiveSession, AuditLogEntry, Language } from '../types/auth';
import { getTranslation } from '../utils/translations';
import { INITIAL_SESSIONS, INITIAL_AUDIT_LOGS } from '../data/mockUsers';

interface AuthenticatedConsoleProps {
  user: User;
  lang: Language;
  onSignOut: () => void;
  onNotify: (title: string, message: string) => void;
}

export const AuthenticatedConsole: React.FC<AuthenticatedConsoleProps> = ({
  user,
  lang,
  onSignOut,
  onNotify,
}) => {
  const t = getTranslation(lang);
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'BERHASIL' | 'DITOLAK'>('ALL');
  const [mfaActive, setMfaActive] = useState(user.mfaEnabled);
  const [passkeyActive, setPasskeyActive] = useState(user.passkeyRegistered);

  // Revoke single session
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    onNotify(
      lang === 'id' ? 'Sesi Dicabut' : 'Session Revoked',
      lang === 'id' ? 'Token otorisasi perangkat berhasil dibatalkan.' : 'Device authorization token invalidated successfully.'
    );
  };

  // Revoke all other sessions
  const handleRevokeOthers = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    onNotify(
      lang === 'id' ? 'Semua Sesi Lain Dicabut' : 'Other Sessions Revoked',
      lang === 'id' ? 'Hanya perangkat aktif saat ini yang dipertahankan.' : 'Only this active device remains authenticated.'
    );
  };

  // Export audit log to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Waktu', 'Peristiwa', 'Pengguna', 'Alamat IP', 'Lokasi', 'Perangkat', 'Status'];
    const rows = auditLogs.map((log) => [
      log.id,
      log.timestamp,
      `"${log.event}"`,
      log.userEmail,
      log.ipAddress,
      `"${log.location}"`,
      `"${log.device}"`,
      log.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_log_portal_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onNotify(
      lang === 'id' ? 'Ekspor Selesai' : 'Export Complete',
      lang === 'id' ? 'Berkas log audit berhasil diunduh (CSV).' : 'Audit log CSV file downloaded successfully.'
    );
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (filterStatus === 'ALL') return true;
    return log.status === filterStatus;
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Session Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                {user.status}
              </span>
            </div>
            {/* Zero-pill metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>{user.email}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">NIP {user.nip}</span>
              <span aria-hidden="true">·</span>
              <span>{user.department}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.signOut}</span>
          </button>
        </div>
      </div>

      {/* Permissions & Security Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Role & Clearances */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.roleTag}
            </span>
            <ShieldCheck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {user.role}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user.permissions.map((p) => (
              <span
                key={p}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Card 2: 2FA Status */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.totpStatus}
            </span>
            <KeyRound className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {mfaActive ? t.enabled : t.disabled}
            </span>
            <button
              type="button"
              onClick={() => {
                setMfaActive(!mfaActive);
                onNotify(
                  lang === 'id' ? 'Pengaturan 2FA Diperbarui' : '2FA Setting Updated',
                  !mfaActive
                    ? (lang === 'id' ? 'Autentikasi dua langkah diaktifkan.' : 'Two-factor authentication enabled.')
                    : (lang === 'id' ? 'Autentikasi dua langkah dinonaktifkan.' : 'Two-factor authentication disabled.')
                );
              }}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              {t.toggle}
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.totpDesc}
          </p>
        </div>

        {/* Card 3: Passkey Biometrics */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.passkeyStatus}
            </span>
            <Fingerprint className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {passkeyActive ? t.enabled : t.disabled}
            </span>
            <button
              type="button"
              onClick={() => {
                setPasskeyActive(!passkeyActive);
                onNotify(
                  lang === 'id' ? 'Pengaturan Passkey Diperbarui' : 'Passkey Setting Updated',
                  !passkeyActive
                    ? (lang === 'id' ? 'Kunci FIDO2 didaftarkan.' : 'FIDO2 Passkey registered.')
                    : (lang === 'id' ? 'Kunci FIDO2 dinonaktifkan.' : 'FIDO2 Passkey deactivated.')
                );
              }}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              {t.toggle}
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.passkeyDesc}
          </p>
        </div>
      </div>

      {/* Active Sessions & Devices Management */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.activeSessionsTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.activeSessionsSub}
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleRevokeOthers}
              className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.revokeAllSessions}
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {sess.deviceName.toLowerCase().includes('iphone') ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {sess.deviceName}
                    </span>
                    {sess.isCurrent && (
                      <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 px-1.5 py-0.5 rounded">
                        {t.currentDevice}
                      </span>
                    )}
                  </div>
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{sess.browser}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{sess.ipAddress}</span>
                    <span aria-hidden="true">·</span>
                    <span>{sess.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-xs font-mono text-slate-400">
                  {sess.lastActive}
                </span>
                {!sess.isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevokeSession(sess.id)}
                    className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 rounded-md transition-colors cursor-pointer"
                  >
                    {t.revokeButton}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.auditLogTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.auditLogSub}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter buttons - segmented controls */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('BERHASIL')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === 'BERHASIL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.filterSuccess}
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('DITOLAK')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === 'DITOLAK'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.filterFailed}
              </button>
            </div>

            {/* CSV export */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">{t.eventCol}</th>
                <th className="px-6 py-3">{t.timeCol}</th>
                <th className="px-6 py-3">{t.deviceCol}</th>
                <th className="px-6 py-3 text-right">{t.statusCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {log.event}
                    </div>
                    {log.details && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {log.details}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3.5 font-mono tabular-nums text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="text-slate-800 dark:text-slate-200">
                      {log.device}
                    </div>
                    <div className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400">
                      {log.ipAddress} · {log.location}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                        log.status === 'BERHASIL'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : log.status === 'DITOLAK'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {log.status === 'BERHASIL' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
