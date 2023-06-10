let popUp = null
let blur = null
let blurr = null
let child_counter = 0;
let complete = false;

let button_finish_child_profile = null
let button_add_child_profile = null

let last_child_id = 1;
let child_ids = [];
let parent_ids = [];

window.onload = function () {
    popUp = document.getElementById("pop");
    blur = document.querySelector('.signup-box');
    blurr = document.querySelector('.banner');

    button_finish_child_profile = document.querySelector("#gata");
    button_add_child_profile = document.querySelector("#continue");

    button_add_child_profile.addEventListener("click", openPopup);
    button_finish_child_profile.addEventListener("click", checkChild);
    //button_finish_child_profile.addEventListener("click", addChildList);
    //button_finish_child_profile.addEventListener("click", closePopup);


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
    child.className = `child${last_child_id}`;
    child.innerHTML = `<div class="pfp"></div>
                    <button class="registered-child">${name.value}</button>
                    <button class="remove-child" onclick="removeChildList(${last_child_id})"><span class="material-symbols-rounded">person_remove</span></button>`;
    child_counter++;
    document.getElementById("baby-id").appendChild(child);
    document.getElementById("name").value = "";
    document.getElementById("height").value = "";
    document.getElementById("weight").value = "";
    console.log(child_counter);
}

function removeChildList(nr) {
    document.querySelector(".child" + nr).remove();
    const index = child_ids.indexOf(nr);
    if(nr > -1){
        child_ids.splice(index, 1);
    }
    deleteChild(nr);
    child_counter--;

    console.log(child_counter);
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
    insertChild(form.elements[3].value, form.elements[4].value, form.elements[5].value, form.elements[6].value, (gendertype.value === "1" ? "female" : "male"));
    await new Promise(r => setTimeout(r, 100));
    addChildList();
    closePopup();

}

async function insertChild(name, birthday, width, weight, gender){
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
        });
    await new Promise(r => setTimeout(r, 500));

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

async function postAccount(username, email, password){
    fetch("http://localhost:3000/signup", {
        method: "POST",
        body: JSON.stringify({
            "username": username,
            "email": email,
            "password": password
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
            parent_ids.push(id);
        });
    await new Promise(r => setTimeout(r, 500));
}

async function postRelation(parent_id, child_id){
    fetch("http://localhost:3000/addchildtoparent", {
        method: "POST",
        body: JSON.stringify({
            "child_id": child_id,
            "parent_id": parent_id
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
    await new Promise(r => setTimeout(r, 500));
}

async function createRelations(){
    await new Promise(r => setTimeout(r, 1000));
    parent_ids.forEach(element =>{
        child_ids.forEach(child =>{
            postRelation(element, child);
        })
    });
}

async function registerAccount() {
    console.log(child_ids);
    if (child_counter === 0) {
        alert("Please add at least one child.");
        return;
    }
    var form = document.getElementById("signupform");
    var familytype = document.querySelector('input[name="family-type"]:checked');
    if (familytype == null) {
        alert("Please select a family type.");
        return;
    }

    if (form.elements[2].value === "" || form.elements[3].value === "" || form.elements[4].value === "") {
        alert("Please fill in all fields.");
        return;
    }
    if (familytype.value === "1" && (form.elements[5].value === "" || form.elements[6].value === "")) {
        alert("Please fill in all fields for the second person.");
        return;
    }
    postAccount(form.elements[2].value, form.elements[3].value, form.elements[4].value)
        .then((parent_id) => {
            console.log(parent_id);
            child_ids.forEach((child_id) => {
                postRelation(parent_id, child_id);
            });
            return parent_id;
        })
        .then((parent_id) => {
            createRelations();
            return parent_id;
        })
        .then((parent_id) => {
            window.location.href = "http://localhost:3000/views/main.html";
            return parent_id;
        })
        .catch((error) => {
            console.error(error);
        });
}