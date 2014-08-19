<?php

function initSession() {
	session_start();
	if(!isset($_SESSION['user']))
		$_SESSION['user'] = '';
}

?>