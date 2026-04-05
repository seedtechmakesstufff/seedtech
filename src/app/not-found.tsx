import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-seed-500 text-sm font-medium uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[1.05] text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-body-lg text-white/50 max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-white liquid-glass-tinted-seed rounded-xl transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
