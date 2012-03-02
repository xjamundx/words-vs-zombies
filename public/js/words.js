// words with bombs
// jamund ferguson
// nov. 2011

var LETTERS = {
	  a: {points: 1, count: 3}
	, b: {points: 1, count: 3}
	, c: {points: 1, count: 3}
	, d: {points: 1, count: 3}
	, e: {points: 1, count: 3}
	, f: {points: 1, count: 3}
	, g: {points: 1, count: 3}
	, h: {points: 1, count: 3}
	, i: {points: 1, count: 3}
	, j: {points: 1, count: 1}
	, k: {points: 1, count: 3}
	, l: {points: 1, count: 3}
	, m: {points: 1, count: 3}
	, n: {points: 1, count: 3}
	, o: {points: 1, count: 3}
	, p: {points: 1, count: 3}
	, q: {points: 1, count: 1}
	, r: {points: 1, count: 3}
	, s: {points: 1, count: 3}
	, t: {points: 1, count: 3}
	, u: {points: 1, count: 3}
	, v: {points: 1, count: 3}
	, w: {points: 1, count: 3}
	, x: {points: 1, count: 1}
	, y: {points: 1, count: 3}
	, z: {points: 1, count: 1}
	// , "☠": {points: 100, count: 100}
}
var $SQUARE = $('<div class="square"></div>')
var $TILE = $SQUARE.clone().html('<span class="letter"></span><span class="number"></span>')
var $TRAY = $('<div class="tray"></div>')
var NUM_SQUARES = 7
var NUM_TILES = 11

var numPlayers = 2
var players = []
var $board = $(".board")
var $trays = $(".trays")
var letters = []
var $current
var $currentTray
var game = {
	player: 0
}

populateLetters()
drawBoard()
makePlayers()
play()

$(".tray .square").live("click", function() {
	$current = $(this)
	if ($current.hasClass("active")) return $current.removeClass("active")
	$(".square").removeClass("active")
	var letter = $current.addClass("active").find(".letter").text()
	current = letter
})

$(".board .square").live("click", function() {
	if (!current) return
	var $square = $(this)
	if ($square.hasClass("played")) return
	$square.addClass("played").html($current.html()).addClass("inPlay")
	$current.remove()
})

$(".shuffle").live("click", function() {
	var $squares = $tray.find(".square")
	$squares.sort(randomish)
	$tray.empty()
	$squares.each(function() {
		$tray.append($(this))
	})
})

$(".recall").live("click", function() {
	var $letters = $(".inPlay")
	var $tray = $trays.find(".tray").eq(game.player)
	$letters.appendTo($tray)
})

$(".play").live("click", function() {
	// $tray = $current.closest(".tray")
	refreshLetters($tray)
	calcPoints()
	congratulate()
	play()
})

function play() {
	var player = players[game.player]
	nextMove(player)
	game.player++
	if (game.player === numPlayers) game.player = 0
	if ($currentTray) currentTray.removeClass("active")
	$currentTray = player.$tray.addClass("active")
}

function nextMove(player) {
	alert(player.name + "'s turn")
}

function calcPoints() {

}

function congratulate() {
	alert("Nice play")
}

function refreshLetters($tray) {
	var num = $tray.find(".square").length
	for (var i = num; i < NUM_SQUARES; i++) addSquareToPew($tray)
}

function makePlayers() {
	var player = {}
	for (var i = 1; i <= numPlayers; i++) {
		player = {
			name: "Player " + i
			, $tray: makeTray()
		}
		players.push(player)
	}
}

function drawBoard() {
	var i = NUM_TILES * NUM_TILES
	var middle = Math.floor(i / 2)
	var html = ""
	var $square
	while (i--) {
		$square = $SQUARE.clone()
		if (i === middle) $square.addClass("star").html("★")
		$board.append($square)
	}
}

function populateLetters() {
	for (var letter in LETTERS) {
		for (var i = 0; i < LETTERS[letter].count; i++) {
			letters.push(letter)
		}
	}
	
	letters.sort(randomish)
}

function randomish() {
	return 0.5 - Math.random()
}

function makeTray() {
	$tray = $TRAY.clone()
	$trays.append($tray)
	refreshLetters($tray)
	return $tray
}

function addSquareToPew($tray) {
	if (!letters.length) return gameOver()
	var $square = $TILE.clone()
	var letter = letters.shift()
	var num = LETTERS[letter].count
	$square.find(".letter").text(letter).end().find(".number").text(num)
	$tray.append($square)
}

function gameOver() {
	alert("All out of letters -- Game over!")
}
