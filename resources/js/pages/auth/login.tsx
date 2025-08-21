// resources/js/Pages/Auth/Login.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail, MapPin } from 'lucide-react';
import { FormEventHandler } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword = false }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <MainLayout>
            <Head title="Masuk - Sistem Informasi Desa Cinnong" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mb-6 flex items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg">
                                <MapPin className="h-10 w-10 text-white drop-shadow-sm" />
                            </div>
                        </div>
                        <h2 className="mb-2 text-3xl font-bold text-gray-900">Masuk ke Sistem</h2>
                        <p className="font-medium text-gray-600">Sistem Informasi Desa Cinnong</p>
                        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-600">✅</span>
                                <p className="text-sm font-medium text-emerald-700">{status}</p>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-xl">
                        <form className="space-y-6" onSubmit={submit} noValidate>
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukkan alamat email Anda"
                                        className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 transition duration-150 ease-in-out invalid:border-red-300 invalid:text-red-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none invalid:focus:border-red-500 invalid:focus:ring-red-500"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                                        <span className="text-red-500">⚠</span>
                                        {errors.email.includes('required')
                                            ? 'Email wajib diisi'
                                            : errors.email.includes('email')
                                              ? 'Format email tidak valid'
                                              : errors.email.includes('exists')
                                                ? 'Email tidak terdaftar dalam sistem'
                                                : errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Kata Sandi
                                    </label>
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan kata sandi Anda"
                                        minLength={6}
                                        className="block w-full rounded-lg border border-gray-300 py-3 pr-3 pl-10 transition duration-150 ease-in-out invalid:border-red-300 invalid:text-red-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none invalid:focus:border-red-500 invalid:focus:ring-red-500"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                                        <span className="text-red-500">⚠</span>
                                        {errors.password.includes('required')
                                            ? 'Kata sandi wajib diisi'
                                            : errors.password.includes('min')
                                              ? 'Kata sandi minimal 6 karakter'
                                              : errors.password.includes('incorrect') || errors.password.includes('invalid')
                                                ? 'Email atau kata sandi tidak sesuai'
                                                : errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Ingat saya
                                </label>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full transform items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-orange-600 disabled:hover:to-orange-700 disabled:hover:shadow-lg"
                            >
                                {processing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                                {processing ? 'Sedang Memproses...' : 'Masuk ke Sistem'}
                            </button>
                        </form>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                        <Link
                            href={route('beranda')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-all duration-150 ease-in-out hover:gap-3 hover:text-orange-600"
                        >
                            <span>←</span>
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
