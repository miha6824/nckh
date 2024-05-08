import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './User/Homepage/Homepage';
import RegisterPage from './Register/RegisterPage';
import LoginPage from './Login/LoginPage';
import TasksPage from './User/TasksPage/TasksPage';
import AttendancePage from './User/attendance/AttendancePage';
import ProfilePage from './User/Profile/ProfilePage';
import CRUD_User from './Admin/CRUD_User';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/home" component={Homepage} />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/attendance" component={AttendancePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/CRUD_User" component={CRUD_User} />
      </Switch>
    </Router>
  );
}

export default App;
