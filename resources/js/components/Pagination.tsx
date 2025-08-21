// resources/js/Components/Pagination.tsx

import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    className?: string;
}

export default function Pagination({ links, className = '' }: PaginationProps) {
    // Filter out empty or invalid links
    const validLinks = links.filter((link) => link.label && link.label.trim() !== '');

    if (validLinks.length <= 3) {
        // If there are only prev, current, and next links, don't show pagination
        return null;
    }

    const getPageNumber = (label: string): string => {
        // Handle previous/next buttons
        if (label.includes('Previous') || label.includes('&laquo;')) {
            return '';
        }
        if (label.includes('Next') || label.includes('&raquo;')) {
            return '';
        }

        // Clean up the label to get just the page number
        return label.replace(/&hellip;/g, '...');
    };

    const isPreviousButton = (label: string): boolean => {
        return label.includes('Previous') || label.includes('&laquo;');
    };

    const isNextButton = (label: string): boolean => {
        return label.includes('Next') || label.includes('&raquo;');
    };

    return (
        <nav className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 ${className}`}>
            <div className="flex flex-1 justify-between sm:hidden">
                {/* Mobile pagination - Previous/Next only */}
                {validLinks.find((link) => isPreviousButton(link.label)) && (
                    <Link
                        href={validLinks.find((link) => isPreviousButton(link.label))?.url || '#'}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Sebelumnya
                    </Link>
                )}
                {validLinks.find((link) => isNextButton(link.label)) && (
                    <Link
                        href={validLinks.find((link) => isNextButton(link.label))?.url || '#'}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Selanjutnya
                    </Link>
                )}
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Menampilkan halaman <span className="font-medium">{validLinks.find((link) => link.active)?.label || '1'}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {validLinks.map((link, index) => {
                            const pageNumber = getPageNumber(link.label);
                            const isPrev = isPreviousButton(link.label);
                            const isNext = isNextButton(link.label);

                            if (!link.url && !link.active) {
                                // Disabled link (usually prev/next when not available)
                                return (
                                    <span
                                        key={index}
                                        className="relative inline-flex cursor-default items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-300"
                                    >
                                        {isPrev && <ChevronLeft className="h-5 w-5" />}
                                        {isNext && <ChevronRight className="h-5 w-5" />}
                                        {!isPrev && !isNext && <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                                    </span>
                                );
                            }

                            if (link.active) {
                                // Current page
                                return (
                                    <span
                                        key={index}
                                        className="relative z-10 inline-flex items-center border border-orange-600 bg-orange-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                                    >
                                        {pageNumber}
                                    </span>
                                );
                            }

                            // Regular link
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                >
                                    {isPrev && <ChevronLeft className="h-5 w-5" />}
                                    {isNext && <ChevronRight className="h-5 w-5" />}
                                    {!isPrev && !isNext && <span className="px-2" dangerouslySetInnerHTML={{ __html: link.label }} />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </nav>
    );
}
