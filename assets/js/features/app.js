document.addEventListener("DOMContentLoaded", function() {
    console.log("%c DOMContentLoaded", "color: white; background-color: green");
    const asciiArt = String.raw`
___      .-""-.      ___
\  "-.  /      \  .-"  /
 > -=.\/        \/.=- <
 > -='/\        /\'=- <
/__.-'  \      /  '-.__\
         '-..-'

    ____
  .' /  '.
 /  (  .-'\
|'.__\/__  |
|    /\  '.|
 \.-'  )  /
  '.__/_.'

      ____
    .' /:::.
   /  (:::-'\
  |:\__\/__  |
  |::::/\:::\|
   \::'  )::/
     '.__/::'
`
console.log(asciiArt)

const infoPara = document.querySelectorAll(".info-para");
//const secondaryPara = document.querySelectorAll(".secondary-para");
const cardAverageEvolution = document.querySelector("#card_average-evolution");
infoPara.forEach((para) => {
  para.style.visibility = "hidden";
    para.style.fontSize = "0.8rem";
    para.style.fontStyle = "italic";
    para.style.textAlign = "center";
    para.style.color = "var(--secondary-text-color)";
});

cardAverageEvolution.addEventListener("mouseover", function() {
    infoPara.forEach((para) => {
        para.style.visibility = "visible";
    });
  })
  cardAverageEvolution.addEventListener("mouseout", function() {
    infoPara.forEach((para) => {
        para.style.visibility = "hidden";
    });
  })
});
