<?php

function doc($file)
{
	include "doc/header.html";
	
	include "doc/" . $file . ".html";
	
	include "doc/footer.html";
	die();
}

?>