import React, { useEffect, useState, useRef } from 'react';
import { messageService } from '../../service/messageService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ChatPanel.css'; 

function ChatPanel({ groupId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null); 

    // Ref for the messages box to enable auto-scrolling
    const messagesEndRef = useRef(null);

    // Scroll to the bottom of the messages box
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchMessages();
    }, [groupId]); // Re-fetch messages when groupId changes

    useEffect(() => {
        // Scroll to bottom whenever messages array changes
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        setError(null); 
        setLoading(true);
        try {
            const data = await messageService.getAllMessage(groupId);
            console.log("Fetched messages:", data); 
            setMessages(Array.isArray(data.messages) ? data.messages : []);
        } catch (err) {
            console.error('Error loading messages:', err);
            setError('Failed to load messages. Please try again.');
            setMessages([]); // Clear messages on error to prevent displaying stale data
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMsg.trim()) return; // Don't send empty messages

        setError(null); 
        setSending(true);
        try {
            // messageService.sendMessage should return the newly created message object
            const sentResponse = await messageService.sendMessage(newMsg, groupId);
            setMessages((prevMessages) => [...prevMessages, sentResponse.message]);
            setNewMsg(''); // Clear the input field
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        setError(null); // Clear previous errors
        if (!window.confirm('Are you sure you want to delete this message?')) {
            return; // Confirm deletion
        }
        try {
            await messageService.deleteMessage(messageId);
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        } catch (err) {
            console.error('Error deleting message:', err);
            setError('Failed to delete message. Please try again.');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="chat-panel">
            {error && <div className="error-message">{error}</div>} {/* Display error */}

            <div className="messages-box">
                {messages.length === 0 && !loading && <p className="no-messages">No messages yet. Start the conversation!</p>}
                {messages.map((msg) => (
                    // Use msg._id for key, as per your schema.
                    // Fallback to timestamp or index if _id is somehow missing (e.g., during optimistic update before _id is assigned by backend)
                    <div key={msg._id || msg.timestamp || Math.random()} className={`message-item ${msg.sender?._id === currentUser._id ? 'my-message' : 'other-message'}`}>
                        <div className="message-header">
                            {/* Display sender's username or email, preferring username */}
                            <strong className="sender-name">{msg.sender?.username || msg.sender?.email || 'Unknown User'}</strong>
                            <span className="message-timestamp">
                                {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                            </span>
                        </div>
                        <div className="message-content">{msg.content}</div>
                        {/* Only show delete button if the message sender's ID matches the current user's ID */}
                        {msg.sender?._id === currentUser._id && (
                            <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="delete-btn"
                                title="Delete message"
                            >
                                ❌
                            </button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Element to scroll to */}

            </div>

            <form onSubmit={handleSendMessage} className="send-message-form">
                <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder={sending ? "Sending..." : "Type a message..."}
                    disabled={sending || loading} // Disable input while sending or loading messages
                    aria-label="New message input"
                />
                <button type="submit" disabled={sending || !newMsg.trim()}>
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
}

export default ChatPanel;