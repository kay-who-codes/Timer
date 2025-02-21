let countdown;
const timeInput = document.getElementById("timeInput");
const stopButton = document.getElementById("stopButton");
const alarm = document.getElementById("alarm");

// Fetch and inject the header
fetch('https://kay-who-codes.github.io/Kay-App-Assets/Full Header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load header');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header').innerHTML = data;

    // Add event listeners after injecting the header
    const dropbtn = document.querySelector('.dropbtn');
    if (dropbtn) {
      dropbtn.addEventListener('click', toggleDropdown);
    }

    // Close dropdown when clicking outside
    window.addEventListener('click', (event) => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    });
  })
  .catch(error => {
    console.error('Error loading header:', error);
    document.getElementById('header').innerHTML = '<p>Header failed to load.</p>';
  });

// Toggle dropdown visibility
function toggleDropdown() {
  const dropdown = document.querySelector('.dropdown');
  dropdown.classList.toggle('show');
}

// Add event listeners for the custom number pad
document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    const value = key.dataset.value;

    if (key.classList.contains("clear")) {
      timeInput.value = "";
    } else if (key.classList.contains("start")) {
      startTimer();
    } else if (value) {
      timeInput.value += value;
    }
  });
});

// Add event listener for manual keyboard input
timeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    startTimer();
  }
});

// Start the timer
function startTimer() {
  clearInterval(countdown);

  const [minutes, seconds] = timeInput.value.split(":").map(Number);
  if (isNaN(minutes) || isNaN(seconds)) return alert("Invalid time format!");

  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds <= 0) return alert("Time must be greater than zero!");

  displayTime(totalSeconds);

  countdown = setInterval(() => {
    const remaining = --totalSeconds;

    if (remaining <= 0) {
      clearInterval(countdown);
      alarm.play();
      stopButton.classList.remove("hidden");
    } else {
      displayTime(remaining);
    }
  }, 1000);
}

// Format and display the countdown
function displayTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timeInput.value = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Stop the alarm
stopButton.addEventListener("click", () => {
  alarm.pause();
  alarm.currentTime = 0;
  stopButton.classList.add("hidden");
});
