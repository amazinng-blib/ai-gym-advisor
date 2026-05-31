import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
              <Routes>
                {/* Public: accessible to everyone */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute type="public">
                      <Home />
                    </ProtectedRoute>
                  }
                />

                {/* Auth: only for unauthenticated users */}
                <Route
                  path="/auth/:pathname"
                  element={
                    <ProtectedRoute type="auth">
                      <Auth />
                    </ProtectedRoute>
                  }
                />

                {/* Protected: requires authentication */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute type="protected">
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute type="protected">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/:pathname"
                  element={
                    <ProtectedRoute type="protected">
                      <Account />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
