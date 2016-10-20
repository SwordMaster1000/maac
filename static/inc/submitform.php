<?php

$name = '';
$cname = false;
$email = '';
$subject = '';
$msg = '';

if (!isset($_POST['name'], $_POST['email'], $_POST['subject'], $_POST['msg'])) {
    header('Location: /home');
    exit;
}

$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$msg = $_POST['msg'];

if (isset($_POST['companyname'])) {
    $cname = $_POST['companyname'];
}

if ($cname !== false) {
    $msg = "MAAC form submission from $name of $cname ($email)\n\nMessage:\n$msg";
}else {
    $msg = "MAAC form submission from $name ($email)\n\nMessage:\n$msg";
}

$headers = "From: MACH Automated Agricultural Company <$email>";
$to = "machrobotics@hotmail.com, ".$email;
mail($to, $subject, $msg, $headers);

?>