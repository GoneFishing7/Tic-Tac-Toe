class Board {

    constructor(mode) {
        this.squares = [];
        if (mode == "DEBUG") {
            this.initDebugBoard();
        } else {
            this.initSquares();
        }
    }

    initSquares() {
        this.squares = [];
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            let row = [];
            for (let cellIndex = 0; cellIndex < 3; cellIndex++) {
                row.push(symbols["blank"]);
            }
            this.squares.push(row);
        }
    }

    initDebugBoard() {
        this.squares = [
            [symbols["player"],     symbols["blank"],   symbols["computer"]],
            [symbols["computer"],   symbols["blank"],   symbols["blank"]],
            [symbols["computer"],   symbols["player"],  symbols["player"]]
        ]
    }

    getGameState() {
        for (const symbolOwner in symbols) {
            if (symbols.hasOwnProperty(symbolOwner)) {
                const currentSymbol = symbols[symbolOwner];
                if (currentSymbol == "blank") {
                    continue;
                }
                // Check rows
                for (let rowIndex = 0; rowIndex < this.squares.length; rowIndex++) {
                    const row = this.squares[rowIndex];
                    if (row[0] == currentSymbol && row[1] == currentSymbol && row[2] == currentSymbol) {
                        return currentSymbol;
                    }
                }
                // Check cols
                for (let colIndex = 0; colIndex < this.squares[0].length; colIndex++) {
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
    
    setSquare(square, row, cell) {
        this.squares[row][cell] = square;
    }
    
    getSquare(row, cell) {
        return this.squares[row][cell];
    }

    getBlankSquares() {
        let blankSquares = [];
        for (let rowIndex = 0; rowIndex < this.squares.length; rowIndex++) {
            for (let cellIndex = 0; cellIndex < this.squares[rowIndex].length; cellIndex++) {
                if (this.squares[rowIndex][cellIndex] == symbols["blank"]) {
                    blankSquares.push({row: rowIndex, cell: cellIndex});
                }
            }
        }
        return blankSquares;
    }

    copyWithMove(symbol, row, cell) {
        let newBoard = new Board();
        for (let rowIndex = 0; rowIndex < this.squares.length; rowIndex++) {
            for (let cellIndex = 0; cellIndex < this.squares.length; cellIndex++) {
                newBoard.setSquare(this.squares[rowIndex][cellIndex], rowIndex, cellIndex);
            }
        }
        newBoard.setSquare(symbol, row, cell);
        return newBoard;
    }

    toString() {
        let horizontalLine = "-------------\n";
		let returnString = "\n    1   2   3\n  " + horizontalLine;
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
		for (let i = 0; i < this.squares.length; i++) {
			returnString += (i+1) + " |";
			for (let j = 0; j < this.squares[i].length; j++) {
				returnString += " " + this.getSquare(j, i) + " |"; 
			}
			returnString += "\n  " + horizontalLine;
		}
		return returnString;
    }
}