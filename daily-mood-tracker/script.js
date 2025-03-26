// Run functions when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadMood(); // Load today's mood
  generateCalendar(); // Generate the calendar view
});

// Function to log today's mood
function logMood() {
  let moodSelect = document.getElementById("mood"); // Get the mood dropdown
  let mood = moodSelect.value; // Get the selected mood
  let emoji = moodSelect.options[moodSelect.selectedIndex].text.split(" ")[0]; // Extract emoji from dropdown
  let today = new Date().toLocaleDateString(); // Get today's date

  // Get saved moods from localStorage, if none, set an empty object
  let savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || {};

  // Save today's mood with emoji
  savedMoods[today] = { mood, emoji };
  localStorage.setItem("moodHistory", JSON.stringify(savedMoods)); // Store updated data

  loadMood(); // Update the displayed mood
  generateCalendar(); // Refresh the calendar
}

// Function to load today's logged mood
function loadMood() {
  let log = document.getElementById("moodLog"); // Get the mood log container
  let savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || {}; // Retrieve stored moods
  let today = new Date().toLocaleDateString(); // Get today's date

  if (savedMoods[today]) {
    log.innerHTML = `<div class="entry ${savedMoods[today].mood}">
                          <strong>${today}</strong>: ${savedMoods[today].emoji} ${savedMoods[today].mood}
                       </div>`;
  } else {
    log.innerHTML = "<p>No mood logged for today.</p>"; // Show message if no mood is logged
  }
}

// Function to clear all stored moods
function clearLog() {
  localStorage.removeItem("moodHistory"); // Remove stored moods from localStorage
  document.getElementById("moodLog").innerHTML =
    "<p>No mood logged for today.</p>"; // Reset mood log
  document.getElementById("timelineView").innerHTML = ""; // Clear timeline
  document.getElementById("calendarView").innerHTML = ""; // Clear calendar
}

// Function to show mood history (day/week/month)
function showTimeline(range) {
  let savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || {}; // Retrieve stored moods
  let timelineView = document.getElementById("timelineView"); // Get timeline container
  timelineView.innerHTML = ""; // Clear previous entries

  let days = Object.keys(savedMoods).slice(-7); // Default to last 7 days (Week View)
  if (range === "month")
    days = Object.keys(savedMoods).slice(-30); // Last 30 days for Month View
  else if (range === "day") days = Object.keys(savedMoods).slice(-1); // Only show today's mood

  days.forEach(function (date) {
    let moodEntry = savedMoods[date];
    let entry = `<div class="entry ${moodEntry.mood}">
                      <strong>${date}</strong>: ${moodEntry.emoji} ${moodEntry.mood}
                   </div>`;
    timelineView.innerHTML += entry; // Append to timeline view
  });
}

// Function to generate the calendar view
function generateCalendar() {
  let savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || {}; // Retrieve stored moods
  let calendarView = document.getElementById("calendarView"); // Get calendar container
  calendarView.innerHTML = ""; // Clear previous calendar entries

  let daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate(); // Get number of days in current month

  for (let i = 1; i <= daysInMonth; i++) {
    let date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      i
    ).toLocaleDateString(); // Get formatted date
    let moodEntry = savedMoods[date] || { mood: "-", emoji: "" }; // Default if no mood is logged

    // Add each day as a calendar entry with emoji
    calendarView.innerHTML += `<div class="entry ${moodEntry.mood}">
                                    ${i} <br> ${moodEntry.emoji} ${moodEntry.mood}
                                 </div>`;
  }
}
