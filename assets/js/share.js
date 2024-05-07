let db;
    
    // Open or create a database
    const dbName = "Share Resources";
    const dbVersion = 1;
    
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function(event) {
      console.error("Database error: " + event.target.errorCode);
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      console.log("Database opened successfully");
      displayFiles(); // Display files on page load
    };

    request.onupgradeneeded = function(event) {
      const db = event.target.result;

      // Create an object store (similar to a table in relational databases)
      const objectStore = db.createObjectStore("files", { keyPath: "id", autoIncrement: true });

      // Define indexes for searching
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("type", "type", { unique: false });
      objectStore.createIndex("size", "size", { unique: false });

      console.log("Database setup complete");
    };

    // Function to add a file to the database
    function uploadFile() {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];

      const transaction = db.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");

      const request = objectStore.add({ name: file.name, type: file.type, size: file.size, data: file });

      request.onsuccess = function(event) {
        console.log("File uploaded successfully");
        fileInput.value = ""; // Clear the file input
        displayFiles(); // Update file list
      };

      request.onerror = function(event) {
        console.error("File upload error: " + event.target.errorCode);
      };
    }

    // Function to display uploaded files in a table
    function displayFiles() {
      const transaction = db.transaction(["files"], "readonly");
      const objectStore = transaction.objectStore("files");
      const request = objectStore.getAll();

      request.onsuccess = function(event) {
        const files = event.target.result;
        const fileList = document.getElementById("fileList");
        fileList.innerHTML = ""; // Clear previous results

        files.forEach(file => {
          const tr = document.createElement("tr");
          const fileNameCell = document.createElement("td");
          fileNameCell.textContent = file.name;
          const downloadCell = document.createElement("td");
          const downloadButton = document.createElement("button");
          downloadButton.textContent = "Download";
          downloadButton.className = "download";
          downloadButton.onclick = function() {
            downloadFile(file.name);
          };
          downloadButton.style.border='0'
          downloadButton.style.backgroundColor='maroon'
          downloadButton.style.color='white'
          downloadButton.style.fontWeight='500'
          downloadButton.style.width='100%'
          downloadButton.style.height='100%'
          downloadCell.style.padding='0'
          downloadCell.style.backgroundColor='maroon'
          downloadCell.appendChild(downloadButton);
          tr.appendChild(fileNameCell);
          tr.appendChild(downloadCell);
          fileList.appendChild(tr);
        });
      };

      request.onerror = function(event) {
        console.error("Display files error: " + event.target.errorCode);
      };
    }

    // Function to search files by name
    function searchFiles() {
      const searchInput = document.getElementById("searchInput");
      const searchTerm = searchInput.value.trim().toLowerCase();

      const transaction = db.transaction(["files"], "readonly");
      const objectStore = transaction.objectStore("files");
      const index = objectStore.index("name");
      const request = index.openCursor();

      const fileList = document.getElementById("fileList");
      fileList.innerHTML = ""; // Clear previous results

      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          const file = cursor.value;
          if (file.name.toLowerCase().includes(searchTerm)) {
            const tr = document.createElement("tr");
            const fileNameCell = document.createElement("td");
            fileNameCell.textContent = file.name;
            const downloadCell = document.createElement("td");
            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Download";
            downloadButton.className = "download";
            downloadButton.onclick = function() {
              downloadFile(file.name);
            };
            downloadCell.appendChild(downloadButton);
            tr.appendChild(fileNameCell);
            tr.appendChild(downloadCell);
            fileList.appendChild(tr);
          }
          cursor.continue();
        }
      };

      request.onerror = function(event) {
        console.error("Search error: " + event.target.errorCode);
      };
    }

    // Function to download a file by name
    function downloadFile(fileName) {
      const transaction = db.transaction(["files"], "readonly");
      const objectStore = transaction.objectStore("files");
      const index = objectStore.index("name");
      const request = index.get(fileName);

      request.onsuccess = function(event) {
        const file = event.target.result;
        const downloadUrl = URL.createObjectURL(file.data);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(downloadUrl);
      };

      request.onerror = function(event) {
        console.error("Download error: " + event.target.errorCode);
      };
    }