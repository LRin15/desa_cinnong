// resources/js/Pages/auth/reset-password.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, KeyRound, LoaderCircle, Lock, MapPin } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

const inputClass = (hasError?: string) =>
    [
        'w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-colors focus:ring-2 focus:outline-none',
        hasError
            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-200',
    ].join(' ');

const inputPasswordClass = (hasError?: string) =>
    [
        'w-full rounded-lg border py-2.5 pr-10 pl-10 text-sm transition-colors focus:ring-2 focus:outline-none',
        hasError
            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-200',
    ].join(' ');

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <MainLayout>
            <Head title="Atur Ulang Kata Sandi - Sistem Informasi Desa Cinnong" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
                <div className="w-full max-w-sm space-y-6 sm:max-w-md sm:space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center sm:mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg sm:h-20 sm:w-20">
                                <MapPin className="h-8 w-8 text-white drop-shadow-sm sm:h-10 sm:w-10" />
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">Atur Ulang Kata Sandi</h2>
                        <p className="text-sm font-medium text-gray-600 sm:text-base">Sistem Informasi Desa Cinnong</p>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 sm:w-16" />
                    </div>

                    {/* Form */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
                        <form className="space-y-5" onSubmit={submit} noValidate>
                            {/* Email — read only */}
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={data.email}
                                        readOnly
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={inputClass(errors.email) + ' cursor-not-allowed bg-gray-50 text-gray-500'}
                                    />
                                </div>
                                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            {/* Password baru */}
                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Kata Sandi Baru
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoFocus
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukkan kata sandi baru"
                                        className={inputPasswordClass(errors.password)}
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
                                {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                            </div>

                            {/* Konfirmasi password */}
                            <div>
                                <label htmlFor="password_confirmation" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Konfirmasi Kata Sandi
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        id="password_confirmation"
                                        type={showConfirm ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi kata sandi baru"
                                        className={inputPasswordClass(errors.password_confirmation)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        tabIndex={-1}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="mt-1.5 text-xs text-red-600">{errors.password_confirmation}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? 'Memproses...' : 'Atur Ulang Kata Sandi'}
                            </button>
                        </form>
                    </div>

                    {/* Kembali ke login */}
                    <p className="text-center text-sm text-gray-600">
                        Sudah ingat kata sandi?{' '}
                        <Link href={route('login')} className="font-medium text-orange-600 hover:text-orange-700 hover:underline">
                            Masuk ke sistem
                        </Link>
                    </p>
                </div>
            </div>

            {processing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex flex-col items-center gap-3">
                            <LoaderCircle className="h-8 w-8 animate-spin text-orange-600" />
                            <p className="text-sm font-medium text-gray-700">Memproses permintaan...</p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
