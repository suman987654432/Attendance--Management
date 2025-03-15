import React from 'react'
import {BrowserRouter , Route, Routes} from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import AddStudent from './pages/AddStudent'
import DisplayPage from './pages/DisplayPage'
import Search from './pages/Search'

const App = () => {
  return (
  <>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<AdminLogin/>} />
    <Route path="/dashboard" element={<Dashboard/>} >  
      <Route path="dashboard/insert" element={<AddStudent/>} />
      <Route path="dashboard/display" element={<DisplayPage/>} />
      <Route path="dashboard/search" element={<Search/>} />

    </Route>
  </Routes>
  </BrowserRouter>
  </>
  )
}

export default App