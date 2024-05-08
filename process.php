<?php
$host = 'localhost';
$db   = 'Discussion';
$user = 'root';
$pass = '';

// Create a new PDO instance
$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $message = $_POST['message'];

    // Insert the name, message, and reply_to into the database
    $stmt = $pdo->prepare("INSERT INTO messages (name, content) VALUES (?, ?)");
    $stmt->execute([$name, $message]);

    // Redirect back to the same page
    header('Location: index.php#discussion');
    exit;
}

// Retrieve all messages
$stmt = $pdo->query("SELECT * FROM messages ORDER BY id DESC");
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($messages);
?>