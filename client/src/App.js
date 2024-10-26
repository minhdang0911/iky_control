import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Thêm Navigate vào import
import CarList from './components/ui-users/CarList';
import Dashboard from './components/ui-staff/carliststaff';
import NotFound from './components/Pages/notfound';
import Login from './components/Login/Login';
import CreateStore from './components/Admin/Store/ManageStore';
import CreateTechnicianForm from './components/Technical/createTechnical';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPasswordForm from './components/Login/forgotPassword';

function App() {
    return (
        <>
            <Router>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/UI-USERS" element={<CarList />} />
                    <Route path="/UI-STAFF" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/manage-store" element={<CreateStore />} />
                    <Route path="/manage-technical" element={<CreateTechnicianForm />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
