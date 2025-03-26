const quote = document.getElementById("quote");
const author = document.getElementById("author");
const likeQuote = document.getElementById("likeQuote");
const copyQuote = document.querySelector(".fa-copy");
const api_url = "https://api.freeapi.app/api/v1/public/quotes/quote/random"


// Function to fetch a random quote from the API
async function getQuote(url) {
    const response = await fetch(url);
    var data = await response.json();
    console.log(data);
    

    // Display the quote and author in the respective elements
    // The API response contains a nested object: 'data' inside which 'content' (quote) and 'author' are stored
    quote.innerHTML = data.data.content;
    author.innerHTML = data.data.author;
}

getQuote(api_url);


// Function to share the quote on Twitter
function tweet(){
    window.open("https://twitter.com/intent/tweet?text=" + quote.innerHTML + `%0A— By ${author.innerHTML}`, "Tweet Window", "width=700, height=400")
    
    // %0A adds a new line in the tweet
}



// Event listener for the like button (toggles like/unlike)
likeQuote.addEventListener("click", function () {

    // If not liked, change it to liked state
    if (likeQuote.classList.contains("fa-regular")) {
        likeQuote.classList.remove("fa-regular");
        likeQuote.classList.add("fa-solid");
        likeQuote.style.color = "red";
    } 
    
    // If already liked, change back to unliked state
    else {
        likeQuote.classList.remove("fa-solid");
        likeQuote.classList.add("fa-regular");
        likeQuote.style.color = "black";
    }
});

// Copy quote to clipboard
copyQuote.addEventListener("click", function () {
    const text = quote.innerHTML;

    // Copy text to clipboard
    navigator.clipboard.writeText(text).then(() => {
        alert("Quote copied to clipboard!"); // Show alert after copying
    })
});

