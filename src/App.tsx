import {useContext, useEffect} from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router';
import MainApp from './MainApp';
import { AuthContext } from './Authenticate';

import Login from './Login';

const App = () => {
  const location = useLocation();
  const auth = useContext(AuthContext);
  
  console.log("user: ", auth);
  
  const mainApp = auth.user && auth.user.addr ? <MainApp /> : <Navigate to={`/login`} />
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={mainApp} />
    </Routes>
  )
}

export default App;