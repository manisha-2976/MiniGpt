import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

function Sidebar() {
    const { user, fetchUser, allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread", { credentials: "include" });
            const res = await response.json();
            console.log(res);
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            console.log(filteredData);
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (user) {
            getAllThreads();
        } else {
            setAllThreads([]);
        }
    }, [currThreadId, user]);


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/thread/${newThreadId}`,
                { credentials: "include" });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/thread/${threadId}`, { method: "DELETE", credentials: "include" });
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/logout`, { method: "POST", credentials: "include" });
            console.log("user logged out")
            await fetchUser();

            setAllThreads([]);     
            setPrevChats([]);      
            setNewChat(true);      
            setCurrThreadId(uuidv1());
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            {/* new chat button */}
            <button className="top-btn" onClick={createNewChat}>
                <img src="src/assets/minigpt.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* thread history */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            {/* sign */}
            <div className="sign">

                {user ? (
                    <div className="userInfo" onClick={handleProfileClick}>
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                        <span className="username">{user.firstName} {user.lastName}</span>
                        {
                            isOpen &&
                            <div className="dropDown">
                                <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                                <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                                <div className="dropDownItem" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                                </div>
                            </div>
                        }
                    </div>) : (

                    <div>
                        <p className="login-info muted">Log in to get answers based on saved chats, plus create images and upload files.</p>

                        <button className="login-btn" onClick={() => setOpenLogin(true)}>
                            Log in
                        </button>
                    </div>)}

                <LoginModal
                    isOpen={openLogin}
                    onClose={() => setOpenLogin(false)}
                    openSignup={() => {
                        setOpenLogin(false);
                        setOpenSignup(true);
                    }}
                    fetchUser={fetchUser}
                />

                <SignUpModal
                    isOpen={openSignup}
                    onClose={() => setOpenSignup(false)}
                    openLogin={() => {
                        setOpenSignup(false);
                        setOpenLogin(true);
                    }}
                    fetchUser={fetchUser}
                />
            </div>
        </section>
    )
}

export default Sidebar;