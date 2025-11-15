document.addEventListener("DOMContentLoaded", function() { 
    const tnButton = document.querySelector(".tn-button");
    const txButton = document.querySelector(".tx-button");
    const txElement = document.querySelector(".tx-graph");
    const tnElement = document.querySelector(".tn-graph");

    txButton.addEventListener("click", function() {
        txElement.classList.remove("hidden");
        tnElement.classList.add("hidden");
    });
    tnButton.addEventListener("click", function() {
        txElement.classList.add("hidden");
        tnElement.classList.remove("hidden");
    });

    const buttons = document.querySelectorAll(".button");
    const selectedLocation = document.querySelector(".AULNOIS-SS-LAON");
    let displayedGrid = document.querySelector(`.${selectedLocation.classList[0]}-grid`);

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove 'selected' class from all buttons
            buttons.forEach(btn => btn.classList.remove("selected"));
            
            // Add 'selected' class to the clicked button
            button.classList.add("selected");

            // Hide the previously displayed grid
            displayedGrid.classList.add("grid-hidden");
            let newDisplayedGrid = document.querySelector(`.${button.classList[0]}-grid`);
            newDisplayedGrid.classList.remove("grid-hidden");
            displayedGrid = newDisplayedGrid;
        });
    });s
});