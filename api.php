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
		action_write();
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
	
	if(isset($_GET["address"]))
		$address = $_GET["address"];
	
	if(!empty($_GET["var"]))
		$var = $_GET["var"];
	
	if($label && !($var || isset($address)))
		echo_by_label($label);
	else if($var && isset($address) && !$label)
		echo_by_address($var, $address);
	else
		doc("action_read");
}


///
/// Wypisz wartość zmiennej po nazwie etykiety
///
function echo_by_label($label) {
	$data = read_by_label($label);
	echo json_encode(array("value" => $data["value"]));
}

///
/// Czytaj zmienną po nazwie etykiety
/// Funkcja zwraca tablicę asocjacyjną zawierającą pola
/// Rodzaj,	Adres,		Typ,	Wartość
/// var,	address,	type,	value
///
function read_by_label($label)
{
	global $sql;
	
	$mysqli = db_connect();
	
	$stmt = $mysqli -> prepare($sql["read_by_label"]);
	$stmt -> bind_param("s", $label);
	$stmt -> execute();
	$result = $stmt -> get_result();
	$data = $result -> fetch_assoc();
	$mysqli -> close();
	
	return $data;
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
/// Funkcja zwraca tylko wartość zmiennej
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

function action_write()
{
	$var = "";
	$address = "";
	$label = "";
	$type = "";
	$value = 0;
		
	if(!empty($_GET["var"]))
		$var = $_GET["var"];
	
	if(isset($_GET["address"]))
		$address = $_GET["address"];
	
	if(!empty($_GET["label"]))
		$label = $_GET["label"];
	
	if(!empty($_GET["type"]))
		$type = $_GET["type"];
	
	if(!isset($_GET["value"]))
		doc("action_write");
	
	$value = $_GET["value"];

	if($label && !($var || isset($address)))
		write_by_label($label, $value);
	else if($var && isset($address) && !$label)
		write_by_address($var, $address, $type, $value);
	else
		doc("action_write");
}

///
/// Zapisz nową wartość zmiennej po jej adresie
///
function write_by_address($var, $address, $type, $value)
{
	if(!in_array($var, array("Q", "R")))
		doc("action_write");
	
	if(!is_numeric($address))
		doc("action_write");
	
	if($address < 0 || $address > 65535)
		doc("action_write");
		
	if(!in_array($type, array("BOOL", "INT", "DINT", "LINT", "UINT", "UDINT", "ULINT", "REAL", "LREAL")))
		doc("action_write");
	
	if($var == "R" && $type == "BOOL")
		doc("action_write");
	
	if($var == "Q" && $type != "BOOL")
		doc("action_write");
	
	if(!is_numeric($value))
		doc("action_write");
	
	global $sql;
	
	$db = db_connect();
	$stmt = $db -> prepare($sql["write"]);
	$stmt -> bind_param("sisd", $var, $address, $type, $value);
	$stmt -> execute();
	$result = $stmt -> affected_rows;
	
	switch($result)
	{
		case -1:
		case 0:
			$result = "error";
			break;
		default:
			$result = "ok";
	}
	echo json_encode(array("result" => $result));
}

///
/// Zapisz nową wartość zmiennej po nazwie etykiety
///
function write_by_label($label, $value)
{
	$data = read_by_label($label);
	write_by_address($data["var"], $data["address"], $data["type"], $value);
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
?>