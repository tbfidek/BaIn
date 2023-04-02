
function handleRadioClick(displayValue) {
    const signupForm = document.querySelector('.family-options');
    signupForm.style.display = displayValue;
}

function openPopup(){
    let popUp = document.getElementById("pop")
    let blur = document.querySelector('.signup-box')
    let blurr = document.querySelector('.banner')
    popUp.classList.add('active')
    blur.classList.add('active')
    blurr.classList.add('active')
}

function closePopup(){
    let blur = document.querySelector('.signup-box')
    let blurr = document.querySelector('.banner')
    let popUp = document.getElementById("pop")
    blur.classList.remove('active')
    blurr.classList.remove('active')
    popUp.classList.remove('active')
}

