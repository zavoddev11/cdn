function nanoid(t = 21) {
  return crypto.getRandomValues(new Uint8Array(t)).reduce((t, e) => 
    t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e < 63 ? "_" : "-", "");
}

document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.getElementById("chat-container");

  const script1 = document.createElement("script");
  script1.src = "https://unpkg.com/react@18/umd/react.production.min.js";
  document.body.appendChild(script1);

  const script2 = document.createElement("script");
  script2.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
  document.body.appendChild(script2);

  const script3 = document.createElement("script");
  script3.src = "https://cdn.socket.io/4.0.1/socket.io.min.js";
  document.body.appendChild(script3);

  const script4 = document.createElement("script");
  script4.src = "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js";
  document.body.appendChild(script4);

  script4.onload = function () {
    const ChatWidget = () => {
      let session_id = nanoid();
      const { useState, useRef, useEffect } = React;
      const socket = io("http://localhost:8000");
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([]);
      const [message, setMessage] = useState("");
      const messagesEndRef = useRef(null);

      useEffect(() => {
        socket.on("message:receive", (message) => {
          if (message.status === "error") {
            setMessages((prev) => [...prev, message.data]);
          }
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
                <div ref={messagesEndRef} />
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
    };

    ReactDOM.render(React.createElement(ChatWidget), chatContainer);
  };
});
