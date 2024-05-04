import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import RegisterPage from './Register/RegisterPage';
import LoginPage from './Login/LoginPage';
import TasksPage from './TasksPage/TasksPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/home" component={Homepage} />
        <Route path="/tasks" component={TasksPage} />
      </Switch>
    </Router>
  );
}

export default App;
