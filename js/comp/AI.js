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
            if (!mode) {
                return this.findBestMinimaxMove(board);
            }
            if (mode === "list") {
                return this.findBestMoveFromList(board);
            }
            return this.findRandomMove(board);
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
                for (var _i = 0; _i < possibleMoves.length; _i++) {
                    var _move = possibleMoves[_i];
                    var _boardWithNewMove = board.copyWithMove(symbols["computer"], _move.row, _move.cell);
                    var _currentMoveEval = this.evalMoveMinimax(_boardWithNewMove, -turn);
                    if (_currentMoveEval > bestMoveEval) {
                        bestMoveEval = _currentMoveEval;
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