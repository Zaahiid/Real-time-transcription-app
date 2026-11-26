import { Navigate, Route, Routes, useLocation } from 'react-router';

import { useAuth } from './auth/AuthProvider.jsx';
import AppHeader from './components/AppHeader.jsx';
import LogoMark from './components/LogoMark.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TranscribePage from './pages/TranscribePage.jsx';

export default function App() {
  const { status } = useAuth();
  const { pathname } = useLocation();

  if (status === 'checking') return <SplashScreen />;
  if (status === 'signed-out') return <LoginPage />;

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div
          key={pathname}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-4 motion-safe:animate-fade-in sm:px-6 sm:py-10 short:py-4"
        >
          <Routes>
            <Route path="/" element={<TranscribePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="grid min-h-dvh place-content-center justify-items-center gap-4">
      <LogoMark className="size-14 rounded-2xl motion-safe:animate-breathe" />
      <p className="text-sm text-muted">Loading…</p>
    </div>
  );
}
