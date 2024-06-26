 // Subscribe Function
 function subscribe() {
    const email = document.getElementById('emailInput').value;
    if (email) {
        const newEmailRef = firebase.database().ref('emails').push();
        newEmailRef.set({
            email: email
        }).then(() => {
            alert('Subscribed successfully!');
        }).catch(error => {
            console.error('Error subscribing:', error);
        });
    } else {
        alert('Please enter a valid email address.');
    }
}

// Download Emails Function
function downloadEmails() {
    firebase.database().ref('emails').once('value').then(snapshot => {
        const emails = [];
        snapshot.forEach(childSnapshot => {
            emails.push(childSnapshot.val().email);
        });
        const csvContent = "data:text/csv;charset=utf-8," + emails.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "emails.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch(error => {
        console.error('Error fetching emails:', error);
    });
}