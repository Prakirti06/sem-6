import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Layout from './components/Layout';
import DashboardPage from './pages/Dashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "/login" element = {<LoginPage />}></Route>
          <Route path = "/" element = {<Layout />}>
            <Route index element = {<DashboardPage />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
