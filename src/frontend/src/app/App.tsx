import React from 'react';
import { useEffect, useState } from 'react';
import '../styles/App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AppHeader} from "../widgets/AppHeader";
import {HomePage} from '../pages/HomePage';
import {PollPage} from '../pages/PollPage';
import {CreatePollPage} from "../pages/CreatePollPage";
import {ProfilePage} from "../pages/ProfilePage";
import {logout, restoreSession, setOnSessionExpired} from "../shared/ApiRequest";

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<{name: string} | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
      setOnSessionExpired(() => setAuthenticatedUser(null));

      restoreSession().then(user => {
          if (user) {
              setAuthenticatedUser({name: user.username});
          }
          setSessionChecked(true);
      });
  }, []);

  const login = (name: string) => {
      setAuthenticatedUser({name: name});
  };

  const handleLogout = () => {
      logout().then(() => setAuthenticatedUser(null));
  };

  if (!sessionChecked) {
      return (
          <div className="App">
              <div className="roundedFrame">
                  <h1>Загрузка...</h1>
              </div>
          </div>
      )
  }

  return (
    <div className="App">
        <BrowserRouter>
            <AppHeader authenticatedUser={authenticatedUser} onLogin={login}/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/poll/:code" element={<PollPage/>}/>
                <Route path="/profile" element={
                    <ProfilePage authenticatedUser={authenticatedUser} onLogout={handleLogout}/>}/>
                <Route path="/create" element={
                    <CreatePollPage authenticatedUser={authenticatedUser}/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
