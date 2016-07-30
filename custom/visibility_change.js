var visProp = getHiddenProp();
if (visProp) {
    var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
    document.addEventListener(evtname, visChange);
}

function getHiddenProp() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document) {
        return 'hidden'
    };

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'Hidden') in document) {
            console.log(prefixes[i] + 'Hidden')
            return prefixes[i] + 'Hidden';
        }
    }

    // otherwise it's not supported
    return null;
}

function visChange() {
    if (isHidden()) {
        $("#preview_youtube").attr("class", "preview_hide");
        $("#preview_youtube figure iframe").attr("src", "");
        console.log("Tab Hidden!");
    } else {
        console.log("Tab Visible!");
    }
}

function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;

    return document[prop];
}