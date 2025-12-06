'use client';

import { usePathname } from 'next/navigation';
import { XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

/**
 * Preview Mode Banner
 * Displays a prominent banner when viewing draft/preview content
 * Provides an easy way to exit preview mode
 */
export function PreviewBanner() {
  const pathname = usePathname();

  const handleExitPreview = () => {
    // Redirect to exit-preview API route with current path
    window.location.href = `/api/exit-preview?redirect=${encodeURIComponent(pathname)}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-amber-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
            <EyeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm md:text-base">
              Preview Mode Active
            </p>
            <p className="text-white/90 text-xs md:text-sm">
              You&apos;re viewing unpublished changes. This content is not visible to visitors.
            </p>
          </div>
        </div>

        <button
          onClick={handleExitPreview}
          className="flex items-center gap-2 px-4 py-2 bg-white text-amber-700 font-medium text-sm rounded-lg hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-600"
          aria-label="Exit preview mode"
        >
          <XMarkIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Exit Preview</span>
        </button>
      </div>
    </div>
  );
}
