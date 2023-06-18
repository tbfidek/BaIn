function resetForm() {
    let form_child = document.querySelector(".form-child");
    form_child.reset();
    document.getElementById("gender-female").checked = false;
    document.getElementById("gender-male").checked = false;
}

//add child popup
function openPopup() {
    popUp = document.querySelector("#pop");
    blur = document.querySelector(".sidebar");
    blurr = document.querySelector(".main");
    console.log("se apasa");
    popUp.classList.add("active");
    blur.classList.add("active");
    blurr.classList.add("active");
}

function closePopup() {
    blur.classList.remove("active");
    blurr.classList.remove("active");
    popUp.classList.remove("active");
}

//dark-theme
function themeToggle() {
    const element = document.body;
    element.classList.toggle("dark-theme");

    if (element.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const userPreference = localStorage.getItem("theme");

    if (userPreference === "dark") {
        document.body.classList.add("dark-theme");
    }
});

//PENTRU DESIGN
function showOverview() {
    populateTimeline();
    const journal = document.querySelector(".OVERVIEW");
    journal.style.display = "flex";
    let others = document.querySelector(".SLEEPING-SCHEDULE");
    others.style.display = "none";
    others = document.querySelector(".FEEDING-TIME");
    others.style.display = "none";
    // others = document.querySelector(".LIKES");
    // others.style.display = "none";
    others = document.querySelector(".GALLERY");
    others.style.display = "none";
    others = document.querySelector(".EDIT-CHILD");
    others.style.display = "none";
}

function showSleepingSchedule() {
    const sleepingSchedule = document.querySelector(".SLEEPING-SCHEDULE");
    sleepingSchedule.style.display = "block";
    let others = document.querySelector(".OVERVIEW");
    others.style.display = "none";
    others = document.querySelector(".FEEDING-TIME");
    others.style.display = "none";
    // others = document.querySelector(".LIKES");
    // others.style.display = "none";
    others = document.querySelector(".GALLERY");
    others.style.display = "none";
    others = document.querySelector(".EDIT-CHILD");
    others.style.display = "none";
    populateNapTable();
}

function showFeedingTime() {
    const feedingTime = document.querySelector(".FEEDING-TIME");
    feedingTime.style.display = "block";
    let others = document.querySelector(".OVERVIEW");
    others.style.display = "none";
    others = document.querySelector(".SLEEPING-SCHEDULE");
    others.style.display = "none";
    // others = document.querySelector(".LIKES");
    // others.style.display = "none";
    others = document.querySelector(".GALLERY");
    others.style.display = "none";
    others = document.querySelector(".EDIT-CHILD");
    others.style.display = "none";
    populateMealTable();
}

function showGallery() {
    const gallery = document.querySelector(".GALLERY");
    gallery.style.display = "block";
    let others = document.querySelector(".OVERVIEW");
    others.style.display = "none";
    others = document.querySelector(".SLEEPING-SCHEDULE");
    others.style.display = "none";
    others = document.querySelector(".FEEDING-TIME");
    others.style.display = "none";
    // others = document.querySelector(".LIKES");
    // others.style.display = "none";
    others = document.querySelector(".EDIT-CHILD");
    others.style.display = "none";
    populateGallery();
}

function showEditChildProfile() {
    const childProfile = document.querySelector(".EDIT-CHILD");
    childProfile.style.display = "block";
    let others = document.querySelector(".OVERVIEW");
    others.style.display = "none";
    others = document.querySelector(".SLEEPING-SCHEDULE");
    others.style.display = "none";
    others = document.querySelector(".FEEDING-TIME");
    others.style.display = "none";
    others = document.querySelector(".GALLERY");
    others.style.display = "none";
}

function showAddOption() {
    let gallery = document.querySelector(".form-add-image");
    gallery.style.display = "block";
    let sal = document.querySelector("#gallery");
    sal.style.display = "none";
}
function removeAddOption() {
    let gallery = document.querySelector(".form-add-image");
    gallery.style.display = "none";
    let sal = document.querySelector("#gallery");
    sal.style.display = "";
}
function showAddMeal() {
    let food = document.querySelector(".form-table");
    food.style.display = "block";
    food = document.querySelector(".calendar-meal");
    food.style.display = "none";
    datepicker = document.querySelector("#mealFormDate");
    datepicker.style.display = "none";
}

function showAddSleep() {
    let sleep = document.querySelector(".sleep-form");
    sleep.style.display = "block";
    sleep = document.querySelector(".calendar-sleep");
    sleep.style.display = "none";

    datepicker = document.querySelector("#napFormDate");
    datepicker.style.display = "none";
}

function showFiles() {
    let file = document.querySelector(".show-files");
    file.style.display = "block";
}

function dropdown() {
    let menu = document.querySelector(".sidebar");
    menu.style.display = "flex";
    menu.style.width = "100%";
    menu = document.querySelector(".main");
    menu.style.display = "none";
}
function closeDropdown() {
    let menu = document.querySelector(".sidebar");
    menu.style.display = "none";
    menu = document.querySelector(".main");
    menu.style.display = "block";
}

function toggleSidebar() {
    let sidebar = document.querySelector(".sidebar");
    if (window.innerWidth < 1000) {
        sidebar.style.display = "none";
    } else {
        sidebar.style.display = "flex";
        sidebar.style.width = "20rem";
    }
}

window.addEventListener("resize", toggleSidebar);

window.onload = function () {
    button_finish_child_profile = document.querySelector("#gata");
    button_add_child_profile = document.querySelector("#continue");
    button_export = document.querySelector("#export_btn");
    button_export.addEventListener("click", function() {
        download('data');
    });

    let new_name = document.querySelector("#changedName");
    let new_date = document.querySelector("#hbd");
    let new_height = document.querySelector("#changedHeight");
    let new_weight = document.querySelector("#changedWeight");
    document.querySelector("#name_btn").addEventListener("click", function(){ updateChild(new_name.value, new Date(selected_child.birthday), selected_child.weight, selected_child.height, selected_child.gender, selected_child.image_code); resetForm();});
    document.querySelector("#date_btn").addEventListener("click", function(){ updateChild(selected_child.name, new_date.value, selected_child.weight, selected_child.height, selected_child.gender, selected_child.image_code);resetForm(); });
    document.querySelector("#height_btn").addEventListener("click", function(){ updateChild(selected_child.name, selected_child.birthday, selected_child.weight, new_height.value, selected_child.gender, selected_child.image_code);resetForm(); });
    document.querySelector("#weight_btn").addEventListener("click", function(){ updateChild(selected_child.name, selected_child.birthday, new_weight.value, selected_child.height, selected_child.gender, selected_child.image_code);resetForm(); });
    document.querySelector("#gender-male").addEventListener("click", function(){ updateChild(selected_child.name, selected_child.birthday, selected_child.weight, selected_child.height, "male", selected_child.image_code); resetForm();});
    document.querySelector("#gender-female").addEventListener("click", function(){ updateChild(selected_child.name, selected_child.birthday, selected_child.weight, selected_child.height, "female", selected_child.image_code); resetForm();});
    button_add_child_profile.addEventListener("click", openPopup);
    button_finish_child_profile.addEventListener("click", checkChild);
};

function hidePopupOnEscapeKey(event) {
    if (event.key === "Escape") {
        closePopup();
    }
}
