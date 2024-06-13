let allVacancies = [];
let fuse;

// Function to load only the latest 10 vacancies initially
function loadLatestVacancies() {
    const vacancyList = document.getElementById('vacancy_list');
    firebase.database().ref('vacancies').orderByChild('timestamp').limitToLast(10).on('value', (snapshot) => {
        vacancyList.innerHTML = ''; // Clear the list
        const vacancies = [];
        snapshot.forEach((childSnapshot) => {
            vacancies.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });

        // Reverse the array to show the latest vacancy on top
        vacancies.reverse();

        // Display vacancies
        vacancies.forEach((vacancy) => {
            const vacancyItem = document.createElement('div');
            vacancyItem.className = 'vacancy-item';
            vacancyItem.innerHTML = `<h3><a href="career-open-positions.html?id=${vacancy.key}">${vacancy.jobName}</a></h3>`;
            vacancyList.appendChild(vacancyItem);
        });
    });
}


// Function to fetch all vacancies for search operations
function fetchAllVacancies() {
    firebase.database().ref('vacancies').once('value', (snapshot) => {
        allVacancies = []; // Clear the global array
        snapshot.forEach((childSnapshot) => {
            allVacancies.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });
        console.log('All vacancies fetched:', allVacancies); // Debugging statement

        // Initialize Fuse.js
        const options = {
            keys: ['jobName'], // Search only in the jobName field
            threshold: 0.3     // Adjust threshold for matching sensitivity
        };
        fuse = new Fuse(allVacancies, options);
    });
}

// Function to perform search operation using Fuse.js
function searchVacancies(query) {
    const vacancyList = document.getElementById('vacancy_list');
    const result = fuse.search(query);
    const filteredVacancies = result.map(resultItem => resultItem.item);

    // Display the filtered vacancies
    vacancyList.innerHTML = ''; // Clear the list
    filteredVacancies.forEach((vacancy) => {
        const vacancyItem = document.createElement('div');
        vacancyItem.className = 'vacancy-item';
        vacancyItem.innerHTML = `<h3><a href="career-open-positions.html?id=${vacancy.key}">${vacancy.jobName}</a></h3>`;
        vacancyList.appendChild(vacancyItem);
    });
}

// Real-time search as user types
document.getElementById('quick_search_input').addEventListener('input', (e) => {
    const searchInput = e.target.value;
    searchVacancies(searchInput);
});

// Fetch vacancies initially
fetchAllVacancies();

// Function to populate categories in the dropdown
function populateCategoryDropdown() {
    const categoryDropdown = document.getElementById('category_dropdown');

    // Fetch all vacancies to extract unique categories
    firebase.database().ref('vacancies').once('value', (snapshot) => {
        const categories = new Set();
        snapshot.forEach((childSnapshot) => {
            const vacancy = childSnapshot.val();
            if (vacancy.jobCategory) {
                categories.add(vacancy.jobCategory);
            }
        });

        // Populate the dropdown with unique categories
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.text = category;
            categoryDropdown.appendChild(option);
        });
    });
}

// Function to filter vacancies by category
function filterVacanciesByCategory(category) {
    const vacancyList = document.getElementById('vacancy_list');
    firebase.database().ref('vacancies').orderByChild('jobCategory').equalTo(category).on('value', (snapshot) => {
        vacancyList.innerHTML = ''; // Clear the list
        snapshot.forEach((childSnapshot) => {
            const vacancy = { key: childSnapshot.key, ...childSnapshot.val() };
            const vacancyItem = document.createElement('div');
            vacancyItem.className = 'vacancy-item';
            vacancyItem.innerHTML = `<h3><a href="career-open-positions.html?id=${vacancy.key}">${vacancy.jobName}</a></h3>`;
            vacancyList.appendChild(vacancyItem);
        });
    });
}

// Initial load of the latest vacancies and fetching all vacancies for search operations
document.addEventListener('DOMContentLoaded', () => {
    loadLatestVacancies();
    fetchAllVacancies();
    populateCategoryDropdown();
});

// Event listener for category dropdown change
document.getElementById('category_dropdown').addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory) {
        filterVacanciesByCategory(selectedCategory);
    } else {
        loadLatestVacancies(); // If no category is selected, load the latest vacancies
    }
});



// Fetch vacancies initially
fetchAllVacancies();


// Reset functionality
document.getElementById('reset_button').addEventListener('click', () => {
    document.getElementById('quick_search_input').value = '';
    document.getElementById('category_dropdown').value = '';
    loadLatestVacancies(); // Reload the latest 10 vacancies
});