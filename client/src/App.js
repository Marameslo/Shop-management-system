import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from './components/Routes/ProtectedRoute'; 
import Laptop from "./components/Laptop/index";
import Signup from "./components/Signup/index";
import Login from "./components/Login/index";
import Orders from "./components/Order/index";
import Profile from "./components/Profile/index";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Laptop />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;