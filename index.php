<?php
$clientPath = './';
$clientLibPath = '../js/disco-0.2.1a/inc/';
$cssPath = $clientPath . 'css/';
$jsPath = $clientPath . 'js/';
$generalJsPath = '../js/';

$discoUri = isset($_GET['disco']) ? $_GET['disco'] : '//test.disco-network.org/api/odata';
?>

<!doctype html>
<html manifest="manifest.manifest">
	<head>
		<title>qKonsens - d!sco in action</title>
		<link rel="shortcut icon" href="<?php echo $clientPath ?>qkonsens2.ico" />
		<link rel="stylesheet" href="<?php echo $cssPath ?>reset.css" />
		<link rel="stylesheet" href="<?php echo $cssPath ?>frame.css" />
		<link rel="stylesheet" href="<?php echo $cssPath ?>style.css" />
	</head>
	<body>
		<!--div id="wrapper">
			<div id="usermgt">
				<label for="username">Username: </label><input id="username" type="text" data-bind="value: userName" />
			</div>
			<div id="top">
				<h1><span class="logo-q">q</span><span class="logo-consense">Konsens</span> <i>Proof-of-Concept</i></h1>
				<ul id="nav" data-bind="foreach: tabs"><li>
					<a data-bind="text: title, click: $parent.selectedTab.bind(null,$data), attr: { class: $data == $parent.selectedTab() ? 'selected tabitem' : 'tabitem' }"> </a>
				</li></ul>
			</div>
			<input type="checkbox" id="modmode" data-bind="checked: isAdmin" /><label for="modmode">Moderationsmodus</label>
			<div id="main" data-bind="with: selectedTab">
				<div data-bind="template: { name: type + '-tab-template' }"></div>
			</div>
		</div-->
		
		<div id="page">
			<div id="header">
				<span class="logo-q">q</span><span class="logo-consense">Konsens</span> <i>Proof-of-Concept</i>
				<span id="usermgt">
					<label for="username">Username: </label><input id="username" type="text" data-bind="value: userName" />
				</span>
				<input type="checkbox" id="modmode" data-bind="checked: isAdmin" /><label for="modmode">Moderationsmodus</label>
			</div>
			<div id="main">
				<div       class="win" id="center" data-bind="with: center">
				<!-- ko with: win --><!-- ko template: { name: viewTemplate } -->
				<!-- /ko --><!-- /ko -->
				</div><div class="win" id="left"   data-bind="with: left">
				<!-- ko with: win --><!-- ko template: { name: viewTemplate } -->
				<!-- /ko --><!-- /ko -->
				</div><div class="win" id="right"  data-bind="with: right">
				<!-- ko with: win --><!-- ko template: { name: viewTemplate } -->
				<!-- /ko --><!-- /ko -->
				</div>
			</div>
			<div id="footer">
				by <a href="//wiki.piratenpartei.de/AG_Meinungsfindungstool">AG Meinungsfindungstool</a>
			</div>
		</div>
		
		<script type="text/html" id="kk-win-template">
			<h1>
				Konsenskiste
				<span class="description" data-bind="text: documentView() ? 'Dokumentansicht' : 'Detailansicht'"></span>
				<a class="description" class="clickable" data-bind="click: function() { documentView.mapValue(function(x) { return !x }) }">wechseln</a>
			</h1>
			<div data-bind="template: { name: documentView() ? 'document-template' : 'qkelem-template', data: kkView }"></div>
		</script>
		
		<script type="text/html" id="browse-win-template">
			<h1>Themen</h1>
			<!-- ko with: parentTopicView -->
			<div>
				<ul data-bind="foreach: breadcrumb"><!-- ko with: $parent.breadcrumbTopicView($data) -->
					<li class="clickable" data-bind="text: caption, click: click"></li>
				<!-- /ko --></ul>
				
				<b data-bind="text: title"></b>
				<p data-bind="text: text"></p>
				
				<ul data-bind="foreach: children"><!-- ko with: $parent.childTopicView($data) -->
					<li class="clickable" data-bind="text: caption, click: click"></li>
				<!-- /ko --></ul>
			</div>
			<h1>Konsenskisten zum Thema</h1>
			<div>
					<ul data-bind="">
						<!-- ko foreach: kks --><!-- ko with: $parent.kkView($data) -->
							<li class="clickable" data-bind="text: caption, click: click"></li>
						<!-- /ko --><!-- /ko -->
						<li data-bind="if: $root.isAdmin">
							<a data-bind="click: newKk.onClick">Neu</a>
						</li>
					</ul>
				</div>
			</div>
			<!-- /ko -->
		</script>
		
		<script type="text/html" id="newkk-win-template">
			<h1>
				<span data-bind="template: { name: 'historybar-template' }"></span>
				Neue Konsenskiste <span class="description">in <span data-bind="text: parentDescription"></span></span></h1>
			<div>
				<p><input class="block" type="text" placeholder="Titel" data-bind="value: title" /></p>
				<p><textarea class="block" placeholder="Kurzbeschreibung" data-bind="value: text"></textarea></p>
				<button data-bind="click: submit_onClick">Los</button>
			</div>
		</script>
		
		<script type="text/html" id="editor-win-template">
			<span data-bind="text: console.log($data, $parent)"></span>
			<h1>
				<span data-bind="template: { name: 'historybar-template' }"></span>
				Bearbeiten
			</h1>
			<div>
				<p>
					<input class="block" type="text" placeholder="Titel" data-bind="value: input().title" />
					<textarea class="block" placeholder="Text" data-bind="value: input().text"></textarea>
					<button data-bind="click: save_onClick">Titel und Text speichern</button>
				</p>
				<p>
					<textarea class="block" placeholder="Klärtext" data-bind="value: input().context"></textarea>
					<button data-bind="click: saveContext_onClick">Klärtext speichern</button>
				</p>
			</div>
		</script>
		
		<script type="text/html" id="discussion-win-template">
			<h1>
				<span data-bind="template: { name: 'historybar-template' }"></span>
				Diskussion
			</h1>
			<h2 data-bind="text: parent().title()"></h2>
			<p data-bind="text: parent().text()"></p>
			<!-- ko foreach: parent().comments -->
			<div data-bind="template: { name: 'comment-template', data: $parent.cmtView($data) }"></div>
			<!-- /ko -->
			
			<div class="cmt">
				<form data-bind="event: { submit: function() { submitComment_onClick(); return false; } }">
					<p><textarea maxlength="250" placeholder="Dein Beitrag" data-bind="value: newCommentText, attr: { disabled: newCommentDisabled }"></textarea></p>
					<input type="submit" value="Beitrag abschicken" data-bind="attr: { disabled: newCommentDisabled }" />
				</form>
			</div>
		</script>
		
		<script type="text/html" id="start-win-template">
			<h1>Disclaimer</h1>
			<p>
			Dies ist nicht der fertige qKonsens! Es handelt sich lediglich um eine sogenannte "Proof-of-Concept"-Version.
			Es geht uns darum, die grundlegende Funktionsweise des qKonsens darzustellen und es ist gut möglich, dass noch einige Komfort-Funktionen fehlen.
			Diverse Browser (*hust* IE *hust*) sind noch nicht unterstützt.
			</p>
			<p>Danke für euer Verständnis und eure Geduld!</p>
			<p>
			Außerdem ist es wichtig zu beachten, dass die hier verwendeten Testdaten <b>nicht</b> zur Meinungsbildung gedacht sind,
			sondern lediglich dazu, das Konzept zu veranschaulichen. Daher stellen sie auch nicht die Meinung der Autoren dar.
			</p>
					
			<h1>Von wem stammt dieser Prototyp?</h1>
			<p>
				Von der AG Meinungsfindungstool, die Diskussionen und Diskussionsplattformen im Internet verbessern und optimieren will.
				Obwohl wir offiziell eine Arbeisgemeinschaft der Piratenpartei sind, sind viele AG-Mitglieder vond der Piratenpartei
				unabhängig und damit auch die AG. Wenn du mithelfen willst, dann schau doch mal <a href="http://wiki.piratenpartei.de/AG_Meinungsfindungstool">hier</a> vorbei!
			</p>
		</script>
		
		<script type="text/html" id="document-template">
			<div>
				<h1 data-bind="text: title()"></h1>
				<!-- ko foreach: (children && children()) || [] -->
					<p data-bind="text: text()"></p>
				<!-- /ko -->
			</div>
		</script>
		
		<script type="text/html" id="comment-template">
			<div class="cmt">
				<!-- ko if: $root.isAdmin -->
					<a class="clickable symbol" style="float: right" data-bind="click: remove_onClick">x</a>
				<!-- /ko -->
				<!-- ko if: title() && title().length -->
					<h1 class="title" data-bind="text: title"></h1>
				<!-- /ko -->
				<p><span class="text" data-bind="text: text"></span></p>
				<!-- ko template: { name: 'likerating-template' } --><!-- /ko -->
			</div>
		</script>
		
		<script type="text/html" id="likerating-template">
			<div class="select rating control">
				<input type="radio" name="rating" value="like" data-bind="checked: likeRating(), click: like_onClick('like'), attr: { name: id + '-rating', id: id + '-like' }" /><label
				data-bind="attr: { for: id + '-like' }">+<span class="count" data-bind="text: likeSum() + stronglikeSum()"></span></label><input
				type="radio" name="rating" value="dislike" data-bind="checked: likeRating(), click: like_onClick('dislike'), attr: { name: id + '-rating', id: id + '-dislike' }" /><label
				data-bind="attr: { for: id + '-dislike' }">-<span class="count" data-bind="text: dislikeSum() + strongdislikeSum()"></span></label>
			</div>
		</script>
		
		<script type="text/html" id="context-template">
			<div class="cxt">
				<p><span class="text" data-bind="text: $data"></span></p>
			</div>
		</script>
		
		<script type="text/javascript" src="<?php echo $generalJsPath ?>disco-0.2.1a/dev/disco.core.js"></script>
		<script src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
		<script src="http://test.disco-network.org/discoarguments/Scripts/knockout-3.1.0.debug.js"></script>
		<script src="<?php echo $jsPath ?>koExternalTemplateEngine_all.js"></script>
		<script src="http://test.disco-network.org/discoarguments/Scripts/datajs-1.1.2.js"></script>
		<script src="http://test.disco-network.org/discoarguments/Scripts/jaydata.js"></script>
		<script src="http://test.disco-network.org/discoarguments/Scripts/jaydataproviders/oDataProvider.js"></script>
		<script src="<?php echo $jsPath ?>disco.ontology.js"></script>
		<script type="text/javascript">
			var discoUri = '<?php echo $discoUri ?>', serviceUri = '<?php echo $clientPath ?>';
			var knockoutUri = 'http://test.disco-network.org/discoarguments/Scripts/knockout-3.1.0.debug';
		</script>
		<script data-main="js/index" src="<?php echo $jsPath ?>require.js"></script>
	</body>
</html>