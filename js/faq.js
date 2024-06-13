$(document).ready(function() {
    $('.home_faq_question').click(function() {
        // Toggle the active class to expand or collapse
        $(this).toggleClass('active');
        
        // Collapse all other questions
        $('.home_faq_question').not($(this)).removeClass('active');
    });
});
