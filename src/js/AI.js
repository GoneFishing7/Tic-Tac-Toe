class AI {
    static findBestMove(board, mode) {
        if (mode === "easy") {
            return this.findBestMoveFromList(board);
        } else if (mode === "medium") {
            return this.findRandomMove(board);
        } else if (mode === "hard") {
            return this.findBestMoveBadAI(board);
        } else {
            return this.findBestMinimaxMove(board);
        }
    }

    static findBestMoveBadAI(board) {
        let possibleMoves = board.getBlankSquares();
        if (board.getGameState() !== symbols['blank'] || possibleMoves.length == 0) {
            return null;
        }
        let winningMoves = [];
        let nonLosingMoves = [];
        let losingMoves = [];
        moveLoop:
        for (const move of possibleMoves) {
            let boardWithNewMove = board.copyWithMove(symbols['computer'], move.row, move.cell);
            let gameState = boardWithNewMove.getGameState();
            if (gameState === symbols['computer']) {
                winningMoves.push(move);
                continue;
            }
            let possiblePlayerResponses = boardWithNewMove.getBlankSquares();
            for (const playerResponse of possiblePlayerResponses) {
                let boardWithPlayerResponse = boardWithNewMove.copyWithMove(symbols['player'], playerResponse.row, playerResponse.cell);
                let gameStateWithPlayerMove = boardWithPlayerResponse.getGameState();
                if (gameStateWithPlayerMove === symbols['player']) {
                    losingMoves.push(move);
                    continue moveLoop;
                }
            }
            nonLosingMoves.push(move);
        }
        console.log({ winningMoves, nonLosingMoves, losingMoves });
        if (winningMoves.length > 0) {
            return Utils.randomElementFromArray(winningMoves);
        } else if (nonLosingMoves.length > 0) {
            return Utils.randomElementFromArray(nonLosingMoves);
        } else if (losingMoves.length > 0) {
            return Utils.randomElementFromArray(losingMoves);
        }
        // No moves
        return null
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
        let favouredMoves = [{
                row: 1,
                cell: 1
            },
            {
                row: 0,
                cell: 1
            },
            {
                row: 1,
                cell: 2
            },
            {
                row: 2,
                cell: 1
            },
            {
                row: 1,
                cell: 0
            },
            {
                row: 0,
                cell: 0
            },
            {
                row: 0,
                cell: 2
            },
            {
                row: 2,
                cell: 2
            },
            {
                row: 2,
                cell: 0
            },
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