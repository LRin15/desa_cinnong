// resources/js/components/ui/FieldError.tsx
//
// Komponen pesan error validasi yang seragam di seluruh aplikasi.

import { AlertCircle } from 'lucide-react';

interface FieldErrorProps {
    message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
    if (!message) return null;
    return (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{message}</span>
        </p>
    );
}

// ── Pengguna (rounded-lg, py-2.5) ────────────────────────────────────────────
export const inputBase = (error?: string) =>
    `block w-full rounded-lg border py-2.5 px-3 text-sm transition focus:ring-2 focus:outline-none ${
        error
            ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-400 focus:ring-red-400/30'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/30'
    }`;

export const inputWithIcon = (error?: string) => `${inputBase(error)} pl-10`;
export const inputPassword  = (error?: string) => `${inputBase(error)} pl-10 pr-11`;

// ── Admin (rounded-md, py-2, shadow-sm) — sesuai desain halaman admin ────────
export const inputAdmin = (error?: string) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition focus:ring-1 focus:outline-none ${
        error
            ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500'
    }`;

export const inputAdminLg = (error?: string) =>
    `${inputAdmin(error)} sm:text-base`;