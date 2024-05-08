<?php
$host = 'localhost';
$db   = 'resources';
$user = 'root';
$pass = '';

// Create a new PDO instance
$pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);

$id = $_GET['id'];

// Fetch the file with the given id
$stmt = $pdo->prepare("SELECT * FROM files WHERE id = ?");
$stmt->execute([$id]);

$file = $stmt->fetch(PDO::FETCH_ASSOC);

if ($file) {
    // Send the file to the client
    header('Content-Description: File Transfer');
    header('Content-Type: ' . $file['type']);
    header('Content-Disposition: attachment; filename="' . $file['name'] . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . $file['size']);
    readfile($file['destination']);
    exit;
} else {
    echo 'No file found';
}
?>