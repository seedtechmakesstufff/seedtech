export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#f5f5f7", height: "100vh", overflow: "hidden", color: "#111827" }}>
      {children}
    </div>
  );
}
