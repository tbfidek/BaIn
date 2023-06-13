let popUp = null;
let blur = null;
let blurr = null;
let child_counter = 0;
let user_id = null;


//aici se tine informatiile despre copilul selectat (id, nume, gender, weight etc)
let selected_child = null;

let button_finish_child_profile = null;
let button_add_child_profile = null;
let last_child_id = 1;
let child_ids = [];


window.onload = function () {
    console.log("incarcat");
    button_finish_child_profile = document.querySelector("#gata");
    button_add_child_profile = document.querySelector("#continue");

    button_add_child_profile.addEventListener("click", openPopup);
    button_finish_child_profile.addEventListener("click", checkChild);
}

function openPopup() {
    popUp = document.querySelector("#pop");
    blur = document.querySelector(".sidebar");
    blurr = document.querySelector(".main");
    console.log("se apasa");
    popUp.classList.add('active');
    blur.classList.add('active');
    blurr.classList.add('active');
}

async function checkChild(){
    var form = document.getElementById("pfp-child");
    var gendertype = document.querySelector('input[name="gender-type"]:checked');
    if(gendertype == null){
        console.log("select gender");
        return;
    }

    if(form.elements[3].value === "" || form.elements[4].value === "" || form.elements[5].value === "" || form.elements[6].value === ""){
        console.log("nu-i bun");
        return;
    }
    console.log("inainte de insert");
    insertChild(form.elements[3].value, form.elements[4].value, form.elements[5].value, form.elements[6].value, (gendertype.value === "1" ? "female" : "male"));
    await new Promise(r => setTimeout(r, 1000));
    addChildList();
    closePopup();
    console.log("chestieeeeeeeeeeee " + form.elements[3].value);
    populateChildData(form.elements[3].value);
}
function hidePopupOnEscapeKey(event) {
    if (event.key === "Escape") {
        closePopup();
    }
}
function closePopup() {
    blur.classList.remove('active');
    blurr.classList.remove('active');
    popUp.classList.remove('active');
}

function addChildList() {
    const name = document.getElementById("name-pop");
    // const dob = document.getElementById("data").value;
    // const height = document.getElementById("height");
    // const weight = document.getElementById("weight");

    //const child = document.createElement('div');
    //child.className = `child${last_child_id}`;
    //child.innerHTML = `<div class="pfp"></div>
    //                <button class="registered-child">${name.value}</button>
    //                <button class="remove-child" onclick="removeChildList(${last_child_id})"><span class="material-symbols-rounded">person_remove</span></button>`;
    child_counter++;
    //document.getElementById("baby-id").appendChild(child);
    document.getElementById("name").value = "";
    document.getElementById("height").value = "";
    document.getElementById("weight").value = "";
    //console.log(child_counter);
}

function removeChildList(nr) {
    //document.querySelector(".child" + nr).remove();
    //const index = child_ids.indexOf(nr);
    //if(nr > -1){
    //child_ids.splice(index, 1);
    //}
    deleteChild(nr);
    child_counter--;

    //console.log(child_counter);
}

async function deleteChild(child_id){
    fetch("http://localhost:3000/deletechild", {
        method: "DELETE",
        body: JSON.stringify({ "child_id": child_id}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
    await new Promise(r => setTimeout(r, 500));
}


async function insertChild(name, birthday, width, weight, gender){
    console.log("apel functie");
    fetch("http://localhost:3000/addchild", {
        method: "POST",
        body: JSON.stringify({
            "name": name,
            "birthday": birthday,
            "width": width,
            "weight": weight,
            "gender": gender
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((json) => {
            var obj = JSON.parse(JSON.stringify(json));
            let {id, message} = obj;
            last_child_id = id;
            child_ids.push(id);
            console.log("id-ul este " + id);
            fetch("http://localhost:3000/addchildtoparent", {
                method: "POST",
                body: JSON.stringify({
                    "child_id": id,
                    "parent_id": user_id
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((json) => console.log(json));
        });
    //await new Promise(r => setTimeout(r, 500));

}

function themeToggle() {
    const element = document.body;
    element.classList.toggle("dark-theme");
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
    renderCalendar();
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

function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "http://localhost:3000/views/login.html";
            } else {
                alert('An error occurred while logging out.');
            }
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while logging out.');
        });
}

function populateUserData() {
    if(selected_child != null){
        console.log(selected_child.name);
    }
    fetch('/retrieveUserData')
        .then(response => response.json())
        .then(data => {
            const mainTitle = document.querySelector('.main-title');
            user_id = data.id;

            const childList = document.getElementById('child-list');
            childList.innerHTML = ''; // Clear existing content
            data.children.forEach(child => {
                const childDiv = document.createElement('div');
                childDiv.className = 'child sidebutton text';
                childDiv.textContent = child.child_name;
                childDiv.addEventListener('click', function() {
                    populateChildData(child.child_name);
                });
                childList.appendChild(childDiv);
            });

            const paragraph = document.createElement('p');
            paragraph.textContent = `Hello, ${data.name}! How is your baby today?`;

            mainTitle.innerHTML = '';
            mainTitle.appendChild(paragraph);

        })
        .catch(error => {
            console.error(error);
        });
}

// function populateChildData(child_name) {
//     fetch("http://localhost:3000/retrieveChildData", {
//         method: "POST",
//         body: JSON.stringify({
//             "user_id": user_id,
//             "child_name": child_name
//         }),
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     })
//         .then((response) => response.json())
//         .then((json) => {
//             selected_child = json;
//             child_name_text = document.querySelector("#child-name");
//             child_age_text = document.querySelector("#child-age");
//             child_stats_text = document.querySelector("#child-stats");
//             if(child_name_text != null && child_age_text != null && child_stats_text != null){
//                 child_name_text.textContent = json.name;
//                 child_age_text.textContent = json.birthday;
//                 child_stats_text.textContent = "H:" + json.height + " W:" + json.weight;
//             }
//         });
// }
function populateChildData(child_name) {
    fetch("http://localhost:3000/retrieveChildData", {
        method: "POST",
        body: JSON.stringify({
            "user_id": user_id,
            "child_name": child_name
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((json) => {
            selected_child = json;
            child_name_text = document.querySelector("#child-name");
            child_age_text = document.querySelector("#child-age");
            child_stats_text = document.querySelector("#child-stats");
            if(child_name_text != null && child_age_text != null && child_stats_text != null){
                child_name_text.textContent = json.name;
                child_age_text.textContent = calculateAge(json.birthday);
                child_stats_text.textContent = "W:" + json.height + "kg" + " H:" + json.weight + "cm";
            }
        });
}

function calculateAge(birthday) {
    var birthDate = new Date(birthday);
    var currentDate = new Date();

    var monthsDiff = (currentDate.getFullYear() - birthDate.getFullYear()) * 12;
    monthsDiff -= birthDate.getMonth() + 1;
    monthsDiff += currentDate.getMonth();

    if (monthsDiff < 1) {
        var daysDiff = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
        return daysDiff + " days";
    } else if (monthsDiff >= 36) {
        var years = Math.floor(monthsDiff / 12);
        var months = monthsDiff % 12;
        var ageString = years + " years";
        if (months > 0) {
            ageString += " " + months + " months";
        }
        return ageString;
    } else {
        return monthsDiff + " months";
    }
}
window.addEventListener('load', () => {
    document.addEventListener("keydown", hidePopupOnEscapeKey);
    populateUserData();

    const pollingInterval = 5000;

    setInterval(populateUserData, pollingInterval);
});

