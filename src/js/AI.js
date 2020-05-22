class AI {
    static findBestMove(board, mode) {
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

    static findLimitedMinimaxMove(board) {
        let possibleMoves = board.getBlankSquares();
        let bestMoves = [];
        let bestMoveEval = -2;
        for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
            let move = possibleMoves[moveIndex]
            let boardWithNewMove = board.copyWithMove(symbols["computer"], move.row, move.cell);
            let minimaxEval = this.evalMoveLimitedMinimax(boardWithNewMove, -1, 0);
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
        let bestMove = Utils.randomElementFromArray(bestMoves);
        return bestMove;
    }

    static evalMoveLimitedMinimax(board, turn, depth) {
        const MAX_DEPTH = 5; // 1 "Depth" is a move one way, 2 "depths" is one move from each side
        if (depth >= MAX_DEPTH) {
            return turn;
        }
        let possibleMoves = board.getBlankSquares();
        // Check for terminal states
        let gameState = board.getGameState();
        if (gameState !== symbols["blank"]) {
            return gameState == symbols["computer"] ? 1 : -1;
        }
        if (possibleMoves.length < 1) {
            return 0;
        }
        let bestMoveEval = 0;
        if (turn == -1) {
            // MINI
            bestMoveEval = 2;
            for (let i = 0; i < possibleMoves.length; i++) {
                let move = possibleMoves[i];
                let boardWithNewMove = board.copyWithMove(symbols["player"], move.row, move.cell);
                let currentMoveEval = this.evalMoveLimitedMinimax(boardWithNewMove, -turn, depth+1);
                if (currentMoveEval < bestMoveEval) {
                    bestMoveEval = currentMoveEval;
                }
            }
        } else {
            // MAX
            bestMoveEval = -2;
            for (let i = 0; i < possibleMoves.length; i++) {
                let move = possibleMoves[i];
                let boardWithNewMove = board.copyWithMove(symbols["computer"], move.row, move.cell);
                let currentMoveEval = this.evalMoveLimitedMinimax(boardWithNewMove, -turn, depth+1);
                if (currentMoveEval > bestMoveEval) {
                    bestMoveEval = currentMoveEval;
                }
            }
        }
        return bestMoveEval;
    }

    static findBestMinimaxMove(board) {
        let possibleMoves = board.getBlankSquares();
        let bestMoves = [];
        let bestMoveEval = -2;
        for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex++) {
            let move = possibleMoves[moveIndex]
            let boardWithNewMove = board.copyWithMove(symbols["computer"], move.row, move.cell);
            let minimaxEval = this.evalMoveMinimax(boardWithNewMove, -1);
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
        let bestMove = Utils.randomElementFromArray(bestMoves);
        return bestMove;
    }

    static evalMoveMinimax(board, turn) {
        let possibleMoves = board.getBlankSquares();
        // Check for terminal states
        let gameState = board.getGameState();
        if (gameState !== symbols["blank"]) {
            return gameState == symbols["computer"] ? 1 : -1;
        }
        if (possibleMoves.length < 1) {
            return 0;
        }
        let bestMoveEval = 0;
        if (turn == -1) {
            // MINI
            bestMoveEval = 2;
            for (let i = 0; i < possibleMoves.length; i++) {
                let move = possibleMoves[i];
                let boardWithNewMove = board.copyWithMove(symbols["player"], move.row, move.cell);
                let currentMoveEval = this.evalMoveMinimax(boardWithNewMove, -turn);
                if (currentMoveEval < bestMoveEval) {
                    bestMoveEval = currentMoveEval;
                }
            }
        } else {
            // MAX
            bestMoveEval = -2;
            for (let i = 0; i < possibleMoves.length; i++) {
                let move = possibleMoves[i];
                let boardWithNewMove = board.copyWithMove(symbols["computer"], move.row, move.cell);
                let currentMoveEval = this.evalMoveMinimax(boardWithNewMove, -turn);
                if (currentMoveEval > bestMoveEval) {
                    bestMoveEval = currentMoveEval;
                }
            }
        }
        return bestMoveEval;
    }

    static findBestMoveFromList(board) {
        let favouredMoves = [
            {row: 1, cell: 1},
            {row: 0, cell: 1},
            {row: 1, cell: 2},
            {row: 2, cell: 1},
            {row: 1, cell: 0},
            {row: 0, cell: 0},
            {row: 0, cell: 2},
            {row: 2, cell: 2},
            {row: 2, cell: 0},
        ];
        for (let moveIndex = 0; moveIndex < favouredMoves.length; moveIndex++) {
            const currentMove = favouredMoves[moveIndex];
            if (board.getSquare(currentMove.row, currentMove.cell) == symbols["blank"]) {
                return currentMove;
            }
        }
        return null;
    }
    
    static findRandomMove(board) {
        let blankSquares = board.getBlankSquares();
        return Utils.randomElementFromArray(blankSquares);
    }
}