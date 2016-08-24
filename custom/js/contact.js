$(function(){
	console.log("width: " + $(window).width());
    console.log("user agent: " + navigator.userAgent);
	if (ismobile()) {
        location.href = "contact-mobile";
    } else {
        if (ismobile_size()) {
            location.href = "contact-mobile";
        }
    }

    $(window).resize(function() {
        if (ismobile_size()) {
            location.href = "contact-mobile";
        }
    });

    initImageMap();
    
    $(".idea #input-idea").focus(function() {
        if($("#input-idea").val() == "任何我們能幫助您的需求都歡迎寫下來"){
            $("#input-idea").val("");
        }
    });

	$(".name .input-field").click(function(){
		$("#input-name").focus();
	});

	$(".phone .input-field").click(function(){
		$("#input-phone").focus();
	});

	$(".email .input-field").click(function(){
		$("#input-email").focus();
	});
});

function ismobile() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

function ismobile_size() {
    var width = $(window).width();
    var href = location.href;
    var index = href.lastIndexOf("/") + 1;
    href = href.substring(index);
    // console.log(width + ", " + href);
    if (width <= 768) {
        return true;
        // location.href = "works-mobile.html";
    } else {
        return false;
        // location.href = "works.html";
    }
}

function initImageMap(){
    // $("area").click(function(){
    //     console.log($(this).attr("id"));
    // });

    $('img[usemap]').rwdImageMaps();
    $("#left-selector").css("position", "relative");
    $("#left-selector").css("visibility", "initial");
    $("#left-selector").css("left", 0);
    $("#right-selector").css("position", "relative");
    $("#right-selector").css("visibility", "initial");
    $("#right-selector").css("left", 0);
    // $("#0t")
}