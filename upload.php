<?php
if (!isset($_FILES['file'])) {
    echo "No file uploaded.";
    exit;
}
// echo '<pre>';
// print_r($_FILES['file']);
// echo '</pre>';

$targetDir = "quiz-files/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}
$randomName = uniqid('FILE_',false);
$filename = $randomName.'.'.basename($_FILES["file"]["type"]);
$targetFile = $targetDir . $filename;
// echo '<pre>';
// print_r($filename);
// echo '</pre>';
if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
    echo $filename;
} else {
    echo "Error uploading file.";
}
?>