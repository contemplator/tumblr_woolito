$(document).ready(function() {
    $(".drawer").drawer({
        iscroll: {
            // Configuring the iScroll
            // https://github.com/cubiq/iscroll#configuring-the-iscroll
            mouseWheel: true,
            preventDefault: false
        }
    });

    // for desktop
    $(".drawer").on("swipe", function(e) {
        var start_x = e.swipestart.coords[0];
        var stop_x = e.swipestop.coords[0];
        if (stop_x > start_x) {
            console.log("swipe right");
            $('.drawer').drawer('open');
        } else {
            console.log("swipe left");
            $('.drawer').drawer('close');
        }
    });

    // for mobile
    $(".drawer").on("touchstart", function(e) {
        var start_x = e.originalEvent.touches[0].pageX;
        var stop_x = start_x;
        $(".drawer").on("touchend", function(e) {
            stop_x = e.originalEvent.changedTouches[0].pageX;
            if (stop_x < start_x) {
                console.log("touch left");
                $('.drawer').drawer('close');
            } else {
                // console.log("touch right");
                // $('.drawer').drawer('open');
            }
            $(".drawer").off("touchend");
        });
    });

    $(".drawer_icon").on("click", function() {
        $('.drawer').drawer('open');
    });
});
