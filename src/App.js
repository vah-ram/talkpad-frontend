import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Chat from './pages/Chat.js';
import React from 'react';
import Load from './pages/Load.js';
import Exit from './pages/Exit.js';
import MyProfile from './pages/MyProfile.js';

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<Chat/>}/>
          <Route path='/api/loading' element={<Load/>}/>
          <Route path='/logout' element={<Exit/>}/>
          <Route path='/profile' element={<MyProfile/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;