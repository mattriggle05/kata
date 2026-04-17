export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100%",
    }}>
      <div style={{
        outline: "1px solid var(--border)",
        backgroundColor: "var(--social-bg)",
        borderRadius: "var(--border-r)",
        padding: "2rem",
        width: "600px",
      }}>
        {children}
      </div>
    </div>
  );
}