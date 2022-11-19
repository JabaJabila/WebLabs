function get_location() {
    return document.location.toString().split('/').slice(-1)[0].replace(".html", "");
}

function highlight_page() {
    let location = get_location();

    let elems = document.getElementsByClassName("navigationMenu__navigationLink");
    for (let elem of elems) {
        elem.classList.remove("navigationMenu__navigationLink_currentPage");
    }

    document.getElementById(location).classList.add("navigationMenu__navigationLink_currentPage");
}

window.addEventListener("load", highlight_page);