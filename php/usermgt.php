<?php

function getSessionUserName() {
	return $_SESSION['name'];
}

function setSessionUserName($name) {
	$_SESSION['name'] = $name;
}

?>