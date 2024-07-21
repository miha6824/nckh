import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './User/Homepage/Homepage';
import RegisterPage from './Register/RegisterPage';
import LoginPage from './Login/LoginPage';
import UserWorkSchedule from './User/UserWorkSchedule/UserWorkSchedule'
import AttendancePage from './User/attendance/AttendancePage';
import ProfilePage from './User/Profile/ProfilePage';
import UploadPhotoPage from './User/UploadPhotoPage/UploadPhotoPage';
import CRUD_User from './Admin/crud_user/CRUD_User';
import UserCreate from './Admin/crud_user/UserCreate';
import UserUpdate from './Admin/crud_user/UserUpdate';
import FormReportComponent from './Admin/FormReport/FormReportComponent';
import CRUD_ImgUser from './Admin/crud_image_user/CRUD_ImgUser';
import AddImageToUser from './Admin/crud_image_user/AddImageToUser';
import CRUD_Account from './Admin/crud_account/CRUD_Account';
import CreateAccount from './Admin/crud_account/CreateAccount';
import UpdateAccount from './Admin/crud_account/UpdateAccount';
import CRUD_Department from './Admin/crud_department/CRUD_Department';
import CRUD_Attendance from './Admin/crud_attendance/CRUD_Attendance';
import AddAttendance from './Admin/crud_attendance/AddAttendance';
import AttendanceSettings from './Admin/crud_attendance/AttendanceSettings';
import AssignPosition from './Admin/AssignPosition/AssignPosition';
import CRUD_PositionDetails from './Admin/AssignPosition/CRUD_PositionDetails';
import PositionDetailUpdate from './Admin/AssignPosition/UpdatePositionDetail';
import Crud_Position from './Admin/AssignPosition/Position/CRUD_Position';
import WorkSchedule from './Admin/WorkSchedule/WorkSchedule';

import GetFeatureAndAttendanceSimulator from './GetFeatureAndAttendanceSimulator/GetFeatureAndAttendanceSimulator';
import TrainAndTest from './TrainAndTest/TrainAndTest';

import AdminLayout from './Layout/AdminLayout';
import UserLayout from './Layout/UserLayout';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/TrainAndTest" element={<TrainAndTest />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<AttendancePage />} />
        <Route path="/home" element={<UserLayout><Homepage /></UserLayout>} />
        <Route path="/UserWorkSchedule" element={<UserLayout><UserWorkSchedule /></UserLayout>} />
        <Route path="/profile" element={<UserLayout><ProfilePage /></UserLayout>} />
        <Route path="/UploadPhotoPage" element={<UserLayout><UploadPhotoPage /></UserLayout>} />

        <Route path="/CRUD_User" element={<AdminLayout><CRUD_User /></AdminLayout>} />
        <Route path="/create_User" element={<AdminLayout><UserCreate /></AdminLayout>} />
        <Route path="/update_user/:id" element={<AdminLayout><UserUpdate /></AdminLayout>} />
        <Route path="/CRUD_ImgUser" element={<AdminLayout><CRUD_ImgUser /></AdminLayout>} />
        <Route path="/ImgUserAdd/:id" element={<AdminLayout><AddImageToUser /></AdminLayout>} />
        <Route path="/CRUD_Account" element={<AdminLayout><CRUD_Account /></AdminLayout>} />
        <Route path="/create_Account" element={<AdminLayout><CreateAccount /></AdminLayout>} />
        <Route path="/update_Account/:id" element={<AdminLayout><UpdateAccount /></AdminLayout>} />
        <Route path="/CRUD_Department" element={<AdminLayout><CRUD_Department /></AdminLayout>} />
        <Route path="/CRUD_Attendance" element={<AdminLayout><CRUD_Attendance /></AdminLayout>} />
        <Route path="/AddAttendance" element={<AdminLayout><AddAttendance /></AdminLayout>} />
        <Route path="/AttendanceSettings" element={<AdminLayout><AttendanceSettings /></AdminLayout>} />
        <Route path="/WorkSchedule" element={<AdminLayout><WorkSchedule /></AdminLayout>} />
        <Route path="/FormReportComponent" element={<AdminLayout><FormReportComponent /></AdminLayout>} />
        <Route path="/CreatePosition" element={<AdminLayout><AssignPosition /></AdminLayout>} />
        <Route path="/CRUD_PositionDetails" element={<AdminLayout><CRUD_PositionDetails /></AdminLayout>} />
        <Route path="/PositionUpdate/:id" element={<AdminLayout><PositionDetailUpdate /></AdminLayout>} />
        <Route path="/Crud_Position" element={<AdminLayout><Crud_Position /></AdminLayout>} />
        <Route path="/GetFeatureAndAttendanceSimulator" element={<AdminLayout><GetFeatureAndAttendanceSimulator /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
