$(document).ready(function () {
  $("#datepicker-meal").datepicker({
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
    dateFormat: "yy-mm",
    onClose: function (dateText, inst) {
      var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
      var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
      $(this).datepicker("setDate", new Date(year, month, 1));
    },
  });

  $("#mealFormDate").on("submit", function (e) {
    e.preventDefault();
    var selectedDate = $("#datepicker-meal").val();
  });
});

$(document).ready(function () {
  $("#datepicker-meal").datepicker({
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
    dateFormat: "yy-mm",
    onClose: function (dateText, inst) {
      var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
      var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
      $(this).datepicker("setDate", new Date(year, month, 1));
    },
  });

  $("#napFormDate").on("submit", function (e) {
    e.preventDefault();
    var selectedDate = $("#datepicker-meal").val();
  });
});
