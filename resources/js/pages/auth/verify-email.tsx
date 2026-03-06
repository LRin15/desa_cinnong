// resources/js/Pages/Auth/VerifyEmail.tsx
import MainLayout from '@/layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, LoaderCircle, Mail, MapPin } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <MainLayout>
            <Head title="Verifikasi Email - Sistem Informasi Desa Cinnong" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
                <div className="w-full max-w-sm space-y-6 sm:max-w-md sm:space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center sm:mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg sm:h-20 sm:w-20">
                                <MapPin className="h-8 w-8 text-white drop-shadow-sm sm:h-10 sm:w-10" />
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">Verifikasi Email</h2>
                        <p className="text-sm font-medium text-gray-600 sm:text-base">Sistem Informasi Desa Cinnong</p>
                        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 sm:w-16"></div>
                    </div>

                    {/* Success Message */}
                    {status === 'verification-link-sent' && (
                        <div className="rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-3 shadow-sm sm:p-4">
                            <div className="flex items-start gap-2 sm:items-center">
                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 sm:mt-0" />
                                <p className="text-sm leading-relaxed font-medium text-emerald-700">
                                    Link verifikasi baru telah dikirim ke alamat email yang Anda daftarkan.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Content Card */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                                <Mail className="h-8 w-8 text-orange-600" />
                            </div>
                        </div>

                        <div className="mb-6 text-center">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">Verifikasi Alamat Email Anda</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Terima kasih telah mendaftar! Sebelum memulai, mohon verifikasi alamat email Anda dengan mengklik link yang baru saja
                                kami kirimkan ke email Anda.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex min-h-[48px] w-full transform items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:from-orange-600 disabled:hover:to-orange-700 disabled:hover:shadow-lg sm:text-lg"
                            >
                                {processing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                                {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                            </button>

                            <div className="text-center">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm font-medium text-gray-600 transition-colors hover:text-orange-600 hover:underline"
                                >
                                    Keluar
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Info Box */}
                    <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="text-sm leading-relaxed text-blue-800">
                                <p className="font-medium">Tidak menerima email?</p>
                                <p className="mt-1 text-blue-700">
                                    Periksa folder spam atau klik tombol di atas untuk mengirim ulang email verifikasi.
                                </p>
                            </div>
                        </div>
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
                            <p className="text-sm font-medium text-gray-700">Mengirim email verifikasi...</p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
