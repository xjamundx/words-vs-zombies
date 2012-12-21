angular.module("Words", []).
  directive('tile', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="square"><span class="letter">{{tile.letter}}</span><span class="number">{{tile.number}}</span></div>'
    }
});
  
function BoardCtrl($scope) {

	'use strict';
	
	var selected = null;
	var WIDTH = 11;
	var HEIGHT = 11;
	var NUM_TILES = WIDTH * HEIGHT;
	var TILES_PER_TRAY = 7;
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
	    , "☠": {points: 100, count: 1}
	}
	
	// model
	$scope.tiles = getTiles();	
	$scope.letters = getLetters();
	$scope.trays = [{tiles:[]}, {tiles:[]}];

	// actions
	$scope.pickLetter = function() {
		$scope.setTile(1, 1, $scope.letters[$scope.letters.length - 1]);
		return $scope.letters.pop();
	};
	
	$scope.refill = function(tray) {
		var needed = Math.max(TILES_PER_TRAY - tray.tiles.length, 0)
		var tiles = getYourTiles(needed);
		tray.tiles = tray.tiles.concat(tiles);
	};
	
	$scope.setTile = function(x, y, letter) {
		$scope.tiles.splice(x * y - 1, 1, letter);
	};
	
	$scope.shuffle = function() {
		$scope.letters.sort(randomish);
	};
	
	$scope.place = function(tile) {
		if (!tile) return;
 		tile = {letter: selected.letter, number: selected.number};
	};
	
	$scope.select = function(tiles, tile) {
		tiles.forEach(function(t) {
			t.selected = false;
		});
		tile.selected = !tile.selected;
		selected = tile.selected ? tile : null;
	};
	
	$scope.distribute = function() {
		$scope.letters.forEach(function(letter, i) {
			$scope.tiles[i] = $scope.letters.pop();
		});
		$scope.shuffle();
	};
	
	function getYourTiles(num) {
		num =  typeof num !== "undefined" ? num : TILES_PER_TRAY;
		var tiles = [];
		var letter;
		for (var i = 0; i < num; i++) {
			letter = $scope.letters.pop()
			if (letter) tiles.push(letter);
		}
		return tiles;
	}
	
	function getLetters() {
		var letters = [];
		for (var letter in LETTERS) {
			for (var i = 0; i < LETTERS[letter].count; i++) {
				letters.push({letter: letter, number: LETTERS[letter].points});
			}
		}
		letters.sort(randomish);
		return letters;
	}
	
	function randomish() {
		return 0.5 - Math.random();
	}
	
	function getTiles() {
		var middle = Math.floor(NUM_TILES / 2);
		var tiles = [];
		for (var i = 0; i < NUM_TILES; i++) {
			tiles[i] = {};
		}
		tiles.splice(middle, 1, {letter: "☆"});
		return tiles;
	}
	
}