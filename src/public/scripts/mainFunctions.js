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
  button_finish_child_profile = document.querySelector("#gata");
  button_add_child_profile = document.querySelector("#continue");

  button_add_child_profile.addEventListener("click", openPopup);
  button_finish_child_profile.addEventListener("click", checkChild);
  populateMealTable();
  populateNapTable();

};

function openPopup() {
  popUp = document.querySelector("#pop");
  blur = document.querySelector(".sidebar");
  blurr = document.querySelector(".main");
  console.log("se apasa");
  popUp.classList.add("active");
  blur.classList.add("active");
  blurr.classList.add("active");
}

async function checkChild() {
  var form = document.getElementById("pfp-child");
  console.log(form.elements[3].value);
  var gendertype = document.querySelector('input[name="gender-type"]:checked');
  if (gendertype == null) {
    console.log("select gender");
    return;
  }

  if (
      form.elements[3].value === "" || //nume
      form.elements[4].value === "" ||  //an
      form.elements[5].value === "" ||  //w
      form.elements[6].value === ""     //h
  ) {
    console.log("nu-i bun");
    return;
  }
  console.log("inainte de insert");
  insertChild(
      form.elements[3].value,
      form.elements[4].value,
      form.elements[5].value,
      form.elements[6].value,
      gendertype.value === "1" ? "female" : "male"
  );
  await new Promise((r) => setTimeout(r, 1000));
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
  blur.classList.remove("active");
  blurr.classList.remove("active");
  popUp.classList.remove("active");
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

async function deleteChild(child_id) {
  fetch("/deletechild", {
    method: "DELETE",
    body: JSON.stringify({ child_id: child_id }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
      .then((response) => response.json())
      .then((json) => console.log(json));
  await new Promise((r) => setTimeout(r, 500));
}

async function insertChild(name, birthday, width, weight, gender) {

  const fileInput = document.getElementById("profile-pic-baby");
  const uploadedImage = fileInput.files[0];
  console.log("pozica: " + fileInput.files[0]);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("birthday", birthday);
  formData.append("width", width);
  formData.append("weight", weight);
  formData.append("gender", gender);
  formData.append("photo", uploadedImage);

  fetch("/addchild", {
    method: "POST",
    body: formData
    // }),
    // headers: {
    //   Accept: "application/json",
    //   "Content-Type": "application/json",
    // },
  })
      .then((response) => response.json())
      .then((json) => {
        var obj = JSON.parse(JSON.stringify(json));
        let { id, message } = obj;
        last_child_id = id;
        child_ids.push(id);
        console.log("id-ul este " + id);
        fetch("/addchildtoparent", {
          method: "POST",
          body: JSON.stringify({
            child_id: id,
            parent_id: user_id,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
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

// .SLEEPING-SCHEDULE,.FEEDING-TIME,.LIKES, .GALLERY, .EDIT-CHILD{
//     display:none;
// }

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

// function showTimeline() {
//   const medicalHistory = document.querySelector(".LIKES");
//   medicalHistory.style.display = "block";
//   let others = document.querySelector(".OVERVIEW");
//   others.style.display = "none";
//   others = document.querySelector(".SLEEPING-SCHEDULE");
//   others.style.display = "none";
//   others = document.querySelector(".FEEDING-TIME");
//   others.style.display = "none";
//   others = document.querySelector(".GALLERY");
//   others.style.display = "none";
//   others = document.querySelector(".EDIT-CHILD");
//   others.style.display = "none";
// }

function showGallery() {
  renderCalendar();
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
  // others = document.querySelector(".LIKES");
  // others.style.display = "none";
  others = document.querySelector(".GALLERY");
  others.style.display = "none";
}

function showAddOption() {
  let gallery = document.querySelector(".form-add-image");
  gallery.style.display = "block";
  gallery = document.querySelector(".calendar-pic");
  gallery.style.display = "none";
}
function removeAddOption() {
  let gallery = document.querySelector(".form-add-image");
  gallery.style.display = "none";
  gallery = document.querySelector(".calendar-pic");
  gallery.style.display = "flex";
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

async function removeAddSleep() {
  let sleep = document.querySelector(".sleep-form");
  sleep.style.display = "none";
  sleep = document.querySelector(".calendar-sleep");
  sleep.style.display = "flex";
  datepicker = document.querySelector("#napFormDate");
  datepicker.style.display = "block";
  var formData = {};

  formData.nap_date = document.getElementById("nap_date").value;
  formData.start_time = document.getElementById("start_time").value;
  formData.end_time = document.getElementById("end_time").value;
  formData.sleep_quality = document.getElementById("sleep_quality").value;

  if (
      !formData.nap_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.sleep_quality
  ) {
    alert("Please complete all fields before submitting.");
    return;
  }

  if (selected_child != null) {
    formData.child_account_id = selected_child.id;
  } else {
    alert("Please select a child first.");
    return;
  }

  let response = await fetch("/nap", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  populateNapTable();
}

async function removeAddMeal() {
  let food = document.querySelector(".form-table");
  food.style.display = "none";
  food = document.querySelector(".calendar-meal");
  food.style.display = "flex";
  datepicker = document.querySelector("#mealFormDate");
  datepicker.style.display = "block";

  var formData = {};


  formData.meal_date = document.getElementById("meal_date").value;
  formData.meal_description = document.getElementById("meal_description").value;

  var mealTypeElements = document.getElementsByName("meal_type");
  var typeSelected = false;
  for (var i = 0; i < mealTypeElements.length; i++) {
    if (mealTypeElements[i].checked) {
      formData.meal_type = mealTypeElements[i].id;
      typeSelected = true;
      break;
    }
  }

  formData.meal_option = document.getElementById("meal_option").value;


  if (
      !formData.meal_date ||
      !formData.meal_description ||
      !typeSelected ||
      !formData.meal_option
  ) {
    alert("Please complete all fields before submitting.");
    return;
  }
  if (selected_child != null) {
    formData.child_account_id = selected_child.id;
  } else {
    alert("Please select a child first.");
    return;
  }
  let response = await fetch("/meal", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify(formData),
  });
  populateMealTable();
}


document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("mealFormDate");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const month = document.getElementById("meal-month").value;
    const year = document.getElementById("meal-year").value;

    if (month && year) {
      const selectedDate = `${year}-${month.padStart(2, "0")}`;
      if (selected_child == null) {
        alert("Please select a child first.");
        return;
      }
      populateMealTable(selectedDate);
    } else {
      alert("Please select a month and a year.");
    }
  });

  const searchButton = document.getElementById("meal-search");
  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });
});

async function populateMealTable(selectedDate) {
  let meals;
  if (selected_child != null) {
    let url = "/meal"; // URL-ul de bază
    url += `/${selected_child.id}`;

    if (selectedDate != null) {
      url += `/month/${selectedDate}`;
    }

    let response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Error: There are no entries for this month or year.");
      return;
    }

    meals = await response.json();

    let tableBody = document.querySelector(".calendar-meal tbody");
    tableBody.innerHTML = "";
    for (let meal of meals) {
      let row = document.createElement("tr");

      row.dataset.mealId = meal.id;
      let dateCell = document.createElement("td");
      dateCell.textContent = meal.meal_date;
      row.appendChild(dateCell);

      let descriptionCell = document.createElement("td");
      descriptionCell.textContent = meal.meal_description;
      row.appendChild(descriptionCell);

      let typeCell = document.createElement("td");
      typeCell.textContent = meal.meal_type;
      row.appendChild(typeCell);

      let optionCell = document.createElement("td");
      optionCell.textContent = meal.meal_option;
      row.appendChild(optionCell);

      let deleteCell = document.createElement("td");
      let deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = '<i class="material-icons">close</i>';

      deleteButton.addEventListener("click", async function () {
        let response = await fetch(`/meal/${row.dataset.mealId}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          alert("Error: Could not delete entry.");
        } else {
          row.parentNode.removeChild(row);
        }
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tableBody.appendChild(row);
    }
  }
}

function convertTo12Hour(time) {
  let [hour, minute] = time.split(":");
  hour = Number(hour);
  let period = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${period}`;
}

document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("napFormDate");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const month = document.getElementById("nap-month").value;
    const year = document.getElementById("nap-year").value;

    if (month && year) {
      const selectedDate = `${year}-${month.padStart(2, "0")}`;
      if (selected_child == null) {
        alert("Please select a child first.");
        return;
      }
      populateNapTable(selectedDate);
    }
  });

  const searchButton = document.getElementById("nap-search");
  searchButton.addEventListener("click", function (e) {
    e.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });
});
async function populateNapTable(selectedDate) {
  let naps;
  if (selected_child != null) {
    let url = "/nap";
    url += `/${selected_child.id}`;

    if (selectedDate != null) {
      url += `/month/${selectedDate}`;
    }

    let response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("Error: There are no entries for this month or year.");
      return;
    }

    naps = await response.json();

    let tableBody = document.querySelector(".calendar-sleep tbody");
    tableBody.innerHTML = "";
    for (let nap of naps) {
      let row = document.createElement("tr");

      row.dataset.napId = nap.id;
      let dateCell = document.createElement("td");
      dateCell.textContent = nap.nap_date;
      row.appendChild(dateCell);

      let descriptionCell = document.createElement("td");
      descriptionCell.textContent = convertTo12Hour(nap.start_time);
      row.appendChild(descriptionCell);

      let typeCell = document.createElement("td");
      typeCell.textContent = convertTo12Hour(nap.end_time);
      row.appendChild(typeCell);

      let optionCell = document.createElement("td");
      optionCell.textContent = nap.sleep_quality;
      row.appendChild(optionCell);

      let deleteCell = document.createElement("td");
      let deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = '<i class="material-icons">close</i>';

      deleteButton.addEventListener("click", async function () {
        let response = await fetch(`/nap/${row.dataset.napId}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          alert("Error: Could not delete entry.");
        } else {
          row.parentNode.removeChild(row);
        }
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tableBody.appendChild(row);
    }
  }
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

function logout() {
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
      .then((response) => {
        if (response.ok) {
          window.location.href = "http://localhost:3000/views/login.html";
        } else {
          alert("An error occurred while logging out.");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while logging out.");
      });
}

function populateUserData() {
  if (selected_child != null) {
    console.log(selected_child.name);
  }
  fetch("/retrieveUserData")
      .then((response) => response.json())
      .then((data) => {
        const mainTitle = document.querySelector(".main-title");
        user_id = data.id;

        const childList = document.getElementById("child-list");
        childList.innerHTML = "";
        data.children.forEach((child) => {
          const childDiv = document.createElement("div");
          childDiv.className = "child sidebutton text";
          childDiv.textContent = child.child_name;
          childDiv.addEventListener("click", function () {
            populateChildData(child.child_name);
          });
          childList.appendChild(childDiv);
        });

        document.getElementById("main-profile-pic").src = data.profile_image;
        document.getElementById("mobile-main-profile-pic").src = data.profile_image;


        const paragraph = document.createElement("p");
        paragraph.textContent = `Hello, ${data.name}! How is your baby today?`;

        mainTitle.innerHTML = "";
        mainTitle.appendChild(paragraph);
      })
      .catch((error) => {
        console.error(error);
      });
}

function populateChildData(child_name) {
  fetch("/retrieveChildData", {
    method: "POST",
    body: JSON.stringify({
      user_id: user_id,
      child_name: child_name,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
      .then((response) => response.json())
      .then((json) => {
        selected_child = json;
        child_name_text = document.querySelector("#child-name");
        child_age_text = document.querySelector("#child-age");
        child_stats_text = document.querySelector("#child-stats");
        if (
            child_name_text != null &&
            child_age_text != null &&
            child_stats_text != null
        ) {
          child_name_text.textContent = json.name;
          child_age_text.textContent = calculateAge(json.birthday);
          child_stats_text.textContent =
              "W:" + json.height + "kg" + " H:" + json.weight + "cm";
        }
        child_name_text = document.querySelector("#child-name-mobile");
        child_age_text = document.querySelector("#child-age-mobile");
        child_stats_text = document.querySelector("#child-stats-mobile");
        if (
            child_name_text != null &&
            child_age_text != null &&
            child_stats_text != null
        ) {
          child_name_text.textContent = json.name;
          child_age_text.textContent = calculateAge(json.birthday);
          child_stats_text.textContent =
              "W:" + json.height + "kg" + " H:" + json.weight + "cm";
        }

        document.getElementById("kid-pic").src = json.image;
      })
    .then((response) => response.json())
    .then((json) => {
      selected_child = json;
      child_name_text = document.querySelector("#child-name");
      child_age_text = document.querySelector("#child-age");
      child_stats_text = document.querySelector("#child-stats");
      if (
        child_name_text != null &&
        child_age_text != null &&
        child_stats_text != null
      ) {
        child_name_text.textContent = json.name;
        child_age_text.textContent = calculateAge(json.birthday);
        child_stats_text.textContent =
          "W:" + json.height + "kg" + " H:" + json.weight + "cm";
      }
      child_name_text = document.querySelector("#child-name-mobile");
      child_age_text = document.querySelector("#child-age-mobile");
      child_stats_text = document.querySelector("#child-stats-mobile");
      if (
          child_name_text != null &&
          child_age_text != null &&
          child_stats_text != null
      ) {
        child_name_text.textContent = json.name;
        child_age_text.textContent = calculateAge(json.birthday);
        child_stats_text.textContent =
            "W:" + json.height + "kg" + " H:" + json.weight + "cm";
            populateMealTable();
            populateNapTable();
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
    var daysDiff = Math.floor(
        (currentDate - birthDate) / (1000 * 60 * 60 * 24)
    );
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
window.addEventListener("load", () => {
  document.addEventListener("keydown", hidePopupOnEscapeKey);
  populateUserData();

  const pollingInterval = 5000;

  setInterval(populateUserData, pollingInterval);
});