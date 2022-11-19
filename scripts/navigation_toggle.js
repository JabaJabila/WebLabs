function toggle_hamburger() {
    let elem = document.getElementById("main_navigation");
    elem.classList.toggle("navigationMenu__container_deactivated");
    elem.classList.toggle("navigationMenu__container_active");

    elem = document.getElementsByClassName("navigationMenu__navigation")[0];
    elem.classList.toggle("navigationMenu__navigation_deactivated");
    elem.classList.toggle("navigationMenu__navigation_active");
}