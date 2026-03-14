"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-dark-base flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-400 text-sm font-medium uppercase tracking-widest mb-4">
            Something went wrong
          </p>
          <h1 className="font-display text-title text-white mb-4">
            Unexpected Error
          </h1>
          <p className="text-body-lg text-white/50 max-w-md mx-auto mb-8">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-seed-600 hover:bg-seed-500 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
