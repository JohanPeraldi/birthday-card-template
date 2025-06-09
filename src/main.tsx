import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/HomePage';
import CreateCardPage from '@/pages/CreateCardPage';
import BirthdayCard from '@/pages/BirthdayCard';
import '@/index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with layout */}
        <Route
          path="/"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/create"
          element={
            <AppLayout>
              <CreateCardPage />
            </AppLayout>
          }
        />

        {/* Standalone card route (existing system) */}
        <Route path="/card/*" element={<BirthdayCard />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
