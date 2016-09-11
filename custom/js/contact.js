var range_field_left_map = {};
var range_field_right_map = {};

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

    $.getScript("https://cdn.firebase.com/js/client/2.4.2/firebase.js", function() {
        var config = {
            apiKey: "AIzaSyD_aUK5etSpwD2Dp3jq0uFjypQxXKY5TUY",
            authDomain: "woolito-tumblr.firebaseapp.com",
            databaseURL: "https://woolito-tumblr.firebaseio.com",
            storageBucket: "woolito-tumblr.appspot.com",
        };
        firebase.initializeApp(config);
        console.log("init firebase done!");
    });
    
    $(".idea #input-idea").focus(function() {
        if($("#input-idea").val() == "任何我們能幫助您的需求都歡迎寫下來"){
            $("#input-idea").val("");
        }
    });

    $("#left-selector").draggable({ 
        axis: "x" ,
        containment: "parent parent",
        scroll: false
    });

    $("#right-selector").draggable({ 
        axis: "x" ,
        containment: "parent parent",
        scroll: false
    });

    $("#left-selector").onPositionChanged(function(){
        fixLeftSelector();
    });

    $("#right-selector").onPositionChanged(function(){
        $(".dragfield .tip").css("display", "none");
        fixRightSelector();
    });

    $(".idea .input-field textarea").focusout(function(){
        var idea = $("#input-idea").val();
        if(idea == "任何我們能幫助您的需求都歡迎寫下來" || idea == ""){
            $("#input-idea").val("任何我們能幫助您的需求都歡迎寫下來");
            $("#input-idea").css("color", "#aaa");
        }else{
            $("#input-idea").css("color", "#fff");
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

    $("#btn-sender").click(function() {
        verifyInput();
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('.alert-success').on('closed.bs.alert', function () {
        location.reload();
    });

    $('.alert-danger').on('closed.bs.alert', function () {
        // do something let engineer know what happen.
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
    } else {
        return false;
    }
}

// function initJqueryRange(){
//     $("#jquery-range").rangepicker({
//         startValue: "$0",
//         endValue: "$500,000",
//         translateSelectLabel: function(currentPosition, totalPosition) {
//             console.log(parseInt(100 * (currentPosition / totalPosition)));
//             return parseInt(100 * (currentPosition / totalPosition));
//             // return "<img src=\"../resources/contact_lefthand.png\"";
//         }
//     });
// }

function initRange(){
    range_field_left_map = {};
    range_field_right_map = {};
    var selector_width = $(".selector").width();
    var dragfield_width = $(".dragfield").width();
    var range_field_step = dragfield_width / 6;
    console.log("dragfield width: " + dragfield_width);
    console.log("selector width: " + selector_width);
    console.log("range field step: " + range_field_step);

    var max_values = $(".max-value");
    max_values.height($(".range-img").height());
    max_values_width = $(max_values[0]).width();
    $(max_values[0]).css("left", (0-max_values_width/2) + "px");
    $(max_values[1]).css("left", (6*range_field_step-max_values_width/2) + "px");
    $(max_values[1]).css("top", (0) + "px");

    $("#left-selector").css("left", (0-selector_width) + "px");
    $("#right-selector").css("left", (0) + "px");

    var range_field_left_left = 0-selector_width;
    var range_field_right_left = 0;
    var values = [0, 50000, 100000, 200000, 300000, 400000, 500000];
    range_field_left_map[range_field_left_left] = values[0];
    range_field_right_map[range_field_right_left] = values[0];
    for(var i=1; i<7; i++){
        range_field_left_left = 0 - selector_width + i * range_field_step;
        range_field_right_left = 0 + i * range_field_step;
        range_field_left_map[parseInt(range_field_left_left)] = values[i];
        range_field_right_map[parseInt(range_field_right_left)] = values[i];
    }
}

function fixLeftSelector(){
    var left = $("#left-selector").position().left;
    var right = $("#right-selector").position().left;
    if(left>right){
        var keys_right = Object.keys(range_field_right_map);
        var keys_left = Object.keys(range_field_left_map);
        var index = keys_right.indexOf(right+"");
        left = parseInt(keys_left[index-1]);
    }
    var keys = Object.keys(range_field_left_map);
    var abses = [];
    for(i=0;i<keys.length;i++){
        var abs = Math.abs(left-keys[i]);
        abses.push(abs);
    }

    var min_diff = Math.min.apply(null, abses); // 取出比較值最小的
    var closest_index = abses.indexOf(min_diff); // 取出最小值的index
    var closest_value = keys[closest_index]; // 取出最小值是位在哪一個位置
    var budge = range_field_left_map[closest_value];

    $("#left-selector").css("left", closest_value + "px");
    $("#left-selector").attr("data-budge", budge);
    showBudgeRange();
}

function fixRightSelector(){
    var left = $("#left-selector").position().left;
    var right = $("#right-selector").position().left;
    if(right<left){
        var keys_left = Object.keys(range_field_left_map);
        var keys_right = Object.keys(range_field_right_map);
        var index = keys_left.indexOf(left+"");
        right = parseInt(keys_right[index+1]);
    }
    var keys = Object.keys(range_field_right_map);
    var abses = [];
    for(i=0;i<keys.length;i++){
        var abs = Math.abs(right-keys[i]);
        abses.push(abs);
    }

    var min_diff = Math.min.apply(null, abses); // 取出比較值最小的
    var closest_index = abses.indexOf(min_diff); // 取出最小值的index
    var closest_value = keys[closest_index]; // 取出最小值是位在哪一個位置
    var budge = range_field_right_map[closest_value];
    
    $("#right-selector").css("left", closest_value + "px");
    $("#right-selector").attr("data-budge", budge);
    showBudgeRange();
}

function showBudgeRange(){
    var left = parseInt($("#left-selector").position().left);
    var right = parseInt($("#right-selector").position().left);
    $("#result").text("$"+numeral(range_field_left_map[left]).format('0,0') + "~" + "$" + numeral(range_field_right_map[right]).format('0,0'));
    // $("#result").text("$"+(range_field_left_map[left].formatMoney(0)) + "~" + "$" + range_field_right_map[right].formatMoney(0));
}

function verifyInput() {
    $(".input-field").css("border", "3px solid #fff");
    $(".content .error").css("visibility", "hidden");
    var error = [];
    var idea = $("#input-idea").val();
    if (idea == "" || idea == "任何我們能幫助您的需求都歡迎寫下來") {
        error.push("idea");
    }

    var type = $("input[name='input-type']:checked").val();
    // if (!type) {
    //     error.push("type");
    // }

    var name = $("#input-name").val();
    if (!name) {
        error.push("name");
    }

    var email = $("#input-email").val();
    if (!validateEmail(email)) {
        error.push("email");
    }
    console.log(error);
    for (var i = 0; i < error.length; i++) {
        switch (error[i]) {
            case "idea":
                $(".idea .input-field").css("border", "3px solid #ea4e4d");
                $(".idea .error").css("visibility", "initial");
                break;
            // case "type":
            //     $(".type .input-field").css("border", "3px solid #ea4e4d");
            //     $(".type .error").css("visibility", "initial");
            //     break;
            case "name":
                $(".name .input-field").css("border", "3px solid #ea4e4d");
                $(".name .error").css("visibility", "initial");
                break;
            case "email":
                $(".email .input-field").css("border", "3px solid #ea4e4d");
                $(".email .error").css("visibility", "initial");
                break;
            default:
                break;
        }
    }

    if (error.length > 0) {
        return;
    }

    var min_budge = $("#left-selector").attr("data-budge");
    var max_budge = $("#right-selector").attr("data-budge");

    var data = {
        idea: idea,
        type: type,
        name: name,
        email: email,
        min_budge: min_budge,
        max_budge: max_budge,
        phone: $("#input-phone").val()
    }
    // console.log(data);

    sendData(data);
}

function validateEmail(email) {
    var patt = /(\w*)@(\w+)\.(\w+)/g;
    return patt.test(email);
}

function sendData(data) {
    var newApplyKey = firebase.database().ref('apply').push({
        idea: data.idea,
        type: data.type,
        name: data.name,
        email: data.email,
        min_budge: data.min_budge,
        max_budge: data.max_budge,
        phone: data.phone
    }).key;
    console.log(newApplyKey);

    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbzjCXG4CFKRGDao1ygu8yaVQMDglLiGwmtSUnMASiKbQK4MvuHN/exec?&callback=?",
        dataType: "text",
        method: "GET",
        data: data,
        beforeSend: showMask(),
        // error: showError(),
        // success: showSuccess()
    }).done(function(response){
        console.log(response);
        hideMask();
        showSuccess();
    });
}

function showMask(){
    console.log("showMask");
    $("#mask").css("display", "inherit");
}

function hideMask(){
    console.log("hideMask");
    $("#mask").css("display", "none");
}

function hideAlert(){
    $(".alert").alert("close");
}

function showError(){
    $("#alert-danger").css("display", "block");
    $("#alert-danger").addClass("in");
}

function showSuccess(){
    $("#alert-success").css("display", "block");
    $("#alert-success").addClass("in");
}

jQuery.fn.onPositionChanged = function (trigger, millis) {
    if (millis == null) millis = 100;
    var o = $(this[0]); // our jquery object
    if (o.length < 1) return o;

    var lastPos = null;
    var lastOff = null;
    setInterval(function () {
        if (o == null || o.length < 1) return o; // abort if element is non existend eny more
        if (lastPos == null) lastPos = o.position();
        if (lastOff == null) lastOff = o.offset();
        var newPos = o.position();
        var newOff = o.offset();
        if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
            $(this).trigger('onPositionChanged', { lastPos: lastPos, newPos: newPos });
            if (typeof (trigger) == "function") trigger(lastPos, newPos);
            lastPos = o.position();
        }
        if (lastOff.top != newOff.top || lastOff.left != newOff.left) {
            $(this).trigger('onOffsetChanged', { lastOff: lastOff, newOff: newOff});
            if (typeof (trigger) == "function") trigger(lastOff, newOff);
            lastOff= o.offset();
        }
    }, millis);

    return o;
};

Number.prototype.formatMoney = function(fractionDigits, decimal, separator) {
    fractionDigits = isNaN(fractionDigits = Math.abs(fractionDigits)) ? 2 : fractionDigits;
    decimal = typeof(decimal) === "undefined" ? "." : decimal;
    separator = typeof(separator) === "undefined" ? "," : separator;
    var number = this;
    var neg = number < 0 ? "-" : "";
    var wholePart = parseInt(number = Math.abs(+number || 0).toFixed(fractionDigits)) + "";
    var separtorIndex = (separtorIndex = wholePart.length) > 3 ? separtorIndex % 3 : 0;
    return neg +
        (separtorIndex ? wholePart.substr(0, separtorIndex) + separator : "") +
        wholePart.substr(separtorIndex).replace(/(\d{3})(?=\d)/g, "$1" + separator) +
        (fractionDigits ? decimal + Math.abs(number - wholePart).toFixed(fractionDigits).slice(2) : "");
};