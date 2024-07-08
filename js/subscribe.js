document.getElementById('downloadEmailsButton').addEventListener('click', () => {
    db.collection('subscribers').orderBy('timestamp').get().then((querySnapshot) => {
        let emails = [];
        querySnapshot.forEach((doc) => {
            emails.push(doc.data().email);
        });
        
        let csvContent = "data:text/csv;charset=utf-8,Email\n" + emails.join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "subscribers_emails.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "subscribers_emails.csv"
    }).catch((error) => {
        console.error('Error fetching emails: ', error);
    });
});
