<?php
// Ensure errors can be logged
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the filename was received
if (!isset($_POST["filename"])) {
    http_response_code(400);
    // mkdir(__DIR__ . "/error/", 0777, true);
    echo "No filename received.";
    exit;
}

// Get the filename securely
$filename = basename($_POST["filename"]);
$targetDir = __DIR__ . "/quiz-files/";
$filePath = $targetDir . $filename;

if (file_exists($filePath)) {
    if (unlink($filePath)) {
        http_response_code(200);
        echo "File deleted.";
    } else {
        http_response_code(500);
        echo "Error deleting.";
    }
} else {
    http_response_code(404);
    echo "File not found at $filePath";
}