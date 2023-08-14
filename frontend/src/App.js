import { Route, Navigate, Routes } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Employees from './pages/Employees';
import Treatments from './pages/Treatments';
import Appointments from './pages/Appointments';
import { storageService } from './services/storage.service';
import AddAppointment from './pages/AddAppointment';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)
  const BASE_URL = '//localhost:3001/api' // Define base url for sending requests to backend in app

  useEffect(() => {
    const user = storageService.load('loggedInUser')
    if (user) setLoggedInUser(user)
  }, [])
  
  return (
    <section className="app-container">
      {loggedInUser && <Header setLoggedInUser={setLoggedInUser} loggedInUser={loggedInUser}/>}
      <main className='main-container'>
        <Routes>
          <Route path="/login"
            element={loggedInUser ? <Navigate to="/" replace /> : <LoginSignup setLoggedInUser={setLoggedInUser} BASE_URL={BASE_URL} />}>
          </Route>
          <Route path="/resetPassword"
            element={loggedInUser ? <Navigate to="/" replace /> : <ResetPassword BASE_URL={BASE_URL} />}>
          </Route>
          <Route path="/employees"
            element={loggedInUser ? <Employees BASE_URL={BASE_URL} /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/treatments"
            element={loggedInUser ? <Treatments BASE_URL={BASE_URL} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/appointments"
            element={loggedInUser ? <Appointments BASE_URL={BASE_URL} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/addAppointment"
            element={loggedInUser ? <AddAppointment loggedInUser={loggedInUser} BASE_URL={BASE_URL} /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/profile"
            element={loggedInUser ? <Profile BASE_URL={BASE_URL} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}>
          </Route>
          <Route path='/'
            element={loggedInUser ? <Home BASE_URL={BASE_URL}  loggedInUser={loggedInUser} /> : <Navigate to="/login" />}>
          </Route>
        </Routes>
      </main>
      {loggedInUser && <Footer />}
    </section>

  )
}

export default App;
