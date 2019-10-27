<?php
require "db.php";
require "doc.php";

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
	$var = "";
	
	if(!empty($_GET["label"]))
		$label = $_GET["label"];
	
	if(!empty($_GET["address"]))
		$address = $_GET["address"];
	
	if(!empty($_GET["var"]))
		$var = $_GET["var"];
	
	if($label && !($var || $address))
		echo_by_label($label);
	else if($var && $address && !$label)
		echo_by_address($var, $address);
	else
		doc("action_read");
}

function echo_by_label($label) {
	$value = read_by_label($label);
	echo json_encode(array("value" => $value));
}

///
/// Czytaj wartość zmiennej po nazwie etykiety
///
function read_by_label($label)
{
	global $sql;
	
	$mysqli = db_connect();
	
	$stmt = $mysqli -> prepare($sql["read_by_label"]);
	$stmt -> bind_param("s", $label);
	$stmt -> execute();
	$stmt -> store_result();
	$stmt -> bind_result($var, $address, $value);
	$stmt -> fetch();
	$stmt -> free_result();
	$mysqli -> close();
	
	return $value;
}


///
/// Wypisz wartość zmiennej po jej adresie
///
function echo_by_address($type, $address)
{
	$value = read_by_address($type, $address);
	echo json_encode(array("value" => $value));
}

///
/// Czytaj wartość zmiennej po jej adresie
///
function read_by_address($var, $address)
{
	global $sql;
	
	$mysqli = db_connect();
	
	$stmt = $mysqli -> prepare($sql["read_by_address"]);
	$stmt -> bind_param("si", $var, $address);

	$stmt -> execute();
	$stmt -> store_result();
	$stmt -> bind_result($value);
	$stmt -> fetch();
	$stmt -> free_result();
	$mysqli -> close();
	
	return $value;
}

function action_query()
{
	if(empty($_GET["list"]))
		doc("action_query");
	
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
	global $sql;
	
	$variable = "";
	$order = "var";
	
	if(!empty($_GET["order"]))
	{
		$order = $_GET["order"];
		if(!($order == "var" || $order == "label"))
			doc("action_query");
	}
	
	if(!empty($_GET["variable"]))
	{
		$variable = $_GET["variable"];
		if(!in_array($variable, array("I", "Q", "R", "AI")))
			doc("action_query");
	}
	
	$mysqli = db_connect();
	
	$sql_stmt = $sql["query_vars"]["select"];
	if($variable)
		$sql_stmt .= $sql["query_vars"]["where"];
	$sql_stmt .= $sql["query_vars"]["order"][$order];
	
	$stmt = $mysqli -> prepare($sql_stmt);
	
	if($variable)
		$stmt -> bind_param("s", $variable);
	
	$stmt -> execute();
	$stmt -> store_result();
	$stmt -> bind_result($var, $address, $type, $label);
	
	$result = array();
	
	while($stmt -> fetch())
	{
		array_push($result, array(
			"var"		=> $var,
			"address"	=> $address,
			"type"		=> $type,
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