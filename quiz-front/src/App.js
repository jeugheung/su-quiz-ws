import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WebSocketProvider } from './shared/WebSocketContext';
import HomePage from './screens/home-page/home-page';
import AdminPage from './screens/admin/admin-page';
import AdminDashboardPage from './screens/admin-dashboard/admin-dashboard'
import UserGamePage from './screens/user-game-page/user-game-page';

const App = () => {
  return (
    <Router>
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
          <Route path='user-game' element={<UserGamePage />} />
        </Routes>
      </WebSocketProvider>
    </Router>
  );
};

export default App;
