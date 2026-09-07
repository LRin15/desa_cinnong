// resources/js/Pages/auth/forgot-password.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, MapPin } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<{ email: string }>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <MainLayout>
            <Head title="Lupa Kata Sandi - Sistem Informasi Desa Cinnong" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
                <div className="w-full max-w-sm space-y-6 sm:max-w-md sm:space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center sm:mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg sm:h-20 sm:w-20">
                                <MapPin className="h-8 w-8 text-white drop-shadow-sm sm:h-10 sm:w-10" />
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">Lupa Kata Sandi</h2>
                        <p className="text-sm font-medium text-gray-600 sm:text-base">Sistem Informasi Desa Cinnong</p>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 sm:w-16" />
                    </div>

                    {/* Status sukses */}
                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 sm:p-4">
                            <p className="text-sm font-medium text-emerald-700">{status}</p>
                        </div>
                    )}

                    {/* Form */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
                        <p className="mb-5 text-sm text-gray-600">
                            Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                        </p>

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
                                        className={[
                                            'w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm transition-colors focus:ring-2 focus:outline-none',
                                            errors.email
                                                ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-200',
                                        ].join(' ')}
                                    />
                                </div>
                                {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? 'Mengirim...' : 'Kirim Tautan Reset'}
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
        </MainLayout>
    );
}
