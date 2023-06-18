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
  closePopup();
  form.reset();
  populateUserData();
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

async function insertChild(name, birthday, height, weight, gender) {
  var selectedDate = new Date(birthday);
  var currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate > currentDate) {
    alert("The selected date is in the future!");
    return;
  }
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

        if(json.image){
          document.getElementById("kid-pic").src = json.image;
          document.getElementById("kid-pic-mobile").src = json.image;
        }
        else{
          document.getElementById("kid-pic").src = "/images/user_img.png";
          document.getElementById("kid-pic-mobile").src = "/images/user_img.png";
        }
        const pdfInput = document.getElementById("pdf");
        const dateInput = document.getElementById("data");
        const fileDiv = document.querySelector(".show-files");

      pdfInput.value = "";
      dateInput.value = "";
      fileDiv.innerHTML = "";
        showOverview();
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


window.addEventListener("load", () => {
  document.addEventListener("keydown", hidePopupOnEscapeKey);
  populateUserData();

  const pollingInterval = 5000;

  // setInterval(populateGallery, pollingInterval);
  // setInterval(populateUserData, pollingInterval);
  document.getElementById('import_btn').onclick = async () => {
    const jsonFiles = await getJsonUpload()
    if(jsonFiles[0].fileType === "json"){
      const object = JSON.parse(jsonFiles[0].content);
      for(let i = 0; i < object.length; ++i){

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
      populateUserData();
    } else if(jsonFiles[0].fileType === "csv"){
      const rows = jsonFiles[0].content.split('\n');

      if (rows.length > 0 && rows[0].trim() === 'Child_Name,Birthday,Weight,Height,Gender,Profile_Image') {
        rows.shift();
      }

      const childAccounts = rows.map((row) => {
        const columns = row.split(',');
        const [
          name,
          birthday,
          weight,
          height,
          gender,
          profile_image,
        ] = columns.map((column) => column.trim());

        return {
          name,
          birthday,
          weight,
          height,
          gender,
          profile_image,
        };
      });
      for(let i = 0; i < (childAccounts.length - 1); ++i){
        fetch("/importChildData", {
          method: "POST",
          body: JSON.stringify({
            name: childAccounts[i].name,
            birthday: childAccounts[i].birthday,
            height: childAccounts[i].height,
            weight: childAccounts[i].weight,
            gender: childAccounts[i].gender,
            photo: childAccounts[i].profile_image,
            media: null,
            nap_records: null,
            meal_records: null,
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
      populateUserData();
    } else {
      alert("Invalid file type!");
      return;
    }
  }
});

