import { createContext, use, useEffect, useState } from 'react';

import { UNAUTHORIZED_EVENT, api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    api('/session')
      .then(({ authenticated }) => setStatus(authenticated ? 'signed-in' : 'signed-out'))
      .catch(() => setStatus('signed-out'));

    const signOutLocally = () => setStatus('signed-out');
    window.addEventListener(UNAUTHORIZED_EVENT, signOutLocally);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, signOutLocally);
  }, []);

  async function signIn(password) {
    await api('/session', { method: 'POST', body: { password } });
    setStatus('signed-in');
  }

  async function signOut() {
    await api('/session', { method: 'DELETE' });
    setStatus('signed-out');
  }

  return <AuthContext value={{ status, signIn, signOut }}>{children}</AuthContext>;
}

export function useAuth() {
  return use(AuthContext);
}
