function nanoid(t = 21) {
    return crypto.getRandomValues(new Uint8Array(t)).reduce((t, e) => 
      t += (e &= 63) < 36 ? e.toString(36) : 
           e < 62 ? (e - 26).toString(36).toUpperCase() : 
           e < 63 ? "_" : "-", "");
  }
  
  function ChatWidget() {
    let session_id = nanoid();
    const { useState, useRef, useEffect } = React;
    const socket = io("http://localhost:8000");
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
  
    useEffect(() => {
      socket.on("message:receive", (message) => {
        console.log({ message, messages });
        if (message.status == "error") setMessages((prev) => [...prev, message.data]);
      });
  
      return () => {
        socket.off("message:receive");
      };
    }, []);
  
    function toggleChat() {
      setIsOpen(!isOpen);
    }
  
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);
  
    function handleInputChange(event) {
      setMessage(event.target.value);
    }
  
    const sendMessage = () => {
      if (!message.trim()) return;
      const userMessage = { sender_type: "customer", message, session_id };
      setMessages((prev) => [...prev, userMessage]);
      setMessage('');
      socket.emit("message:send", userMessage);
    };
  
    function handleKeyPress(event) {
      if (event.key === 'Enter' && message) {
        sendMessage();
      }
    }
  
    return (
      <div>
        <button id="chat-toggle" onClick={toggleChat}>💬</button>
  
        {isOpen && (
          <div className="chat-widget">
            <div className="chat-header">
              Chat Support
              <button onClick={toggleChat} style={{ background: 'white', color: '#007bff', border: 'none', cursor: 'pointer' }}>X</button>
            </div>
            <div className="chat-body">
              {messages.map((msg, index) => (
                <div key={index} className={`message-container ${msg.sender_type === 'customer' ? 'sent' : 'received'}`}>
                  <div className="message-user">{msg.sender_type === 'customer' ? 'You' : 'AI'}</div>
                  <div className="message">{msg.message}</div>
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <input
                className="chat-input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onKeyPress={handleKeyPress}
                onChange={handleInputChange}
              />
              <button className="send-btn" onClick={sendMessage}>➤</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  ReactDOM.render(<ChatWidget />, document.getElementById('chat-container'));
  
