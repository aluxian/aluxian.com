<?php

if (!(isset($_POST['name']) || isset($_POST['email']) || isset($_POST['message']))) {
	die("missing params");
}

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

if ($message[0] != '<' && strpos($message, '<a href=http://') === false && (strpos($message, 'cheap') === false || strpos($message, 'buy') === false || strpos($message, 'order') === false || strpos($message, 'online') === false)) {
	mail("me@aluxian.com", "aluxian.com contact", $message."\n\n".$name."\n".$email);
}

?>