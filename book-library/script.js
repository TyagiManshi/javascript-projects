// DOM Selections 

const searchInputElement = document.querySelector("#searchInput");
const clearBtn = document.querySelector("#clearBtn");

const selectElement = document.querySelector("#select");
const gridLayoutBtn = document.querySelector("#gridBtn");
const listLayoutBtn = document.querySelector("#listBtn");
console.log(selectElement.value);

const bookContainer = document.querySelector("#bookContainer");


const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const pageNoPara = document.querySelector("#pageNo");

//variable declaration 

let currentPage = 1;
const totalPage = undefined;
let currentPageBooks = [];


// Function to fetch book data from the API
async function getBooksData(pageNo = 1) {
  const url = `https://api.freeapi.app/api/v1/public/books?page=${pageNo}&limit=${9}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Check if the API call was successful
    if (!data.success) {
      throw new Error("Error while fetching data");
    }

    console.log(data); // Debugging: Logs API response to console
    currentPageBooks = data.data.data;
    renderBooks(currentPageBooks); // Display books on the page

    // Update page number display
    pageNoPara.innerText = data.data.page;
    currentPage = data.data.page;

    // Remove previous event listeners before adding new ones (to prevent duplicates)
    prevBtn.removeEventListener("click", handlePrevClick);
    nextBtn.removeEventListener("click", handleNextClick);

    // Enable/Disable Previous Page button based on API response
    if (!data.data.previousPage) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
      prevBtn.addEventListener("click", handlePrevClick);
    }

    // Enable/Disable Next Page button based on API response
    if (!data.data.nextPage) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
      nextBtn.addEventListener("click", handleNextClick);
    }
  } catch (error) {
    alert("Error while fetching data");
  }
}

// Function to render books dynamically
function renderBooks(bookList) {
  bookContainer.innerHTML = ""; // Clear previous book data

  // Determine whether to use Grid or List layout
  bookHolderClass = bookContainer.classList.contains("grid")
    ? "bookHolderGrid"
    : "bookHolderList";

  // Loop through each book and generate HTML structure
  bookList.forEach((book) => {
    const authorsArray = book?.volumeInfo?.authors?.slice(0, 3).join(", ");
    const title = book?.volumeInfo?.title;
    const publishedDate = book?.volumeInfo?.publishedDate;
    const publisher = book?.volumeInfo?.publisher;
    const imageUrl =
      book?.volumeInfo?.imageLinks?.thumbnail ||
      book?.volumeInfo?.imageLinks?.smallThumbnail ||
      "";

    // Create anchor tag to open book details in a new tab
    const bookHolder = document.createElement("a");
    bookHolder.href = book?.volumeInfo?.infoLink;
    bookHolder.target = "_blank";
    bookHolder.classList.add(bookHolderClass);
    bookHolder.id = "bookHolder";

    // Create book card HTML
    const stringBookElement = `
    <div class="imageContainer">
      <img class="image" src="${imageUrl}" alt="${title} book cover" loading="lazy"/>
    </div>
    <div class="bookDetailsHolder">
      <h2 id="bookTitle">${title}</h2>
      <div class="bookMeta">
        <h3 id="bookAuthor">Author: ${authorsArray}</h3>
        <p id="bookPublisher">Publisher: ${publisher}</p>
      </div>
      <p id="bookPublishedDate">Date: ${publishedDate}</p>
    </div>`;

    bookHolder.innerHTML = stringBookElement;
    bookContainer.appendChild(bookHolder);
  });
}

// Function to search for books by title or author
function searchBook(name) {
  let foundBooks = [];

  currentPageBooks.forEach((book) => {
    if (book.volumeInfo.title.toLowerCase().includes(name.toLowerCase())) {
      foundBooks.push(book);
      return;
    }
    book.volumeInfo.authors.forEach(
      (author) => author.toLowerCase().includes(name.toLowerCase()) && foundBooks.push(book)
    );
  });

  // If no books found, show all books again
  if (foundBooks.length <= 0) {
    renderBooks(currentPageBooks);
    return;
  }
  renderBooks(foundBooks);
}

// Debouncer function to optimize search (reduces frequent API calls)
function functionDebouncer(cb, delay) {
  let id = null;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => {
      cb.apply(this, args);
    }, delay * 1000);
  };
}

// Function to clear search input and reset book list
function clearSearch() {
  searchInputElement.value = "";
  renderBooks(currentPageBooks);
}

// Function to sort books based on selected criteria
function sortBooks(sort) {
  let sortedBooks = [...currentPageBooks];

  if (sort === "publishedDate") {
    sortedBooks.sort(
      (a, b) =>
        new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate)
    );
  } else if (sort === "increasing") {
    sortedBooks.sort((a, b) =>
      a.volumeInfo.title.localeCompare(b.volumeInfo.title)
    );
  } else if (sort === "descending") {
    sortedBooks.sort((a, b) =>
      b.volumeInfo.title.localeCompare(a.volumeInfo.title)
    );
  }
  renderBooks(sortedBooks);
}

// Function to switch between Grid and List layouts
function toggleLayout(layout) {
  const bookHolderArray = document.querySelectorAll("#bookHolder");
  if (layout === "grid") {
    gridLayoutBtn.classList.add("select");
    listLayoutBtn.classList.remove("select");
    bookContainer.classList.remove("list");
    bookContainer.classList.add("grid");

    bookHolderArray.forEach((bookHolder) => {
      bookHolder.classList.remove("bookHolderList");
      bookHolder.classList.add("bookHolderGrid");
    });
  } else {
    listLayoutBtn.classList.add("select");
    gridLayoutBtn.classList.remove("select");
    bookContainer.classList.remove("grid");
    bookContainer.classList.add("list");

    bookHolderArray.forEach((bookHolder) => {
      bookHolder.classList.remove("bookHolderGrid");
      bookHolder.classList.add("bookHolderList");
    });
  }
}

// Function to handle previous page button click
function handlePrevClick() {
  getBooksData(currentPage - 1);
}

// Function to handle next page button click
function handleNextClick() {
  getBooksData(currentPage + 1);
}

// Initialize debounced search function
const debouneSearch = functionDebouncer(searchBook, 1);

// Fetch initial book data on page load
getBooksData();

// Event listeners for search, clear, sorting, and layout toggle
searchInputElement.addEventListener("input", (e) => {
  debouneSearch(e.target.value);
});

clearBtn.addEventListener("click", clearSearch);

selectElement.addEventListener("change", function () {
  console.log("Sorting books...");
  let selectedValue = this.value;
  sortBooks(selectedValue);
});

gridLayoutBtn.addEventListener("click", () => {
  toggleLayout("grid");
});

listLayoutBtn.addEventListener("click", () => {
  toggleLayout("list");
});







// Background Animation 

const particlesContainer = document.getElementById('particles-container');
const particleCount = 80;

for (let i = 0; i < particleCount; i++) {
    createParticle();
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    resetParticle(particle);
    particlesContainer.appendChild(particle);
    animateParticle(particle);
}

function resetParticle(particle) {
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = '0';
    
    return {
        x: posX,
        y: posY
    };
}

function animateParticle(particle) {
    const pos = resetParticle(particle);
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    setTimeout(() => {
        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        const moveX = pos.x + (Math.random() * 20 - 10);
        const moveY = pos.y - Math.random() * 30; 
        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;
        setTimeout(() => {
            animateParticle(particle);
        }, duration * 1000);
    }, delay * 1000);
}
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 100;
    const mouseY = (e.clientY / window.innerHeight) * 100;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    particle.style.left = `${mouseX}%`;
    particle.style.top = `${mouseY}%`;
    particle.style.opacity = '0.6';
    
    particlesContainer.appendChild(particle);
    
    setTimeout(() => {
        particle.style.transition = 'all 2s ease-out';
        particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
        particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
        particle.style.opacity = '0';
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }, 10);
    
    const spheres = document.querySelectorAll('.gradient-sphere');
    const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
    
    spheres.forEach(sphere => {
        const currentTransform = getComputedStyle(sphere).transform;
        sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});
