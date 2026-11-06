import React from 'react';
import { X, ShieldCheck, HelpCircle, FileText, PhoneCall } from 'lucide-react';
import { Language } from '../types/auth';

interface ModalDialogProps {
  type: 'help' | 'security' | 'privacy' | 'admin' | null;
  onClose: () => void;
  lang: Language;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({ type, onClose, lang }) => {
  if (!type) return null;

  const isId = lang === 'id';

  const contentMap = {
    help: {
      icon: <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      title: isId ? 'Pusat Bantuan & Panduan Akses' : 'Help Center & Access Guide',
      subtitle: isId ? 'Bantuan teknis seputar akses portal dan autentikasi multi-faktor' : 'Technical assistance on portal access and multi-factor authentication',
      body: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              {isId ? '1. Cara Masuk Pertama Kali' : '1. First-Time Sign In'}
            </h4>
            <p>
              {isId
                ? 'Gunakan akun email resmi institusi (@portal.id) yang telah didaftarkan oleh administrator unit kerja Anda. Kata sandi awal harus segera diganti setelah verifikasi.'
                : 'Use your registered official institutional email (@portal.id). Initial temporary passwords must be updated upon verification.'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              {isId ? '2. Kendala Kode 2FA / TOTP' : '2. 2FA / TOTP Code Issues'}
            </h4>
            <p>
              {isId
                ? 'Pastikan jam pada perangkat ponsel Anda sinkron dengan waktu server (WIB/UTC). Jika kehilangan akses aplikasi authenticator, gunakan kode pemulihan darurat atau opsi kirim via SMS.'
                : 'Ensure your smartphone device clock is synchronized with the server time. If you lost authenticator access, use backup emergency recovery codes or SMS fallback.'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              {isId ? '3. Penggunaan Passkey / Sidik Jari' : '3. Using Passkeys / Biometrics'}
            </h4>
            <p>
              {isId
                ? 'Passkey memanfaatkan modul TPM atau Secure Enclave pada perangkat laptop/ponsel Anda. Anda dapat mendaftarkan lebih dari satu perangkat terpercaya.'
                : 'Passkeys leverage the TPM or Secure Enclave on your device. You can register multiple trusted devices in security settings.'}
            </p>
          </div>
        </div>
      ),
    },
    security: {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: isId ? 'Standar & Kepatuhan Keamanan' : 'Security Standards & Compliance',
      subtitle: isId ? 'Spesifikasi kriptografi dan proteksi integritas data portal' : 'Cryptographic specifications and portal data integrity safeguards',
      body: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 font-mono text-xs">
            <div>
              <span className="text-slate-500 block">Protokol Enkripsi:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">TLS 1.3 / XChaCha20-Poly1305</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sertifikasi:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">ISO/IEC 27001:2022</span>
            </div>
            <div>
              <span className="text-slate-500 block">Autentikasi:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">FIDO2 / WebAuthn Level 2</span>
            </div>
            <div>
              <span className="text-slate-500 block">Audit Kepatuhan:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">BSSN & CSIRT Terverifikasi</span>
            </div>
          </div>
          <p>
            {isId
              ? 'Seluruh lalu lintas transmisi data dilindungi dengan enkripsi end-to-end tanpa penyimpanan kata sandi dalam bentuk teks biasa. Algoritma Argon2id digunakan untuk pengikatan hash kredensial.'
              : 'All transmission traffic is guarded with end-to-end encryption with zero plaintext password storage. Argon2id is enforced for credential hashing.'}
          </p>
        </div>
      ),
    },
    privacy: {
      icon: <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: isId ? 'Kebijakan Privasi & Perlindungan Data' : 'Privacy Policy & Data Protection',
      subtitle: isId ? 'Komitmen tata kelola data identitas dan telemetri akses' : 'Identity data governance and access telemetry commitments',
      body: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {isId
              ? 'Portal ini mematuhi Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022). Kami hanya memproses data identitas yang diperlukan secara sah untuk otorisasi akses sistem kedinasan.'
              : 'This portal complies with personal data protection regulations. We only process identity attributes strictly required for institutional access authorization.'}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{isId ? 'Log alamat IP dan agen peramban disimpan secara aman selama 180 hari untuk keperluan audit.' : 'IP addresses and browser agent logs are retained for 180 days solely for audit integrity.'}</li>
            <li>{isId ? 'Data biometrik lokal tidak pernah dikirimkan atau disimpan pada server pusat.' : 'Local biometric raw data never leaves the client hardware enclave.'}</li>
            <li>{isId ? 'Hak untuk meminta penghapusan identitas atau pengalihan hak akses dapat diajukan ke DPO.' : 'Access right revocations or data queries can be directed to the designated Data Protection Officer.'}</li>
          </ul>
        </div>
      ),
    },
    admin: {
      icon: <PhoneCall className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: isId ? 'Kontak Administrator Sistem' : 'System Administrator Contact',
      subtitle: isId ? 'Layanan bantuan darurat insiden siber & reset akun kedinasan' : 'Emergency cyber incident response & official credential reset desk',
      body: (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Pusat Operasi Keamanan (SOC):</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white">soc-helpdesk@portal.id</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Hotline Darurat 24/7:</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white">+62 21 555-0199</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Lokasi Operasional:</span>
              <span className="text-slate-900 dark:text-white">Gedung Pusat Siber Lt. 8, Jakarta</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {isId
              ? 'Untuk permohonan pembukaan akun terkunci akibat salah memasukkan kata sandi lebih dari 5 kali, lampirkan Surat Tugas resmi atau persetujuan atasan langsung.'
              : 'For unlocking accounts suspended due to excessive failed attempts, provide official supervisor verification.'}
          </p>
        </div>
      ),
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              {contentMap.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {contentMap.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {contentMap.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {contentMap.body}
        </div>

        <div className="flex justify-end px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {isId ? 'Tutup Dialog' : 'Close Dialog'}
          </button>
        </div>
      </div>
    </div>
  );
};
