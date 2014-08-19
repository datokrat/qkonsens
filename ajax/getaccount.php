<?php

require_once('../php/session.php');
require_once('../php/usermgt.php');
initSession();

echo '{"name": ' . json_encode(getSessionUserName()) . '}';

?>