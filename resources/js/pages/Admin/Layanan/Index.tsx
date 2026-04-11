// resources/js/Pages/Admin/Layanan/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    Paperclip,
    Search,
    Settings,
    Star,
    Trash2,
    Upload,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LayananSubmission {
    id: number;
    jenis_layanan: string;
    form_data: {
        nama_lengkap?: string;
        nik?: string;
        email?: string;
        no_telepon?: string;
        [key: string]: any;
    };
    uploaded_files?: { [key: string]: string | string[] };
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    catatan_admin?: string;
    result_files?: string[];
    rating?: number;
    feedback?: string;
    rated_at?: string;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LayananIndexProps {
    auth: { user: { id: number; name: string; email: string; role: string } };
    layanan: {
        data: LayananSubmission[];
        links?: PaginationLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
    };
    jenisLayananList: string[];
    filters: { search?: string; jenis_layanan?: string; status?: string };
    flash?: { success?: string; error?: string };
}

// ─── helpers ────────────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
            ))}
            <span className="ml-1 text-xs font-semibold text-gray-600">{rating}/5</span>
        </div>
    );
}

// ─── main ────────────────────────────────────────────────────────────────────

export default function LayananIndex({ auth, layanan, jenisLayananList, filters, flash }: LayananIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedJenisLayanan, setSelectedJenisLayanan] = useState(filters.jenis_layanan || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedLayanan, setSelectedLayanan] = useState<LayananSubmission | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showSelesaiModal, setShowSelesaiModal] = useState(false);
    const [confirmData, setConfirmData] = useState<{ item: LayananSubmission; newStatus: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // Form selesai: file only (link dihapus)
    const [selesaiFiles, setSelesaiFiles] = useState<File[]>([]);
    const [selesaiCatatan, setSelesaiCatatan] = useState('');
    const [selesaiSubmitting, setSelesaiSubmitting] = useState(false);
    const [fileError, setFileError] = useState('');

    const isInitialMount = useRef(true);

    const isAdminBps = auth.user.role === 'admin_bps';

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const id = setTimeout(() => handleSearch(), 500);
        return () => clearTimeout(id);
    }, [searchTerm, selectedJenisLayanan, selectedStatus]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedJenisLayanan) params.set('jenis_layanan', selectedJenisLayanan);
        if (selectedStatus) params.set('status', selectedStatus);
        const qs = params.toString();
        router.get(qs ? `${route('admin.layanan.index')}?${qs}` : route('admin.layanan.index'), {}, { preserveState: true, replace: true });
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedJenisLayanan('');
        setSelectedStatus('');
        router.get(route('admin.layanan.index'), {}, { preserveState: true, replace: true });
    };

    const handleStatusChange = (item: LayananSubmission, newStatus: string) => {
        if (newStatus === 'ditolak') {
            setConfirmData({ item, newStatus });
            setShowRejectModal(true);
        } else if (newStatus === 'selesai') {
            setConfirmData({ item, newStatus });
            setSelesaiCatatan(item.catatan_admin || '');
            setSelesaiFiles([]);
            setFileError('');
            setShowSelesaiModal(true);
        } else {
            setConfirmData({ item, newStatus });
            setShowConfirmModal(true);
        }
    };

    const confirmStatusChange = () => {
        if (!confirmData) return;
        router.put(
            route('admin.layanan.update-status', confirmData.item.id),
            {
                status: confirmData.newStatus,
                search: searchTerm,
                jenis_layanan_filter: selectedJenisLayanan,
                status_filter: selectedStatus,
            },
            {
                preserveState: false,
                onSuccess: () => {
                    setShowConfirmModal(false);
                    setConfirmData(null);
                },
            },
        );
    };

    const confirmReject = () => {
        if (!confirmData || !rejectReason.trim()) {
            alert('Alasan penolakan harus diisi');
            return;
        }
        router.put(
            route('admin.layanan.update-status', confirmData.item.id),
            {
                status: 'ditolak',
                catatan_admin: rejectReason,
                search: searchTerm,
                jenis_layanan_filter: selectedJenisLayanan,
                status_filter: selectedStatus,
            },
            {
                preserveState: false,
                onSuccess: () => {
                    setShowRejectModal(false);
                    setConfirmData(null);
                    setRejectReason('');
                },
            },
        );
    };

    const confirmSelesai = () => {
        if (!confirmData) return;
        setSelesaiSubmitting(true);

        const formData = new FormData();
        formData.append('status', 'selesai');
        formData.append('_method', 'PUT');
        if (selesaiCatatan) formData.append('catatan_admin', selesaiCatatan);
        selesaiFiles.forEach((f) => formData.append('result_files[]', f));

        if (searchTerm) formData.append('search', searchTerm);
        if (selectedJenisLayanan) formData.append('jenis_layanan_filter', selectedJenisLayanan);
        if (selectedStatus) formData.append('status_filter', selectedStatus);

        router.post(route('admin.layanan.update-status', confirmData.item.id), formData, {
            forceFormData: true,
            preserveState: false,
            onSuccess: () => {
                setShowSelesaiModal(false);
                setConfirmData(null);
                setSelesaiFiles([]);
                setSelesaiCatatan('');
                setFileError('');
                setSelesaiSubmitting(false);
            },
            onError: () => setSelesaiSubmitting(false),
        });
    };

    const cancelAll = () => {
        setShowConfirmModal(false);
        setShowRejectModal(false);
        setShowSelesaiModal(false);
        setConfirmData(null);
        setRejectReason('');
        setSelesaiFiles([]);
        setSelesaiCatatan('');
        setFileError('');
    };

    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

    const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const oversized = Array.from(files).filter((f) => f.size > MAX_FILE_SIZE);
        if (oversized.length > 0) {
            const names = oversized.map((f) => f.name).join(', ');
            setFileError(`File berikut melebihi batas maksimal 1 MB: ${names}`);
            e.target.value = '';
            return;
        }

        setFileError('');
        const newFiles = Array.from(files);
        setSelesaiFiles((prev) => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const removeFile = (idx: number) => {
        setSelesaiFiles((prev) => prev.filter((_, i) => i !== idx));
        setFileError('');
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
            pending: { cls: 'bg-yellow-100 text-yellow-800', icon: <Clock className="mr-1 h-3 w-3" />, label: 'Menunggu' },
            diproses: { cls: 'bg-blue-100 text-blue-800', icon: <AlertCircle className="mr-1 h-3 w-3" />, label: 'Sedang Diproses' },
            selesai: { cls: 'bg-green-100 text-green-800', icon: <CheckCircle className="mr-1 h-3 w-3" />, label: 'Selesai' },
            ditolak: { cls: 'bg-red-100 text-red-800', icon: <XCircle className="mr-1 h-3 w-3" />, label: 'Ditolak' },
        };
        const cfg = map[status] ?? { cls: 'bg-gray-100 text-gray-800', icon: null, label: status };
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}>
                {cfg.icon}
                {cfg.label}
            </span>
        );
    };

    const layananArray = layanan?.data || [];

    // ── Card (mobile) ────────────────────────────────────────────────────────
    const LayananCard = ({ item }: { item: LayananSubmission }) => (
        <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-gray-900">{item.jenis_layanan}</h3>
                    <p className="text-xs text-gray-600">{item.form_data.nama_lengkap}</p>
                    <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <div>{getStatusBadge(item.status)}</div>
            </div>
            {item.rating && (
                <div className="mb-2">
                    <StarDisplay rating={item.rating} />
                </div>
            )}
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedLayanan(item)}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-200"
                >
                    <Eye className="mr-1 h-3 w-3" /> Detail
                </button>
                {item.status !== 'selesai' && item.status !== 'ditolak' && (
                    <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item, e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
                    >
                        <option value="pending">Menunggu</option>
                        <option value="diproses">Sedang Diproses</option>
                        <option value="selesai">Selesai</option>
                        <option value="ditolak">Ditolak</option>
                    </select>
                )}
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Permohonan Layanan">
            <Head title="Kelola Permohonan Layanan" />

            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                {/* Flash */}
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 sm:p-4">
                        <p className="text-sm text-green-700">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 sm:p-4">
                        <p className="text-sm text-red-700">{flash.error}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Kelola Permohonan Layanan</h2>
                        {layanan.total !== undefined && (
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                {layanan.from && layanan.to ? (
                                    <>
                                        Menampilkan {layanan.from}–{layanan.to} dari {layanan.total} permohonan
                                        {(searchTerm || selectedJenisLayanan || selectedStatus) && ' (difilter)'}
                                    </>
                                ) : (
                                    <>Total {layanan.total} permohonan</>
                                )}
                            </p>
                        )}
                    </div>
                    {isAdminBps && (
                        <Link
                            href={route('admin.layanan-settings.index')}
                            className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-700 sm:w-auto"
                        >
                            <Settings className="mr-2 h-4 w-4" /> Kelola Jenis Layanan
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        {
                            label: 'Menunggu',
                            value: layananArray.filter((p) => p.status === 'pending').length,
                            color: 'text-yellow-600',
                            icon: Clock,
                        },
                        {
                            label: 'Diproses',
                            value: layananArray.filter((p) => p.status === 'diproses').length,
                            color: 'text-blue-600',
                            icon: AlertCircle,
                        },
                        {
                            label: 'Selesai',
                            value: layananArray.filter((p) => p.status === 'selesai').length,
                            color: 'text-green-600',
                            icon: CheckCircle,
                        },
                        {
                            label: 'Ditolak',
                            value: layananArray.filter((p) => p.status === 'ditolak').length,
                            color: 'text-red-600',
                            icon: XCircle,
                        },
                    ].map(({ label, value, color, icon: Icon }) => (
                        <div key={label} className="rounded-lg border bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{label}</p>
                                    <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
                                </div>
                                <Icon className={`h-8 w-8 ${color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-4">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NIK, atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {searchTerm ? (
                                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-4 w-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={showFilters ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}
                                >
                                    <Filter className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    {(showFilters || selectedJenisLayanan || selectedStatus) && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-gray-700">Jenis Layanan</label>
                                    <select
                                        value={selectedJenisLayanan}
                                        onChange={(e) => setSelectedJenisLayanan(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                                    >
                                        <option value="">Semua</option>
                                        {jenisLayananList.map((j) => (
                                            <option key={j} value={j}>
                                                {j}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-gray-700">Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="pending">Menunggu</option>
                                        <option value="diproses">Sedang Diproses</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>
                                </div>
                                {(searchTerm || selectedJenisLayanan || selectedStatus) && (
                                    <div className="flex items-end">
                                        <button
                                            onClick={clearSearch}
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <X className="mr-1 h-4 w-4" /> Clear
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {layananArray.length === 0 ? (
                        <div className="rounded-lg border bg-white py-12 text-center shadow-sm">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-base font-medium text-gray-900">Tidak ada permohonan</h3>
                        </div>
                    ) : (
                        <>
                            {/* Mobile */}
                            <div className="block space-y-3 lg:hidden">
                                {layananArray.map((item) => (
                                    <LayananCard key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Desktop */}
                            <div className="hidden lg:block">
                                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {['Tanggal', 'Pemohon', 'Jenis Layanan', 'Status', 'Penilaian', 'Aksi'].map((h) => (
                                                        <th
                                                            key={h}
                                                            className="px-6 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase"
                                                        >
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {layananArray.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-900">
                                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                                                            <div className="font-medium">{item.form_data.nama_lengkap}</div>
                                                            <div className="text-gray-500">{item.form_data.email || item.form_data.no_telepon}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                                                            <div className="max-w-xs truncate">{item.jenis_layanan}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                                                            {getStatusBadge(item.status)}
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                                                            {item.rating ? (
                                                                <div className="flex justify-center">
                                                                    <StarDisplay rating={item.rating} />
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">
                                                                    {item.status === 'selesai' ? 'Belum dinilai' : '–'}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-sm whitespace-nowrap">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => setSelectedLayanan(item)}
                                                                    className="inline-flex shrink-0 items-center rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                                                                >
                                                                    <Eye className="mr-1 h-3 w-3" /> Detail
                                                                </button>
                                                                {item.status !== 'selesai' && item.status !== 'ditolak' && (
                                                                    <select
                                                                        value={item.status}
                                                                        onChange={(e) => handleStatusChange(item, e.target.value)}
                                                                        className="w-36 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                                                                    >
                                                                        <option value="pending">Menunggu</option>
                                                                        <option value="diproses">Sedang Diproses</option>
                                                                        <option value="selesai">Selesai</option>
                                                                        <option value="ditolak">Ditolak</option>
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {layanan.links && layanan.links.length > 0 && layananArray.length > 0 && (
                    <div className="mt-6">
                        <Pagination links={layanan.links} />
                    </div>
                )}
            </div>

            {/* ═══ MODAL: Konfirmasi biasa ═══ */}
            {showConfirmModal && confirmData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="border-b p-6">
                            <h3 className="text-lg font-semibold">Konfirmasi Perubahan Status</h3>
                        </div>
                        <div className="space-y-4 p-6">
                            <p className="text-sm text-gray-700">Apakah Anda yakin ingin mengubah status permohonan ini?</p>
                            <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600">Dari:</span>
                                    {getStatusBadge(confirmData.item.status)}
                                </div>
                                <div className="flex items-center justify-between border-t pt-3">
                                    <span className="text-xs font-medium text-gray-600">Menjadi:</span>
                                    {getStatusBadge(confirmData.newStatus)}
                                </div>
                            </div>
                            <div className="space-y-2 rounded-lg border border-orange-100 bg-orange-50 p-4">
                                <p className="text-xs font-medium text-gray-700">
                                    Pemohon: <span className="font-semibold text-gray-900">{confirmData.item.form_data.nama_lengkap}</span>
                                </p>
                                <p className="text-xs font-medium text-gray-700">
                                    Layanan: <span className="text-gray-900">{confirmData.item.jenis_layanan}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 border-t bg-gray-50 p-6">
                            <button
                                onClick={cancelAll}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmStatusChange}
                                className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
                            >
                                Ya, Ubah Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ MODAL: Tolak ═══ */}
            {showRejectModal && confirmData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="border-b p-6">
                            <h3 className="text-lg font-semibold">Tolak Permohonan</h3>
                        </div>
                        <div className="space-y-4 p-6">
                            <div className="space-y-1 rounded-lg border border-orange-100 bg-orange-50 p-4">
                                <p className="text-xs font-medium text-gray-700">
                                    Pemohon: <span className="font-semibold">{confirmData.item.form_data.nama_lengkap}</span>
                                </p>
                                <p className="text-xs font-medium text-gray-700">Layanan: {confirmData.item.jenis_layanan}</p>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Alasan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                                    placeholder="Jelaskan alasan penolakan..."
                                />
                                {!rejectReason.trim() && <p className="mt-1 text-xs text-red-600">Alasan penolakan wajib diisi</p>}
                            </div>
                        </div>
                        <div className="flex gap-3 border-t bg-gray-50 p-6">
                            <button
                                onClick={cancelAll}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={!rejectReason.trim()}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Tolak Permohonan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ MODAL: Selesai — upload hasil ═══ */}
            {showSelesaiModal && confirmData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Selesaikan Permohonan</h3>
                                <p className="mt-0.5 text-xs text-gray-500">Lampirkan hasil layanan untuk pemohon (opsional)</p>
                            </div>
                            <button onClick={cancelAll} className="rounded-full p-1 hover:bg-gray-100">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            {/* Info pemohon */}
                            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-800">Menandai sebagai Selesai</span>
                                </div>
                                <p className="text-xs text-green-700">
                                    Pemohon: <strong>{confirmData.item.form_data.nama_lengkap}</strong>
                                </p>
                                <p className="text-xs text-green-700">Layanan: {confirmData.item.jenis_layanan}</p>
                            </div>

                            {/* ── Upload file hasil ── */}
                            <div>
                                <p className="mb-2 block text-sm font-medium text-gray-700">
                                    <Paperclip className="mr-1 inline h-4 w-4" />
                                    Upload File Hasil Layanan
                                    <span className="ml-1 text-xs font-normal text-gray-400">(opsional, maks. 1 MB/file)</span>
                                </p>

                                {/* Drop-zone */}
                                <label
                                    htmlFor="selesai-file-upload"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 transition-colors hover:border-orange-400 hover:bg-orange-50"
                                >
                                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                    <p className="text-sm text-gray-600">Klik untuk memilih file</p>
                                    <p className="text-xs text-gray-400">JPG, PNG, PDF, DOC, DOCX • Maks. 1 MB per file</p>
                                </label>
                                <input
                                    id="selesai-file-upload"
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={handleFileAdd}
                                />

                                {/* Pesan error ukuran file */}
                                {fileError && (
                                    <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                        <p className="text-xs font-medium text-red-600">{fileError}</p>
                                    </div>
                                )}

                                {/* Daftar file terpilih */}
                                {selesaiFiles.length > 0 && (
                                    <ul className="mt-3 space-y-2">
                                        {selesaiFiles.map((f, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                                                    <span className="truncate text-gray-700">{f.name}</span>
                                                    <span className="shrink-0 text-xs text-gray-400">({(f.size / 1024).toFixed(0)} KB)</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(i)}
                                                    className="ml-2 shrink-0 text-red-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {selesaiFiles.length > 0 && <p className="mt-2 text-xs text-gray-500">{selesaiFiles.length} file dipilih</p>}
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Catatan untuk Pemohon <span className="text-xs font-normal text-gray-400">(opsional)</span>
                                </label>
                                <textarea
                                    value={selesaiCatatan}
                                    onChange={(e) => setSelesaiCatatan(e.target.value)}
                                    rows={3}
                                    placeholder="Contoh: Surat sudah selesai, silakan diunduh atau ambil di kantor desa."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 border-t bg-gray-50 px-6 py-4">
                            <button
                                onClick={cancelAll}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmSelesai}
                                disabled={selesaiSubmitting || !!fileError}
                                className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {selesaiSubmitting ? 'Menyimpan...' : '✓ Selesaikan Permohonan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ MODAL: Detail ═══ */}
            {selectedLayanan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
                            <h2 className="text-xl font-bold text-gray-900">Detail Permohonan</h2>
                            <button onClick={() => setSelectedLayanan(null)} className="rounded-full p-1 hover:bg-gray-100">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Status */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedLayanan.status)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(selectedLayanan.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Jenis Layanan</label>
                                <p className="mt-1 text-sm font-semibold text-gray-900">{selectedLayanan.jenis_layanan}</p>
                            </div>

                            {selectedLayanan.catatan_admin && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <label className="text-sm font-medium text-red-800">Catatan/Alasan Penolakan</label>
                                    <p className="mt-2 text-sm whitespace-pre-wrap text-red-900">{selectedLayanan.catatan_admin}</p>
                                </div>
                            )}

                            {/* Hasil layanan — hanya file, tanpa link */}
                            {selectedLayanan.result_files && selectedLayanan.result_files.length > 0 && (
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-800">
                                        <CheckCircle className="h-4 w-4" /> Hasil Layanan
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedLayanan.result_files.map((fp, i) => (
                                            <a
                                                key={i}
                                                href={`/${fp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 rounded-md border border-green-300 bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-100"
                                            >
                                                <Download className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{fp.split('/').pop()}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Penilaian */}
                            {selectedLayanan.rating && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
                                        <Star className="h-4 w-4" /> Penilaian Pemohon
                                        {selectedLayanan.rated_at && (
                                            <span className="text-xs font-normal text-amber-600">({selectedLayanan.rated_at})</span>
                                        )}
                                    </h3>
                                    <StarDisplay rating={selectedLayanan.rating} />
                                    {selectedLayanan.feedback && (
                                        <p className="mt-2 text-sm whitespace-pre-line text-amber-900">{selectedLayanan.feedback}</p>
                                    )}
                                </div>
                            )}

                            {/* Data form */}
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Data Permohonan</h3>
                                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    {Object.entries(selectedLayanan.form_data).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            <label className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</label>
                                            <p className="text-sm text-gray-900 sm:col-span-2">{value?.toString() || '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* File pengajuan */}
                            {selectedLayanan.uploaded_files && Object.keys(selectedLayanan.uploaded_files).length > 0 && (
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Dokumen Diunggah Pemohon</h3>
                                    <div className="space-y-3">
                                        {Object.entries(selectedLayanan.uploaded_files).map(([fieldName, files]) => {
                                            const fa = Array.isArray(files) ? files : [files];
                                            return (
                                                <div key={fieldName} className="rounded-lg border border-gray-200 bg-white p-4">
                                                    <label className="mb-2 block text-sm font-medium text-gray-700 capitalize">
                                                        {fieldName.replace(/_/g, ' ')}
                                                    </label>
                                                    <div className="space-y-2">
                                                        {fa.map((fp, i) => (
                                                            <a
                                                                key={i}
                                                                href={`/${fp}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 p-3 text-sm text-blue-600 hover:bg-blue-50"
                                                            >
                                                                <FileText className="h-5 w-5" />
                                                                <span className="flex-1 truncate">{fp.split('/').pop()}</span>
                                                                <Eye className="h-4 w-4" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 border-t bg-gray-50 p-4 sm:p-6">
                            <button
                                onClick={() => setSelectedLayanan(null)}
                                className="w-full rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
