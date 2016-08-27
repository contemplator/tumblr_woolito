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
    
    $(".idea #input-idea").focus(function() {
        if($("#input-idea").val() == "任何我們能幫助您的需求都歡迎寫下來"){
            $("#input-idea").val("");
        }
    });

    $("#left-selector").draggable({ 
        axis: "x" ,
        containment: "parent",
        scroll: false
    });

    $("#right-selector").draggable({ 
        axis: "x" ,
        containment: "parent",
        scroll: false
    });

    $("#left-selector").onPositionChanged(function(){
        fixLeftSelector();
    });

    $("#right-selector").onPositionChanged(function(){
        fixRightSelector();
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

    initRange();
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

function initRange(){
    var selector_width = $(".selector").width();
    var dragfield_width = $(".dragfield").width() - selector_width*2;
    var range_field_step = dragfield_width / 6;
    // var value_index = range_field_left;
    // left : 0, 538
    // right : 39, 577
    console.log("dragfield width: " + dragfield_width);
    console.log("selector width: " + selector_width);
    console.log("range field step: " + range_field_step);
    var range_field_left_left = 0;
    var range_field_right_left = 0 + selector_width;
    var range_field_left_rigth = 0 + dragfield_width - selector_width;
    var range_field_right_rigth = dragfield_width;
    var values = [0, 50000, 100000, 200000, 300000, 400000, 500000];
    $("#left-selector").css("left", range_field_left_left);
    $("#right-selector").css("left", (range_field_right_left+range_field_step));
    range_field_left_map[range_field_left_left] = values[0];
    range_field_right_map[range_field_right_left] = values[0];
    for(var i=1; i<7; i++){
        range_field_left_left += range_field_step;
        range_field_right_left += range_field_step;
        range_field_left_map[parseInt(range_field_left_left)] = values[i];
        range_field_right_map[parseInt(range_field_right_left)] = values[i];
    }
}

function fixLeftSelector(){
    var left = $("#left-selector").position().left;
    var right = $("#right-selector").position().left;
    if(left>right){
        left = right;
    }
    var keys = Object.keys(range_field_left_map);
    var abses = [];
    for(i=0;i<keys.length;i++){
        var abs = Math.abs(left-keys[i]);
        abses.push(abs);
    }
    // console.log(abses); // 所有比較值得陣列
    var min_diff = Math.min.apply(null, abses); // 取出比較值最小的
    var closest_index = abses.indexOf(min_diff); // 取出最小值的index
    var closest_value = keys[closest_index]; // 取出最小值是位在哪一個位置

    $("#left-selector").css("left", closest_value + "px");
    showBudgeRange();
}

function fixRightSelector(){
    var left = $("#left-selector").position().left;
    var right = $("#right-selector").position().left;
    if(right<left){
        right = left;
    }
    var keys = Object.keys(range_field_right_map);
    var abses = [];
    for(i=0;i<keys.length;i++){
        var abs = Math.abs(right-keys[i]);
        abses.push(abs);
    }
    $("#right-selector").css("left", keys[abses.indexOf(Math.min.apply(null, abses))] + "px");
    showBudgeRange();
}

function showBudgeRange(){
    var left = parseInt($("#left-selector").position().left);
    var right = parseInt($("#right-selector").position().left);
    $("#result").text("$"+(range_field_left_map[left].formatMoney(0)) + "~" + "$" + range_field_right_map[right].formatMoney(0));
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