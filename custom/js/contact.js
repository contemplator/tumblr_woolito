$(function() {
    $.getScript("https://www.gstatic.com/firebasejs/3.6.1/firebase.js", function() {
        var config = {
            apiKey: "AIzaSyBNy15wX554wZwTaHuiDTq4O_BA82yXUdE",
            authDomain: "woolito-tumblr-7b996.firebaseapp.com",
            databaseURL: "https://woolito-tumblr-7b996.firebaseio.com",
            storageBucket: "woolito-tumblr-7b996.appspot.com",
            messagingSenderId: "553913781545"
        };
        firebase.initializeApp(config);
        console.log("init firebase done!");
    });

    $(".idea #input-idea").focus(function() {
        if ($("#input-idea").val() == "任何我們能幫助您的需求都歡迎寫下來") {
            $("#input-idea").val("");
        }
    });

    $("#left-selector").draggable({
        axis: "x",
        containment: $(".type .input-field"),
        scroll: false,
        stop: fixLeftSelector
    });

    $("#right-selector").draggable({
        axis: "x",
        containment: $(".type .input-field"),
        scroll: false,
        stop: fixRightSelector
    });

    $("#right-selector").one("drag", function(event, ui) {
        $(".dragfield .tip").css("display", "none");
    });

    $(".idea .input-field textarea").focusout(function() {
        var idea = $("#input-idea").val();
        if (idea == "任何我們能幫助您的需求都歡迎寫下來" || idea == "") {
            $("#input-idea").val("任何我們能幫助您的需求都歡迎寫下來");
            $("#input-idea").css("color", "#aaa");
        } else {
            $("#input-idea").css("color", "#fff");
        }
    });

    $(".name .input-field").click(function() {
        $("#input-name").focus();
    });

    $(".phone .input-field").click(function() {
        $("#input-phone").focus();
    });

    $(".email .input-field").click(function() {
        $("#input-email").focus();
    });

    $(".type label").on("click", enable_type_radio);

    $("#btn-sender").click(function() {
        verifyInput();
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('.alert-success').on('closed.bs.alert', function() {
        location.reload();
    });

    $('.alert-danger').on('closed.bs.alert', function() {
        // do something let engineer know what happen.
    });
});

function validateNumber(element, value){
    var x = event.keyCode;
    var last = value.charAt(value.length-1);
    if(!("1234567890".indexOf(last) > -1)){
        value = value.substring(0, value.length-1);
    }

    // element.value = value.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
}

function enable_type_radio(element) {
    $(".type label img").attr("src", "http://static.tumblr.com/sirdwhf/7egof82eq/contact_uncheck_radio.png");
    $(element.currentTarget).find("img").attr("src", "http://static.tumblr.com/sirdwhf/S1Uof82e4/contact_check_radio.png");
}

function fixLeftSelector() {
    console.log("fixLeftSelector");
    var left = $("#left-selector").position().left;
    // console.log("left:" + left);
    var right = $("#right-selector").position().left;
    // console.log("right:" + right);
    if (left > right) {
        var keys_right = Object.keys(range_field_right_map);
        var keys_left = Object.keys(range_field_left_map);
        var index = keys_right.indexOf(right + "");
        left = parseInt(keys_left[index - 1]);
        if (index == 0) {
            // to fix the mininum key of range_field_left_map always set to index 6
            left = parseInt(keys_left[6]);
        }
    }
    var keys = Object.keys(range_field_left_map);
    var abses = [];
    for (i = 0; i < keys.length; i++) {
        var abs = Math.abs(left - keys[i]);
        abses.push(abs);
    }

    var min_diff = Math.min.apply(null, abses); // 取出比較值最小的
    var closest_index = abses.indexOf(min_diff); // 取出最小值的index
    var closest_value = keys[closest_index]; // 取出最小值是位在哪一個位置
    var budge = range_field_left_map[closest_value];

    $("#left-selector").css("left", closest_value + "px");
    $("#left-selector").attr("data-budget", budge);
    showBudgeRange();
}

function fixRightSelector() {
    var left = $("#left-selector").position().left;
    var right = $("#right-selector").position().left;
    if (right < left) {
        var keys_left = Object.keys(range_field_left_map);
        var keys_right = Object.keys(range_field_right_map);
        var index = keys_left.indexOf(left + "");
        right = parseInt(keys_right[index + 1]);
        if (!right) {
            right = parseInt(keys_right[0]);
        }
    }

    var keys = Object.keys(range_field_right_map);
    var abses = [];
    for (i = 0; i < keys.length; i++) {
        var abs = Math.abs(right - keys[i]);
        abses.push(abs);
    }

    var min_diff = Math.min.apply(null, abses); // 取出比較值最小的
    var closest_index = abses.indexOf(min_diff); // 取出最小值的index
    var closest_value = keys[closest_index]; // 取出最小值是位在哪一個位置
    var budge = range_field_right_map[closest_value];

    $("#right-selector").css("left", closest_value + "px");
    $("#right-selector").attr("data-budget", budge);
    showBudgeRange();
}

function showBudgeRange() {
    var left = parseInt($("#left-selector").position().left);
    var right = parseInt($("#right-selector").position().left);
    $("#result").text("$" + numeral(range_field_left_map[left]).format('0,0') + "~" + "$" + numeral(range_field_right_map[right]).format('0,0'));
    // $("#result").text("$"+(range_field_left_map[left].formatMoney(0)) + "~" + "$" + range_field_right_map[right].formatMoney(0));
}

function verifyInput() {
    $(".input-field").css("border", "3px solid #fff");
    $(".content .error").css("display", "none");
    var error = [];
    var idea = $("#input-idea").val();
    if (idea == "" || idea == "任何我們能幫助您的需求都歡迎寫下來") {
        error.push("idea");
    }

    var type = $("input[name='input-type']:checked").val();
    if (type == undefined) {
        type = null;
    }
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
    // console.log(error);
    for (var i = 0; i < error.length; i++) {
        switch (error[i]) {
            case "idea":
                $(".idea .input-field").css("border", "3px solid #E94D4C");
                $(".idea img.error").css("display", "inline");
                $(".idea label.error").css("display", "inline-block");
                break;
                // case "type":
                //     $(".type .input-field").css("border", "3px solid #ea4e4d");
                //     $(".type .error").css("visibility", "initial");
                //     break;
            case "name":
                $(".name .input-field").css("border", "3px solid #E94D4C");
                $(".name img.error").css("display", "inline");
                $(".name label.error").css("display", "inline-block");
                break;
            case "email":
                $(".email .input-field").css("border", "3px solid #E94D4C");
                $(".email img.error").css("display", "inline");
                $(".email label.error").css("display", "inline-block");
                break;
            default:
                break;
        }
    }

    if (error.length > 0) {
        return;
    }

    var min_budget = $("#left-selector").attr("data-budget");
    var max_budget = $("#right-selector").attr("data-budget");

    var datetime = new Date();

    var data = {
            time: datetime,
            idea: idea,
            type: type,
            name: name,
            email: email,
            min_budget: min_budget,
            max_budget: max_budget,
            phone: $("#input-phone").val()
        }
    console.log(data);

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
        min_budget: data.min_budget,
        max_budget: data.max_budget,
        phone: data.phone
    }).key;
    // console.log(newApplyKey);

    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbzjCXG4CFKRGDao1ygu8yaVQMDglLiGwmtSUnMASiKbQK4MvuHN/exec?&callback=?",
        dataType: "text",
        method: "POST",
        data: data,
        beforeSend: showLoading(),
        // error: showError(),
        // success: showSuccess()
    }).done(function(response) {
        console.log(response)
        hideLoading();
        successRedirect(response);
    });
}

