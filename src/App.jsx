import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages from Express API
    axios
      .get("http://fe.ahadalichowdhury.online/api/hello")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  const saveMessage = () => {
    axios
      .post("http://fe.ahadalichowdhury.online/api/message", { text: message })
      .then((response) => {
        console.log(response.data);
        setMessages([...messages, { text: message }]); // Update messages list
        setMessage(""); // Clear input after save
      })
      .catch((error) => {
        console.error("Error saving message:", error);
      });
  };

  return (
    <div className="App">
      <h1>Messages mujib</h1>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.text}</li>
        ))}
      </ul>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={saveMessage}>Save Message</button>
    </div>
  );
}

export default App;
