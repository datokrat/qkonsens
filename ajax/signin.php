<?php

require_once('../php/session.php');
require_once('../php/usermgt.php');
initSession();

$success = false;

if(isset($_GET['name'])) {
	setSessionUserName($_GET['name']);
	$success = true;
}

echo '{"success": ' . ($success ? 'true' : 'false') . ', "name": ' . json_encode(getSessionUserName()) . '}';

?>