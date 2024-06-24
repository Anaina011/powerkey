console.log("Firebase initialized:", firebaseConfig);

    var database = firebase.database();

    function subscribe() {
        var email = document.getElementById('email').value;
        console.log('Email entered:', email);
        if (email) {
            database.ref('subscribers/').push({
                email: email
            }).then(function() {
                alert('Subscribed successfully!');
            }).catch(function(error) {
                console.error('Error subscribing: ', error);
            });
        } else {
            alert('Please enter a valid email address.');
        }
    }

    function downloadEmails() {
        database.ref('subscribers/').once('value', function(snapshot) {
            var subscribers = snapshot.val();
            var csvContent = "data:text/csv;charset=utf-8,Email\n";
            for (var key in subscribers) {
                if (subscribers.hasOwnProperty(key)) {
                    csvContent += subscribers[key].email + "\n";
                }
            }
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "subscribers.csv");
            document.body.appendChild(link); // Required for FF
            link.click(); // This will download the data file named "subscribers.csv".
        });
    }

    // Test Firebase write access
    database.ref('test/').set({
        test: "test value"
    }).then(function() {
        console.log('Test write successful!');
    }).catch(function(error) {
        console.error('Error writing test value: ', error);
    });