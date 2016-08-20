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
            location.href = "works-mobile";
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