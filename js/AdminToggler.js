function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin_career, .admin_right, .admin_project, .admin_news, .admin_reviews, .admin_solutions').forEach(function (el) {
        el.style.display = 'none';
    });

    // Remove active class from all sidebar items
    document.querySelectorAll('.admin_sidebar_sec div').forEach(function (el) {
        el.classList.remove('active');
    });

    // Remove active class from all sidebar items
    document.querySelectorAll('.admin_sidebar_mobile div').forEach(function (el) {
        el.classList.remove('active');
    });

    // Show the selected section and add active class to the corresponding sidebar item
    switch (section) {
        case 'career':
            document.querySelector('.admin_career').style.display = 'flex';
            document.querySelector('.admin_sidebar_careers').classList.add('active');
            document.querySelector('.admin_sidebar_mobile_career').classList.add('active');
            break;
        case 'products':
            document.querySelector('.admin_right').style.display = 'block';
            document.querySelector('.admin_sidebar_products').classList.add('active');
            document.querySelector('.admin_sidebar_mobile_products').classList.add('active');
            break;
        case 'projects':
            document.querySelector('.admin_project').style.display = 'block';
            document.querySelector('.admin_sidebar_projects').classList.add('active');
            document.querySelector('.admin_sidebar_mobile_projects').classList.add('active');
            break;
        case 'reviews':
            document.querySelector('.admin_reviews').style.display = 'block';
            document.querySelector('.admin_sidebar_reviews').classList.add('active');
            document.querySelector('.admin_sidebar_mobile_reviews').classList.add('active');
            break;
        // case 'news':
        //     document.querySelector('.admin_news').style.display = 'block';
        //     document.querySelector('.admin_sidebar_news').classList.add('active');
        //     document.querySelector('.admin_sidebar_mobile_news').classList.add('active');
        //     break;
        case 'solutions':
            document.querySelector('.admin_solutions').style.display = 'block';
            document.querySelector('.admin_sidebar_solutions').classList.add('active');
            break;
        default:
            break;
    }
}

// Initialize the first section to be displayed
showSection('career');