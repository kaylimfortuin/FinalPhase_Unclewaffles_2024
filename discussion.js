// Reference HTML elements by their IDs
const messageContainer = document.getElementById('message-container');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let db;

// Function to open connection to IndexedDB database
const openDB = () => {
  // Create a request to open the database
  const request = indexedDB.open('Discussion', 1);

  // Define what to do on success (database opened)
  request.onsuccess = (event) => {
    console.log('Database opened successfully');
    // Store the database reference in a global variable
    db = event.target.result;
  };

  // Define what to do on error (opening database failed)
  request.onerror = (event) => {
    console.error('Error opening database:', event.target.error);
  };

  // Define what to do on upgrade needed (database version changed)
  request.onupgradeneeded = (event) => {
    const objectStore = event.target.result.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
  };
};

// Call the openDB function to open the database connection
openDB();

// Function to send a message
const sendMessage = (username, message) => {
  // Create a transaction for read-write access to the "messages" object store
  const transaction = db.transaction('messages', 'readwrite');
  const objectStore = transaction.objectStore('messages');

  // Create a timestamp object for the message
  const timestamp = new Date().toISOString(); // Uncomment for timestamps

  // Create a new message object with username, content, and timestamp (optional)
  const addRequest = objectStore.add({ username: username, content: message, timestamp: timestamp });

  // Define what to do on success (message added)
  addRequest.onsuccess = (event) => {
    console.log('Message sent:', message);
    // Update the message display with the new message
    displayMessages();
  };

  // Define what to do on error (adding message failed)
  addRequest.onerror = (event) => {
    console.error('Error sending message:', event.target.error);
  };
};

// Function to display all messages
const displayMessages = () => {
  // Clear the content of the message container element
  messageContainer.innerHTML = '';

  // Create a transaction for read-only access to the "messages" object store
  const transaction = db.transaction('messages', 'readonly');
  const objectStore = transaction.objectStore('messages');

  // Retrieve all messages from the object store
  const getAllRequest = objectStore.getAll();

  // Define what to do on success (messages retrieved)
  getAllRequest.onsuccess = (event) => {
    const messages = event.target.result;

    // Loop through each retrieved message
    messages.forEach(message => {
      const messageElement = document.createElement('p');

      // Format the message content with username and message
      const date = new Date(message.timestamp); // Uncomment for timestamps
      const formattedTime = date.toLocaleTimeString(); // Uncomment for timestamps
      messageElement.textContent = `${message.username} (${formattedTime}): ${message.content}`;

      // Append the message paragraph element to the container
      messageContainer.appendChild(messageElement);
    });
  };
};

// Add a click event listener to the send button
sendButton.addEventListener('click', () => {
  // Get the username and message values from their input fields
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();

  // Check if both username and message are not empty strings
  if (username !== '' && message !== '') {
    // Send the message using the sendMessage function
    sendMessage(username, message);

    // Clear both input fields after sending the message
    usernameInput.value = '';
    messageInput.value = '';
  }
});

// Add an event listener to the window load event
window.addEventListener('load', displayMessages);
