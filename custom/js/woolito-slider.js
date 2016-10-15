$(function(){
    $(".drawer").on("show.bs.drawer", function(e){
        $(".mask").css("display", "initial");
        // console.log("show");
    });

    $(".drawer").on("hide.bs.drawer", function(e){
        $(".mask").css("display", "none");
        // console.log("hide");
    });

    $(".drawer_icon").on("click", function() {
        $('.drawer').drawer('show');
    });

    $("body").on("swiperight", function(e){
        $(".drawer").drawer("show");
    });

    $("body").on("swipeleft", function(e){
        $(".drawer").drawer("hide");
    });

    $(".mask").on("click", function(e){
        // console.log("click");
        $(".drawer").drawer("hide");
    });
});