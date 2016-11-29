var isBudgetDefault = false;

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

    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500000,
        step: 50000,
        values: [ 100000, 200000 ],
        slide: function( event, ui ) {
            numeral(1000).format('0,0')
            $("#min").text(numeral(ui.values[0]).format('0,0'));
            $("#max").text(numeral(ui.values[1]).format('0,0'));
        }
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

function validatePhone(element, value){
    var x = event.keyCode;
    var last = value.charAt(value.length-1);
    if(!("1234567890".indexOf(last) > -1)){
        value = value.substring(0, value.length-1);
    }

    element.value = value.replace(/(\d\d\d\d)(\d\d\d)(\d\d\d)/, "$1-$2-$3");
}

function enable_type_radio(element) {
    $(".type label img").attr("src", "http://static.tumblr.com/sirdwhf/7egof82eq/contact_uncheck_radio.png");
    $(element.currentTarget).find("img").attr("src", "http://static.tumblr.com/sirdwhf/S1Uof82e4/contact_check_radio.png");
}

function verifyInput() {
    $(".input-field").css("border", "3px solid #fff");
    $(".content .error").css("display", "none");
    var error = [];
    var idea = $("#input-idea").val();
    if (idea == "" || idea == "任何我們能幫助您的需求都歡迎寫下來") {
        error.push("idea");
    }

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

    var datetime = new Date();
    var min_budget, max_budget;
    if(isBudgetDefault == true){
        min_budget = "";
        max_budget = "無預算限制";
    }else{
        min_budget = $("#min").text();
        max_budget = $("#max").text();
    }

    var data = {
            time: datetime,
            idea: idea,
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

function changeBudget(element){
    isBudgetDefault = element.checked;
    if(isBudgetDefault){
        $("#slider-range").slider("disable");
        $("#result").css("color", "#7c545a");
    }else{
        $("#slider-range").slider("enable");
        $("#result").css("color", "#ff373b");
    }
    console.log(isBudgetDefault);
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
