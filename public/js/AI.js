"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AI = function () {
    function AI() {
        _classCallCheck(this, AI);
    }

    _createClass(AI, null, [{
        key: "findBestMove",
        value: function findBestMove(board, mode) {
            if (mode === "easy") {
                return this.findBestMoveFromList(board);
            } else if (mode === "medium") {
                return this.findRandomMove(board);
            } else if (mode === "hard") {
                return this.findLimitedMinimaxMove(board);
            } else {
                return this.findBestMinimaxMove(board);
            }
        }
    }, {
        key: "findLimitedMinimaxMove",
        value: function findLimitedMinimaxMove(board) {
            var possibleMoves = board.getBlankSquares();
            var bestMoves = [];
            var bestMoveEval = -2;
            for (var moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
                var move = possibleMoves[moveIndex];
                var boardWithNewMove = board.copyWithMove(symbols["computer"], move.row, move.cell);
                var minimaxEval = this.evalMoveLimitedMinimax(boardWithNewMove, -1, 0);
                if (minimaxEval > bestMoveEval) {
                    bestMoveEval = minimaxEval;
                    bestMoves = [move];
                } else if (minimaxEval == bestMoveEval) {
                    bestMoves.push(move);
                }
            }
            if (bestMoveEval == -2) {
                console.log("Something bad happened!");
                return null;
            }
            var bestMove = Utils.randomElementFromArray(bestMoves);
            return bestMove;
        }
    }, {
        key: "evalMoveLimitedMinimax",
        value: function evalMoveLimitedMinimax(board, turn, depth) {
            var MAX_DEPTH = 5; // 1 "Depth" is a move one way, 2 "depths" is one move from each side
            if (depth >= MAX_DEPTH) {
                return turn;
            }
            var possibleMoves = board.getBlankSquares();
            // Check for terminal states
            var gameState = board.getGameState();
            if (gameState !== symbols["blank"]) {
                return gameState == symbols["computer"] ? 1 : -1;
            }
            if (possibleMoves.length < 1) {
                return 0;
            }
            var bestMoveEval = 0;
            if (turn == -1) {
                // MINI
                bestMoveEval = 2;
                for (var i = 0; i < possibleMoves.length; i++) {
                    var move = possibleMoves[i];
                    var boardWithNewMove = board.copyWithMove(symbols["player"], move.row, move.cell);
                    var currentMoveEval = this.evalMoveLimitedMinimax(boardWithNewMove, -turn, depth + 1);
                    if (currentMoveEval < bestMoveEval) {
                        bestMoveEval = currentMoveEval;
                    }
                }
            } else {
                // MAX
                bestMoveEval = -2;
                for (var _i = 0; _i < possibleMoves.length; _i++) {
                    var _move = possibleMoves[_i];
                    var _boardWithNewMove = board.copyWithMove(symbols["computer"], _move.row, _move.cell);
                    var _currentMoveEval = this.evalMoveLimitedMinimax(_boardWithNewMove, -turn, depth + 1);
                    if (_currentMoveEval > bestMoveEval) {
                        bestMoveEval = _currentMoveEval;
                    }
                }
            }
            return bestMoveEval;
        }
    }, {
        key: "findBestMinimaxMove",
        value: function findBestMinimaxMove(board) {
            var possibleMoves = board.getBlankSquares();
            var bestMoves = [];
            var bestMoveEval = -2;
            for (var moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
                var move = possibleMoves[moveIndex];
                var boardWithNewMove = board.copyWithMove(symbols["computer"], move.row, move.cell);
                var minimaxEval = this.evalMoveMinimax(boardWithNewMove, -1);
                if (minimaxEval > bestMoveEval) {
                    bestMoveEval = minimaxEval;
                    bestMoves = [move];
                } else if (minimaxEval == bestMoveEval) {
                    bestMoves.push(move);
                }
            }
            if (bestMoveEval == -2) {
                console.log("Something bad happened!");
                return null;
            }
            var bestMove = Utils.randomElementFromArray(bestMoves);
            return bestMove;
        }
    }, {
        key: "evalMoveMinimax",
        value: function evalMoveMinimax(board, turn) {
            var possibleMoves = board.getBlankSquares();
            // Check for terminal states
            var gameState = board.getGameState();
            if (gameState !== symbols["blank"]) {
                return gameState == symbols["computer"] ? 1 : -1;
            }
            if (possibleMoves.length < 1) {
                return 0;
            }
            var bestMoveEval = 0;
            if (turn == -1) {
                // MINI
                bestMoveEval = 2;
                for (var i = 0; i < possibleMoves.length; i++) {
                    var move = possibleMoves[i];
                    var boardWithNewMove = board.copyWithMove(symbols["player"], move.row, move.cell);
                    var currentMoveEval = this.evalMoveMinimax(boardWithNewMove, -turn);
                    if (currentMoveEval < bestMoveEval) {
                        bestMoveEval = currentMoveEval;
                    }
                }
            } else {
                // MAX
                bestMoveEval = -2;
                for (var _i2 = 0; _i2 < possibleMoves.length; _i2++) {
                    var _move2 = possibleMoves[_i2];
                    var _boardWithNewMove2 = board.copyWithMove(symbols["computer"], _move2.row, _move2.cell);
                    var _currentMoveEval2 = this.evalMoveMinimax(_boardWithNewMove2, -turn);
                    if (_currentMoveEval2 > bestMoveEval) {
                        bestMoveEval = _currentMoveEval2;
                    }
                }
            }
            return bestMoveEval;
        }
    }, {
        key: "findBestMoveFromList",
        value: function findBestMoveFromList(board) {
            var favouredMoves = [{ row: 1, cell: 1 }, { row: 0, cell: 1 }, { row: 1, cell: 2 }, { row: 2, cell: 1 }, { row: 1, cell: 0 }, { row: 0, cell: 0 }, { row: 0, cell: 2 }, { row: 2, cell: 2 }, { row: 2, cell: 0 }];
            for (var moveIndex = 0; moveIndex < favouredMoves.length; moveIndex++) {
                var currentMove = favouredMoves[moveIndex];
                if (board.getSquare(currentMove.row, currentMove.cell) == symbols["blank"]) {
                    return currentMove;
                }
            }
            return null;
        }
    }, {
        key: "findRandomMove",
        value: function findRandomMove(board) {
            var blankSquares = board.getBlankSquares();
            return Utils.randomElementFromArray(blankSquares);
        }
    }]);

    return AI;
}();
//# sourceMappingURL=AI.js.map