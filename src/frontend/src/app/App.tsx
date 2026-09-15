import React from 'react';
import { useEffect, useState } from 'react';
import '../styles/App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AppHeader} from "../widgets/AppHeader";
import {HomePage} from '../pages/HomePage';
import {PollPage} from '../pages/PollPage';
import {CreatePollPage} from "../pages/CreatePollPage";
import {ProfilePage} from "../pages/ProfilePage";
import {getMe, setOnSessionExpired} from "../shared/ApiRequest";
import {deleteToken} from "../shared/Token";

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<{name: string} | null>(null);

  useEffect(() => {
      setOnSessionExpired(() => setAuthenticatedUser(null));

      getMe().then(user => {
          if (user) {
              setAuthenticatedUser({name: user.username});
          }
      });
  }, []);

  const login = (name: string) => {
      setAuthenticatedUser({name: name});
  };

  const logout = () => {
      deleteToken();
      setAuthenticatedUser(null);
  };

  return (
    <div className="App">
        <BrowserRouter>
            <AppHeader authenticatedUser={authenticatedUser} onLogin={login}/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/poll/:id" element={<PollPage/>}/>
                <Route path="/profile" element={
                    <ProfilePage authenticatedUser={authenticatedUser} onLogout={logout}/>}/>
                <Route path="/create" element={
                    <CreatePollPage authenticatedUser={authenticatedUser}/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
