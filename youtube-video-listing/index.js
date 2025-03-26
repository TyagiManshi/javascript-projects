// Selecting DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const clearSearchButton = document.getElementById('clear-search');
const videoListContainer = document.getElementById('video-cards-container');

// API URL for fetching YouTube videos
const API_URL = 'https://api.freeapi.app/api/v1/public/youtube/videos';

// Function to fetch and display videos from API
async function fetchVideos() {
    try {
        const response = await fetch(API_URL); // Fetch data from API
        const data = await response.json(); // Convert response to JSON

        // Validate if API response contains required data
        if (!data.data || !data.data.data) {
            throw new Error("Invalid API response");
        }

        renderVideoCards(data.data.data); // Call function to display videos
    } catch (error) {
        console.error("Error fetching videos:", error);
        alert("Failed to load videos. Please try again later.");
    }
}

// Function to create and display video cards dynamically
function renderVideoCards(videos) {
    videoListContainer.innerHTML = ''; // Clear previous content before adding new cards

    videos.forEach(video => {
        const { snippet, statistics, id } = video.items; // Extract required data
        
        const videoCard = document.createElement('div'); // Create a div for the video card
        videoCard.classList.add('video-card-single'); // Add class for styling
        videoCard.setAttribute('tags', snippet.tags ? snippet.tags.join(", ") : ""); // Store tags for search filtering
        
        // Construct video card layout with thumbnail, title, channel name, and views
        videoCard.innerHTML = `
            <div class="video-content">
                <a href="https://youtube.com/watch?v=${id}" target="_blank">
                    <img src="${snippet.thumbnails.high.url}" alt="${snippet.localized.title}">
                </a>
                <div class="h2-container">
                    <a href="https://youtube.com/watch?v=${id}" target="_blank">
                        <h2 class="video-title">${snippet.localized.title}</h2>
                    </a>
                </div>
            </div>
            <div class="other-details">
                <p class="channel-title">${snippet.channelTitle}</p>
                <p class="views">${statistics.viewCount} views</p>
            </div>
        `;
        
        videoListContainer.appendChild(videoCard); // Append the video card to the container
    });
}

// Function to filter videos based on search input
function filterVideos() {
    const searchTerm = searchInput.value.trim().toLowerCase(); // Get user input and convert to lowercase

    // Enforce a minimum search term length of 5 characters
    if (searchTerm.length < 5) {
        alert("Please enter at least 5 characters for search.");
        return;
    }

    let matchFound = false; // Track if any matching videos are found
    
    // Loop through each video card to check if it matches the search term
    document.querySelectorAll('.video-card-single').forEach(card => {
        const cardTags = card.getAttribute("tags") || ""; // Get video tags
        const cardTitle = card.querySelector(".video-title").textContent.toLowerCase(); // Get video title
        
        // Check if the search term exists in either the title or tags
        const isMatch = cardTags.toLowerCase().includes(searchTerm) || cardTitle.includes(searchTerm);
        
        // Show or hide the video card based on the search match
        card.style.display = isMatch ? "block" : "none";
        
        if (isMatch) matchFound = true; // Set flag if a match is found
    });

    // Show or hide the clear button based on search results
    clearSearchButton.classList.toggle("hidden", !matchFound);
    
    if (!matchFound) alert("No matches found.");
}

// Function to reset search filter and display all videos again
function resetSearch() {
    searchInput.value = ""; // Clear search input field
    
    // Loop through all video cards and make them visible again
    document.querySelectorAll('.video-card-single').forEach(card => {
        card.style.display = "block";
    });
    
    clearSearchButton.classList.add("hidden"); // Hide clear button
}

// Event Listeners
// Fetch and display videos when the page loads
document.addEventListener('DOMContentLoaded', fetchVideos);

// Trigger video filtering when search button is clicked
searchButton.addEventListener('click', filterVideos);

// Enable search by pressing 'Enter' in the search input
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') filterVideos();
});

// Reset search filter when the clear button is clicked
clearSearchButton.addEventListener('click', resetSearch);
