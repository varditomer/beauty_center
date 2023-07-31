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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (<>
    <section className="app-container">
      {isLoggedIn && <Header />}
      <main className='main-container'>
        <Routes>
          <Route path="/login"
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />}>
          </Route>
          <Route path="/employees"
            element={isLoggedIn ? <Employees /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/treatments"
            element={isLoggedIn ? <Treatments /> : <Navigate to="/login" />}>
          </Route>
          <Route path="/appointments"
            element={isLoggedIn ? <Appointments /> : <Navigate to="/login" />}>
          </Route>
          <Route path='/'
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}>
          </Route>
        </Routes>
      </main>
      {isLoggedIn && <Footer />}
    </section>
  </>

  )
}

export default App;
