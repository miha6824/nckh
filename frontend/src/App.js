import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './User/Homepage/Homepage';
import RegisterPage from './Register/RegisterPage';
import LoginPage from './Login/LoginPage';
import TasksPage from './User/TasksPage/TasksPage';
import AttendancePage from './User/attendance/AttendancePage';
import ProfilePage from './User/Profile/ProfilePage';
import CRUD_User from './Admin/CRUD_User';
import UserCreate from './Admin/UserCreate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/CRUD_User" element={<CRUD_User />} />
        <Route path="/create_User" element={<UserCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
