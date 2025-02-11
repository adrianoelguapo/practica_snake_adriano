$(document).ready(function() {
    $('#showranking').on('click', () => {
        $.ajax({
            url: 'getScores.php',
            type: 'GET',
            success: function(response) {
                let scores = JSON.parse(response);
                let rankingHTML = `
                    <span class = "closemodalbutton">&times;</span>
                    <p class = "rankingtitle">Top 5 Scores</p>
                `;
    
                scores.forEach(score => {
                    rankingHTML += `<p class = "rankingscore">${score.name}: ${score.score} points</p>`;
                });
    
                $(".ranking").html(rankingHTML).css("display", "block").css("visibility", "visible");
            },
            error: function(xhr, status, error) {
                console.error("Error al obtener el ranking:", error);
                alert("Hubo un problema al obtener el ranking. Intenta de nuevo.");
            }
        })

        $('.ranking').fadeIn();

        $(document).on('click', '.ranking .closemodalbutton', () => {
            $('.ranking').fadeOut();
        });
    });
})