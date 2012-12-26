angular.module("Words", []).
  directive('tile', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="square"><span class="letter">{{tile.letter}}</span><span class="number">{{tile.number}}</span></div>'
    }
  }).
  directive('tray', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="tray"><h1 class="a">Player {{$index + 1}}</h1>' +
				'	<tile ng-repeat="tile in tray.tiles" ng-click="select(tile)" />' +
				'</div>'	  
	}
});
  
function BoardCtrl($scope) {

	'use strict';
	
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
	$scope.selected = [];
	$scope.activeTray = null;
	$scope.activeIndex = 0;
	$scope.isRunning = false;
	$scope.player = 1;
	$scope.numPlayers = 2;
	
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
	
	$scope.endGame = function() {
		$scope.isRunning = false;
	}
	
	$scope.next = function() {
		$scope.player++;
		if ($scope.player > $scope.numPlayers) $scope.player = 1;
	}
	
	$scope.place = function(tile) {
		if (!tile) return;
		var sel = $scope.selected[0];
		// some sort of _.extend would be better
 		tile.letter = sel.letter;
 		tile.number = sel.number;
 		$scope.selected[0] =  null; // remove selected tile
 		$scope.activeTray.tiles.splice($scope.activeIndex, 1); // remove from tray
	};
	
	$scope.select = function(tile) {
		var wasSelected = tile.selected;
		$scope.activeTray = this.$parent.tray;
		$scope.activeIndex = this.$index;
		this.$parent.tiles.forEach(function(t) {
			t.selected = false;
		});
		tile.selected = !wasSelected;
		$scope.selected[0] = tile.selected ? tile : null;
	};
	
	$scope.startGame = function() {
		$scope.isRunning = true;
		$scope.trays.forEach(function(tray, i) {
			$scope.refill(tray);
		});
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