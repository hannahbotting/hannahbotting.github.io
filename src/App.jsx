import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import NameClippings from './components/NameClippings';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';

function SiteShell({ children }) {
  return (
    <main className="min-h-screen p-8">
      <header className="mx-auto mb-8 flex max-w-[1120px] items-center justify-between gap-4">
        <NameClippings />
        <nav className="flex gap-3" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `no-underline px-4 pt-2 pb-0.5 text-lg transition-transform duration-150 hover:scale-110 ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-underline">Home</span>
          </NavLink>
          <NavLink
            to="/test"
            className={({ isActive }) =>
              `no-underline px-4 pt-2 pb-0.5 text-lg transition-transform duration-150 hover:scale-110 ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-underline">Test</span>
          </NavLink>
        </nav>
      </header>
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
