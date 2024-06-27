import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './User/Homepage/Homepage';
import RegisterPage from './Register/RegisterPage';
import LoginPage from './Login/LoginPage';
import TasksPage from './User/TasksPage/TasksPage';
import AttendancePage from './User/attendance/AttendancePage';
import ProfilePage from './User/Profile/ProfilePage';
import UploadPhotoPage from './User/UploadPhotoPage/UploadPhotoPage';
import CRUD_User from './Admin/crud_user/CRUD_User';
import UserCreate from './Admin/crud_user/UserCreate';
import UserUpdate from './Admin/crud_user/UserUpdate';
import FormReportComponent from './Admin/FormReport/FormReportComponent';
import CRUD_ImgUser from './Admin/crud_image_user/CRUD_ImgUser'
import ImgUserCreate from './Admin/crud_image_user/ImgUserCreate'
import AddImageToUser from './Admin/crud_image_user/AddImageToUser';
import CRUD_Account from './Admin/crud_account/CRUD_Account';
import CRUD_Department from './Admin/crud_department/CRUD_Department';
import CRUD_Attendance from './Admin/crud_attendance/CRUD_Attendance';
import AttendanceSettings from './Admin/crud_attendance/AttendanceSettings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/" element={<AttendancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/UploadPhotoPage" element={<UploadPhotoPage />} />
        <Route path="/CRUD_User" element={<CRUD_User />} />
        <Route path="/create_User" element={<UserCreate />} />
        <Route path="/update_user/:id" element={<UserUpdate />} />
        <Route path="/CRUD_ImgUser" element={<CRUD_ImgUser />} />
        <Route path="/create_ImgUser" element={<ImgUserCreate />} />
        <Route path="/ImgUserAdd/:id" element={<AddImageToUser />} />
        <Route path="/CRUD_Account" element={<CRUD_Account />} />
        <Route path="/CRUD_Department" element={<CRUD_Department />} />
        <Route path="/CRUD_Attendance" element={<CRUD_Attendance />} />
        <Route path="/AttendanceSettings" element={<AttendanceSettings />} />
        <Route path="/FormReportComponent" element={<FormReportComponent />} />
      </Routes>
    </Router>

  );
}

export default App;
