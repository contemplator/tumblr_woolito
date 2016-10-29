console.log("width: " + window.innerWidth);
console.log("user agent: " + navigator.userAgent);
console.log(get_current_location());
var current_location = get_current_location();
if (ismobile() || ismobile_size()) {
    if (current_location.indexOf("mobile") > -1) {
        // break;
    } else {
        current_location = current_location + "-mobile";
        // console.log(current_location);
        location.href = current_location;
    }
} else {
    if (current_location.indexOf("mobile") > -1) {
        current_location = current_location.slice(0, current_location.indexOf("-"));
        // console.log(current_location);
        location.href = current_location;
    } else {
        // break;
    }
}

window.addEventListener("resize", function() {
    if (ismobile() || ismobile_size()) {
        if (current_location.indexOf("mobile") > -1) {
            // break;
        } else {
            current_location = current_location + "-mobile";
            // console.log(current_location);
            location.href = current_location;
        }
    } else {
        if (current_location.indexOf("mobile") > -1) {
            current_location = current_location.slice(0, current_location.indexOf("-"));
            // console.log(current_location);
            location.href = current_location;
        } else {
            // break;
        }
    }
});

function get_current_location() {
    var path = location.pathname;
    var matches = path.match(/\/[a-zA-Z0-9\-\_]*/g);
    var current_location = matches[matches.length - 1].substring(1);
    return current_location;
}

function ismobile() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

function ismobile_size() {
    var width = window.innerWidth;
    if (width <= 768) {
        return true;
    } else {
        return false;
    }
}
