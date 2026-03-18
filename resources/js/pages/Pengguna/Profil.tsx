// resources/js/Pages/Pengguna/Profil.tsx
import { FieldError, inputBase, inputPassword, inputWithIcon } from '@/components/ui/FieldError';
import MainLayout from '@/layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, ChevronRight, Clock, Eye, EyeOff, FileText, LoaderCircle, Lock, Mail, MapPin, User, XCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
    nama_lengkap: string | null;
    jenis_kelamin: 'Laki-laki' | 'Perempuan' | null;
    tanggal_lahir: string | null;
    usia: number | null;
    alamat: string | null;
    rt: string | null;
    rw: string | null;
    no_telepon: string | null;
    pekerjaan: string | null;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    profile: UserProfile | null;
}

interface RiwayatLayanan {
    id: number;
    jenis_layanan: string;
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
    status_label: string;
    catatan_admin: string | null;
    created_at: string;
    updated_at: string;
}

interface ProfilProps {
    auth: { user: UserData };
    status?: string;
    riwayatLayanan: RiwayatLayanan[];
}

type TabId = 'profil' | 'layanan';

// ─── Status configs ───────────────────────────────────────────────────────────

const layananStatusConfig = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    diproses: { label: 'Diproses', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: LoaderCircle },
    selesai: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status, config }: { status: string; config: Record<string, { label: string; color: string; icon: any }> }) {
    const cfg = config[status] ?? { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200', icon: AlertCircle };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
        </span>
    );
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <Icon className="h-7 w-7 text-gray-400" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-700">{title}</p>
            <p className="max-w-xs text-xs leading-relaxed text-gray-400">{description}</p>
        </div>
    );
}

