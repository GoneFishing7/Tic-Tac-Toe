"use strict";

// NOTE: This may be the most hacky program I've ever made.
var symbols = {
    "player": null,
    "player2": null,
    "blank": " "
};

var board;
var state;
var turn;
var gameOver;
var currentPlayer2Mode;
var DEBUG_MODE = false;

$(document).ready(function () {
    updateMode();
    // Transition from choose symbol to play
    $("#play-btn").on('click', function () {
        // Hide options/start menu
        $("#start-menu").hide();
        // Check who is o and set symbols accordingly
        var settings = getOptions();
        if (settings.playerIsO) {
            symbols["player"] = 'O';
            symbols["player2"] = 'X';
        } else {
            symbols["player"] = 'X';
            symbols["player2"] = 'O';
        }
        // Check who is moving first
        turn = settings.movingFirst;
        // Get computer difficulty
        currentPlayer2Mode = settings.comMode;
        // Show the game page
        $("#game").show();
        // Init board
        board = new Board(DEBUG_MODE ? "DEBUG" : null);
        renderBoard(board);
        if (settings.movingFirst === "ply2" && currentPlayer2Mode !== "human") {
            console.log({ currentPlayer2Mode: currentPlayer2Mode, comMode: comMode });
            makeComMove(currentPlayer2Mode);
            // Check for win
            state = board.getGameState();
            if (state !== symbols['blank']) {
                var winner = state === symbols['player'] ? "Player" : "Player 2";
                gameOver = true;
                announceWinner(winner);
                return;
            } else if (board.getBlankSquares().length == 0) {
                var _winner = "Tie";
                gameOver = true;
                announceWinner(_winner);
                return;
            }
        }
        renderBoard(board);
    });

    // Who is O toggle
    $("#o-toggle .toggle").on('click', function () {
        $("#who-is-o .toggle").toggleClass("button-filled-purple selected button-gray");
    });

    // Moving first toggle
    $("#moving-first-toggle .toggle").on('click', function () {
        if ($(this).hasClass("selected")) {
            return;
        }
        $("#moving-first-toggle .toggle").removeClass("selected button-filled-purple").addClass("button-gray");
        $(this).addClass("selected button-filled-purple").removeClass("button-gray");
    });

    // Difficulty toggle
    $("#com-mode-toggle .toggle").on('click', function () {
        if ($(this).hasClass("selected")) {
            return;
        }
        $("#com-mode-toggle .toggle").removeClass("selected button-filled-purple").addClass("button-gray");
        $(this).addClass("selected button-filled-purple").removeClass("button-gray");
    });

    $(".cell").on({
        click: function click() {
            var settings = getOptions();
            if (!$(this).hasClass("blank")) {
                return;
            }
            if (turn === "ply2" && currentPlayer2Mode !== "human" || gameOver) {
                return;
            }
            $(this).removeClass('blank preview-move');
            var id = $(this).attr("id");
            var row = id.charAt(0);
            var cell = id.charAt(1);
            console.log({ turn: turn });
            board.setSquare(symbols[turn === "ply" ? "player" : "player2"], row, cell);
            renderBoard(board);
            // Check for win
            var state = board.getGameState();
            if (state !== symbols['blank']) {
                var winner = state === symbols['player'] ? "Player 1" : "Player 2";
                gameOver = true;
                announceWinner(winner);
                return;
            } else if (board.getBlankSquares().length == 0) {
                var _winner2 = "Tie";
                gameOver = true;
                announceWinner(_winner2);
                return;
            }
            turn = turn === "ply" ? "ply2" : "ply";
            if (currentPlayer2Mode !== "human") {
                makeComMove(currentPlayer2Mode);
                // Check for win again
                state = board.getGameState();
                if (state !== symbols['blank']) {
                    var _winner3 = state === symbols['player'] ? "Player 1" : "Player 2";
                    gameOver = true;
                    announceWinner(_winner3);
                    return;
                } else if (board.getBlankSquares().length == 0) {
                    var _winner4 = "Tie";
                    gameOver = true;
                    announceWinner(_winner4);
                    return;
                }
            }
        },
        mouseenter: function mouseenter() {
            if ($(this).hasClass("blank") && (turn === "ply" || currentPlayer2Mode == "human")) {
                if (turn === "ply") {
                    $(this).text(symbols['player']);
                } else if (currentPlayer2Mode === "human") {
                    $(this).text(symbols['player2']);
                }
                $(this).addClass("preview-move");
            }
        },
        mouseleave: function mouseleave() {
            // NOTE: Not trustworthy after being clicked, for some reason.
            if ($(this).hasClass("blank") && (turn === "ply" || currentPlayer2Mode == "human")) {
                $(this).text(symbols['blank']);
                $(this).removeClass("preview-move");
            }
        }
    });

    // Dark mode stuff
    $("#dark-mode-button").on('click', function () {
        var oldMode = localStorage.getItem("mode");
        localStorage.setItem("mode", oldMode == 'light' ? 'dark' : 'light');
        updateMode();
    });

    function updateMode() {
        var DARK_MODE_TOGGLEABLE_ELEMENTS = ["body", ".button", ".select", "#board .cell"];
        var newMode = localStorage.getItem("mode");
        var $darkModeBtn = $("#dark-mode-button");
        if (newMode === "dark") {
            for (var i = 0; i < DARK_MODE_TOGGLEABLE_ELEMENTS.length; i++) {
                var $element = $(DARK_MODE_TOGGLEABLE_ELEMENTS[i]);
                $element.addClass("dark");
            }
            $darkModeBtn.removeClass("button-filled-dark").addClass("button-filled-light").text("Light Mode! 🌻");
        } else {
            for (var _i = 0; _i < DARK_MODE_TOGGLEABLE_ELEMENTS.length; _i++) {
                var _$element = $(DARK_MODE_TOGGLEABLE_ELEMENTS[_i]);
                _$element.removeClass("dark");
            }
            $darkModeBtn.addClass("button-filled-dark").removeClass("button-filled-light").text("Dark Mode! 🌙");
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
        $("#game").show();
    });

    // Reset button
    $("#reset-button").on('click', function () {
        var settings = getOptions();
        board = new Board();
        if (settings.playerIsO) {
            symbols["player"] = 'O';
            symbols["player2"] = 'X';
        } else {
            symbols["player"] = 'X';
            symbols["player2"] = 'O';
        }
        $(".cell").addClass("blank");
        $("#winner").text("");
        renderBoard(board);
        turn = settings.movingFirst;
        currentPlayer2Mode = settings.comMode;
        gameOver = false;
        if (turn === "ply2" && currentPlayer2Mode !== "human") {
            makeComMove(currentPlayer2Mode);
            turn = "ply";
        }
    });

    function announceWinner(winner) {
        if (winner == "Tie") {
            $("#winner").text("It's a tie!");
        } else {
            $("#winner").text(winner + " wins!");
        }
    }

    function makeComMove(mode) {
        var move = AI.findBestMove(board, mode);
        board.setSquare(symbols["player2"], move.row, move.cell);
        $("table#board td#" + move.row + move.cell).removeClass("blank");
        renderBoard(board);
        turn = "ply";
    }

    function renderBoard(board) {
        for (var rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (var cellIndex = 0; cellIndex < 3; cellIndex++) {
                $("#board #" + rowIndex + cellIndex).text(board.getSquare(rowIndex, cellIndex));
            }
        }
    }

    function getOptions() {
        var movingFirstInput = $("#moving-first-toggle .selected").attr("id").replace("-is-moving-first", "");
        var movingFirst = movingFirstInput == "rnd" ? Math.random() < 0.5 ? "ply" : "ply2" : movingFirstInput;
        var playerIsO = $("#o-toggle .selected").attr("id").replace("-is-o", "") == "ply";
        var comMode = $("#com-mode-toggle .selected").attr("id");
        return {
            movingFirst: movingFirst,
            playerIsO: playerIsO,
            comMode: comMode
        };
    }
});
//# sourceMappingURL=app.js.map