$(function() {
    console.log("width: " + $(window).width());
    console.log("user agent: " + navigator.userAgent);
    if (!ismobile()) {
        location.href = "contact";
    }

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

    $(".idea .input-field").click(function() {
        $("#input-idea").focus();
    });

    $("#input-idea").focus(function() {
        $("#input-idea").val("");
    });

    $("#input-idea").focusout(function() {
        var idea = $("#input-idea").val();
        if (idea == "") {
            $("#input-idea").val("任何我們能幫助您的需求都歡迎寫下來");
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

    $("#btn-sender").click(function() {
        verifyInput();
    });

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

function verifyInput() {
    $(".content label.error").css("display", "none");
    var error = [];
    var idea = $("#input-idea").val();
    // if (idea == "" || idea == "任何我們能幫助您的需求都歡迎寫下來") {
    //     error = "idea";
    //     return;
    // }

    var type = $("input[name='input-type']:checked").val();
    if (!type) {
        error.push("type");
    }

    var name = $("#input-name").val();
    if (!name) {
        error.push("name");
    }

    var email = $("#input-email").val();
    if (!validateEmail(email)) {
        error.push("email");
    }

    for (var i = 0; i < error.length; i++) {
        switch (error[i]) {
            case "type":
                $(".type label.error").css("display", "initial");
                break;
            case "name":
                $(".name label.error").css("display", "initial");
                break;
            case "email":
                $(".email label.error").css("display", "initial");
                break;
            default:
                break;
        }
    }

    if (error.length > 0) {
        return;
    }

    var budge = $("option[name='input-budge']:selected").text();
    var budges = budge.split("-");
    var min_budge = budges[0].replace(",", "");
    var max_budge = budges[1].replace(",", "");
    var datetime = new Date();

    var data = {
        time: datetime,
        idea: idea,
        type: type,
        name: name,
        email: email,
        min_budge: min_budge,
        max_budge: max_budge,
        phone: $("#input-phone").val()
    }

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
        beforeSend: showLoading(),
        // error: showError(),
        // success: showSuccess()
    }).done(function(response){
        console.log(response);
        hideLoading();
        showSuccess();
    });
}

function showLoading(){
    $("#mask").css("display", "inherit");
    $("#loading").css("display", "inherit");
}

function hideLoading(){
    $("#mask").css("display", "none");
    $("#loading").css("display", "none");
}

function hideAlert(){
    $(".alert").alert("close");
}

function showError(){
    $("#mask").css("display", "inherit");
    $("#alert-danger").css("display", "block");
    $("#alert-danger").addClass("in");
}

function showSuccess(){
    $("#mask").css("display", "inherit");
    $("#alert-success").css("display", "block");
    $("#alert-success").addClass("in");
}
