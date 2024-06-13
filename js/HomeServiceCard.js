$(document).ready(function () {
    $('.home_services_cards_container').slick({
        infinite: false,
        slidesToShow: 3.3,
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
                    slidesToShow: 1.3,
                    slidesToScroll: 1
                }
            }
        ]
    });
});


$(document).ready(function () {
    $('.home_service_project').slick({
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
                    slidesToShow: 1.3,
                    slidesToScroll: 1
                }
            }
        ]
    });
});



