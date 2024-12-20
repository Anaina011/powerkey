
# Powerkey Project - Backend Documentation

## 1. Overview <a name="overview"></a>
This backend project is designed to manage products, projects, and careers using Firebase as the backend for data storage, authentication, and media management. The admin dashboard supports content creation and modification, while the public pages display the data dynamically.

---

## 2. Project Structure and Code Flow <a name="project-structure"></a>
1. **Admin Dashboard (`admin.html` and `admin.js`)**: 
   - Handles CRUD operations for products and projects.
   - Uses Firebase for real-time database and storage.
   - Implements session management with auto-logout.

2. **Products Page (`products.html` and `products.js`)**:
   - Displays products with pagination and search.
   - Fetches product data from Firebase.

3. **Projects Page (`projects.html` and `projects.js`)**:
   - Dynamically loads and displays project details.
   - Fetches data in reverse chronological order from Firebase.

4. **Careers Page (`career.html` and `career-open-positions.html`)**:
   - Displays job vacancies and allows users to apply.
   - Provides real-time search and filtering.

---

## 3. Detailed Code Breakdown <a name="code-breakdown"></a>

### Products Module <a name="products-module"></a>
- **Page:** `products.html`
- **Script:** `products.js`

**How It Works:**
1. On page load, `fetchAndDisplayProducts()` is called to retrieve all products from Firebase.
2. Products are displayed in pages (9 products per page).
3. The `searchProducts()` function filters products by name.

**Relevant Code:**
```javascript
function fetchAndDisplayProducts() {
    const db = firebase.database().ref("product");
    db.once("value", snapshot => {
        allProducts = snapshot.val();
        displayPage(allProducts, currentPage);
        createPaginationControls(allProducts);
    });
}
```

---

### Projects Module <a name="projects-module"></a>
- **Page:** `projects.html`
- **Script:** `projects.js`

**How It Works:**
1. On page load, `displayProjects()` fetches all projects from Firebase.
2. Projects are displayed in reverse order based on their timestamp.
3. Each project card contains an image and description.

**Relevant Code:**
```javascript
async function displayProjects() {
    const snapshot = await firebase.database().ref("project").orderByChild("timestamp").once("value");
    snapshot.forEach(childSnapshot => {
        const project = childSnapshot.val();
        // Create project cards dynamically
    });
}
```

---

### Careers Module <a name="careers-module"></a>
- **Pages:** 
  - `career.html`
  - `career-open-positions.html`

- **Scripts:**
  - `career.js`
  - `career-open-position.js`

**How It Works:**
1. **Vacancy Listing:** 
   - `career.js` loads the latest vacancies and supports category-based filtering.

2. **Vacancy Details:**
   - `career-open-position.js` extracts the vacancy ID from the URL and fetches corresponding details from Firebase.

**Relevant Code:**
```javascript
function loadVacancyDetails(vacancyId) {
    firebase.database().ref('vacancies/' + vacancyId).once('value').then(snapshot => {
        const vacancy = snapshot.val();
        // Display vacancy details dynamically
    });
}
```

---

## 4. Firebase Connections <a name="firebase-connections"></a>
- **Authentication:** 
  - Used for login/logout and auto-logout on inactivity.

- **Realtime Database:**
  - Stores products, projects, vacancies, and reviews.
  - Data retrieval happens asynchronously using `.once()` or `.on()`.

- **Storage:**
  - Images for products and projects are uploaded to Firebase Storage.
  - The download URLs are stored in the database.

**Example Connection:**
```javascript
const db = firebase.database().ref("product");
db.once("value").then(snapshot => {
    console.log("Products loaded:", snapshot.val());
});
```

---

## 4. Page Functionality <a name="page-functionality"></a>

### Products <a name="products"></a>
- **Page:** `products.html`
- **Script:** `products.js`

**Features:**
- **Pagination**: Displays 9 products per page with smooth navigation.
- **Search**: Real-time filtering based on product name.
- **Firebase Integration**: Fetches product details and dynamically generates cards.

**Key Function:**
```javascript
function fetchAndDisplayProducts() {
    firebase.database().ref("product").once("value").then(snapshot => {
        allProducts = snapshot.val();
        displayPage(allProducts, currentPage);
    });
}
```

---

### Projects <a name="projects"></a>
- **Page:** `projects.html`
- **Script:** `projects.js`

**Features:**
- **Dynamic Rendering**: Loads projects with images and descriptions.
- **Firebase Integration**: Retrieves projects sorted by timestamp.

**Key Function:**
```javascript
async function displayProjects() {
    const snapshot = await firebase.database().ref("project").orderByChild("timestamp").once("value");
    snapshot.forEach(childSnapshot => {
        const project = childSnapshot.val();
        // Create and display project cards
    });
}
```

---

### Careers <a name="careers"></a>
- **Pages:** 
  - `career-open-positions.html`: Displays individual vacancy details.
  - `career.html`: Lists vacancies with search and category filtering.
- **Scripts:**
  - `career-open-position.js`: Fetches and displays vacancy details based on URL parameters.
  - `career.js`: Manages vacancy search, category filtering, and real-time updates.

**Key Feature:**
- **Search and Filter Vacancies** using Fuse.js for real-time search:
```javascript
function searchVacancies(query) {
    const result = fuse.search(query);
    const filteredVacancies = result.map(item => item.item);
    // Display the filtered vacancies
}
```
## 5. Firebase Connections <a name="firebase-connections"></a>
- **Authentication:** 
  - Used for login/logout and auto-logout on inactivity.

- **Realtime Database:**
  - Stores products, projects, vacancies, and reviews.
  - Data retrieval happens asynchronously using `.once()` or `.on()`.

- **Storage:**
  - Images for products and projects are uploaded to Firebase Storage.
  - The download URLs are stored in the database.

**Example Connection:**
```javascript
const db = firebase.database().ref("product");
db.once("value").then(snapshot => {
    console.log("Products loaded:", snapshot.val());
});
```


---

## 6. Authentication Flow <a name="authentication-flow"></a>
1. **Login Process:** Managed via `login.js`.
2. **State Management:** 
   - Uses `firebase.auth().onAuthStateChanged()` to track user sessions.
3. **Auto-Logout:** 
   - Implemented in `credentials.js` to log out users after 30 minutes of inactivity.

**Auto-Logout Code:**
```javascript
function startAutoLogoutTimer() {
    setTimeout(() => {
        firebase.auth().signOut().then(() => {
            window.location.href = "login.html";
        });
    }, 1800000); // 30 minutes
}
```

## 6. Scripts and Dependencies <a name="scripts-and-dependencies"></a>
- **Firebase Libraries:** 
  - `firebase-app.js`: Core Firebase library.
  - `firebase-database.js`: Realtime Database support.
  - `firebase-auth.js`: Authentication module.

- **Front-End Dependencies:** 
  - Bootstrap: Styling and layout.

**External Libraries Example:**
```html
<script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-database.js"></script>
```

---
## Run the Application:**
   - Open `login.html` to access the admin dashboard.
   - Navigate to `products.html`, `projects.html`, or `career-open-positions.html` for public views.

---

## 7. Troubleshooting <a name="troubleshooting"></a>
- **Issue:** Products not displaying.
  - **Solution:** Verify Firebase configuration and data existence.

- **Issue:** Auto-logout not functioning.
  - **Solution:** Ensure `credentials.js` is properly included.

- **Issue:** Vacancy details not loading.
  - **Solution:** Confirm vacancy ID in the URL and check Firebase database permissions.

---

