
function download(filename) {

    fetch("/retrieveExportData")
        .then((response) => response.json())
        .then((data) => {
            var elementJ = document.createElement('a');
            elementJ.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data.data)));
            elementJ.setAttribute('download', filename + '.json');

            elementJ.style.display = 'none';

            var elementC = document.createElement('a');
            elementC.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(data.csvContent));
            elementC.setAttribute('download', filename + '.csv');

            elementC.style.display = 'none';
            document.body.appendChild(elementJ);
            document.body.appendChild(elementC);

            elementJ.click();
            elementC.click();

            document.body.removeChild(elementJ);
            document.body.removeChild(elementC);

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
        inputFileElement.setAttribute('accept', '.json, .csv')

        inputFileElement.addEventListener(
            'change',
            async (event) => {
                const { files } = event.target
                if (!files) {
                    return
                }

                const filePromises = [...files].map(async file => {
                    const fileType = file.type.split('/')[1]
                    const content = await file.text()

                    return { fileType, content }
                })

                const results = await Promise.all(filePromises)
                resolve(results)
            },
            false,
        )
        inputFileElement.click()
    })
