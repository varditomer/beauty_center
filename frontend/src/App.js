import { Route, Navigate, Routes } from 'react-router-dom';
import Login from './pages/Login';
import { useState } from 'react';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Employees from './pages/Employees';
import Treatments from './pages/Treatments';
import Appointments from './pages/Appointments';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const BASE_URL = '//localhost:3001' // Define base url for sending requests to backend in app
  return (
    <div className="App">
      {isLoggedIn && <Header />}
      <Routes>
        <main className='main-content'>
          <Route path="/login"
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} BASE_URL={BASE_URL} />}>
          </Route>
          <Route path="/employees"
            element={isLoggedIn ? <Employees BASE_URL={BASE_URL} /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/treatments"
            element={isLoggedIn ? <Treatments BASE_URL={BASE_URL} /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/appointments"
            element={isLoggedIn ? <Appointments BASE_URL={BASE_URL} /> : <Navigate to="/login" />}>
          </Route>
          <Route path='/'
            element={isLoggedIn ? <Home BASE_URL={BASE_URL} /> : <Navigate to="/login" />}>
          </Route>
        </main>
      </Routes>
      {isLoggedIn && <Footer />}
    </div>
  )
}

export default App;
