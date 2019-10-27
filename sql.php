<?php
$sql = array(
	"query_vars"		=> array(
		"select"	=> "SELECT DISTINCT var, address, type, label FROM data ",
		"where"		=> "WHERE var = ? ",
		"order"		=> array(
			"var"	=>	"ORDER BY var ASC, address ASC, time DESC",
			"label"	=>	"ORDER BY label ASC, time DESC"
		)
	),
	"read_by_address"	=> "SELECT value FROM data WHERE var = ? AND address = ? ORDER BY time DESC LIMIT 1",
	"read_by_label"		=> "SELECT var, address, type, value FROM data WHERE label = ? ORDER BY time DESC LIMIT 1",
	"write"				=> "INSERT INTO writes(var, address, type, value) VALUES (?, ?, ?, ?)"
);
?>