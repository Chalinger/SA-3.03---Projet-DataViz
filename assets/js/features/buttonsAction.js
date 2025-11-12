document.addEventListener("DOMContentLoaded", function() { 
    const tnButton = document.querySelector(".tn-button");
    const txButton = document.querySelector(".tx-button");
    const txElement = document.querySelector(".tx-graph")
    const tnElement = document.querySelector(".tn-graph")

    txButton.addEventListener("click", function() {
        txElement.classList.remove("hidden");
        tnElement.classList.add("hidden");
    })
    tnButton.addEventListener("click", function() {
        txElement.classList.add("hidden");
        tnElement.classList.remove("hidden");
    })

    const button = document.querySelectorAll(".button");
    const selectedLocation = document.querySelector(".AULNOIS-SS-LAON");
    let displayedGrid = document.querySelector(`.${selectedLocation.classList[0]}-grid`);

    button.forEach(button => {
        button.addEventListener("click", function() {
            selectedLocation.classList.remove("selected");
            button.classList.add("selected");
            displayedGrid.classList.add("grid-hidden");
            let newDisplayedGrid = document.querySelector(`.${button.classList[0]}-grid`);
            newDisplayedGrid.classList.remove("grid-hidden");
            displayedGrid = newDisplayedGrid;
        })
    })
})