import React from 'react';
import { useState } from 'react';
import '../styles/App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AppHeader} from "../widgets/AppHeader";
import {HomePage} from '../pages/HomePage';
import {VotePage} from '../pages/VotePage';
import {CreateVotePage} from "../pages/CreateVotePage";
import {ProfilePage} from "../pages/ProfilePage";

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<{name: string} | null>(null);

  const login = (name: string) => {
      setAuthenticatedUser({name: name});
  };

  const logout = () => {
      setAuthenticatedUser(null);
  };

  return (
    <div className="App">
        <BrowserRouter>
            <AppHeader authenticatedUser={authenticatedUser} onLogin={login}/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/vote/:id" element={<VotePage/>}/>
                <Route path="/profile" element={
                    <ProfilePage authenticatedUser={authenticatedUser} onLogout={logout}/>}/>
                <Route path="/create" element={
                    <CreateVotePage authenticatedUser={authenticatedUser}/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
