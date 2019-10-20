<?php
require "db.php";

if(empty($_GET["action"]))
	die();

$action = $_GET["action"];

switch($action)
{
	case "read":
		action_read();
		break;
	case "write":
		break;
	case "query":
		action_query();
		break;
	default:
		die();
}

function action_read()
{
	$label = "";
	$address = "";
	$type = "";
	
	if(!empty($_GET["label"]))
		$label = $_GET["label"];
	
	if(!empty($_GET["address"]))
		$address = $_GET["address"];
	
	if(!empty($_GET["type"]))
		$type = $_GET["type"];
	
	if($label && !($type || $address))
		read_by_label($label);
	else if($type && $address && !$label)
		read_by_address($type, $address);
	else
		die();
}

///
/// Czytaj wartość zmiennej po nazwie etykiety
///
function read_by_label($label)
{
	$mysqli = db_connect();
	
	$stmt = $mysqli -> prepare("SELECT value FROM data WHERE label = ? ORDER BY time DESC LIMIT 1");
	$stmt -> bind_param("s", $label);
	$stmt -> execute();
	$stmt -> store_result();
	$stmt -> bind_result($value);
	$stmt -> fetch();
	
	echo json_encode(array("value" => $value));
	
	$stmt -> free_result();
	$mysqli -> close();
}

///
/// Czytaj wartość zmiennej po jej adresie
///
function read_by_address($type, $address)
{
	$mysqli = db_connect();
	
	$stmt = $mysqli -> prepare("SELECT value FROM data WHERE type = ? AND address = ? ORDER BY time DESC LIMIT 1");
	$stmt -> bind_param("si", $type, $address);
	$stmt -> execute();
	$stmt -> store_result();
	$stmt -> bind_result($value);
	$stmt -> fetch();
	
	echo json_encode(array("value" => $value));
	
	$stmt -> free_result();
	$mysqli -> close();
}

function action_query()
{
	if(empty($_GET["list"]))
		die();
	
	$list = $_GET["list"];
	
	switch($list)
	{
		case "vars":
			query_vars($list);
			break;
	}
}

///
/// Pobierz listę zmiennych
///
function query_vars()
{
	$mysqli = db_connect();
	
	$stmt = $mysqli -> prepare("SELECT DISTINCT type, address, label FROM data ORDER BY time DESC");
	$stmt -> execute();
	$stmt -> store_result();
	$stmt -> bind_result($type, $address, $label);
	
	$result = array();
	
	while($stmt -> fetch())
	{
		array_push($result, array(
			"type"		=> $type,
			"address"	=> $address,
			"label"		=> $label
		));
	}
	
	echo json_encode($result);
	
	$stmt -> free_result();
	$mysqli -> close();
}

/*
//Read
$_GET["label"]
$_GET["type"]
$_GET["address"]

//Write
$_GET["address"]
$_GET["value"]

//Query
$_GET["list"]
*/

?>