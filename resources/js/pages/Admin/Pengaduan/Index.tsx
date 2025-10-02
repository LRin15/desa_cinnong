// resources/js/Pages/Admin/Pengaduan/Index.tsx

import Pagination from '@/components/Pagination';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Eye, Filter, Mail, MessageSquare, Phone, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Pengaduan {
    id: number;
    nama: string;
    email: string;
    telepon: string;
    judul: string;
    isi_pengaduan: string;
    status: 'belum_diproses' | 'sedang_diproses' | 'selesai';
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PengaduanIndexProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    pengaduan: {
        data: Pengaduan[];
        links?: PaginationLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function PengaduanIndex({ auth, pengaduan, filters, flash }: PengaduanIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmData, setConfirmData] = useState<{ item: Pengaduan; newStatus: string } | null>(null);
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
    }, [searchTerm, selectedStatus]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchTerm) {
            params.set('search', searchTerm);
        }

        if (selectedStatus) {
            params.set('status', selectedStatus);
        }

        const queryString = params.toString();
        const url = queryString ? route('admin.pengaduan.index') + `?${queryString}` : route('admin.pengaduan.index');

        router.get(
            url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedStatus('');
        router.get(
            route('admin.pengaduan.index'),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStatusChange = (item: Pengaduan, newStatus: string) => {
        setConfirmData({ item, newStatus });
        setShowConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (!confirmData) return;

        router.put(
            route('admin.pengaduan.update-status', confirmData.item.id),
            {
                status: confirmData.newStatus,
                search: searchTerm,
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

    const cancelStatusChange = () => {
        setShowConfirmModal(false);
        setConfirmData(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'belum_diproses':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Belum Diproses
                    </span>
                );
            case 'sedang_diproses':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
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
        }
    };

    // Card component for mobile view
    const PengaduanCard = ({ item }: { item: Pengaduan }) => (
        <div className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">{item.judul}</h3>
                    <p className="mb-1 text-xs text-gray-600 sm:text-sm">{item.nama}</p>
                    <p className="mb-2 text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <div>{getStatusBadge(item.status)}</div>
            </div>
            <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center">
                    <Mail className="mr-1 h-3 w-3" />
                    {item.email}
                </span>
                <span className="inline-flex items-center">
                    <Phone className="mr-1 h-3 w-3" />
                    {item.telepon}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedPengaduan(item)}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-200"
                >
                    <Eye className="mr-1 h-3 w-3" />
                    Detail
                </button>
                {item.status !== 'selesai' && (
                    <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item, e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
                    >
                        <option value="belum_diproses">Belum Diproses</option>
                        <option value="sedang_diproses">Sedang Diproses</option>
                        <option value="selesai">Selesai</option>
                    </select>
                )}
            </div>
        </div>
    );

    const pengaduanArray = pengaduan?.data || [];

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Pengaduan">
            <Head title="Kelola Pengaduan" />

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
                        <h2 className="text-xl font-semibold text-gray-700 sm:text-2xl">Kelola Pengaduan</h2>
                        {pengaduan.total && (
                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                {pengaduan.from && pengaduan.to ? (
                                    <>
                                        Menampilkan {pengaduan.from} - {pengaduan.to} dari {pengaduan.total} pengaduan
                                        {(searchTerm || selectedStatus) && ' (difilter)'}
                                    </>
                                ) : (
                                    <>Total {pengaduan.total} pengaduan</>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Belum Diproses</p>
                                <p className="mt-1 text-2xl font-bold text-red-600">
                                    {pengaduanArray.filter((p) => p.status === 'belum_diproses').length}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Sedang Diproses</p>
                                <p className="mt-1 text-2xl font-bold text-yellow-600">
                                    {pengaduanArray.filter((p) => p.status === 'sedang_diproses').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Selesai</p>
                                <p className="mt-1 text-2xl font-bold text-green-600">
                                    {pengaduanArray.filter((p) => p.status === 'selesai').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="rounded-lg border bg-white p-3 shadow-sm sm:p-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama, email, atau judul..."
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

                    {/* Expandable Filters */}
                    {(showFilters || selectedStatus) && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                            <div className="flex flex-col gap-3 sm:flex-row">
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
                                        <option value="belum_diproses">Belum Diproses</option>
                                        <option value="sedang_diproses">Sedang Diproses</option>
                                        <option value="selesai">Selesai</option>
                                    </select>
                                </div>

                                {(searchTerm || selectedStatus) && (
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
                    {pengaduanArray.length === 0 ? (
                        <div className="rounded-lg border bg-white shadow-sm">
                            <div className="py-12 text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-base font-medium text-gray-900 sm:text-lg">
                                    {searchTerm || selectedStatus ? 'Tidak ada pengaduan yang sesuai dengan pencarian' : 'Tidak ada pengaduan'}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                    {searchTerm || selectedStatus
                                        ? 'Coba ubah kata kunci pencarian atau filter status.'
                                        : 'Belum ada pengaduan dari masyarakat.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="block space-y-3 sm:space-y-4 lg:hidden">
                                {pengaduanArray.map((item) => (
                                    <PengaduanCard key={item.id} item={item} />
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
                                                    Nama
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                    Judul
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
                                            {pengaduanArray.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="font-medium">{item.nama}</div>
                                                        <div className="text-gray-500">{item.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="max-w-xs truncate">{item.judul}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{getStatusBadge(item.status)}</td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setSelectedPengaduan(item)}
                                                                className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                                                            >
                                                                <Eye className="mr-1 h-3 w-3" />
                                                                Detail
                                                            </button>
                                                            {item.status !== 'selesai' && (
                                                                <select
                                                                    value={item.status}
                                                                    onChange={(e) => handleStatusChange(item, e.target.value)}
                                                                    className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
                                                                >
                                                                    <option value="belum_diproses">Belum Diproses</option>
                                                                    <option value="sedang_diproses">Sedang Diproses</option>
                                                                    <option value="selesai">Selesai</option>
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
                {pengaduan.links && pengaduan.links.length > 0 && pengaduanArray.length > 0 && (
                    <div className="mt-6">
                        <Pagination links={pengaduan.links} />
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
                            <p className="text-sm text-gray-700 sm:text-base">Apakah Anda yakin ingin mengubah status pengaduan ini?</p>

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
                                    <span className="text-xs font-medium text-gray-700">Pengadu:</span>
                                    <p className="mt-0.5 text-sm font-semibold text-gray-900">{confirmData.item.nama}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-700">Judul:</span>
                                    <p className="mt-0.5 text-sm text-gray-900">{confirmData.item.judul}</p>
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

            {/* Detail Modal */}
            {selectedPengaduan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
                            <h2 className="text-xl font-bold text-gray-900">Detail Pengaduan</h2>
                            <button onClick={() => setSelectedPengaduan(null)} className="rounded-full p-1 hover:bg-gray-100">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4 p-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <div className="mt-1">{getStatusBadge(selectedPengaduan.status)}</div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedPengaduan.nama}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tanggal</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(selectedPengaduan.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <a
                                        href={`mailto:${selectedPengaduan.email}`}
                                        className="mt-1 flex items-center text-sm text-blue-600 hover:underline"
                                    >
                                        <Mail className="mr-1 h-4 w-4" />
                                        {selectedPengaduan.email}
                                    </a>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">No. Telepon</label>
                                    <a
                                        href={`tel:${selectedPengaduan.telepon}`}
                                        className="mt-1 flex items-center text-sm text-blue-600 hover:underline"
                                    >
                                        <Phone className="mr-1 h-4 w-4" />
                                        {selectedPengaduan.telepon}
                                    </a>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Judul Pengaduan</label>
                                <p className="mt-1 text-sm font-semibold text-gray-900">{selectedPengaduan.judul}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Isi Pengaduan</label>
                                <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-4">
                                    <p className="text-sm whitespace-pre-wrap text-gray-900">{selectedPengaduan.isi_pengaduan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
