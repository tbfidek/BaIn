// const daysTag = document.querySelector(".days"),
//     currentDate = document.querySelector(".current-date"),
//     prevNextIcon = document.querySelectorAll(".icons span");
//
// let date = new Date(),
//     currYear = date.getFullYear(),
//     currMonth = date.getMonth();
//
// const months = ["January", "February", "March", "April", "May", "June", "July",
//     "August", "September", "October", "November", "December"];
//
// const renderCalendar = () => {
//     let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(),
//         lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
//         lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(),
//         lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
//     let liTag = "";
//
//     for (let i = firstDayOfMonth; i > 0; i--) {
//         liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
//     }
//
//     for (let i = 1; i <= lastDateOfMonth; i++) {
//         let isToday = i === date.getDate() && currMonth === new Date().getMonth()
//         && currYear === new Date().getFullYear() ? "active" : "";
//         liTag += `<li class="${isToday}">${i}</li>`;
//     }
//
//     for (let i = lastDayOfMonth; i < 6; i++) {
//         liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`
//     }
//
//     currentDate.innerText = `${months[currMonth]} ${currYear}`;
//     daysTag.innerHTML = liTag;
//
//     const dateElements = document.querySelectorAll(".days li");
//     dateElements.forEach((element) => {
//         element.addEventListener("click", () => {
//             dateElements.forEach((dateElement) => {
//                 dateElement.classList.remove("active");
//             });
//             element.classList.add("active");
//         });
//     });
// };
//
// renderCalendar();
// prevNextIcon.forEach(icon => {
//     icon.addEventListener("click", () => {
//         if (icon.classList.contains("prev")) {
//             currMonth -= 1;
//         } else if (icon.classList.contains("next")) {
//             currMonth += 1;
//         }
//
//         if (currMonth < 0 || currMonth > 11) {
//             date = new Date(currYear, currMonth, new Date().getDate());
//             currYear = date.getFullYear();
//             currMonth = date.getMonth();
//         } else {
//             date = new Date();
//         }
//         renderCalendar();
//     });
// });
//
//
//
//
//
//
//
