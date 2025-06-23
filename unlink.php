<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    #code...
    if (isset($_POST["stringData"])) {

    $fileName = $_POST["stringData"];
    $target_dir = "quiz-files/";
    echo $fileName;
    unlink($target_dir.$fileName);
    }
    else {
        echo 'No file present';
    }
}
?>