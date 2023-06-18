
function sendMedicalFile() {

    const formData = new FormData();

    const pdf = document.getElementById("pdf");
    console.log(pdf.files[0]);

    formData.append('pdf',pdf.files[0]);
    formData.append('id',selected_child.id);
    if(pdf.files[0] != null) {
        fetch('/addMedicalFile', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    alert('Medical file added');
                } else {
                    alert('Failed to upload file. Please try again.');
                }
            })
            .catch((error) => {
                removeAddOption();
                console.error(error);
                alert('An error occurred');
            });
        const pdfInput = document.getElementById("pdf");
        const dateInput = document.getElementById("data");
        const fileDiv = document.querySelector(".show-files");

        pdfInput.value = "";
        dateInput.value = "";
        fileDiv.innerHTML = "";
    }
    else {
        alert("no file selected");
    }
}
function getFilesByDate() {
    const dateInput = document.getElementById("data");
    const date = dateInput.value;

    if (selected_child != null) {
        if (!date) {
            alert("Please select a date.");
            return;
        }
        fetch(`/getFilesByDate/${selected_child.id}/${date}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                const fileDiv = document.querySelector(".show-files");
                fileDiv.innerHTML = "";
                if (data.message) {
                    alert(data.message);
                    return;
                }
                data.forEach((file) => {
                    const button = document.createElement("button");
                    button.textContent = file.filename;
                    button.addEventListener("click", () => {
                        window.open(file.url, "_blank");
                    });

                    fileDiv.appendChild(button);
                });
                dateInput.value = "";
            })
            .catch((error) => {
                console.error(error);
                alert(error.message);
            });
    } else {
        alert("Please select a child first.");
        return;
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("data").addEventListener("change", getFilesByDate);
});
