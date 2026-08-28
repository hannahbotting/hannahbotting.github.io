import { useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import NameClippings from './components/NameClippings';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';

const linkClass = ({ isActive }) =>
  `no-underline px-4 pt-2 pb-0.5 text-lg transition-transform duration-150 hover:scale-110 ${isActive ? 'active' : ''}`;

function SiteShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="min-h-screen p-8">
      <header className="mx-auto mb-8 flex max-w-280 items-center justify-between gap-4">
        <NameClippings />

        <nav className="hidden gap-3 sm:flex" aria-label="Primary">
          <NavLink to="/" end className={linkClass}>
            <span className="nav-underline">Home</span>
          </NavLink>
          <NavLink to="/test" className={linkClass}>
            <span className="nav-underline">Test</span>
          </NavLink>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-brand transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 sm:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="flex flex-col gap-1.5 transition-transform duration-150 [font-size:unset] motion-safe:transition-[transform,opacity]">
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </span>
        </button>
      </header>

      {/* Popout drawer */}
      <nav
        className={`fixed inset-y-0 right-0 z-50 flex w-64 transform flex-col gap-2 border-l border-brand/15 bg-paper p-6 pt-24 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur transition-transform duration-300 sm:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Primary"
      >
        <button
          type="button"
          className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full text-brand transition-transform duration-150 hover:scale-110"
          aria-label="Close navigation"
          onClick={closeMenu}
        >
          <span className="text-4xl leading-none">&times;</span>
        </button>
        <NavLink to="/" end className={linkClass} onClick={closeMenu}>
          <span className="nav-underline">Home</span>
        </NavLink>
        <NavLink to="/test" className={linkClass} onClick={closeMenu}>
          <span className="nav-underline">Test</span>
        </NavLink>
      </nav>

      {children}
    </main>
  );
}

export default function App() {
  return (
    <SiteShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  );
}
