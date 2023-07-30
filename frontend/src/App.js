import { Route, Navigate, Routes } from 'react-router-dom';
import Login from './pages/Login';
import { useState } from 'react';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <div className="App">
      {isLoggedIn && <Header />}
      <Routes>
        <Route path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />}>
        </Route>
        <Route path="/appointments"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}>
        </Route>
        <Route path="/treatments"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}>
        </Route>
        <Route path="/appointments"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}>
        </Route>
        <Route path='/'
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}>
        </Route>
      </Routes>
      {isLoggedIn && <Footer />}
    </div>
  )
}

export default App;
