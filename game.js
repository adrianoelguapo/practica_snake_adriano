$(document).ready(function () {
    const gameBoard = $("#gameboard");
    const cells = gameBoard.find(".gamecell");
    const boardSize = 10;
    let snake = [44];
    let direction = "RIGHT";
    let food = [];
    let score = 0;
    let gameInterval;

    const updateScore = () => {
        $("#startgame").text(`Score: ${score}`);
    };

    const placeFood = () => {
        while (food.length < 1) {
            const newFood = Math.floor(Math.random() * cells.length);
            if (!snake.includes(newFood) && !food.includes(newFood)) {
                food.push(newFood);
                $(cells[newFood]).addClass("food").html("<img src='images/cauldron.png' alt='Food'>");
            }
        }
    };

    const moveSnake = () => {
        const head = snake[0];
        let newHead;
    
        switch (direction) {
            case "UP":
                newHead = head - boardSize;
                if (newHead < 0) return endGame();
                break;
            case "DOWN":
                newHead = head + boardSize;
                if (newHead >= cells.length) return endGame();
                break;
            case "LEFT":
                newHead = head % boardSize === 0 ? -1 : head - 1;
                if (newHead === -1) return endGame();
                break;
            case "RIGHT":
                newHead = (head + 1) % boardSize === 0 ? -1 : head + 1;
                if (newHead === -1) return endGame();
                break;
            default:
                return;
        }
    
        if (snake.includes(newHead)) return endGame();
        snake.unshift(newHead);

        // Actualizar la cabeza de la serpiente
        $(cells[snake[1]]).removeClass("head").removeClass("snake")
            .html("<img src='images/cat.png' alt='Snake'>");
        
        if (food.includes(newHead)) {
            score += 10;
            updateScore();
            food = food.filter((f) => f !== newHead);
            $(cells[newHead]).removeClass("food").empty();
            placeFood();
        } else {
            const tail = snake.pop();
            $(cells[tail]).removeClass("snake").empty();
        }

        // Actualizar nueva cabeza de la serpiente
        $(cells[newHead])
            .addClass("snake head")
            .html("<img src='images/witch.png' alt='Snake Head'>")
            .find("img")
            .css("transform", "translate(0, 0)");
    };

    const endGame = () => {
        clearInterval(gameInterval);
        $(".gameover .gameovertext").eq(0).text(`Your final score is ${score} points!`);
        $(".gameover").fadeIn();
    };

    const startGame = () => {
        // Initialize game state
        $("#playerval").val("");
        snake = [44];
        direction = "RIGHT";
        score = 0;
        food = [];
        updateScore();
        $(".gamecell").removeClass("snake food head").empty();
        
        // Colocar cabeza de la serpiente
        $(cells[44]).addClass("snake head")
            .html("<img src='images/witch.png' alt='Snake Head'>");
        
        placeFood();
        gameInterval = setInterval(moveSnake, 175);
    };

    // Listen for keyboard input
    $(document).on("keydown", (e) => {
        const key = e.key;
        if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        else if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        else if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        else if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    });

    // Start game button
    $("#resetgame").on("click", startGame);

    // Close modal button
    $(".gameover .closemodalbutton").on("click", () => {
        $(".gameover").fadeOut();
    });

    // Start the game for the first time
    startGame();

    $("#savescore").on("click", (event) => {
        event.preventDefault();
    
        let name = $("#playername").val();
    
        if (name) {
            $.ajax({
                url: 'scores.php',
                type: 'POST',
                data: JSON.stringify({
                    name: name,
                    score: parseInt(score)
                }),
                contentType: 'application/json',
                success: function(response) {
                    let responseObj = JSON.parse(response);
                    if (responseObj.message === "Puntuación guardada correctamente.") {
                        $.ajax({
                            url: 'getScores.php',
                            type: 'GET',
                            success: function(response) {
                                let scores = JSON.parse(response);
                                let rankingHTML = `
                                    <span class="closemodalbutton">&times;</span>
                                    <p class="rankingtitle">Top 5 Scores</p>
                                `;
    
                                scores.forEach((score) => {
                                    rankingHTML += `<p class="rankingscore">${score.name}: ${score.score} points</p>`;
                                });
    
                                // Mostrar el modal con el ranking
                                $(".ranking")
                                    .html(rankingHTML)
                                    .css("display", "block")
                                    .css("visibility", "visible");
    
                                // Manejo del botón para cerrar el modal del ranking
                                $(".ranking .closemodalbutton").on("click", () => {
                                    $(".ranking").fadeOut();
                                });
                            },
                            error: function(xhr, status, error) {
                                console.error("Error al obtener el ranking:", error);
                                alert("Hubo un problema al obtener el ranking. Intenta de nuevo.");
                            },
                        });
    
                        // Ocultar el modal de Game Over
                        $(".gameover").fadeOut();
                    } else {
                        alert("Hubo un problema al guardar la puntuación. Intenta de nuevo.");
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error al guardar la puntuación:", error);
                    alert("Hubo un problema al comunicarse con el servidor. Intenta de nuevo.");
                },
            });
        } else {
            alert("Por favor, introduce tu nombre.");
        }
    });
    
});
