$(function() {
    var swipeElement = document.documentElement;
    var $drawer = $('.drawer');
    var hammer = new Hammer(swipeElement);
    hammer.add(new Hammer.Pan({
        threshold: 60
    }));

    hammer.set({
        touchAction: 'auto'
    });

    $(".drawer").on("show.bs.drawer", function(e) {
        $(".mask").css("display", "initial");
    });

    $(".drawer").on("hide.bs.drawer", function(e) {
        $(".mask").css("display", "none");
    });

    $(".drawer_icon").on("click", function() {
        $drawer.drawer('show');
    });

    $(".mask").on("click", function(e) {
        $drawer.drawer("hide");
    });

    hammer.on("panleft panright", function(event) {
        switch (event.type) {
            case "panleft":
                $drawer.drawer("hide");
                break;
            case "panright":
                $drawer.drawer("show");
                break;
            default:
                break;
        }
    })
});