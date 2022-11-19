function loading_time() {
    document.getElementById("page_load_time").innerHTML = (performance.now() / 1000).toFixed(3);
    document.getElementById("page_load_message").style.visibility = "visible";
}

window.addEventListener("load", loading_time);