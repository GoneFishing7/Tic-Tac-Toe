"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
    function Board(mode) {
        _classCallCheck(this, Board);

        this.squares = [];
        if (mode == "DEBUG") {
            this.initDebugBoard();
        } else {
            this.initSquares();
        }
    }

    _createClass(Board, [{
        key: "initSquares",
        value: function initSquares() {
            this.squares = [];
            for (var rowIndex = 0; rowIndex < 3; rowIndex++) {
                var row = [];
                for (var cellIndex = 0; cellIndex < 3; cellIndex++) {
                    row.push(symbols["blank"]);
                }
                this.squares.push(row);
            }
        }
    }, {
        key: "initDebugBoard",
        value: function initDebugBoard() {
            this.squares = [[symbols["player"], symbols["blank"], symbols["computer"]], [symbols["computer"], symbols["blank"], symbols["blank"]], [symbols["computer"], symbols["player"], symbols["player"]]];
        }
    }, {
        key: "getGameState",
        value: function getGameState() {
            for (var symbolOwner in symbols) {
                if (symbols.hasOwnProperty(symbolOwner)) {
                    var currentSymbol = symbols[symbolOwner];
                    if (currentSymbol == "blank") {
                        continue;
                    }
                    // Check rows
                    for (var rowIndex = 0; rowIndex < this.squares.length; rowIndex++) {
                        var row = this.squares[rowIndex];
                        if (row[0] == currentSymbol && row[1] == currentSymbol && row[2] == currentSymbol) {
                            return currentSymbol;
                        }
                    }
                    // Check cols
                    for (var colIndex = 0; colIndex < this.squares[0].length; colIndex++) {
                        if (this.squares[0][colIndex] == currentSymbol && this.squares[1][colIndex] == currentSymbol && this.squares[2][colIndex] == currentSymbol) {
                            return currentSymbol;
                        }
                    }
                    // Check top left diag
                    if (this.squares[0][0] == currentSymbol && this.squares[1][1] == currentSymbol && this.squares[2][2] == currentSymbol) {
                        return currentSymbol;
                    }
                    // Check bottom left diag
                    if (this.squares[2][0] == currentSymbol && this.squares[1][1] == currentSymbol && this.squares[0][2] == currentSymbol) {
                        return currentSymbol;
                    }
                }
            }
            return symbols["blank"];
        }
    }, {
        key: "setSquare",
        value: function setSquare(square, row, cell) {
            this.squares[row][cell] = square;
        }
    }, {
        key: "getSquare",
        value: function getSquare(row, cell) {
            return this.squares[row][cell];
        }
    }, {
        key: "getBlankSquares",
        value: function getBlankSquares() {
            var blankSquares = [];
            for (var rowIndex = 0; rowIndex < this.squares.length; rowIndex++) {
                for (var cellIndex = 0; cellIndex < this.squares[rowIndex].length; cellIndex++) {
                    if (this.squares[rowIndex][cellIndex] == symbols["blank"]) {
                        blankSquares.push({ row: rowIndex, cell: cellIndex });
                    }
                }
            }
            return blankSquares;
        }
    }, {
        key: "copyWithMove",
        value: function copyWithMove(symbol, row, cell) {
            var newBoard = new Board();
            for (var rowIndex = 0; rowIndex < this.squares.length; rowIndex++) {
                for (var cellIndex = 0; cellIndex < this.squares.length; cellIndex++) {
                    newBoard.setSquare(this.squares[rowIndex][cellIndex], rowIndex, cellIndex);
                }
            }
            newBoard.setSquare(symbol, row, cell);
            return newBoard;
        }
    }, {
        key: "toString",
        value: function toString() {
            var horizontalLine = "-------------\n";
            var returnString = "\n    1   2   3\n  " + horizontalLine;
            /*
             *     1   2   3
             *   -------------
             * 1 | - | - | - |
             *   -------------
             * 2 | - | - | - |
             *   -------------
             * 3 | - | - | - |
             *   -------------
             * 
                   */
            for (var i = 0; i < this.squares.length; i++) {
                returnString += i + 1 + " |";
                for (var j = 0; j < this.squares[i].length; j++) {
                    returnString += " " + this.getSquare(j, i) + " |";
                }
                returnString += "\n  " + horizontalLine;
            }
            return returnString;
        }
    }]);

    return Board;
}();
//# sourceMappingURL=Board.js.map