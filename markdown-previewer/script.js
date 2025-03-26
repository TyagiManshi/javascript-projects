// Get references to the input textarea, preview div, and clear button
const input = document.getElementById('markdown-input');
const preview = document.getElementById('markdown-preview');
const clearBtn = document.getElementById('clear-btn');

/**
 * Function to update the preview in real-time as the user types.
 * It converts Markdown input into HTML using the `marked` library.
 * Also applies syntax highlighting to code blocks.
 */
function updatePreview() {
    const markdownText = input.value; // Get user input from the textarea
    preview.innerHTML = marked.parse(markdownText); // Convert Markdown to formatted HTML

    // Apply syntax highlighting for code blocks inside the preview
    document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block); // Highlights the code using highlight.js
    });
}

// Event listener for the "Clear" button: clears the textarea and updates the preview
clearBtn.addEventListener("click", () => {
    input.value = ""; // Clears the text area
    updatePreview(); // Updates preview (removes all content)
});

/**
 * Default Markdown text that appears when the page loads.
 * This provides an example of basic Markdown syntax, so users
 * can see live formatting immediately.
 */
const defaultMarkdown = `Type some **Markdown** to see live formatting!  
<br>

**📝 Basic Markdown Elements:**

<br>

**📌 Headings:** 
# H1 Heading  
## H2 Heading  
### H3 Heading  

<br>

**📌 Bold & Italics:**  
- **This is bold text**  
- *This is italic text*  
- ***This is bold & italic text***  

<br>

**📌 Links:**  
[Click here to connect with me](https://www.linkedin.com/in/manshi--tyagi/)  

<br>

**📜 Lists:**
#### 🔸 Unordered List  
- Item 1  
- Item 2  
  - Nested Item 1  
  - Nested Item 2  

#### 🔹 Ordered List  
1. First item  
2. Second item  
   1. Sub-item 1  
   2. Sub-item 2  

<br>

**📌 Code Blocks:** 

\`\`\`javascript
// JavaScript Example  
function greet() {  
    console.log("Hello, World!");  
}  
greet();
\`\`\`
 
<br>

\`Inline code example: console.log("Hello, Markdown!");\`

<br>

**Enjoy Writing in Markdown! 🎉**
`;

// Set the default Markdown content in the textarea when the page loads
input.value = defaultMarkdown;

// Call updatePreview() immediately to render the default Markdown in the preview
updatePreview();

// Event listener to update the preview whenever the user types in the textarea
input.addEventListener("input", updatePreview);
