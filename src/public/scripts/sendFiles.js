//images, videos, audios
function sendData() {

    const formData = new FormData();

    const date = document.getElementById("date-pic");
    const img = document.getElementById("add-pic");
    const type = document.getElementById("type-pic");
    const desc = document.getElementById("desc-pic");
    console.log(type.value);
    console.log(date.value);
    console.log(desc.value);

    if(img.files[0] != null){
        if(date.value != "" && desc.value != ""){
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
                    //removeAddOption();
                    if (response.ok) {
                        // location.reload();
                        removeAddOption();
                        showGallery();
                        alert('Media added to the gallery');
                        date.value = "";
                        img.value = "";
                        type.value = "";
                        desc.value = "";
                    } else {
                        alert('Failed to update picture. Please try again.');
                    }
                })
                .catch((error) => {
                    removeAddOption();
                    console.error(error);
                    alert('An error occurred.');
                });
        } else {
            alert("Please fill all fields.");
        }
    } else {
        alert("No media selected.");
    }
}

//medical files
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
    const pdfInput = document.getElementById("pdf");
    const dateInput = document.getElementById("data");
    const fileDiv = document.querySelector(".show-files");

    pdfInput.value = "";
    dateInput.value = "";
    fileDiv.innerHTML = "";
}