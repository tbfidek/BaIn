
import { Sleeping } from './sleepingSchedule.js'

function themeToggle() {
    const element = document.body;
    element.classList.toggle("dark-theme");
}

function addNewSection() {
    const firstSection = document.createElement('div');

    firstSection.innerHTML = `<div class="child sidebutton text">child#</div>`;

    document.getElementById("child-list").appendChild(firstSection);
    //pt mobile
    // const secondSection = document.createElement('section');
    //
    // secondSection.innerHTML = `<h2>Baby </h2>
    //                         <span onclick='removeChild(this)' class='material-symbols-rounded'>person_remove</span>`;
    //
    // document.getElementById("babyID-mobile").appendChild(secondSection);
}

function showOverview() {
    const journal = document.querySelector('.OVERVIEW');
    journal.style.display = 'flex';
    let others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.LIKES');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}

// .SLEEPING-SCHEDULE,.FEEDING-TIME,.LIKES, .GALLERY, .EDIT-CHILD{
//     display:none;
// }

function showSleepingSchedule() {
    const sleepingSchedule = document.querySelector('.SLEEPING-SCHEDULE');
    sleepingSchedule.style.display = 'block';
    let others = document.querySelector('.OVERVIEW');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.LIKES');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}


function showFeedingTime() {
    const feedingTime = document.querySelector('.FEEDING-TIME');
    feedingTime.style.display = 'block';
    let others = document.querySelector('.OVERVIEW');
    others.style.display = 'none';
    others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.LIKES');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}

function showTimeline() {
    const medicalHistory = document.querySelector('.LIKES');
    medicalHistory.style.display = 'block';
    let others = document.querySelector('.OVERVIEW');
    others.style.display = 'none';
    others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}

function showGallery() {
    const gallery = document.querySelector('.GALLERY');
    gallery.style.display = 'block';
    let others = document.querySelector('.OVERVIEW');
    others.style.display = 'none';
    others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.LIKES');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}

function showEditChildProfile() {
    const childProfile = document.querySelector('.EDIT-CHILD');
    childProfile.style.display = 'block';
    let others = document.querySelector('.OVERVIEW');
    others.style.display = 'none';
    others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.LIKES');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
}

function showAddOption() {
    let gallery = document.querySelector('.form-add-image');
    gallery.style.display = 'block';
    gallery = document.querySelector('.calendar-pic');
    gallery.style.display = 'none';
}
function removeAddOption() {
    let gallery = document.querySelector('.form-add-image');
    gallery.style.display = 'none';
    gallery = document.querySelector('.calendar-pic');
    gallery.style.display = 'flex';
}
function showAddMeal() {
    let food = document.querySelector('.form-table');
    food.style.display = 'block';
    food = document.querySelector('.calendar-meal');
    food.style.display = 'none';
}

function showAddSleep() {
    let sleep = document.querySelector('.sleep-form');
    sleep.style.display = 'block';
    // sleep= document.querySelector('table');
    // sleep.style.display = 'none';
}

function removeAddSleep() {
    let sleep = document.querySelector('.sleep-form');
    sleep.style.display = 'none';
    // sleep = document.querySelector('table');
    // sleep.style.display = 'inherit';
}
function removeAddMeal() {
    let food = document.querySelector('.form-table');
    food.style.display = 'none';
    food = document.querySelector('.calendar-meal');
    food.style.display = 'flex';
}
function showFiles() {
    let file = document.querySelector('.show-files');
    file.style.display = 'block';
}

Sleeping.forEach(schedule => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
                    <td>${schedule.date}</td>
                    <td>${schedule.start}</td>
                    <td>${schedule.end}</td>
                    <td>${schedule.quality}</td>
                    `;
    document.querySelector('table tbody').appendChild(tr);
});

function dropdown(){
    let menu = document.querySelector('.sidebar');
    menu.style.display='flex';
    menu.style.width='100%';
    menu = document.querySelector('.main');
    menu.style.display='none';
}
function closeDropdown(){
    let menu = document.querySelector('.sidebar');
    menu.style.display='none';
    menu = document.querySelector('.main');
    menu.style.display='block';

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




