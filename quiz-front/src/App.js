import './App.css';
import WebSock from './WebSock';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './screens/home-page/home-page';
import AdminPage from './screens/admin/admin-page';
import AdminDashboardPage from './screens/admin-dashboard/admin-dashboard'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="admin-dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </Router>
  );
};

export default App;
