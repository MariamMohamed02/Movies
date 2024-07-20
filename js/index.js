
function openNavbar(){
    $(".navbar").animate({left:0},500)
    $(".openNavbarIcon").removeClass("fa-align-justify")
    $(".openNavbarIcon").addClass("fa-x")   
    // link: go up, one after the other
    let time=500
    for(let i=0;i<6;i++){
        $(".links li").eq(i).animate({top:0},time+100)
        time+=100
    }
}

function closeNavbar(){
    let width=$(".navbar .nav-tab").outerWidth()
    $(".navbar").animate({left:-width},500)
    $(".openNavbarIcon").removeClass("fa-x")
    $(".openNavbarIcon").addClass("fa-align-justify")
    // links: go down
    let time=500
    for(let i=5;i>-1;i--){
        $(".links li").eq(i).animate({top:300},time+100)
        time+=100
    }  
}
closeNavbar()
// OPEN AND CLOSE NAVBAR
$(".navbar i.openNavbarIcon").click(()=>{
    if ($(".navbar").css("left")=="0px" ){
       closeNavbar()
    }
    else{
       openNavbar()
    }   
})


// Searching
// Your TMDb API key
const apiKey = 'eba8b9a7199efdcb0ca1f96879b83c44';

// Get references to the input field, results container, and navbar links
const searchInput = document.getElementById('search');
const resultsContainer = document.getElementById('search-results');
const navbarItems = document.querySelectorAll('ul.list-unstyled li');

// Add an event listener to the input field to trigger on every input event
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim(); // Get the current value of the input field and remove any leading/trailing whitespace
    if (query.length > 0) {
        searchMovies(query); // Call the searchMovies function with the current query
    } else {
        resultsContainer.innerHTML = ''; // Clear the results if the input field is empty
    }
});

// Function to search for movies using the TMDb API
async function searchMovies(query) {
    try {
        // Make a request to the TMDb API with the search query and API key
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const data = await response.json(); // Parse the JSON response
        displayResults(data.results); // Call the displayResults function with the results
    } catch (error) {
        console.error('Error fetching movie data:', error); // Log any errors to the console
    }
}


// Function to display the search results
const navTypes = {
    'Now Playing': 'nowPlaying',
    'Popular': 'popular',
    'Top Rated': 'topRated',
    'Trending': 'trending',
    'Upcoming': 'upcoming'
};

// Add event listeners to each navbar item
navbarItems.forEach(item => {
    // Set data-type attribute
    const text = item.textContent.trim();
    if (navTypes[text]) {
        item.setAttribute('data-type', navTypes[text]);

        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            fetchMovies(type);
        });
    }
});

// Function to fetch movies based on type
async function fetchMovies(type) {
    try {
        let url;
        switch(type) {
            case 'nowPlaying':
                url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
                break;
            case 'popular':
                url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
                break;
            case 'topRated':
                url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
                break;
            case 'trending':
                url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
                break;
            case 'upcoming':
                url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;
                break;
            default:
                url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`; // Default to now playing
        }
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.results); // Call the displayResults function with the results
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

// Function to generate star rating
function generateStars(rating) {
    const maxStars = 5;
    const fullStars = Math.floor(rating / 2); // Since the rating is out of 10, divide by 2 to get full stars
    const halfStar = (rating % 2) >= 1 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    let stars = '';
    stars += '★'.repeat(fullStars); // Full stars
    if (halfStar) stars += '☆'; // Half star
    stars += '☆'.repeat(emptyStars); // Empty stars

    return stars;
}

// Function to display the search results
function displayResults(movies) {
    resultsContainer.innerHTML = ''; // Clear any previous results

    if (movies.length === 0) {
        resultsContainer.innerHTML = '<p>No movies found.</p>'; // Display a message if no movies are found
    } else {
        let row = document.createElement('div'); // Create a new div for the row
        row.className = 'movie-row'; // Add a class to the row for styling
        resultsContainer.appendChild(row); // Append the row to the results container

        movies.forEach((movie, index) => {
            // Create a new div for each movie
            const movieElement = document.createElement('div');
            movieElement.className = 'movie-item'; // Add a class to the movie item for styling

            // Set the inner HTML of the div element to include the movie poster and overlay
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" />
                <div class="movie-overlay">
                    <h3>${movie.title}</h3>
                    <p>${movie.overview}</p>
                    <p>First Air Date: ${movie.release_date ? movie.release_date : 'N/A'}</p>
                    <p>Rating: <span class="star-rating">${generateStars(movie.vote_average)}</span> <span class="vote-number">${movie.vote_average}</span></p>
                </div>
            `;

            row.appendChild(movieElement); // Append the movie element to the row

            // After adding 3 movies, create a new row
            if ((index + 1) % 3 === 0) {
                row = document.createElement('div');
                row.className = 'movie-row';
                resultsContainer.appendChild(row);
            }
        });
    }
}

// Default to displaying now playing movies on page load
fetchMovies('nowPlaying');

// FORM VALIDATION

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{11}$/; // 11 digits
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, including numbers

// Select form fields and error messages
const form = document.querySelector('form');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const phoneField = document.getElementById('phone');
const ageField = document.getElementById('age');
const passwordField = document.getElementById('password');
const repasswordField = document.getElementById('repassword');
const submitBtn = document.querySelector('.form-btn');

// Validation functions
function validateName() {
    if (nameField.value.trim() === '') {
        setError(nameField, 'Name is required.');
    } else {
        clearError(nameField);
    }
}

function validateEmail() {
    if (!emailRegex.test(emailField.value.trim())) {
        setError(emailField, 'Invalid Email, try example@domain.com');
    } else {
        clearError(emailField);
    }
}

function validatePhone() {
    if (!phoneRegex.test(phoneField.value.trim())) {
        setError(phoneField, 'Invalid phone number');
    } else {
        clearError(phoneField);
    }
}

function validateAge() {
    const age = parseInt(ageField.value.trim(), 10);
    if (isNaN(age) || age <= 16) {
        setError(ageField, 'Your age must be over 16+');
    } else {
        clearError(ageField);
    }
}

function validatePassword() {
    if (!passwordRegex.test(passwordField.value.trim())) {
        setError(passwordField, 'Password must contain numbers and letters at least 8 characters');
    } else {
        clearError(passwordField);
    }
}

function validateRepassword() {
    if (passwordField.value.trim() !== repasswordField.value.trim()) {
        setError(repasswordField, "Passwords don't match");
    } else {
        clearError(repasswordField);
    }
}

// Helper functions to set and clear error messages
function setError(field, message) {
    const errorElement = field.nextElementSibling;
    field.classList.add('invalid');
    errorElement.textContent = message;
    submitBtn.classList.add('invalid'); // Make button red
}

function clearError(field) {
    const errorElement = field.nextElementSibling;
    field.classList.remove('invalid');
    errorElement.textContent = '';
    submitBtn.classList.remove('invalid'); // Revert button to default
}

// Event listeners for live validation
nameField.addEventListener('input', validateName);
emailField.addEventListener('input', validateEmail);
phoneField.addEventListener('input', validatePhone);
ageField.addEventListener('input', validateAge);
passwordField.addEventListener('input', validatePassword);
repasswordField.addEventListener('input', validateRepassword);

// Form submission event
form.addEventListener('submit', (event) => {
    validateName();
    validateEmail();
    validatePhone();
    validateAge();
    validatePassword();
    validateRepassword();

    // Prevent submission if any validation fails
    if (document.querySelectorAll('.invalid').length > 0) {
        event.preventDefault();
    }
});

