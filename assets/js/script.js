// script.js

document.addEventListener("DOMContentLoaded", function () { const menuToggle = document.getElementById("menu-toggle"); const sidebar = document.getElementById("sidebar"); const mainContent = document.querySelector(".main-content");

menuToggle.addEventListener("click", () => { sidebar.classList.toggle("open"); mainContent.classList.toggle("shifted"); }); });

