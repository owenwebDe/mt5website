import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const handleLoginSuccess = (account) => {
    setAccountInfo(account);
  };

  const handleLogout = () => {
    setAccountInfo(null);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {!accountInfo ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard
          socket={socket}
          accountInfo={accountInfo}
          onLogout={handleLogout}
          isConnected={isConnected}
        />
      )}
    </div>
  );
}

export default App;
