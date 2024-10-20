<!doctype html public "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
<title>tor.blackpinguin.de Statistics</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta http-equiv="content-language" content="en">
<meta name="DC.Language" content="en">
<meta name="author" content="Robin Christopher Ladiges">
<meta name="DC.Creator" content="Robin Christopher Ladiges">
<meta name="robots" content="all">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
<link rel="stylesheet" title="Default (blue / yellow)" type="text/css" href="/stats.css">
<?php
include_once("/rcl/www/funktionen.php");
$year = get("year");
if($year === "current") { $year = (int) date("Y"); }
else if($year === "all" || (int)$year <= 2012){ $year = "all"; }

function printNav(){
  global $year;
  global $rcl;
  $first = 2013;
  $max = (int) date("Y");
  $see = 3;
  if($year === "all"){
    $n = $first - 1;
    if($first + $see === $max) { $see = 4; }
  }
  else {
    $n = $year;
    if($year - $see - 1 === $first) { $see = 4; }
  }
  $vor="<a class='round sub year' href='/";
  $vors="<div class='round sub year'>";
  $mitte="/'>";
  $nach="</a>";
  $nachs="</div>";
  //print :
  if($year === "all") echo $vors."all".$nachs;
  else echo $vor."all".$mitte."all".$nach;
  $rcl->page($max, $see, $n, $vor, $mitte, $nach, $first, $vors, $nachs);
}
?>
<script type="text/javascript" src="/data/<?php echo $year; ?>.js"></script>
<script type="text/javascript" src="/process.js"></script>
<script type="text/javascript" src="/util.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript">
google.load("visualization", "1", {packages:["corechart"], language: "en"});
google.setOnLoadCallback(init);
</script>
</head>
<body>
<div id="main">
	<div id="round" class="round">

		<!-- Title -->
		<div id="title" class="round sub">
			<?php printNav(); ?>
			tor.blackpinguin.de Statistics
			<a class="round sub imp" href="https://rcl.blackpinguin.de/legal">Impressum</a>
		</div>

		<!-- Settings -->
		<div class="round sub">
			<span class="header clear">Settings</span>
			<div id="smooth-div">
				<input id="smooth" type="range" min="1" max="20"/>
				<br/>
				<div>
					Smoothing: <span id="smooth-text">1</span>
					<br/>Total: <span id="smooth-total">1</span>
					<br/>Displayed: <span id="smooth-now">1</span>
				</div>
			</div>
			<br/>Nickname <a href="https://atlas.torproject.org/#details/BF09062A3C4E72873268CC68598132DF3431F43F" target="_blank" rel="noopener">blackpinguinDE</a>
			<br/>Address tor.blackpinguin.de
			<br/>DirPort 60001
			<br/>ORPort 60002
			<br/>RelayBandwidthRate 1024 KB (8 Mbps)
			<br/>RelayBandwidthBurst 1280 KB (10 Mbps)
			<br/>ExitPolicy reject *:* (this is not an exit node)
			<hr/>The data for these statistics is generated with a shell script from the heartbeats in the local <a href="https://www.torproject.org/" target="_blank" rel="noopener">Tor</a> logfile. It's visualized using the <a href="https://developers.google.com/chart/" target="_blank" rel="noopener">Google Chart Tools</a>.
		</div>

		<!-- Traffic -->
		<div class="round sub">
			<span class="header">Traffic</span>
			<div id="traffic" style="width:100%;height:400px;"></div>
		</div>

		<!-- Sent -->
		<div class="round sub">
			<span class="header">Data Sent</span>
			<div id="sent" style="width:100%;height:400px;"></div>
		</div>

		<!-- Received -->
		<div class="round sub">
			<span class="header">Data Received</span>
			<div id="received" style="width:100%;height:400px;"></div>
		</div>

		<!-- Sent Speed -->
		<div class="round sub">
			<span class="header">Sent Speed</span>
			<div id="sentspeed" style="width:100%;height:400px;"></div>
		</div>

		<!-- Reveived Speed -->
		<div class="round sub">
			<span class="header">Received Speed</span>
			<div id="receivedspeed" style="width:100%;height:400px;"></div>
		</div>

	</div>

	<!-- author -->
	<!-- author and creative commons licence information -->
	<div class="footer">
		<a id="w3c" title="Valid HTML 4.01 Transitional" href="http://validator.w3.org/check?uri=referer" target="_blank" rel="noopener"></a>
		This page was created by <a class="footer" href="https://rcl.blackpinguin.de/" target="_blank" rel="noopener">Robin&nbsp;Christopher&nbsp;Ladiges</a>
		<a id="cc" title="cc by-sa" href="https://creativecommons.org/licenses/by-sa/3.0/de/" target="_blank" rel="noopener"></a>
		<!-- This page (not the page and content it's linking to) is under creative commons by-sa 3.0 de license, you can read it here: https://creativecommons.org/licenses/by-sa/3.0/de/legalcode -->
	</div>

</div>

</body>
</html>
