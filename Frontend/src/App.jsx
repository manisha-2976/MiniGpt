import './App.css';
import Sidebar from "./Sidebar.jsx";
import LoginModal from "./LoginModal.jsx";
import SignUpModal from "./SignUpModal.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState, useRef } from 'react';
import {v1 as uuidv1} from "uuid";
import { useEffect } from 'react';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); 
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);
  const touchStartY = useRef(null);
  const touchCurrentY = useRef(null);
  const SWIPE_THRESHOLD = 60;

  const onTouchStart = (e) => {
    const point = e.touches ? e.touches[0] : e;
    touchStartX.current = point.clientX;
    touchCurrentX.current = point.clientX;
    touchStartY.current = point.clientY;
    touchCurrentY.current = point.clientY;
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const point = e.touches ? e.touches[0] : e;
    touchCurrentX.current = point.clientX;
    touchCurrentY.current = point.clientY;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchCurrentX.current === null) {
      touchStartX.current = null;
      touchCurrentX.current = null;
      touchStartY.current = null;
      touchCurrentY.current = null;
      return;
    }
    const deltaX = touchCurrentX.current - touchStartX.current;
    const deltaY = touchCurrentY.current - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
    touchStartY.current = null;
    touchCurrentY.current = null;
  };

   // FETCH LOGGED-IN USER 
  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/me`, { credentials: "include" });

      if (!res.ok) {
      setUser(null);
      return;
    }
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    sidebarOpen, setSidebarOpen,
    user, setUser, fetchUser
  }; 

  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  return (
    <div className='app'
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={(e) => { if (e.buttons === 1) onTouchMove(e); }}
      onMouseUp={onTouchEnd}
    >
      <MyContext.Provider value={providerValues}>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onOpenLogin={() => setOpenLogin(true)} />
          <ChatWindow sidebarOpen={sidebarOpen} />

          <LoginModal
            isOpen={openLogin}
            onClose={() => setOpenLogin(false)}
            openSignup={() => { setOpenLogin(false); setOpenSignup(true); }}
            fetchUser={fetchUser}
          />

          <SignUpModal
            isOpen={openSignup}
            onClose={() => setOpenSignup(false)}
            openLogin={() => { setOpenSignup(false); setOpenLogin(true); }}
            fetchUser={fetchUser}
          />
        </MyContext.Provider>
    </div>
  )
}

export default App