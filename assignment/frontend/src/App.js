import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for message display

  // Use an environment variable for the backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://public_ip_instance:8000";

  const handleSubmit = async (action) => {
    try {
      const response = await fetch(`${BACKEND_URL}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      // Set message based on response from the server
      if (response.ok) {
        setMessage(data.message || 'Success!'); // Success scenario
      } else {
        setMessage(data.message || 'Something went wrong.'); // Error scenario
      }

    } catch (error) {
      setMessage('Network error! Please try again.'); // Network error handling
    }
  };

  return (
    <div>
      <h1>Hello!</h1>
      <div>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passcode (4 digits)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength="4"
        />
        <button onClick={() => handleSubmit('create_user')}>Create User</button>
        <button onClick={() => handleSubmit('login')}>Login</button>
      </div>
      {message && <p>{message}</p>} {/* Display message to the user */}
    </div>
  );
}

export default App;
