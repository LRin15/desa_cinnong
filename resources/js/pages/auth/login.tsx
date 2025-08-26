// resources/js/Pages/Auth/Login.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Lock, Mail, MapPin } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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
    const [showPassword, setShowPassword] = useState(false);
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <MainLayout>
            <Head title="Masuk - Sistem Informasi Desa Cinnong" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
                <div className="w-full max-w-sm space-y-6 sm:max-w-md sm:space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center sm:mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg sm:h-20 sm:w-20">
                                <MapPin className="h-8 w-8 text-white drop-shadow-sm sm:h-10 sm:w-10" />
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">Masuk ke Sistem</h2>
                        <p className="text-sm font-medium text-gray-600 sm:text-base">Sistem Informasi Desa Cinnong</p>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 sm:w-16"></div>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-3 shadow-sm sm:p-4">
                            <div className="flex items-start gap-2 sm:items-center">
                                <span className="mt-0.5 flex-shrink-0 text-emerald-600 sm:mt-0">✅</span>
                                <p className="text-sm leading-relaxed font-medium text-emerald-700">{status}</p>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
                        <form className="space-y-5 sm:space-y-6" onSubmit={submit} noValidate>
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
                                        inputMode="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contoh@email.com"
                                        className={`block w-full rounded-lg border py-3 pr-3 pl-10 text-base transition duration-150 ease-in-out focus:ring-2 focus:outline-none ${
                                            errors.email
                                                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/50'
                                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/50'
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-red-600">
                                        <span className="mt-0.5 flex-shrink-0 text-red-500">⚠</span>
                                        <span>
                                            {errors.email.includes('required')
                                                ? 'Email wajib diisi'
                                                : errors.email.includes('email')
                                                  ? 'Format email tidak valid'
                                                  : errors.email.includes('exists')
                                                    ? 'Email tidak terdaftar dalam sistem'
                                                    : errors.email}
                                        </span>
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
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan kata sandi"
                                        minLength={6}
                                        className={`block w-full rounded-lg border py-3 pr-12 pl-10 text-base transition duration-150 ease-in-out focus:ring-2 focus:outline-none ${
                                            errors.password
                                                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/50'
                                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/50'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-red-600">
                                        <span className="mt-0.5 flex-shrink-0 text-red-500">⚠</span>
                                        <span>
                                            {errors.password.includes('required')
                                                ? 'Kata sandi wajib diisi'
                                                : errors.password.includes('min')
                                                  ? 'Kata sandi minimal 6 karakter'
                                                  : errors.password.includes('incorrect') || errors.password.includes('invalid')
                                                    ? 'Email atau kata sandi tidak sesuai'
                                                    : errors.password}
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-2 focus:ring-orange-500 sm:h-5 sm:w-5"
                                    />
                                    <label htmlFor="remember" className="ml-2 block cursor-pointer text-sm text-gray-700 select-none sm:ml-3">
                                        Ingat saya
                                    </label>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex min-h-[48px] w-full transform items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:from-orange-600 disabled:hover:to-orange-700 disabled:hover:shadow-lg sm:min-h-[52px] sm:text-lg"
                            >
                                {processing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                                {processing ? 'Memproses...' : 'Masuk ke Sistem'}
                            </button>
                        </form>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                        <Link
                            href={route('beranda')}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 ease-in-out hover:gap-3 hover:bg-white/50 hover:text-orange-600"
                        >
                            <span className="text-lg">←</span>
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {processing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex flex-col items-center space-y-3">
                            <LoaderCircle className="h-8 w-8 animate-spin text-orange-600" />
                            <p className="text-sm font-medium text-gray-700">Sedang memverifikasi...</p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
