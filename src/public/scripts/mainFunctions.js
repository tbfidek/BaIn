let popUp = null;
let blur = null;
let blurr = null;
let child_counter = 0;
let user_id = null;

//aici se tin informatiile despre copilul selectat (id, nume, gender, weight etc)
let selected_child = null;

let button_finish_child_profile = null;
let button_add_child_profile = null;
let last_child_id = 1;
let child_ids = [];

function resetForm() {
  let form_child = document.querySelector(".form-child");
  form_child.reset();
  document.getElementById("gender-female").checked = false;
  document.getElementById("gender-male").checked = false;
}

window.onload = function () {
  button_finish_child_profile = document.querySelector("#gata");
  button_add_child_profile = document.querySelector("#continue");
  button_export = document.querySelector("#export_btn");
  button_export.addEventListener("click", function() {
    download('data.json');
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
  var gendertype = document.querySelector('input[name="gender-type"]:checked');
  if (gendertype == null) {
    console.log("select gender");
    return;
  }

  if (
      form.elements[3].value === "" || //nume
      form.elements[4].value === "" || //an
      form.elements[5].value === "" || //w
      form.elements[6].value === ""    //h
  ) {
    return;
  }
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
  form.reset();
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

  child_counter++;
  //document.getElementById("baby-id").appendChild(child);
  //document.getElementById("name").value = "";
  //document.getElementById("height").value = "";
  //document.getElementById("weight").value = "";
  //console.log(child_counter);
}

async function deleteChild(child_id) {
  fetch("http://localhost:3000/deletechild", {
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

async function insertChild(name, birthday, height, weight, gender) {
  const fileInput = document.getElementById("profile-pic-baby");
  const uploadedImage = fileInput.files[0];
  console.log("pozica: " + fileInput.files[0]);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("birthday", birthday);
  formData.append("height", height);
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
  // renderCalendar();
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
  // others = document.querySelector(".LIKES");
  // others.style.display = "none";
  others = document.querySelector(".GALLERY");
  others.style.display = "none";
}

function showAddOption() {
  let gallery = document.querySelector(".form-add-image");
  gallery.style.display = "block";
  // gallery = document.querySelector(".calendar-pic");
  // gallery.style.display = "none";
}
function removeAddOption() {
  let gallery = document.querySelector(".form-add-image");
  gallery.style.display = "none";
  // gallery = document.querySelector(".calendar-pic");
  // gallery.style.display = "flex";
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
          childDiv.id = child.child_id;
          childDiv.addEventListener("click", function () {
            populateChildData(child.child_id);
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

function populateChildData(child_id) {
  console.log(child_id + " blbablalba")
  fetch("/retrieveChildData", {
    method: "POST",
    body: JSON.stringify({
      user_id: user_id,
      child_id: child_id,
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
              "W:" + json.weight + "kg" + " H:" + json.height + "cm";
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
              "W:" + json.weight + "kg" + " H:" + json.height + "cm";
        }

        document.getElementById("kid-pic").src = json.image;
        populateMealTable();
        populateNapTable();
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

function updateChild(name, birthday, weight, height, gender, profile_image){
  //info necesare -> child id si toate atributele (name, birthday, weight, etc)
  console.log(birthday);
  fetch("/editChildData", {
    method: "POST",
    body: JSON.stringify({
      child_id: selected_child.id,
      new_name: name,
      new_birthday: birthday,
      new_weight: weight,
      new_height: height,
      new_gender: gender,
      new_profile_image: profile_image
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message);
        populateChildData(selected_child.id);
      });
}

function updateProfilePicture() {

  const formData = new FormData();
  const photo = document.querySelector('#profile-pic');
  formData.append('photo', photo.files[0]);
  formData.append('id',selected_child.id);
  console.log(photo.files[0]);
  fetch('/updateBabyPicture', {
    method: 'POST',
    body: formData
  })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message);
        populateChildData(selected_child.id);
      });
      // .then((response) => {
      //   if (response.ok) {
      //     location.reload();
      //   } else {
      //     alert('Failed to update picture. Please try again.');
      //   }
      // })
      // .catch((error) => {
      //   console.error(error);
      //   alert('An error occurred');
      // });
}
function sendData() {

  const formData = new FormData();

  const date = document.getElementById("date-pic");
  const img = document.getElementById("add-pic");
  const type = document.getElementById("type-pic");
  const desc = document.getElementById("desc-pic");

  formData.append('date',date.value);
  formData.append('photo', img.files[0]);
  formData.append('type', type.value);
  formData.append('desc', desc.value);
  formData.append('id',selected_child.id);

  fetch('/addMedia', {
    method: 'POST',
    body: formData,
  })
  .then((response) => {
    removeAddOption();
    if (response.ok) {
      // location.reload();
      removeAddOption();
      alert('Media added to the gallery');
      populateGallery();
    } else {
      alert('Failed to update picture. Please try again.');
    }
  })
  .catch((error) => {
    removeAddOption();
    console.error(error);
    alert('An error occurred');
  });
}



window.addEventListener("load", () => {
  document.addEventListener("keydown", hidePopupOnEscapeKey);
  populateUserData();

  const pollingInterval = 5000;

  // setInterval(populateGallery, pollingInterval);
  setInterval(populateUserData, pollingInterval);
  document.getElementById('import_btn').onclick = async () => {
    const jsonFiles = await getJsonUpload()
    const object = JSON.parse(jsonFiles[0]);
    for(let i = 0; i < object.length; ++i){
      //console.log(object[i]);

      fetch("/importChildData", {
        method: "POST",
        body: JSON.stringify({
          name: object[i].name,
          birthday: object[i].birthday,
          height: object[i].height,
          weight: object[i].weight,
          gender: object[i].gender,
          photo: object[i].image_code,
          media: object[i].media,
          nap_records: object[i].nap_records,
          meal_records: object[i].meal_records,
          parent_id: user_id
        })
      })
          .then((response) => response.json())
          .then((json) => {
            var obj = JSON.parse(JSON.stringify(json));
            let { id, message } = obj;
            last_child_id = id;
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
      await new Promise((r) => setTimeout(r, 500));
    }
  }
});

function populateGallery() {
  const formData = new FormData();
  formData.append('id', selected_child.id);

  fetch('/populateGallery', {
    method: 'POST',
    body: JSON.stringify({
      child_id: selected_child.id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const galleryContainer = document.getElementById("gallery");
        galleryContainer.innerHTML = "";

        if (data.images && data.images.length > 0) {
          data.images.forEach((mediaUrl, index) => {
            const galleryItem = document.createElement("div");
            galleryItem.classList.add("gallery-item");
            //??????????
            if (data.type[index] === 'video') {
              const videoElement = document.createElement("video");
              videoElement.src = mediaUrl;
              videoElement.controls = true;
              videoElement.classList.add("gallery-video");
              galleryItem.appendChild(videoElement);
            } else {
              console.log("da cf");
              const imageElement = document.createElement("img");
              imageElement.src = mediaUrl;
              imageElement.classList.add("gallery-image");
              galleryItem.appendChild(imageElement);
            }

            //descriere
            const descriptionElement = document.createElement("div");
            descriptionElement.classList.add("gallery-description");
            descriptionElement.innerText = data.desc[index];
            galleryItem.appendChild(descriptionElement);

            const buttonsContainer = document.createElement("div");
            buttonsContainer.classList.add("share");

            const shareButton = document.createElement("span");
            shareButton.classList.add("material-symbols-rounded");
            shareButton.innerText = "share";
            galleryItem.appendChild(shareButton);

            galleryContainer.appendChild(galleryItem);
          });
        } else {
          console.log("No images found.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
}

function sendMedicalFile() {

  const formData = new FormData();

  const pdf = document.getElementById("pdf");
  console.log(pdf.files[0]);

  formData.append('pdf',pdf.files[0]);
  formData.append('id',selected_child.id);

  fetch('/addMedicalFile', {
    method: 'POST',
    body: formData,
  })
      .then((response) => {
        if (response.ok) {
          alert('Medical file added');
        } else {
          alert('Failed to update picture. Please try again.');
        }
      })
      .catch((error) => {
        removeAddOption();
        console.error(error);
        alert('An error occurred');
      });
}

function populateTimeline() {
  const formData = new FormData();
  formData.append('id', selected_child.id);

  fetch('/populateTimeline', {
    method: 'POST',
    body: JSON.stringify({
      child_id: selected_child.id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const timelineContainer = document.getElementById("timeline");
        timelineContainer.innerHTML = "";

        if (data.images && data.images.length > 0 && data.date && data.date.length > 0) {
          data.images.forEach((mediaUrl, index) => {
            const imageDate = new Date(data.date[index]);
            const currentDate = new Date();
            console.log(imageDate);
            console.log(currentDate);

            if (
                imageDate.getMonth() === currentDate.getMonth() &&
                imageDate.getDate() === currentDate.getDate()
            ) {
              console.log(data.type[index]);

              const mediaContainer = document.createElement('div');
              mediaContainer.classList.add('timeline-media-container');

              if (data.type && data.type[index] === "video") {
                const videoElement = document.createElement('video');
                videoElement.src = mediaUrl;
                videoElement.controls = true;
                videoElement.classList.add('timeline-media');
                mediaContainer.appendChild(videoElement);
              } else {
                const imageElement = document.createElement('img');
                imageElement.src = mediaUrl;
                imageElement.classList.add('timeline-media');
                mediaContainer.appendChild(imageElement);
              }

              const descriptionElement = document.createElement('p');
              descriptionElement.textContent = data.desc[index];
              mediaContainer.appendChild(descriptionElement);

              const dateElement = document.createElement('p');
              dateElement.textContent = formatDate(imageDate);
              mediaContainer.appendChild(dateElement);

              timelineContainer.appendChild(mediaContainer);
            }
          });

          timelineContainer.classList.add('timeline-row');
        } else {
          console.log("No images found.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
}

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function download(filename) {

  fetch("/retrieveExportData")
      .then((response) => response.json())
      .then((data) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      })
      .catch((error) => {
        console.error(error);
      });

}
const getJsonUpload = () =>
    new Promise(resolve => {
      const inputFileElement = document.createElement('input')
      inputFileElement.setAttribute('type', 'file')
      inputFileElement.setAttribute('multiple', 'false')
      inputFileElement.setAttribute('accept', '.json')

      inputFileElement.addEventListener(
          'change',
          async (event) => {
            const { files } = event.target
            if (!files) {
              return
            }

            const filePromises = [...files].map(file => file.text())

            resolve(await Promise.all(filePromises))
          },
          false,
      )
      inputFileElement.click()
    })