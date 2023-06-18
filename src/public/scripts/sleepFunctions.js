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
    document.querySelector(".sleep-form form").reset();
    populateNapTable();
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