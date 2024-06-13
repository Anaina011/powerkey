
$(document).ready(function () {
    $('.about_team_card_container').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false, // Hide the previous and next arrows
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2.5,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.2,
                    slidesToScroll: 1
                }
            }
        ]
    });
});
