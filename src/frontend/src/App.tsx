import React from 'react';
import { useState } from 'react';
import './App.css';
import { MainPage } from './pages/MainPage';
import {CreateVotePage} from "./pages/CreateVotePage";
import {ProfilePage} from "./pages/ProfilePage";

type PageType = "main" | "profile" | "create";

function App() {
  const [page, setPage] = useState<PageType>("main");

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main className="App-main">
          {page === "main" && (
              <MainPage onOpenProfile={() => setPage("profile")}/>
          )}
          {page === "profile" && (
              <ProfilePage
                  onOpenProfile={() => setPage("profile")}
                  onCreateVote={() => setPage("create")}
                  onLogout={() => setPage("main")}/>
          )}
          {page === "create" && (
              <CreateVotePage onOpenProfile={() => setPage("profile")}/>
          )}
      </main>
    </div>
  );
}

export default App;
