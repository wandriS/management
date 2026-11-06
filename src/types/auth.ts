export type AuthMode =
  | 'login'
  | 'two_factor'
  | 'register'
  | 'forgot_password'
  | 'magic_link'
  | 'passkey'
  | 'authenticated_dashboard';

export type EnvironmentMode = 'production' | 'internal' | 'sandbox';

export type Language = 'id' | 'en';

export type UserRole =
  | 'Super Administrator'
  | 'Auditor & Pengawas'
  | 'Staf Operasional'
  | 'Mitra Eksternal';

export interface User {
  id: string;
  name: string;
  email: string;
  nip: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  mfaEnabled: boolean;
  passkeyRegistered: boolean;
  lastLogin: string;
  status: 'Aktif' | 'Peninjauan' | 'Ditangguhkan';
  permissions: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: string;
  userEmail: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'BERHASIL' | 'DITOLAK' | 'PERINGATAN';
  details?: string;
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
