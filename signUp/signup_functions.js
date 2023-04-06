let popUp = null
let blur = null
let blurr = null
let child_counter = 0;
let complete = false;

let button_finish_child_profile = null
let button_add_child_profile = null

window.onload = function () {
    popUp = document.getElementById("pop");
    blur = document.querySelector('.signup-box');
    blurr = document.querySelector('.banner');

    button_finish_child_profile = document.querySelector("#gata");
    button_add_child_profile = document.querySelector("#continue");

    button_add_child_profile.addEventListener("click", openPopup);
    button_finish_child_profile.addEventListener("click", addChildList);

    button_finish_child_profile.addEventListener("click", closePopup);

}

function handleRadioClick(displayValue) {
    const signupForm = document.querySelector('.family-options');
    signupForm.style.display = displayValue;
}

function openPopup() {
    popUp.classList.add('active')
    blur.classList.add('active')
    blurr.classList.add('active')
}

function closePopup() {
    blur.classList.remove('active')
    blurr.classList.remove('active')
    popUp.classList.remove('active')
}

function addChildList() {
    const name = document.getElementById("name");
    // const dob = document.getElementById("data").value;
    // const height = document.getElementById("height");
    // const weight = document.getElementById("weight");

    const child = document.createElement('div');
    child.className = `child${child_counter}`;
    child.innerHTML = `<div class="pfp"></div>
                    <button class="registered-child">${name.value}</button>
                    <button class="remove-child" onclick="removeChildList(${child_counter})"><span class="material-symbols-rounded">person_remove</span></button>`;
    child_counter++;
    document.getElementById("baby-id").appendChild(child);
    document.getElementById("name").value = "";
    document.getElementById("height").value = "";
    document.getElementById("weight").value = "";

}

function removeChildList(nr) {
    document.querySelector(".child" + nr).remove();
}
