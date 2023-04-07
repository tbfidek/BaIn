function themeToggle() {
    const element = document.body;
    element.classList.toggle("dark-theme");
}

// dc nu merge :(((
function removeChild(element) {
    console.log("alo");
    element.parentNode.parentNode.removeChild(element.parentNode);
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


// function dropdown() {
//     const menu = document.querySelector('.dropdown');
//     const container = document.querySelector('.container');
//     const root = document.querySelector(":root");
//     const dropColor = getComputedStyle(root).getPropertyValue("--under-card-color");
//     const originalColor = getComputedStyle(root).getPropertyValue("--background-color");
//
//     if (menu.style.display === 'block') {
//         menu.style.display = 'none';
//         container.style.visibility = 'visible' ;
//         document.body.style.backgroundColor = originalColor;
//     } else {
//         menu.style.display = 'block';
//         container.style.visibility = 'hidden' ;
//         document.body.style.backgroundColor = dropColor;
//     }
// }


