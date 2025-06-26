<?php
if (!isset($_FILES['file'])) {
    echo "No file uploaded.";
    exit;
}
$error = array(); 
$allowedType = "json";

if (!str_contains(basename($_FILES["file"]["type"]),$allowedType)) {
    $error[] = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
} else if ($_FILES["file"]["size"] > 1048576) {
    $error[] = "Sorry, your file is too large.";
} 
if (empty($error)) {
$targetDir = "quiz-files/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}
$randomName = uniqid('FILE_',false);
$filename = $randomName.'.'.basename($_FILES["file"]["type"]);
$targetFile = $targetDir . $filename;

if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
    echo $filename;
} else {
    http_response_code(500);
    echo "Error uploading file.";
}
} else { 
    // Display all error messages
foreach ($error as $err) {
    http_response_code(500);
    echo "<div class='alert alert-danger'>{$err}</div>";
    die();
}
}
?>