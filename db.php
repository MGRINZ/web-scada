<?php
$db = array(
	"host"		=> "127.0.0.1",
	"port"		=> "3306",
	"user"		=> "root",
	"password"	=> "12345",
	"database"	=> "web_scada"
);

function db_connect()
{
	global $db;
	return mysqli_connect($db["host"], $db["user"], $db["password"], $db["database"], $db["port"]);
}
?>