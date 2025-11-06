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
})