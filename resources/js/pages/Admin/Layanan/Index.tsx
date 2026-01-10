// resources/js/Pages/Admin/Layanan/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Eye, FileText, Filter, Search, X, XCircle } from 'lucide-react';
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
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LayananIndexProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
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
    filters: {
        search?: string;
        jenis_layanan?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function LayananIndex({ auth, layanan, jenisLayananList, filters, flash }: LayananIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedJenisLayanan, setSelectedJenisLayanan] = useState(filters.jenis_layanan || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedLayanan, setSelectedLayanan] = useState<LayananSubmission | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [confirmData, setConfirmData] = useState<{ item: LayananSubmission; newStatus: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const isInitialMount = useRef(true);

    // Debounced search
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedJenisLayanan, selectedStatus]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchTerm) params.set('search', searchTerm);
        if (selectedJenisLayanan) params.set('jenis_layanan', selectedJenisLayanan);
        if (selectedStatus) params.set('status', selectedStatus);

        const queryString = params.toString();
        const url = queryString ? route('admin.layanan.index') + `?${queryString}` : route('admin.layanan.index');

        router.get(url, {}, { preserveState: true, replace: true });
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
                preserveScroll: false,
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
                preserveScroll: false,
                onSuccess: () => {
                    setShowRejectModal(false);
                    setConfirmData(null);
                    setRejectReason('');
                },
            },
        );
    };

    const cancelStatusChange = () => {
        setShowConfirmModal(false);
        setShowRejectModal(false);
        setConfirmData(null);
        setRejectReason('');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Menunggu
                    </span>
                );
            case 'diproses':
                return (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Sedang Diproses
                    </span>
                );
            case 'selesai':
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Selesai
                    </span>
                );
            case 'ditolak':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <XCircle className="mr-1 h-3 w-3" />
                        Ditolak
                    </span>
                );
        }
    };

    // Card component for mobile view
    const LayananCard = ({ item }: { item: LayananSubmission }) => (
        <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">{item.jenis_layanan}</h3>
                    <p className="mb-1 text-xs text-gray-600 sm:text-sm">{item.form_data.nama_lengkap}</p>
                    <p className="mb-2 text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <div>{getStatusBadge(item.status)}</div>
            </div>
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-500">
                {item.form_data.email && <span>Email: {item.form_data.email}</span>}
                {item.form_data.no_telepon && <span>Telp: {item.form_data.no_telepon}</span>}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedLayanan(item)}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-200"
                >
                    <Eye className="mr-1 h-3 w-3" />
                    Detail
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

    const layananArray = layanan?.data || [];

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Layanan">
            <Head title="Kelola Layanan" />

            <div className="space-y-4 px-4 sm:space-y-6 sm:px-0">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 sm:p-4">
                        <p className="text-sm text-green-700 sm:text-base">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 sm:p-4">
                        <p className="text-sm text-red-700 sm:text-base">{flash.error}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Kelola Layanan</h2>
                        {layanan.total && (
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                {layanan.from && layanan.to ? (
                                    <>
                                        Menampilkan {layanan.from} - {layanan.to} dari {layanan.total} permohonan
                                        {(searchTerm || selectedJenisLayanan || selectedStatus) && ' (difilter)'}
                                    </>
                                ) : (
                                    <>Total {layanan.total} permohonan</>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                                <p className="mt-1 text-2xl font-bold text-yellow-600">{layananArray.filter((p) => p.status === 'pending').length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Diproses</p>
                                <p className="mt-1 text-2xl font-bold text-blue-600">{layananArray.filter((p) => p.status === 'diproses').length}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Selesai</p>
                                <p className="mt-1 text-2xl font-bold text-green-600">{layananArray.filter((p) => p.status === 'selesai').length}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ditolak</p>
                                <p className="mt-1 text-2xl font-bold text-red-600">{layananArray.filter((p) => p.status === 'ditolak').length}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, NIK, atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none sm:py-3 sm:pl-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {searchTerm ? (
                                <button onClick={() => setSearchTerm('')} className="text-gray-400 transition-colors hover:text-gray-600">
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`transition-colors ${showFilters ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {(showFilters || selectedJenisLayanan || selectedStatus) && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex-1">
                                    <label htmlFor="jenis_layanan" className="mb-1 block text-xs font-medium text-gray-700">
                                        Jenis Layanan
                                    </label>
                                    <select
                                        id="jenis_layanan"
                                        value={selectedJenisLayanan}
                                        onChange={(e) => setSelectedJenisLayanan(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                    >
                                        <option value="">Semua Jenis Layanan</option>
                                        {jenisLayananList.map((jenis) => (
                                            <option key={jenis} value={jenis}>
                                                {jenis}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="status" className="mb-1 block text-xs font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
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
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {layananArray.length === 0 ? (
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
                                    {searchTerm || selectedJenisLayanan || selectedStatus
                                        ? 'Tidak ada permohonan yang sesuai dengan pencarian'
                                        : 'Tidak ada permohonan layanan'}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                    {searchTerm || selectedJenisLayanan || selectedStatus
                                        ? 'Coba ubah kata kunci pencarian atau filter.'
                                        : 'Belum ada permohonan layanan dari masyarakat.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block space-y-3 sm:space-y-4 lg:hidden">
                                {layananArray.map((item) => (
                                    <LayananCard key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden overflow-hidden rounded-lg border bg-white shadow-sm lg:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Pemohon
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Jenis Layanan
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {layananArray.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="font-medium">{item.form_data.nama_lengkap}</div>
                                                        <div className="text-gray-500">{item.form_data.email || item.form_data.no_telepon}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="max-w-xs truncate">{item.jenis_layanan}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{getStatusBadge(item.status)}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setSelectedLayanan(item)}
                                                                className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                                                            >
                                                                <Eye className="mr-1 h-3 w-3" />
                                                                Detail
                                                            </button>
                                                            {item.status !== 'selesai' && item.status !== 'ditolak' && (
                                                                <select
                                                                    value={item.status}
                                                                    onChange={(e) => handleStatusChange(item, e.target.value)}
                                                                    className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
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
                        </>
                    )}
                </div>

                {/* Pagination */}
                {layanan.links && layanan.links.length > 0 && layananArray.length > 0 && (
                    <div className="mt-6">
                        <Pagination links={layanan.links} />
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && confirmData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="border-b p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">Konfirmasi Perubahan Status</h3>
                        </div>

                        <div className="space-y-4 p-4 sm:p-6">
                            <p className="text-sm text-gray-700 sm:text-base">Apakah Anda yakin ingin mengubah status permohonan ini?</p>

                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600 sm:text-sm">Dari:</span>
                                    {getStatusBadge(confirmData.item.status)}
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                                    <span className="text-xs font-medium text-gray-600 sm:text-sm">Menjadi:</span>
                                    {getStatusBadge(confirmData.newStatus)}
                                </div>
                            </div>

                            <div className="space-y-2 rounded-lg border border-orange-100 bg-orange-50 p-3 sm:p-4">
                                <div>
                                    <span className="text-xs font-medium text-gray-700">Pemohon:</span>
                                    <p className="mt-0.5 text-sm font-semibold text-gray-900">{confirmData.item.form_data.nama_lengkap}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-700">Jenis Layanan:</span>
                                    <p className="mt-0.5 text-sm text-gray-900">{confirmData.item.jenis_layanan}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t bg-gray-50 p-4 sm:p-6">
                            <button
                                onClick={cancelStatusChange}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:text-base"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmStatusChange}
                                className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 sm:text-base"
                            >
                                Ya, Ubah Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && confirmData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="border-b p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">Tolak Permohonan</h3>
                        </div>

                        <div className="space-y-4 p-4 sm:p-6">
                            <p className="text-sm text-gray-700 sm:text-base">Silakan masukkan alasan penolakan permohonan layanan ini:</p>

                            <div className="space-y-2 rounded-lg border border-orange-100 bg-orange-50 p-3 sm:p-4">
                                <div>
                                    <span className="text-xs font-medium text-gray-700">Pemohon:</span>
                                    <p className="mt-0.5 text-sm font-semibold text-gray-900">{confirmData.item.form_data.nama_lengkap}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-700">Jenis Layanan:</span>
                                    <p className="mt-0.5 text-sm text-gray-900">{confirmData.item.jenis_layanan}</p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Alasan Penolakan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                                    placeholder="Jelaskan alasan penolakan permohonan ini..."
                                    required
                                />
                                {!rejectReason.trim() && <p className="mt-1 text-xs text-red-600">Alasan penolakan wajib diisi</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 border-t bg-gray-50 p-4 sm:p-6">
                            <button
                                onClick={cancelStatusChange}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:text-base"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={!rejectReason.trim()}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                            >
                                Tolak Permohonan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedLayanan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
                            <h2 className="text-xl font-bold text-gray-900">Detail Permohonan Layanan</h2>
                            <button onClick={() => setSelectedLayanan(null)} className="rounded-full p-1 hover:bg-gray-100">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Status and Basic Info */}
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

                            {/* Catatan Admin (jika ada) */}
                            {selectedLayanan.catatan_admin && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <label className="text-sm font-medium text-red-800">Catatan/Alasan Penolakan</label>
                                    <p className="mt-2 text-sm whitespace-pre-wrap text-red-900">{selectedLayanan.catatan_admin}</p>
                                </div>
                            )}

                            {/* Form Data */}
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Data Permohonan</h3>
                                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    {Object.entries(selectedLayanan.form_data).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            <label className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</label>
                                            <div className="sm:col-span-2">
                                                <p className="text-sm text-gray-900">{value?.toString() || '-'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Uploaded Files */}
                            {selectedLayanan.uploaded_files && Object.keys(selectedLayanan.uploaded_files).length > 0 && (
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Dokumen yang Diunggah</h3>
                                    <div className="space-y-3">
                                        {Object.entries(selectedLayanan.uploaded_files).map(([fieldName, files]) => {
                                            const fileArray = Array.isArray(files) ? files : [files];
                                            return (
                                                <div key={fieldName} className="rounded-lg border border-gray-200 bg-white p-4">
                                                    <label className="mb-2 block text-sm font-medium text-gray-700 capitalize">
                                                        {fieldName.replace(/_/g, ' ')}
                                                    </label>
                                                    <div className="space-y-2">
                                                        {fileArray.map((filePath, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={`/storage/${filePath}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 p-3 text-sm text-blue-600 transition-colors hover:bg-blue-50"
                                                            >
                                                                <FileText className="h-5 w-5" />
                                                                <span className="flex-1 truncate">{filePath.split('/').pop()}</span>
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
                                className="w-full rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 sm:text-base"
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
