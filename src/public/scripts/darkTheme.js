function applyThemeFromLocalStorage() {
    const element = document.body;
    const userPreference = localStorage.getItem("theme");

    if (userPreference === "dark") {
        element.classList.add("dark-theme");
    } else {
        element.classList.remove("dark-theme");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    applyThemeFromLocalStorage();
});