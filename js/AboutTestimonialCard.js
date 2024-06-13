$(document).ready(function() {
    $('.about_testimonial_container').slick({
        infinite: false,
        slidesToShow: 2.3,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 1.3,
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
