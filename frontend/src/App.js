import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import RegisterPage from './Register/RegisterPage';
import LoginPage from './Login/LoginPage';
import TasksPage from './TasksPage/TasksPage';
import AttendancePage from './attendance/AttendancePage';
import ProfilePage from './Profile/ProfilePage';

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
      </Switch>
    </Router>
  );
}

export default App;
