// resources/js/components/NotificationBell.tsx
// Pasang komponen ini di navbar/AuthenticatedLayout Anda

import { AlertCircle, Bell, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface NotificationData {
    layanan_id: number;
    jenis_layanan: string;
    status: 'diproses' | 'selesai' | 'ditolak' | string;
    status_label: string;
    catatan_admin?: string;
    message: string;
    icon: 'info' | 'success' | 'error' | 'warning';
}

interface Notification {
    id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isMutating = useRef(false);
    // Track apakah dropdown pernah dibuka (agar auto-read hanya terpicu setelah benar-benar dibuka)
    const wasOpened = useRef(false);

    const csrfToken = () => (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';

    const fetchNotifications = useCallback(async () => {
        if (isMutating.current) return;
        setLoading(true);
        try {
            const res = await fetch(route('notifications.index'), {
                headers: { Accept: 'application/json' },
            });
            const json = await res.json();
            setNotifications(json.notifications ?? []);
            setUnreadCount(json.unread_count ?? 0);
        } catch (e) {
            console.error('Gagal mengambil notifikasi:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        isMutating.current = true;
        try {
            await fetch(route('notifications.mark-all-read'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrfToken(), Accept: 'application/json' },
            });
            const res = await fetch(route('notifications.index'), {
                headers: { Accept: 'application/json' },
            });
            const json = await res.json();
            setNotifications(json.notifications ?? []);
            setUnreadCount(json.unread_count ?? 0);
        } catch (e) {
            console.error('Gagal tandai semua baca:', e);
        } finally {
            isMutating.current = false;
        }
    }, []);

    // Auto mark-all-read saat dropdown ditutup (jika ada unread)
    const closeDropdown = useCallback(() => {
        if (wasOpened.current && unreadCount > 0) {
            markAllAsRead();
        }
        wasOpened.current = false;
        setOpen(false);
    }, [unreadCount, markAllAsRead]);

    // Fetch saat pertama kali mount + polling setiap 60 detik
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60_000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeDropdown]);

    const handleOpen = () => {
        if (open) {
            closeDropdown();
        } else {
            wasOpened.current = true;
            setOpen(true);
            fetchNotifications();
        }
    };

    const markAsRead = async (id: string) => {
        isMutating.current = true;
        try {
            await fetch(route('notifications.mark-read', id), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrfToken(), Accept: 'application/json' },
            });
            const res = await fetch(route('notifications.index'), {
                headers: { Accept: 'application/json' },
            });
            const json = await res.json();
            setNotifications(json.notifications ?? []);
            setUnreadCount(json.unread_count ?? 0);
        } catch (e) {
            console.error('Gagal tandai baca:', e);
        } finally {
            isMutating.current = false;
        }
    };

    const statusIcon = (icon: string) => {
        switch (icon) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'error':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'info':
                return <AlertCircle className="h-4 w-4 text-blue-500" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    const statusBadge = (status: string, label: string) => {
        const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium';
        switch (status) {
            case 'selesai':
                return <span className={`${base} bg-green-100 text-green-700`}>{label}</span>;
            case 'ditolak':
                return <span className={`${base} bg-red-100 text-red-700`}>{label}</span>;
            case 'diproses':
                return <span className={`${base} bg-blue-100 text-blue-700`}>{label}</span>;
            default:
                return <span className={`${base} bg-yellow-100 text-yellow-700`}>{label}</span>;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell button */}
            <button
                onClick={handleOpen}
                className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                aria-label="Notifikasi"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-gray-900">Notifikasi</h3>
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="py-8 text-center text-sm text-gray-400">Memuat...</div>
                        ) : notifications.length === 0 ? (
                            <div className="py-10 text-center">
                                <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                <p className="text-sm text-gray-400">Belum ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.read_at && markAsRead(notif.id)}
                                    className={`cursor-pointer border-b border-gray-50 px-4 py-3 transition-colors last:border-0 hover:bg-gray-50 ${
                                        !notif.read_at ? 'bg-orange-50/60' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex-shrink-0">{statusIcon(notif.data.icon)}</div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                {statusBadge(notif.data.status, notif.data.status_label)}
                                                {!notif.read_at && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />}
                                            </div>
                                            <p className="text-xs leading-relaxed text-gray-700">{notif.data.message}</p>

                                            {/* Alasan penolakan */}
                                            {notif.data.status === 'ditolak' && notif.data.catatan_admin && (
                                                <div className="mt-1.5 rounded-md border border-red-100 bg-red-50 p-2">
                                                    <p className="text-xs font-medium text-red-700">Alasan:</p>
                                                    <p className="line-clamp-2 text-xs text-red-600">{notif.data.catatan_admin}</p>
                                                </div>
                                            )}

                                            <p className="mt-1 text-[11px] text-gray-400">{notif.created_at}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-gray-100 px-4 py-2 text-center">
                            <p className="text-xs text-gray-400">Menampilkan {notifications.length} notifikasi terbaru</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
