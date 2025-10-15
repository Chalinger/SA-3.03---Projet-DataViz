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
});
