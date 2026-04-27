"use strict";

document.addEventListener("DOMContentLoaded", () => {

  //Eventlyssnare för hamburgermeny
  document.querySelector("#hamburger-menu").addEventListener("click", toggleMenu);
});

//togglefunktion för hamburgermeny
function toggleMenu() {
  const mainNavEl = document.querySelector("#main-nav");
  const hamMenuEl = document.querySelector("#hamburger-menu");

  if (mainNavEl.style.display === "block") {
    mainNavEl.style.display = "none";
    hamMenuEl.classList.remove("change");
  } else {
    mainNavEl.style.display = "block";
    hamMenuEl.classList.add("change");
  }
}