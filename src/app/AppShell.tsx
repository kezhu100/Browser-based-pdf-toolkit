import { Link, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <h1>Browser-based PDF Toolkit</h1>
          <p>Private, browser-only PDF conversion for Markdown, TXT, HTML, and Images.</p>
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/tools">Tools</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
