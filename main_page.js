function themeToggle() {
    const element = document.body;
    element.classList.toggle("dark-theme");
}

// dc nu merge :(((
function removeChild(element) {
    const section = element.parentElement.parentElement;
    section.remove();
}


function addNewSection() {
    const newSection = document.createElement('section');

    const content =`<h2>Baby </h2>
                            <span onclick='removeChild(this)' class='material-symbols-rounded'>person_remove</span>`;
    newSection.innerHTML = content;

    document.getElementById("babyID").appendChild(newSection);
}

function showJournal() {
    const journal = document.querySelector('.BABY-PROFILE');
    journal.style.display = 'block';
    let others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.MEDICAL-HISTORY');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}
function showSleepingSchedule() {
    const sleepingSchedule = document.querySelector('.SLEEPING-SCHEDULE');
    sleepingSchedule.style.display = 'block';
    let others = document.querySelector('.BABY-PROFILE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.MEDICAL-HISTORY');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}

function showFeedingTime() {
    const feedingTime = document.querySelector('.FEEDING-TIME');
    feedingTime.style.display = 'block';
    let others = document.querySelector('.BABY-PROFILE');
    others.style.display = 'none';
    others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.MEDICAL-HISTORY');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}

function showMedicalHistory() {
    const medicalHistory = document.querySelector('.MEDICAL-HISTORY');
    medicalHistory.style.display = 'block';
    let others = document.querySelector('.BABY-PROFILE');
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
    let others = document.querySelector('.BABY-PROFILE');
    others.style.display = 'none';
    others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.MEDICAL-HISTORY');
    others.style.display = 'none';
    others = document.querySelector('.EDIT-CHILD');
    others.style.display = 'none';
}

function showEditChildProfile() {
    const childProfile = document.querySelector('.EDIT-CHILD');
    childProfile.style.display = 'block';
    let others = document.querySelector('.BABY-PROFILE');
    others.style.display = 'none';
    others = document.querySelector('.SLEEPING-SCHEDULE');
    others.style.display = 'none';
    others = document.querySelector('.FEEDING-TIME');
    others.style.display = 'none';
    others = document.querySelector('.MEDICAL-HISTORY');
    others.style.display = 'none';
    others = document.querySelector('.GALLERY');
    others.style.display = 'none';
}



