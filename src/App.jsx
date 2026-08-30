import { useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import NameClippings from './components/NameClippings';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import JournalPage from './pages/JournalPage';
import LibraryPage from './pages/LibraryPage';

const DOWNLOAD_URL = 'https://github.com/hannahbotting/cv/releases/latest/download/hannah-botting-cv.pdf';

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
          <NavLink to="/projects" className={linkClass}>
            <span className="nav-underline">Projects</span>
          </NavLink>
          {/* Temporarily hidden
          <NavLink to="/journal" className={linkClass}>
            <span className="nav-underline">Journal</span>
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            <span className="nav-underline">Library</span>
          </NavLink>
          */}
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
        className={`fixed inset-y-0 right-0 z-[120] flex w-64 transform flex-col gap-2 border-l border-brand/15 bg-paper p-6 pt-24 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur transition-transform duration-300 sm:hidden ${
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
        <NavLink to="/projects" className={linkClass} onClick={closeMenu}>
          <span className="nav-underline">Projects</span>
        </NavLink>
        {/* Temporarily hidden
        <NavLink to="/journal" className={linkClass} onClick={closeMenu}>
          <span className="nav-underline">Journal</span>
        </NavLink>
        <NavLink to="/library" className={linkClass} onClick={closeMenu}>
          <span className="nav-underline">Library</span>
        </NavLink>
        */}
      </nav>

      {children}

      <a
        href={DOWNLOAD_URL}
        download
        className="fixed right-6 bottom-6 z-[130] rounded-full border border-brand/15 bg-paper px-5 py-2.5 text-brand shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        Download CV
      </a>
    </main>
  );
}

export default function App() {
  return (
    <SiteShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  );
}