function LayananProgressBar({ status }: { status: string }) {
    const steps = [
        { key: 'pending', label: 'Diterima' },
        { key: 'diproses', label: 'Diproses' },
        { key: 'selesai', label: 'Selesai' },
    ];
    const order = ['pending', 'diproses', 'selesai'];
    const currentIdx = order.indexOf(status === 'ditolak' ? 'pending' : status);

    if (status === 'ditolak') {
        return (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                <p className="text-xs font-medium text-red-600">
                    Permohonan ini ditolak oleh admin. Silakan hubungi kantor desa untuk informasi lebih lanjut.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Progres Permohonan</p>
            <div className="flex items-center">
                {steps.map((step, i) => {
                    const done = i <= currentIdx;
                    const current = i === currentIdx;
                    const last = i === steps.length - 1;
                    return (
                        <div key={step.key} className={`flex items-center ${!last ? 'flex-1' : ''}`}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${done ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300 bg-white text-gray-400'} ${current ? 'ring-2 ring-orange-300 ring-offset-1' : ''}`}
                                >
                                    {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                                </div>
                                <span className={`mt-1 text-center text-xs font-medium ${done ? 'text-orange-600' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                            {!last && <div className={`mb-4 h-0.5 flex-1 transition-colors ${i < currentIdx ? 'bg-orange-400' : 'bg-gray-200'}`} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Label + children + error — sama dengan pola di form lain
function FormGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
            {children}
            <FieldError message={error} />
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Profil({ auth, status, riwayatLayanan }: ProfilProps) {
    const [activeTab, setActiveTab] = useState<TabId>('profil');
    const [expandedLayanan, setExpandedLayanan] = useState<number | null>(null);
    const [showCurrentPwd, setShowCurrentPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    const profile = auth.user.profile;

    const { data, setData, patch, processing, errors, reset } = useForm({
        // Akun
        name: auth.user.name,
        email: auth.user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
        // Profil
        nama_lengkap: profile?.nama_lengkap ?? '',
        jenis_kelamin: profile?.jenis_kelamin ?? '',
        tanggal_lahir: profile?.tanggal_lahir ?? '',
        alamat: profile?.alamat ?? '',
        rt: profile?.rt ?? '',
        rw: profile?.rw ?? '',
        no_telepon: profile?.no_telepon ?? '',
        pekerjaan: profile?.pekerjaan ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('pengguna.profil.update'), {
            onSuccess: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    const tabs: { id: TabId; label: string; icon: any; count?: number }[] = [
        { id: 'profil', label: 'Profil & Keamanan', icon: User },
        { id: 'layanan', label: 'Riwayat Layanan', icon: FileText, count: riwayatLayanan.length },
    ];

    const displayName = profile?.nama_lengkap || auth.user.name;
    const avatarInitial = displayName.charAt(0).toUpperCase();

    const pwdFields = [
        {
            id: 'current_password',
            label: 'Kata Sandi Saat Ini',
            key: 'current_password' as const,
            show: showCurrentPwd,
            toggle: () => setShowCurrentPwd(!showCurrentPwd),
            ph: 'Kata sandi saat ini',
        },
        {
            id: 'password',
            label: 'Kata Sandi Baru',
            key: 'password' as const,
            show: showNewPwd,
            toggle: () => setShowNewPwd(!showNewPwd),
            ph: 'Minimal 8 karakter',
        },
        {
            id: 'password_confirmation',
            label: 'Konfirmasi Kata Sandi Baru',
            key: 'password_confirmation' as const,
            show: showConfirmPwd,
            toggle: () => setShowConfirmPwd(!showConfirmPwd),
            ph: 'Ulangi kata sandi baru',
        },
    ];

    return (
        <MainLayout auth={auth}>
            <Head title="Profil Saya" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                        {/* ════ SIDEBAR ════ */}
                        <aside className="w-full lg:w-64 lg:flex-shrink-0">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                {/* Identitas */}
                                <div className="bg-orange-600 px-5 py-6 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white ring-2 ring-white/30">
                                        {avatarInitial}
                                    </div>
                                    <p className="text-sm leading-tight font-semibold text-white">{displayName}</p>
                                    <p className="mt-1 text-xs break-all text-orange-100">{auth.user.email}</p>
                                </div>

                                {/* Info ringkas */}
                                {(profile?.alamat || profile?.pekerjaan || profile?.no_telepon) && (
                                    <div className="space-y-2 border-b border-gray-100 px-4 py-3">
                                        {profile?.pekerjaan && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <User className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{profile.pekerjaan}</span>
                                            </div>
                                        )}
                                        {profile?.no_telepon && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                                <span className="truncate">{profile.no_telepon}</span>
                                            </div>
                                        )}
                                        {profile?.alamat && (
                                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                                <span className="line-clamp-2">
                                                    {profile.alamat}
                                                    {profile.rt ? `, RT ${profile.rt}` : ''}
                                                    {profile.rw ? `/RW ${profile.rw}` : ''}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Stat */}
                                <div className="border-b border-gray-100 py-3 text-center">
                                    <p className="text-lg font-bold text-orange-600">{riwayatLayanan.length}</p>
                                    <p className="text-xs text-gray-500">Total Permohonan Layanan</p>
                                </div>

                                {/* Tab nav */}
                                <nav className="p-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const active = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                                    active ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-orange-500' : 'text-gray-400'}`} />
                                                <span className="flex-1 text-left">{tab.label}</span>
                                                {tab.count !== undefined && (
                                                    <span
                                                        className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${active ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}
                                                    >
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>

                        {/* ════ KONTEN ════ */}
                        <div className="min-w-0 flex-1">
                            {/* ── TAB PROFIL ── */}
                            {activeTab === 'profil' && (
                                <div className="space-y-5">
                                    {status && (
                                        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                                            <p className="text-sm font-medium text-emerald-700">{status}</p>
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-5">
                                        {/* Informasi Akun */}
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-5 text-base font-semibold text-gray-900">Informasi Akun</h2>
                                            <div className="space-y-4">
                                                <FormGroup label="Nama Tampilan (Akun)" error={errors.name}>
                                                    <div className="relative">
                                                        <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData('name', e.target.value)}
                                                            placeholder="Nama tampilan"
                                                            className={inputWithIcon(errors.name)}
                                                        />
                                                    </div>
                                                </FormGroup>

                                                <FormGroup label="Alamat Email" error={errors.email}>
                                                    <div className="relative">
                                                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            placeholder="contoh@email.com"
                                                            className={inputWithIcon(errors.email)}
                                                        />
                                                    </div>
                                                </FormGroup>
                                            </div>
                                        </div>

                                        {/* Data Diri */}
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-5 text-base font-semibold text-gray-900">Data Diri</h2>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <FormGroup label="Nama Lengkap (sesuai KTP)" error={errors.nama_lengkap}>
                                                    <input
                                                        type="text"
                                                        value={data.nama_lengkap}
                                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                        placeholder="Nama sesuai KTP"
                                                        className={inputBase(errors.nama_lengkap)}
                                                    />
                                                </FormGroup>

                                                <FormGroup label="Jenis Kelamin" error={errors.jenis_kelamin}>
                                                    <select
                                                        value={data.jenis_kelamin}
                                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                                        className={inputBase(errors.jenis_kelamin)}
                                                    >
                                                        <option value="">-- Pilih --</option>
                                                        <option value="Laki-laki">Laki-laki</option>
                                                        <option value="Perempuan">Perempuan</option>
                                                    </select>
                                                </FormGroup>

                                                <FormGroup label="Tanggal Lahir" error={errors.tanggal_lahir}>
                                                    <input
                                                        type="date"
                                                        value={data.tanggal_lahir}
                                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                                        className={inputBase(errors.tanggal_lahir)}
                                                    />
                                                </FormGroup>

                                                <FormGroup label="Pekerjaan" error={errors.pekerjaan}>
                                                    <input
                                                        type="text"
                                                        value={data.pekerjaan}
                                                        onChange={(e) => setData('pekerjaan', e.target.value)}
                                                        placeholder="Petani, Wiraswasta, dll"
                                                        className={inputBase(errors.pekerjaan)}
                                                    />
                                                </FormGroup>

                                                <FormGroup label="No. Telepon" error={errors.no_telepon}>
                                                    <input
                                                        type="tel"
                                                        value={data.no_telepon}
                                                        onChange={(e) => setData('no_telepon', e.target.value)}
                                                        placeholder="08xxxxxxxxxx"
                                                        className={inputBase(errors.no_telepon)}
                                                    />
                                                </FormGroup>

                                                <div className="sm:col-span-2">
                                                    <FormGroup label="Alamat Lengkap" error={errors.alamat}>
                                                        <textarea
                                                            value={data.alamat}
                                                            onChange={(e) => setData('alamat', e.target.value)}
                                                            rows={3}
                                                            placeholder="Jalan, Nomor Rumah, Dusun"
                                                            className={inputBase(errors.alamat)}
                                                        />
                                                    </FormGroup>
                                                </div>

                                                <FormGroup label="RT" error={errors.rt}>
                                                    <input
                                                        type="text"
                                                        value={data.rt}
                                                        onChange={(e) => setData('rt', e.target.value)}
                                                        placeholder="000"
                                                        maxLength={3}
                                                        className={inputBase(errors.rt)}
                                                    />
                                                </FormGroup>

                                                <FormGroup label="RW" error={errors.rw}>
                                                    <input
                                                        type="text"
                                                        value={data.rw}
                                                        onChange={(e) => setData('rw', e.target.value)}
                                                        placeholder="000"
                                                        maxLength={3}
                                                        className={inputBase(errors.rw)}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>

                                        {/* Keamanan */}
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                            <h2 className="mb-1 text-base font-semibold text-gray-900">Keamanan</h2>
                                            <p className="mb-5 text-sm text-gray-400">Kosongkan jika tidak ingin mengubah kata sandi.</p>
                                            <div className="space-y-4">
                                                {pwdFields.map((field) => (
                                                    <FormGroup key={field.id} label={field.label} error={errors[field.key]}>
                                                        <div className="relative">
                                                            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                id={field.id}
                                                                type={field.show ? 'text' : 'password'}
                                                                value={data[field.key]}
                                                                onChange={(e) => setData(field.key, e.target.value)}
                                                                placeholder={field.ph}
                                                                className={inputPassword(errors[field.key])}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={field.toggle}
                                                                tabIndex={-1}
                                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                            >
                                                                {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </FormGroup>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* ── TAB RIWAYAT LAYANAN ── */}
                            {activeTab === 'layanan' && (
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-base font-semibold text-gray-900">Riwayat Pengajuan Layanan</h2>
                                        <p className="text-sm text-gray-500">{riwayatLayanan.length} permohonan tercatat</p>
                                    </div>

                                    {riwayatLayanan.length === 0 ? (
                                        <EmptyState
                                            icon={FileText}
                                            title="Belum ada pengajuan"
                                            description="Anda belum pernah mengajukan permohonan layanan. Kunjungi menu Layanan untuk mulai mengajukan."
                                        />
                                    ) : (
                                        <div className="space-y-3">
                                            {riwayatLayanan.map((item) => {
                                                const isOpen = expandedLayanan === item.id;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                                    >
                                                        <button
                                                            onClick={() => setExpandedLayanan(isOpen ? null : item.id)}
                                                            className="flex w-full items-center gap-4 px-5 py-4 text-left"
                                                        >
                                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50">
                                                                <FileText className="h-5 w-5 text-orange-500" />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-semibold text-gray-900">{item.jenis_layanan}</p>
                                                                <p className="mt-0.5 text-xs text-gray-400">Diajukan {item.created_at}</p>
                                                            </div>
                                                            <div className="flex flex-shrink-0 items-center gap-3">
                                                                <StatusBadge status={item.status} config={layananStatusConfig} />
                                                                <ChevronRight
                                                                    className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                                                                />
                                                            </div>
                                                        </button>

                                                        {isOpen && (
                                                            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                                                                <dl className="space-y-2 text-sm">
                                                                    {[
                                                                        {
                                                                            dt: 'ID Permohonan',
                                                                            dd: `#${String(item.id).padStart(5, '0')}`,
                                                                            mono: true,
                                                                        },
                                                                        { dt: 'Jenis Layanan', dd: item.jenis_layanan },
                                                                        { dt: 'Tanggal Diajukan', dd: item.created_at },
                                                                        { dt: 'Terakhir Diperbarui', dd: item.updated_at },
                                                                    ].map(({ dt, dd, mono }) => (
                                                                        <div key={dt} className="flex justify-between gap-4">
                                                                            <dt className="text-gray-500">{dt}</dt>
                                                                            <dd
                                                                                className={`text-right font-medium text-gray-700 ${mono ? 'font-mono' : ''}`}
                                                                            >
                                                                                {dd}
                                                                            </dd>
                                                                        </div>
                                                                    ))}
                                                                    <div className="flex justify-between gap-4">
                                                                        <dt className="text-gray-500">Status</dt>
                                                                        <dd>
                                                                            <StatusBadge status={item.status} config={layananStatusConfig} />
                                                                        </dd>
                                                                    </div>
                                                                </dl>

                                                                {item.catatan_admin && (
                                                                    <div
                                                                        className={`mt-4 rounded-xl border p-3 text-sm ${item.status === 'ditolak' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}
                                                                    >
                                                                        <p
                                                                            className={`mb-1 text-xs font-semibold tracking-wide uppercase ${item.status === 'ditolak' ? 'text-red-500' : 'text-blue-500'}`}
                                                                        >
                                                                            Catatan dari Admin
                                                                        </p>
                                                                        <p className={item.status === 'ditolak' ? 'text-red-700' : 'text-blue-700'}>
                                                                            {item.catatan_admin}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                <LayananProgressBar status={item.status} />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {processing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex flex-col items-center gap-3">
                            <LoaderCircle className="h-8 w-8 animate-spin text-orange-600" />
                            <p className="text-sm font-medium text-gray-700">Menyimpan perubahan...</p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
