<?php
$host = 'localhost';
$db   = 'resources';
$user = 'root';
$pass = '';

// Create a new PDO instance
$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

// Check if file is uploaded
if (isset($_FILES['myfile'])) {
    $file = $_FILES['myfile'];
    $module = $_POST['Modules'];

    // Upload the file to the server
    $uploadDir = 'uploads/';
    $uploadFile = $uploadDir . basename($file['name']);
    move_uploaded_file($file['tmp_name'], $uploadFile);

    // Insert the file into the database
    $stmt = $pdo->prepare("INSERT INTO files (module, name, size, type, destination) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$module, $file['name'], $file['size'], $file['type'], $uploadFile]);

    echo 'File uploaded successfully';
} else {
    echo 'No file uploaded';
}
?>