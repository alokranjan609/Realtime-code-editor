// export default EditorPage;
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Action';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import axios from 'axios';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [language, setLanguage] = useState('python3'); // Default language
    const [consoleOutput, setConsoleOutput] = useState(''); // Console output state
    const [userInput, setUserInput] = useState(''); // User input state

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter(client => client.socketId !== socketRef.current.id));
            });
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, [reactNavigator, location.state, roomId]);

    async function runCode() {
      
        
        
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/execute`, {
                script: codeRef.current,
                language,
                versionIndex: '3', // Modify based on language version if needed
                stdin: userInput, // Pass the user input
            });
            setConsoleOutput(response.data.output || 'No output');
            toast.success('Code executed successfully!');
        } catch (error) {
            setConsoleOutput('Code execution failed.');
            console.error('Execution error:', error);
            toast.error('Code execution failed.');
        }
    }

    function clearConsole() {
        setConsoleOutput('');
    }

    const changeLanguage = (e) => {
        setLanguage(e.target.value);
        toast.success(`Language changed to ${e.target.value}`);
    };

    function copyRoomId() {
        navigator.clipboard.writeText(roomId)
            .then(() => toast.success('Room ID copied to clipboard'))
            .catch(() => toast.error('Failed to copy Room ID'));
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/code-sync.png" alt="logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map(client => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>
            </div>

            <div className="editorContainer">
                <div className="editorControls">
                    <select
                        className="languageSelect"
                        onChange={changeLanguage}
                        value={language}
                    >
                        <option value="python3">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                    </select>
                    <button className="btn runBtn" onClick={runCode}>
                        Run
                    </button>
                </div>

                <div className="editorWrap">
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => {
                            codeRef.current = code;
                        }}
                    />
                </div>

              {/* Input Section */}
<div className="inputContainer">
    <div className="inputHeader">
        <span>Standard Input</span>
    </div>
    <textarea
        className="inputField styledInput"
        placeholder="Enter your standard input here..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
    />
</div>

                {/* Console Output Section */}
                <div className="consoleContainer">
                    <div className="consoleHeader">
                        <span>Console Output</span>
                        <button className="btn clearBtn" onClick={clearConsole}>
                            Clear Console
                        </button>
                    </div>
                    <div className="consoleOutput">
                        <pre>{consoleOutput}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
