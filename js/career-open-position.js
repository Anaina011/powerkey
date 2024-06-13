// Get the vacancy ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const vacancyId = urlParams.get('id');
console.log('Vacancy ID from URL:', vacancyId); // Debugging statement

// Fetch and display vacancy details
function loadVacancyDetails(vacancyId) {
    if (!vacancyId) {
        document.getElementById('vacancy_details').innerHTML = '<p>Invalid vacancy ID</p>';
        return;
    }

    firebase.database().ref('vacancies/' + vacancyId).once('value').then((snapshot) => {
        const vacancy = snapshot.val();
        console.log('Fetched vacancy details:', vacancy); // Debugging statement
        if (vacancy) {
            const vacancyDetails = `
                <h1>${vacancy.jobName}</h1>
                <p><strong>Job Location:</strong> ${vacancy.jobLocation}</p>
                <p><strong>Job Shift:</strong> ${vacancy.jobShift}</p>
                <p><strong>Position Type:</strong> ${vacancy.positionType}</p>
                <p><strong>Job Category:</strong> ${vacancy.jobCategory}</p>
                <p><strong>Education Level:</strong> ${vacancy.educationLevel}</p>
                <h3>Job Details</h3>
                ${vacancy.jobDescription}
            `;
            document.getElementById('vacancy_details').innerHTML = vacancyDetails;
        } else {
            document.getElementById('vacancy_details').innerHTML = '<p>Vacancy not found</p>';
        }
    }).catch((error) => {
        console.error('Error fetching vacancy details:', error);
        document.getElementById('vacancy_details').innerHTML = '<p>Error loading vacancy details</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadVacancyDetails(vacancyId);

    // Set the vacancy_id hidden input field
    document.getElementById('vacancy_id').value = vacancyId;

    // Form submission handling
    document.getElementById('apply_form').addEventListener('submit', (e) => {
        e.preventDefault();
        e.target.submit(); // Proceed with form submission
    });
});
