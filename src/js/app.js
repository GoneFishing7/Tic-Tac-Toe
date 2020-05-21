// NOTE: This may be the most hacky program I've ever made.
var symbols = {
    "player": null,
    "computer": null,
    "blank": " "
}

var movingFirstInput;
var movingFirst;
var board;
var turn;
var gameOver;
var playerIsOForNextGame;
const DEBUG_MODE = false;

$(document).ready(function () {
    updateMode()
    // Transition from choose symbol to play
    $("#play-btn").on('click', function () {
        // Hide options/start menu
        $("#start-menu").hide();
        // Check who is o and set symbols accordingly
        let playerIsO = $("#who-is-o .selected").attr("id").replace("-is-o", "") == "ply";
        playerIsOForNextGame = playerIsO;
        if (playerIsO) {
            symbols["player"] = 'O';
            symbols["computer"] = 'X';
        } else {
            symbols["player"] = 'X';
            symbols["computer"] = 'O';
        }
        // Check who is moving first
        movingFirstInput = $("#who-is-moving-first .selected").attr("id").replace("-is-moving-first", "");
        movingFirst = movingFirstInput == "rnd" ? (Math.random() < 0.5 ? "ply" : "com") : movingFirstInput;
        turn = movingFirst;
        // Show the game page
        $("#game").show();
        // Init board
        board = new Board(DEBUG_MODE ? "DEBUG" : null);
        renderBoard(board);
        if (movingFirst === "com") {
            makeComMove();
            // Check for win
            state = board.getGameState()
            if (state !== symbols['blank']) {
                let winner = state === symbols['player'] ? "Player" : "Computer";
                gameOver = true;
                announceWinner(winner);
                return;
            } else if (board.getBlankSquares().length == 0) {
                let winner = "Tie";
                gameOver = true;
                announceWinner(winner);
                return;
            }
        }
        renderBoard(board);
    });

    // Who is O toggle
    $("#who-is-o .toggle").on('click', function () {
        $("#who-is-o .toggle").toggleClass("button-filled-aqua selected button-gray")
    });

    // Moving first toggle
    $("#who-is-moving-first .toggle").on('click', function () {
        if ($(this).hasClass("selected")) {
            return;
        }
        $("#who-is-moving-first .toggle").removeClass("selected button-filled-purple").addClass("button-gray");
        $(this).addClass("selected button-filled-purple").removeClass("button-gray");
    });

    $(".cell").on({
        click: function() {
            if (!$(this).hasClass("blank")) {
                return;
            }
            if (turn === 'com' || gameOver) {
                return;
            } else {
                turn = 'com';
            }
            $(this).removeClass('blank preview-move');
            let id = $(this).attr("id");
            let row = id.charAt(0);
            let cell = id.charAt(1);
            board.setSquare(symbols["player"], row, cell);
            renderBoard(board);
            // Check for win
            let state = board.getGameState()
            if (state !== symbols['blank']) {
                let winner = state === symbols['player'] ? "Player" : "Computer";
                gameOver = true;
                announceWinner(winner);
                return;
            } else if (board.getBlankSquares().length == 0) {
                let winner = "Tie";
                gameOver = true;
                announceWinner(winner);
                return;
            }
            makeComMove();
            // Check for win again
            state = board.getGameState()
            if (state !== symbols['blank']) {
                let winner = state === symbols['player'] ? "Player" : "Computer";
                gameOver = true;
                announceWinner(winner);
                return;
            } else if (board.getBlankSquares().length == 0) {
                let winner = "Tie";
                gameOver = true;
                announceWinner(winner);
                return;
            }
        },
        mouseenter: function () {
            let isBlank = $(this).hasClass("blank");
            if ($(this).hasClass("blank") && turn === "ply") {
                $(this).text(symbols['player']);
                $(this).addClass("preview-move");
            }
        },
        mouseleave: function () {
            if ($(this).hasClass("blank") && turn === "ply") {
                $(this).text(symbols['blank']);
                $(this).removeClass("preview-move");
            }
        }
    });

    // Dark mode stuff
    $("#dark-mode-button").on('click', function () {
        let oldMode = localStorage.getItem("mode");
        localStorage.setItem("mode", oldMode == 'light' ? 'dark' : 'light');
        updateMode();
    });
    
    function updateMode() {
        const DARK_MODE_TOGGLEABLE_ELEMENTS = ["body", ".button", ".select", "#board .cell"];
        let newMode = localStorage.getItem("mode");
        let $darkModeBtn = $("#dark-mode-button")
        if (newMode === "dark") {
            for (let i = 0; i < DARK_MODE_TOGGLEABLE_ELEMENTS.length; i++) {
                let $element = $(DARK_MODE_TOGGLEABLE_ELEMENTS[i]);
                $element.addClass("dark");
            }
            $darkModeBtn.removeClass("button-filled-dark").addClass("button-filled-light")
        } else {
            for (let i = 0; i < DARK_MODE_TOGGLEABLE_ELEMENTS.length; i++) {
                let $element = $(DARK_MODE_TOGGLEABLE_ELEMENTS[i]);
                $element.removeClass("dark");
            }
            $darkModeBtn.addClass("button-filled-dark").removeClass("button-filled-light")
        }
    };

    $("#settings").on('click', function () {
        $("#play-btn").hide();
        $("#start-menu").show();
        $("#continue-btn").show();
        $("#game").hide();
    });

    $("#continue-btn").on('click', function () {
        $("#start-menu").hide();
        // Check who is o and set symbols accordingly
        playerIsOForNextGame = $("#who-is-o .selected").attr("id").replace("-is-o", "") == "ply";
        // Check who is moving first
        movingFirstInput = $("#who-is-moving-first .selected").attr("id").replace("-is-moving-first", "");
        movingFirst = movingFirstInput == "rnd" ? (Math.random() < 0.5 ? "ply" : "com") : movingFirstInput;
        $("#game").show();
    });

    // Reset button
    $("#reset-button").on('click', function () {
        board = new Board();
        if (playerIsOForNextGame) {
            symbols["player"] = 'O';
            symbols["computer"] = 'X';
        } else {
            symbols["player"] = 'X';
            symbols["computer"] = 'O';
        }
        $(".cell").addClass("blank");
        $("#winner").text("");
        renderBoard(board);
        movingFirst = movingFirstInput == "rnd" ? (Math.random() < 0.5 ? "ply" : "com") : movingFirstInput;
        turn = movingFirst;
        gameOver = false;
        if (turn === "com") {
            makeComMove();
            turn = "ply";
        }
    });

    function announceWinner(winner) {
        if (winner == "Tie") {
            $("#winner").text(`It's a tie!`);
        } else {
            $("#winner").text(`${winner} wins!`);
        }
    }

    function makeComMove() {
        let move = AI.findBestMove(board);
        board.setSquare(symbols["computer"], move.row, move.cell);
        $(`table#board td#${move.row}${move.cell}`).removeClass("blank");
        renderBoard(board);
        turn = "ply"
    }

    function renderBoard(board) {
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (let cellIndex = 0; cellIndex < 3; cellIndex++) {
                $(`#board #${rowIndex}${cellIndex}`).text(board.getSquare(rowIndex, cellIndex));
            }
        }
    }
});