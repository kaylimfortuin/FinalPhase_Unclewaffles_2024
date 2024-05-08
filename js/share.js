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