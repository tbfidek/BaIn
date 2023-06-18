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
    document.querySelector(".form-table form").reset();
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