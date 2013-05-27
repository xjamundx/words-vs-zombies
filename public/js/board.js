var app = angular.module('Words', []);

// tile directive
app.directive('tile', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: true,
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

app.directive('dragtile', function () {
  return {
    restrict: 'A',
    scope: {
    	item: '=dragtile'
    },
    link: function (scope, elem, attr, ctrl) {
      elem.prop('draggable', true);
      elem.bind('dragstart', function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', angular.toJson(scope.tile));
      });
      elem.bind('dragleave', function (e) {});
      elem.bind('dragend', function (e) {
        e.preventDefault(); // firefox
      	if (e.dataTransfer.dropEffect === 'move') {
      		scope.removeTile(scope.$index);
      		scope.$apply();
      	}
      });
    }
  };
});

app.directive('droptile', function () {
  return {
    scope: {
      items: '=droptile'
    },
		controller: function($scope, $element, $attrs) {
			$scope.placeTile = function(tile) {
				$scope.tile = tile;
				$scope.$apply(); // seems needed for async stuff
			};
		},
    link: function (scope, elem, attr) {
      elem.bind('drop', function (e) {
        e.preventDefault(); // firefox
        var data = angular.fromJson(e.dataTransfer.getData('text'));
        scope.placeTile(data);
        elem.addClass('played');
        return false;
      });
      elem.bind('dragover', function (e) {
          e.preventDefault();
          return false;
      });
      elem.bind('dragleave', function (e) {});
      elem.bind('dragenter', function (e) {});
    }
  };
});

// services to control the game
app.factory('game', function() {
	var game = {
		player: 1,
		isRunning: false,
		numPlayers: 2,
    currentScore: 0,
    scores: [0,0]
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
app.factory('bag', function() {
	var letters = [], LETTERS = [];

  // setup the letters
  for (var i = 97; i <= 122; i++) {
    LETTERS[String.fromCharCode(i)] = {points: Math.ceil(Math.random() * 10), count: 3};
  }
  LETTERS['☠'] = {points: 100, count: 1};

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
	};
});

app.controller('TraysCtrl', function($scope, game, bag, trays) {

	var TILES_PER_TRAY = 7;
  var currentScore = 0;

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

	$scope.start = function() {
		$scope.trays.forEach(function(tray) {
			$scope.refill(tray);
		});

		// kinda weird
		$scope.$parent.start();
	};

	$scope.end = function() {
		// return all the times
		$scope.trays.forEach(function(tray) {
			bag.returnTiles(tray.tiles);
		});

		// kinda weird
		$scope.$parent.end();
	};

  $scope.next = function() {
    $scope.refill($scope.trays[game.game.player - 1]);
    game.game.scores[game.game.player - 1] += game.game.currentScore;
    game.game.currentScore = 0;

    // kinda weird
    $scope.$parent.next();
  };

  $scope.removeTile = function($index) {
    // there's got to be an easier way to get here
    var currentTile = $scope.trays[game.game.player - 1].tiles[$index];
    game.game.currentScore += currentTile.number;
    delete $scope.trays[game.game.player - 1].tiles.splice($index, 1);
  };

});

app.controller('GameCtrl', function($scope, game) {

	// adding the service to the scope
	$scope.game = game.game;
  $scope.scores = game.game.scores;

	$scope.next = function() {
		game.next();
	};

	$scope.end = function() {
		game.end();
	};

	$scope.start = function() {
		game.start();
	};

});