function showLoading() {
    $(".mask").css("display", "inherit");
    $("#loading").css("display", "inherit");
}

function hideLoading() {
    $(".mask").css("display", "none");
    $("#loading").css("display", "none");
}

function hideAlert() {
    $(".alert").alert("close");
}

function showError() {
    $(".mask").css("display", "inherit");
    $("#alert-danger").css("display", "block");
    $("#alert-danger").addClass("in");
}

function successRedirect(response) {
    var startIndex = response.indexOf(":")+1;
    var row = response.substring(startIndex);
    location.href = "applySuccess?row="+row;
}

jQuery.fn.onPositionChanged = function(trigger, millis) {
    if (millis == null) millis = 100;
    var o = $(this[0]); // our jquery object
    if (o.length < 1) return o;

    var lastPos = null;
    var lastOff = null;
    setInterval(function() {
        if (o == null || o.length < 1) return o; // abort if element is non existend eny more
        if (lastPos == null) lastPos = o.position();
        if (lastOff == null) lastOff = o.offset();
        var newPos = o.position();
        var newOff = o.offset();
        if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
            $(this).trigger('onPositionChanged', { lastPos: lastPos, newPos: newPos });
            if (typeof(trigger) == "function") trigger(lastPos, newPos);
            lastPos = o.position();
        }
        if (lastOff.top != newOff.top || lastOff.left != newOff.left) {
            $(this).trigger('onOffsetChanged', { lastOff: lastOff, newOff: newOff });
            if (typeof(trigger) == "function") trigger(lastOff, newOff);
            lastOff = o.offset();
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
