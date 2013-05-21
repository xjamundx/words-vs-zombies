var app = angular.module('Words', []);

// tile directive
app.directive('tile', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/templates/square.html'
  }
})

// tray directive
app.directive('tray', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/templates/tray.html'
	}
});

// services to control the game
app.factory('game', function() {
	var game = {
		player: 1,
		isRunning: false,
		numPlayers: 2
	};
	return {
		end: function() {
			game.isRunning = false;
			game.player = 1;
		},
		start: function () {
			game.isRunning = true;
		},
		next: function() {
			game.player++; 
			if (game.player > game.numPlayers) game.player = 1;
		},
		game: game
	}
});

// service to control the bag
app.service('bag', function() {
	var letters = [];
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
    , '☠': {points: 100, count: 1}
	};

	function getTiles(num) {
		var tiles = [];
		var letter;
		for (var i = 0; i < num; i++) {
			letter = letters.pop();
			if (letter) tiles.push(letter);
		}
		return tiles;
	}

	function shuffle() {
		letters.sort(randomish);
	}

	function randomish() {
		return 0.5 - Math.random();
	}

	function getLetters() {
		var letters = [];
		for (var letter in LETTERS) {
			for (var i = 0; i < LETTERS[letter].count; i++) {
				letters.push({letter: letter, number: LETTERS[letter].points});
			}
		}
		return letters;
	}

	function returnTiles(tiles) {
		letters.concat(tiles.splice(0, tiles.length));
	}

	letters = getLetters();
	shuffle();

	return {
		letters: letters,
		shuffle: shuffle,
		getTiles: getTiles,
		returnTiles: returnTiles
	};

});

app.factory('trays', function() {
	return [{tiles:[]}, {tiles:[]}];
});
  
app.controller('BoardCtrl', function($scope) {
	
	var WIDTH = 11;
	var HEIGHT = 11;
	var NUM_TILES = WIDTH * HEIGHT;

	// model
	$scope.tiles = getTiles();
	$scope.selected = [];
	
	// actions
	$scope.pickLetter = function() {
		$scope.setTile(1, 1, $scope.letters[$scope.letters.length - 1]);
		return $scope.letters.pop();
	};
		
	$scope.setTile = function(x, y, letter) {
		$scope.tiles.splice(x * y - 1, 1, letter);
	};
	
	$scope.place = function(tile) {
		if (!tile) return;
		if (tile.status === 'played') return;
		var sel = $scope.selected[0];
 		tile.letter = sel.letter;
 		tile.number = sel.number;
 		tile.status = 'played';
 		$scope.selected[0] =  null; // remove selected tile
 		// $scope.activeTray.tiles.splice($scope.activeIndex, 1); // remove from tray
	};
	
	function getTiles() {
		var middle = Math.floor(NUM_TILES / 2);
		var tiles = [];
		for (var i = 0; i < NUM_TILES; i++) {
			tiles[i] = {};
		}
		tiles.splice(middle, 1, {letter: '☆'});
		return tiles;
	}
	
});

app.controller('BagCtrl', function($scope, bag) {
	$scope.letters = bag.letters;
	$scope.shuffle = function() {
		bag.shuffle();
	}
});

app.controller('TraysCtrl', function($scope, game, bag, trays) {

	var TILES_PER_TRAY = 7;

	$scope.trays = trays;

	$scope.shuffle = function() {
		$scope.trays[game.game.player - 1].tiles.sort(function() {
			return 0.5 - Math.random();
		})
	};

	$scope.refill = function(tray) {
		var needed = Math.max(TILES_PER_TRAY - tray.tiles.length, 0)
		var tiles = bag.getTiles(needed);
		tray.tiles = tray.tiles.concat(tiles);
	};

	$scope.play = function() {
		$scope.trays.forEach(function(tray) {
			$scope.refill(tray);
		});

		// kinda weird
		$scope.startGame();
	};

	$scope.end = function() {
		// return all the times
		$scope.trays.forEach(function(tray) {
			bag.returnTiles(tray.tiles);
		});

		// kinda weird
		$scope.endGame();
	};

	function clearAll() {
		$scope.trays[game.game.player - 1].tiles.forEach(function(tile) {
			tile.selected = false;
		});
	};
	
	$scope.select = function(tile) {
		clearAll();
		tile.selected = !tile.selected;
	};

	$scope.fill = function($index) {
		$scope.refill($scope.trays[$index]);
	};

});

app.controller('GameCtrl', function($scope, game) {

	// adding the service to the scope
	$scope.game = game.game;

	$scope.next = function() {
		game.next();
	};

	$scope.endGame = function() {
		game.end();
	};

	$scope.startGame = function() {
		game.start();
	};

});