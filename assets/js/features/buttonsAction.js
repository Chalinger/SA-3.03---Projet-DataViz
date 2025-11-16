document.addEventListener("DOMContentLoaded", () => {
  // Boutons pour basculer entre les graphiques TX et TN
  const tnButton = document.querySelector(".tn-button");
  const txButton = document.querySelector(".tx-button");
  const txElement = document.querySelector(".tx-graph");
  const tnElement = document.querySelector(".tn-graph");

  if (txButton && tnButton && txElement && tnElement) {
    txButton.addEventListener("click", () => {
      txElement.classList.remove("hidden");
      tnElement.classList.add("hidden");
      txButton.classList.add("selected");
      tnButton.classList.remove("selected");
    });

    tnButton.addEventListener("click", () => {
      tnElement.classList.remove("hidden");
      txElement.classList.add("hidden");
      tnButton.classList.add("selected");
      txButton.classList.remove("selected");
    });
  }

  // Boutons de localisation des graphiques des moyennes
  const locationButtons = document.querySelectorAll("nav.buttons_averages .button");
  let currentGrid = document.querySelector(".AULNOIS-SS-LAON-grid");

  if (locationButtons.length > 0 && currentGrid) {
    locationButtons.forEach(button => {
      button.addEventListener("click", () => {
        locationButtons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");

        
        currentGrid.classList.add("grid-hidden");

        
        const className = button.classList[0];
        const newGrid = document.querySelector(`.${className}-grid`);

        if (newGrid) {
          newGrid.classList.remove("grid-hidden");
          currentGrid = newGrid;
        }
      });
    });
  }
});