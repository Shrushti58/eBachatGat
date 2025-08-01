import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './output.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from "react";


import {BrowserRouter,Routes,Route} from 'react-router-dom'
import MainDashboard from './components/MainDashboard.jsx'
import MemberLogin from './components/MemberLogin.jsx'
import MemberDashboard from './pages/MemberDashboard.jsx'
import LoanRequest from './pages/LoanRequest.jsx'
import Register from './pages/Register.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import SetCollection from './components/SetCollection.jsx'
import AdminRegister from './components/AdminRegister.jsx'
import ProfileUpdate from './components/ProfileUpdate.jsx'
import SecretaryDashboard from './pages/SecretaryDashboard.jsx'
import TreasurerDashboard from './pages/TreasurerDashboard.jsx'
import AllRecordsT from './components/AllRecordsT.jsx'
import TreasurerProfileT from './components/TreasurerProfileT.jsx'
import SecretaryProfileS from './components/SecretaryProfileS.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PresidentDashboard from './pages/PresidentDashboard.jsx'
import PresidentProfile from './components/PresidentProfile.jsx'
import LoanDetailsP from './components/LoanDetailsP.jsx'
import LearnMorePage from './pages/LearnMorePage.jsx';


export default function Index(){
  return(
    <>
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<MainDashboard/>}></Route>
        <Route path='/member/login' element={<MemberLogin />} />
        <Route path='/member/dashboard' element={<MemberDashboard/>}/>
        <Route path='/loan/request-loan' element={<LoanRequest/>}/>
        <Route path='/member/register' element={<Register/>}/>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/settings" element={<SetCollection />} />
        <Route path='/admin/register' element={<AdminRegister/>}/>
        <Route path='admin/updateprofile' element={<ProfileUpdate/>}/>
        <Route path='/secretary/dashboard' element={<SecretaryDashboard/>}/>
        <Route path='/treasurer/dashboard' element={<TreasurerDashboard/>}/>
        <Route path='/treasurer/records' element={<AllRecordsT/>} />
        <Route path='/treasurer/getprofile' element={<TreasurerProfileT/>} />
        <Route path='/secretary/getprofile' element={<SecretaryProfileS/>} />
        <Route path='/president/dashboard' element={<PresidentDashboard/>} />
        <Route path='/president/getprofile' element={<PresidentProfile/>} />
        <Route path='/president/loan-details/:id' element={<LoanDetailsP/>} />
        <Route path='/about' element={<LearnMorePage/>} />
      </Routes>
    </BrowserRouter>
<ToastContainer position="top-center" autoClose={2000}  />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <Index/>
  
)
