// resources/js/Pages/Admin/LayananSettings/Index.tsx
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Settings, ToggleLeft, ToggleRight, XCircle } from 'lucide-react';
import { useState } from 'react';

interface LayananSetting {
    id: number;
    key: string;
    name: string;
    is_active: boolean;
    category: 'kependudukan' | 'umum';
}

interface LayananSettingsIndexProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    layananSettings: {
        kependudukan?: LayananSetting[];
        umum?: LayananSetting[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function LayananSettingsIndex({ auth, layananSettings, flash }: LayananSettingsIndexProps) {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | null>(null);

    const handleToggle = (key: string, currentStatus: boolean) => {
        router.post(
            route('admin.layanan-settings.toggle'),
            {
                key: key,
                is_active: !currentStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSelectAll = (category: 'kependudukan' | 'umum', checked: boolean) => {
        const categoryKeys = layananSettings[category]?.map((l) => l.key) || [];

        if (checked) {
            setSelectedKeys([...new Set([...selectedKeys, ...categoryKeys])]);
        } else {
            setSelectedKeys(selectedKeys.filter((k) => !categoryKeys.includes(k)));
        }
    };

    const handleSelect = (key: string, checked: boolean) => {
        if (checked) {
            setSelectedKeys([...selectedKeys, key]);
        } else {
            setSelectedKeys(selectedKeys.filter((k) => k !== key));
        }
    };

    const handleBulkAction = (action: 'activate' | 'deactivate') => {
        if (selectedKeys.length === 0) {
            alert('Pilih layanan terlebih dahulu');
            return;
        }
        setBulkAction(action);
        setShowConfirmModal(true);
    };

    const confirmBulkAction = () => {
        if (!bulkAction) return;

        router.post(
            route('admin.layanan-settings.toggle-bulk'),
            {
                keys: selectedKeys,
                is_active: bulkAction === 'activate',
            },
            {
                preserveState: false,
                preserveScroll: false,
                onSuccess: () => {
                    setSelectedKeys([]);
                    setShowConfirmModal(false);
                    setBulkAction(null);
                },
            },
        );
    };

    const renderLayananCard = (layanan: LayananSetting) => (
        <div key={layanan.key} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    checked={selectedKeys.includes(layanan.key)}
                    onChange={(e) => handleSelect(layanan.key, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <div>
                    <h3 className="font-medium text-gray-900">{layanan.name}</h3>
                    <p className="text-xs text-gray-500">{layanan.key}</p>
                </div>
            </div>

            <button
                onClick={() => handleToggle(layanan.key, layanan.is_active)}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    layanan.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                {layanan.is_active ? (
                    <>
                        <ToggleRight className="h-5 w-5" />
                        <span>Aktif</span>
                    </>
                ) : (
                    <>
                        <ToggleLeft className="h-5 w-5" />
                        <span>Nonaktif</span>
                    </>
                )}
            </button>
        </div>
    );

    const kependudukanLayanan = layananSettings.kependudukan || [];
    const umumLayanan = layananSettings.umum || [];
    const totalActive = [...kependudukanLayanan, ...umumLayanan].filter((l) => l.is_active).length;
    const totalInactive = [...kependudukanLayanan, ...umumLayanan].filter((l) => !l.is_active).length;

    return (
        <AuthenticatedLayout auth={auth} title="Kelola Layanan">
            <Head title="Kelola Layanan" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-4">
                        <p className="text-sm text-green-700">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-700">{flash.error}</p>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">Kelola Layanan</h2>
                        <p className="mt-1 text-sm text-gray-500">Aktifkan atau nonaktifkan layanan yang tersedia di website</p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Layanan</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{kependudukanLayanan.length + umumLayanan.length}</p>
                            </div>
                            <Settings className="h-8 w-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Layanan Aktif</p>
                                <p className="mt-1 text-2xl font-bold text-green-600">{totalActive}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Layanan Nonaktif</p>
                                <p className="mt-1 text-2xl font-bold text-red-600">{totalInactive}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedKeys.length > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-orange-800">{selectedKeys.length} layanan dipilih</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleBulkAction('activate')}
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    Aktifkan Semua
                                </button>
                                <button
                                    onClick={() => handleBulkAction('deactivate')}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                >
                                    Nonaktifkan Semua
                                </button>
                                <button
                                    onClick={() => setSelectedKeys([])}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Layanan Kependudukan */}
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Layanan Administrasi Kependudukan</h3>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={kependudukanLayanan.every((l) => selectedKeys.includes(l.key))}
                                    onChange={(e) => handleSelectAll('kependudukan', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-600">Pilih Semua</span>
                            </label>
                        </div>
                    </div>
                    <div className="space-y-2 p-4">{kependudukanLayanan.map((layanan) => renderLayananCard(layanan))}</div>
                </div>

                {/* Layanan Umum */}
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Layanan Administrasi Umum</h3>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={umumLayanan.every((l) => selectedKeys.includes(l.key))}
                                    onChange={(e) => handleSelectAll('umum', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-600">Pilih Semua</span>
                            </label>
                        </div>
                    </div>
                    <div className="space-y-2 p-4">{umumLayanan.map((layanan) => renderLayananCard(layanan))}</div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="border-b p-6">
                            <h3 className="text-xl font-semibold text-gray-900">Konfirmasi Aksi Massal</h3>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700">
                                Apakah Anda yakin ingin <strong>{bulkAction === 'activate' ? 'mengaktifkan' : 'menonaktifkan'}</strong>{' '}
                                <strong>{selectedKeys.length}</strong> layanan yang dipilih?
                            </p>
                        </div>

                        <div className="flex gap-3 border-t bg-gray-50 p-6">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setBulkAction(null);
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmBulkAction}
                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                                    bulkAction === 'activate' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                Ya, {bulkAction === 'activate' ? 'Aktifkan' : 'Nonaktifkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
