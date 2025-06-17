import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './pages/Home/Home';
import FocusPage from './pages/Focus/Focus';
import LoginPopup from './components/loginpopup/loginpopup';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';

import Groups from './pages/Group/Group';
import GroupDetails from './pages/Group/groupDetails';

function LayoutWrapper() {
  const location = useLocation();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isFocusRunning, setIsFocusRunning] = useState(false);

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
  };

  // Paths where navbar/footer should be hidden
  const hideLayout = location.pathname === '/ai-assistant';

  return (
    <div className="min-h-screen flex flex-col">
      {!isFocusRunning && !hideLayout && (
        <Navbar onLoginClick={() => setShowLoginPopup(true)} />
      )}

      <main className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/focus"
            element={<FocusPage setIsFocusRunning={setIsFocusRunning} />}
          />
          <Route path="/ai-assistant" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
         
         <Route path="/groups" element={<Groups />} />
           <Route path="/groups/:groupId" element={<GroupDetails />} />
        </Routes>
      </main>

      {!isFocusRunning && !hideLayout && <Footer />}

      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
