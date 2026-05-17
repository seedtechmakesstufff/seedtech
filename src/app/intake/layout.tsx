export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Override the global dark scrollbar inside intake routes so the inner
          overflow-y-auto containers show a light scrollbar that matches the
          light theme. */}
      <style>{`
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
