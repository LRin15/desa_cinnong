// resources/js/Pages/Auth/Login.tsx
import { FieldError, inputPassword, inputWithIcon } from '@/components/ui/FieldError';
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

export default function Login({ status }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
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
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 sm:w-16" />
                    </div>

                    {/* Status */}
                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 sm:p-4">
                            <p className="text-sm font-medium text-emerald-700">{status}</p>
                        </div>
                    )}

                    {/* Form */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
                        <form className="space-y-5" onSubmit={submit} noValidate>
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        autoFocus
                                        autoComplete="email"
                                        inputMode="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contoh@email.com"
                                        className={inputWithIcon(errors.email)}
                                    />
                                </div>
                                <FieldError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan kata sandi"
                                        className={inputPassword(errors.password)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <FieldError message={errors.password} />
                            </div>

                            {/* Remember */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-2 focus:ring-orange-500"
                                />
                                <label htmlFor="remember" className="ml-2 cursor-pointer text-sm text-gray-700 select-none">
                                    Ingat saya
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? 'Memproses...' : 'Masuk ke Sistem'}
                            </button>
                        </form>
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="font-medium text-orange-600 hover:text-orange-700 hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>

            {processing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex flex-col items-center gap-3">
                            <LoaderCircle className="h-8 w-8 animate-spin text-orange-600" />
                            <p className="text-sm font-medium text-gray-700">Sedang memverifikasi...</p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
