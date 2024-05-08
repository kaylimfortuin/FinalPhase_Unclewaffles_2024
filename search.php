<?php
$host = 'localhost';
$db   = 'resources';
$user = 'root';
$pass = '';

// Create a new PDO instance
$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

$name = $_GET['name'];

// Search for files with the given name
$stmt = $pdo->prepare("SELECT * FROM files WHERE name LIKE ?");
$stmt->execute(["%$name%"]);

$files = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($files);
?>