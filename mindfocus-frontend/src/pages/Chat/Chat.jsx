import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../service/ChatService';
import './chat.css';

const Chat = () => {
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput('');

    try {
      const res = await chatService.send(input, sessionId);
      const assistantMsg = { role: 'assistant', content: res.reply };
      setSessionId(res.sessionId);
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setIsSessionsOpen(false);
  };

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await chatService.getSession();
      setSessions(res.sessions);
      setIsSessionsOpen(true);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionMessages = async (sid) => {
    try {
      setLoading(true);
      const res = await chatService.getSessionMessages(sid);
      setMessages(res.messages);
      setSessionId(sid);
      setIsSessionsOpen(false);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${isSessionsOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <button className="back-arrow" onClick={() => window.close()}>←</button>
          <h2>Your Chats</h2>
          <button onClick={createNewChat} className="new-chat-button">
            New Chat
          </button>
         
        </div>
        <div className="session-list-container">
          <button onClick={loadSessions} className="load-sessions-toggle">
            {isSessionsOpen ? 'Hide Sessions' : 'Load Sessions'}
          </button>
          {isSessionsOpen && sessions.length > 0 && (
            <nav className="session-nav">
              {sessions.map(s => (
                <button
                  key={s._id}
                  className={`session-item ${s._id === sessionId ? 'active' : ''}`}
                  onClick={() => loadSessionMessages(s._id)}
                >
                  <span className="session-title">{s.title || `Chat ${s._id.slice(0, 6)}`}</span>
                  <span className="session-time">{new Date(s.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </button>
              ))}
              {sessions.length === 0 && <p className="no-sessions">No sessions yet.</p>}
            </nav>
          )}
          {isSessionsOpen && loading && <div className="loading-indicator">Loading sessions...</div>}
        </div>
      </aside>

      {isSessionsOpen && (
        <div className="overlay" onClick={() => setIsSessionsOpen(false)}></div>
      )}

      <main className="chat-main">
        <header className="chat-header">
          <button className="hamburger-menu" onClick={() => setIsSessionsOpen(true)}>☰</button>
          <h3 className="chat-heading">
            Improve your skills with suggestions, guides, or hacks 💡
          </h3>
          
        </header>

        <div className="messages-container">
          {messages.length === 0 && !loading && (
            <div className="empty-chat-state">
              <p>Start a conversation! Ask me anything about improving your skills.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble assistant typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder={loading ? 'Thinking...' : 'Ask AI...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
          />
          <button
            className="chat-send-button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
