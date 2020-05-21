"use strict";

// NOTE: This may be the most hacky program I've ever made.
var symbols = {
    "player": null,
    "computer": null,
    "blank": " "
};

var movingFirstInput;
var movingFirst;
var board;
var turn;
var gameOver;
var playerIsOForNextGame;
var DEBUG_MODE = false;

$(document).ready(function () {
    updateMode();
    // Transition from choose symbol to play
    $("#play-btn").on('click', function () {
        // Hide options/start menu
        $("#start-menu").hide();
        // Check who is o and set symbols accordingly
        var playerIsO = $("#who-is-o .selected").attr("id").replace("-is-o", "") == "ply";
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
        movingFirst = movingFirstInput == "rnd" ? Math.random() < 0.5 ? "ply" : "com" : movingFirstInput;
        turn = movingFirst;
        // Show the game page
        $("#game").show();
        // Init board
        board = new Board(DEBUG_MODE ? "DEBUG" : null);
        renderBoard(board);
        if (movingFirst === "com") {
            makeComMove();
            // Check for win
            state = board.getGameState();
            if (state !== symbols['blank']) {
                var winner = state === symbols['player'] ? "Player" : "Computer";
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
    $("#who-is-o .toggle").on('click', function () {
        $("#who-is-o .toggle").toggleClass("button-filled-aqua selected button-gray");
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
        click: function click() {
            if (!$(this).hasClass("blank")) {
                return;
            }
            if (turn === 'com' || gameOver) {
                return;
            } else {
                turn = 'com';
            }
            $(this).removeClass('blank preview-move');
            var id = $(this).attr("id");
            var row = id.charAt(0);
            var cell = id.charAt(1);
            board.setSquare(symbols["player"], row, cell);
            renderBoard(board);
            // Check for win
            var state = board.getGameState();
            if (state !== symbols['blank']) {
                var winner = state === symbols['player'] ? "Player" : "Computer";
                gameOver = true;
                announceWinner(winner);
                return;
            } else if (board.getBlankSquares().length == 0) {
                var _winner2 = "Tie";
                gameOver = true;
                announceWinner(_winner2);
                return;
            }
            makeComMove();
            // Check for win again
            state = board.getGameState();
            if (state !== symbols['blank']) {
                var _winner3 = state === symbols['player'] ? "Player" : "Computer";
                gameOver = true;
                announceWinner(_winner3);
                return;
            } else if (board.getBlankSquares().length == 0) {
                var _winner4 = "Tie";
                gameOver = true;
                announceWinner(_winner4);
                return;
            }
        },
        mouseenter: function mouseenter() {
            var isBlank = $(this).hasClass("blank");
            if ($(this).hasClass("blank") && turn === "ply") {
                $(this).text(symbols['player']);
                $(this).addClass("preview-move");
            }
        },
        mouseleave: function mouseleave() {
            if ($(this).hasClass("blank") && turn === "ply") {
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
            $darkModeBtn.removeClass("button-filled-dark").addClass("button-filled-light");
        } else {
            for (var _i = 0; _i < DARK_MODE_TOGGLEABLE_ELEMENTS.length; _i++) {
                var _$element = $(DARK_MODE_TOGGLEABLE_ELEMENTS[_i]);
                _$element.removeClass("dark");
            }
            $darkModeBtn.addClass("button-filled-dark").removeClass("button-filled-light");
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
        movingFirst = movingFirstInput == "rnd" ? Math.random() < 0.5 ? "ply" : "com" : movingFirstInput;
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
        movingFirst = movingFirstInput == "rnd" ? Math.random() < 0.5 ? "ply" : "com" : movingFirstInput;
        turn = movingFirst;
        gameOver = false;
        if (turn === "com") {
            makeComMove();
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

    function makeComMove() {
        var move = AI.findBestMove(board);
        board.setSquare(symbols["computer"], move.row, move.cell);
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
});