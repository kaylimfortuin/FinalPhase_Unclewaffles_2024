<?php
$host = 'localhost';
$db   = 'Discussion';
$user = 'root';
$pass = '';

// Create a new PDO instance
$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $message = $_POST['message'];

    // Insert the name and message into the database
    $stmt = $pdo->prepare("INSERT INTO messages (name, content) VALUES (?, ?)");
    $stmt->execute([$name, $message]);

    // Redirect back to the form page
    header('Location: index.html');
    exit;
}
?>