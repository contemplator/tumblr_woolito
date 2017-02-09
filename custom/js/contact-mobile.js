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

    $(".idea .input-field").click(function() {
        $("#input-idea").focus();
    });

    $("#input-idea").focus(function() {
        var idea = $("#input-idea").val();
        if(idea == "任何我們能幫助您的需求都歡迎寫下來"){
            $("#input-idea").val("");    
        }
    });

    $("#input-idea").focusout(function() {
        var idea = $("#input-idea").val();
        if (idea == "任何我們能幫助您的需求都歡迎寫下來" || idea == "") {
            $("#input-idea").val("任何我們能幫助您的需求都歡迎寫下來");
            $("#input-idea").css("color", "#aaa");
        } else {
            $("#input-idea").css("color", "#fff");
        }
    });

    $(".budget .input-field").on("click", show_budget_select);

    $(".budget .budget-choice").on("click", choose_budget);

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

});

function show_budget_select() {
    $('#budget-modal').modal('show');
}

function choose_budget(event){
    $("#input-budget").text(event.currentTarget.innerText);
    $(".budget-choice").css("background-color", "#fff");
    $(event.currentTarget).css("background-color", "#ccc");
    $('#budget-modal').modal('hide');
}

function verifyInput() {
    $(".content label.error").css("display", "none");
    var error = [];
    var idea = $("#input-idea").val();

    var name = $("#input-name").val();
    if (!name) {
        error.push("name");
    }

    var email = $("#input-email").val();
    if (!validateEmail(email)) {
        error.push("email");
    }

    var company = $("#input-company").val().trim();

    for (var i = 0; i < error.length; i++) {
        switch (error[i]) {
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

    var budget = $("#input-budget").text();
    var min_budget = "";
    var max_budget = "無預算限制";
    if(budget.indexOf("~") > 0){
        var budgets = budget.split("~");
        min_budget = budgets[0].trim();
        max_budget = budgets[1].trim();
    }else{
        min_budget = "";
        max_budget = "無預算限制";
    }
    
    var datetime = new Date();

    var data = {
        time: datetime,
        idea: idea,
        name: name,
        email: email,
        min_budget: min_budget,
        max_budget: max_budget,
        phone: $("#input-phone").val(),
        company: company
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
        name: data.name,
        email: data.email,
        min_budget: data.min_budget,
        max_budget: data.max_budget,
        phone: data.phone,
        company: data.company
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

function successRedirect(response) {
    var startIndex = response.indexOf(":")+1;
    var row = response.substring(startIndex);
    location.href = "applySuccess?row="+row;
}

function validatePhone(element, value){
    var x = event.keyCode;
    var last = value.charAt(value.length-1);
    if(!("1234567890".indexOf(last) > -1)){
        value = value.substring(0, value.length-1);
    }

    element.value = value.replace(/(\d\d\d\d)(\d\d\d)(\d\d\d)/, "$1-$2-$3");
}