let API_URL = "http://localhost:8000";

function nanoid(t = 21) {
  return crypto.getRandomValues(new Uint8Array(t)).reduce((t, e) =>
    t += (e &= 63) < 36 ? e.toString(36) :
      e < 62 ? (e - 26).toString(36).toUpperCase() :
        e < 63 ? "_" : "-", "");
}

async function createSession(sitedata) {
  const data = {
    sitedata,
    website: window.location.origin,
    owner: "ownerId",
    status: "active",
    refinedSiteData: "text"
  };

  console.log({ chatdata: data });

  try {
    const response = await fetch(`${API_URL}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Success:", result._id);
    return result._id;
  } catch (error) {
    console.error("Connection error!", error);
    // alert("Failed to connect to server. Please check your internet connection.");
  }
}

async function extractData() {
  try {
    let response = await fetch(window.location.origin + "/sitemap.xml");
    if (!response.ok) throw new Error("Failed to fetch sitemap");
    return await response.text();
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    // alert("Could not retrieve site data. Please check your connection.");
    return [];
  }
}

async function getSessionId() {
  try {
    let storedSessionId = localStorage.getItem("chat__session_id");
    let extractedData = await extractData();
    if (!storedSessionId || storedSessionId === "undefined") {
      storedSessionId = await createSession(extractedData);
      localStorage.setItem("chat__session_id", storedSessionId);
    }
    return storedSessionId;
  } catch (error) {
    console.error("Session error:", error);
    // alert("Could not establish a session. Please try again.");
  }
}

globalThis.socket = io(API_URL, {
  reconnectionAttempts: 3, // Limit reconnection attempts
  timeout: 5000, // Connection timeout
});




getSessionId();

function ChatWidget() {
  const { useState, useRef, useEffect } = React;
  const socket = io(API_URL);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [Loading, setLoading] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);


  const fetchCalled = useRef(false);

  globalThis.socket = io(API_URL, {
    reconnectionAttempts: 5, 
    reconnectionDelayMax: 5000,
    timeout: 5000, 
  });



  useEffect(() => {
    socketRef.current = io(API_URL, {
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    const socket = socketRef.current;

    // Handle successful connection
    socket.on("connect", () => {
      console.log("Connected to socket server.");
      setIsConnected(true);
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("WebSocket connection failed:", error.message);
      setIsConnected(false);
      // alert("Chat connection lost. Please check your internet connection.");
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socket.connect(); // Try reconnecting if the server disconnected the socket
      }
    });

    // Fetch messages on first load
    async function fetchMessageBySessionID(id) {
      console.log({ Loading })
      setLoading("Loading Session...")
      try {
        console.log({ id });
        let response = await fetch(`${API_URL}/api/messages/session/${id}`);
        let data = await response.json();
        if (data && data.length > 0) setMessages(data);
        setLoading("")
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading("")
      }
    }

    let session_id = localStorage.getItem("chat__session_id");
    if (session_id) fetchMessageBySessionID(session_id);



    fetchCalled.current = true;

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  useEffect(() => {
    socket.on("message:receive", (message) => {
      setLoading("Loading... Please wait.")
      console.log({ message, messages });

      setMessages((prev) => [...prev, message.data]);
      setLoading("")
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
    try {

      if (!message.trim()) return;
      const userMessage = { sender_type: "customer", message, session_id: localStorage.getItem("chat__session_id") };


      setMessages((prev) => [...prev, userMessage]);
      setMessage('');
      setLoading("Pls wait, Processing Response.")
      socket.emit("message:send", userMessage, (response) => {
      });
    } catch (error) {

    }
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
            AI Chat Support
            <button onClick={toggleChat} style={{ background: 'white', color: '#007bff', border: 'none', cursor: 'pointer' }}>X</button>
          </div>

          <div className={`connection_status ${Loading || !isConnected ? " inactive_connection" : ""} `} >
            {Loading ? Loading : !isConnected ? "No internet connection..." : ""}
          </div>

          <div className="chat-body">
            {/* {Loading} */}
            {messages.map((msg, index) => (
              <div key={index} className={`message-container ${msg.sender_type === 'customer' ? 'sent' : 'received'}`}>
                <div className="message-user">{msg.sender_type === 'customer' ? 'You' : 'AI'}</div>
                <div className="message" style={{ textAlign: msg.sender_type === 'customer' ? 'right' : 'left' }}>{msg.message}</div>
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
}

ReactDOM.render(<ChatWidget />, document.getElementById('chat-container'));
