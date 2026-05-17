export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Lock the document so anchor navigation and autoFocus scrolling can't
          scroll the body and expose the dark site-wide background. The inner
          .intake-shell container becomes the only scroll context. */}
      <style>{`
        html, body { overflow: hidden !important; height: 100% !important; overscroll-behavior: none; }
        .intake-shell ::-webkit-scrollbar { width: 8px; }
        .intake-shell ::-webkit-scrollbar-track { background: transparent; }
        .intake-shell ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .intake-shell ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
      <div
        className="intake-shell"
        style={{
          background: "#f5f5f7",
          color: "#111827",
          position: "fixed",
          inset: 0,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
}
