
const Gameboard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setMark = (index, marker) => {
        board[index] = marker
    }

    const resetBoard = () => {
        for(let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    return {
        getBoard, 
        setMark, 
        resetBoard
    };
})();

function Player(name, marker) {
    return { name, marker };
}

const GameController = (function() {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");

    let currentPlayer = player1;

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function playRound(index) {
        const board = Gameboard.getBoard();

        if (board[index] !== "") {
            return "invalid";
        } 

        Gameboard.setMark(index, currentPlayer.marker);

        if (checkWin()) {
            return "win";
        } 

        if (checkTie()) {
            return "tie";
        }
        
        switchPlayer();
    }

    function checkWin() {
    const winningCombinations = [
        [0, 1, 2], 
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], 
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const board = Gameboard.getBoard();

    for (let combination of winningCombinations) {
        let [a, b, c] = combination;
        if (
            board[a] === currentPlayer.marker &&
            board[b] === currentPlayer.marker &&
            board[c] === currentPlayer.marker
        ) {
            return true;
        }
    }
    return false;
    }

    function checkTie() {
        const board = Gameboard.getBoard();
        for (let cell of board) {
            if (cell === "") {
                return false;
            }
        }
        return true;
    }

    function resetGame() {
        Gameboard.resetBoard();
        currentPlayer = player1;
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    return {
        playRound,
        resetGame,
        getCurrentPlayer
    }
})();

const DisplayController = (function() {
    const resetBtn = document.querySelector(".reset-btn");
    const statusDiv = document.querySelector(".status");

    function renderBoard() {
        const boardContainer = document.getElementById("board");
        boardContainer.innerHTML = "";

        for (let i = 0; i < Gameboard.getBoard().length; i++) {
            const cell = document.createElement("div");
            cell.textContent = Gameboard.getBoard()[i];
            cell.dataset.index = i;
            cell.classList.add("cell");

            cell.addEventListener("click", () => {
                const result = GameController.playRound(i);
                renderBoard();

                if (result === "win") {
                    statusDiv.textContent = `${GameController.getCurrentPlayer().name} wins`;
                } else if (result === "tie") {
                    statusDiv.textContent = "Tie";
                }
            });

            boardContainer.appendChild(cell);
        }
    }

    resetBtn.addEventListener("click", () => {
        GameController.resetGame();
        renderBoard();
        statusDiv.textContent = "Tic-Tac-Toe";
    })

    renderBoard();

    return { renderBoard };
})();