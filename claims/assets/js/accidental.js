/* var stepper2
var stepper3
var stepper4
var stepperForm
var stepperFormEl */
//import { sanitize } from "dompurify";
var form = document.getElementById("accidental__form");
var form_Bank = document.getElementById("bank_form");
var listCheckBox = document.querySelector("#upload_invalidCheck_1");
var file1 = document.getElementById("file_Upload_1");
var file2 = document.getElementById("file_Upload_2");
var file3 = document.getElementById("file_Upload_3");
var file4 = document.getElementById("file_Upload_4");
var file5 = document.getElementById("file_Upload_5");
var file6 = document.getElementById("proof_BAO");
var file7 = document.getElementById("proof_addBAO");
// start of addition
var file8 = document.getElementById("file_Upload_8");
// end of addition
var trackBenificiary;
let url = new URL(window.location.href);
let referenceNumber = url.searchParams.get("refNumber");
let uid = url.searchParams.get("sender");
let botId = url.searchParams.get("botId");
var user_mobile;
var currSeconds = 0;
var otpSubmitted = false;
var haveBankDetails = false;
var duration;
var remaining = 120; // 2 mins timer
var resendCount = 0;
var otpModal = document.getElementById("otpPopUp");
var otpExpModal = document.getElementById("otpExpiry");
var invalidOtpModal = document.getElementById("invalidOtp");
var maxResendOtp = document.getElementById("maxResendOtp");
var invalidOtp = 0;
var scanDoc = false;
var payoutOption;
var isChangeInBankDetails = "N"; 
var isChangeInPayoutOption = "N";
var isOtpPopShown = false;
var fileSizeZero = false;
$("#privacy_consent_1").prop("checked", true);
$("#privacy_consent_2").prop("checked", true);
// $('#privacy_consent_3').prop('checked', true);

document.getElementById("upload_waiting_btn").style.display = "none";
// document.getElementById('account_details1_btn_waiting').style.display = 'none'
// document.getElementById('pick_up_btn_waiting').style.display = 'none'
// document.getElementById('submit9_waiting_btn').style.display = 'none'

var form_addBank = document.getElementById("addbank_form");
form_addBank.addEventListener("submit", handleAddBankInfo);

form.addEventListener("submit", handleForm);
form_Bank.addEventListener("submit", handleAccountInfo);

// var otp_form = document.getElementById('otpPopUp');
// otp_form.addEventListener('submit', submitOtp);

/* document.addEventListener('DOMContentLoaded', function () {
    stepperFormEl = document.querySelector('#stepperForm')
    stepperForm = new Stepper(stepperFormEl, {
        animation: true
    })
}) */
window.addEventListener("message", function (eventData) {
  if (JSON.parse(eventData.data)) {
    let event = JSON.parse(eventData.data);
    if (event.data && event.data.code === "submit_now") {
      console.log("posting from bot : ");
      return;
    }
  }
});

window.addEventListener("otp", () => {
  console.log("You knocked?");
  console.log("OTP event");
});

function myDisable() {
  document.getElementById("submit9").disabled = true;
  document.getElementById("submit9").style.cursor = "no-drop";
  document.getElementById("field_AccountName").disabled = true;
  document.getElementById("field_AccountName").style.cursor = "no-drop";
  document.getElementById("field_AccountNumber").disabled = true;
  document.getElementById("field_AccountNumber").style.cursor = "no-drop";
  document.getElementById("field_Bank").disabled = true;
  document.getElementById("field_Bank").style.cursor = "no-drop";
  document.getElementById("field_Branch").disabled = true;
  document.getElementById("field_Branch").style.cursor = "no-drop";
  document.getElementById("from_currency").disabled = true;
  document.getElementById("from_currency").style.cursor = "no-drop";
  document.getElementById("proof_BAO").disabled = true;
  document.getElementById("proof_BAO").style.cursor = "no-drop";
  document.getElementById("back_btn1").style.cursor = "no-drop";
  document.getElementById("back_btn1").style.pointerEvents = "none";
  document.getElementById("bank_form").style.cursor = "no-drop";
}

function addFileToList(fileObject, fileName) {
  console.log(fileName);
  let index = filesList.findIndex((x) => x.filename == fileName);

  if (index === -1) {
    console.log("adding bcoz unique");
    filesList.push(fileObject);
  }
}

let cleartime = null;
function timer(lowerVal, UpperVal) {
  var random = 1;
  return new Promise((resolve, reject) => {
    var i = lowerVal;
    // document.getElementsByClassName('loader1').style.display = 'block'
    cleartime = setInterval(() => {
      i = random + i;
      renderProgress(i);
      if (i == UpperVal - 1) {
        i = UpperVal;
        renderProgress(i);
      }
      if (i == UpperVal) {
        console.log("cleartime");
        clearTimeout(cleartime);
        // document.getElementsByClassName('loader1').style.display='none'
        resolve("cleartime");
      }
      // if (i > UpperVal) {

      //   console.log("cleartime");
      //   clearInterval(cleartime);

      //   resolve("cleartime")
      //   if (i > 100) {
      //     renderProgress(0);
      //   }
      // }
      //  i++;
    }, 500);
  });
}

function renderProgress(progress) {
  progress = Math.floor(progress);
  if (progress < 25) {
    var angle = -90 + (progress / 100) * 360;
    $(".animate-0-25-b").css("transform", "rotate(" + angle + "deg)");
  } else if (progress >= 25 && progress < 50) {
    var angle = -90 + ((progress - 25) / 100) * 360;
    $(".animate-0-25-b").css("transform", "rotate(0deg)");
    $(".animate-25-50-b").css("transform", "rotate(" + angle + "deg)");
  } else if (progress >= 50 && progress < 75) {
    var angle = -90 + ((progress - 50) / 100) * 360;
    $(".animate-25-50-b, .animate-0-25-b").css("transform", "rotate(0deg)");
    $(".animate-50-75-b").css("transform", "rotate(" + angle + "deg)");
  } else if (progress >= 75 && progress <= 100) {
    var angle = -90 + ((progress - 75) / 100) * 360;
    $(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css(
      "transform",
      "rotate(0deg)"
    );
    $(".animate-75-100-b").css("transform", "rotate(" + angle + "deg)");
  }
  // if (progress != 0) {
  $(".text").html(progress + "%");
  // }
}

let finalPayload = {};
let accidentPayload = {};
let basicInformation = {};
let InsuredInformation = {};
let BeneficiaryList = {};
let PaymentOption = {};
let BankDetails = {};
let FilesInformation = {};
let filesList = [];

let beneficiaryCount = 1;
let filesMap = {};
let claimType,
  causeOfLoss,
  govIdFront,
  govIdBack,
  apsFile,
  narrationReport,
  officialReceipts;
let file1Buffer,
  file2Buffer,
  file3Buffer,
  file4Buffer,
  file5Buffer,
  file6Buffer,
  file7Buffer,
  file8Buffer;
basicInformation["webReferenceNumber"] = referenceNumber;
basicInformation["companyName"] = "PAL";
basicInformation["claimType"] = "Living";
basicInformation["causeOfLoss"] = "Accident";

// start of addition
var countryOfResidence = document.getElementById("country-of-residence");
var w8Form = document.getElementById("w8-form");
var countryOfCitizenship = document.getElementById("country-of-citizenship");
var w9Form = document.getElementById("w9-form");
var w8w9FormUpload = document.getElementById("w8-w9-form-upload");
var w8w9FormUploadMessage = document.getElementById(
  "w8-w9-form-upload-message"
);
var privacyTermsConditions = document.getElementById(
  "privacy-terms-conditions"
);
var generalPrivacyNotice = document.getElementById("general-privacy-notice");
var chinaPrivacyNotice = document.getElementById("china-privacy-notice");

countryOfResidence.addEventListener("change", function () {
  w8Form.classList.add("w8-form-hidden");
  w9Form.classList.add("w9-form-hidden");
  chinaPrivacyNotice.classList.add("china-privacy-notice-hidden");
  generalPrivacyNotice.classList.add("general-privacy-notice-hidden");

  const selectedResidenceCountry = countryOfResidence.value;
  const selectedCitizenshipCountry = countryOfCitizenship.value;

  if (selectedCitizenshipCountry === "United States of America (USA)") {
    w9Form.classList.remove("w9-form-hidden");
  } else if (selectedResidenceCountry === "United States of America (USA)") {
    w8Form.classList.remove("w8-form-hidden");
  }

  if (
    selectedResidenceCountry === "China" ||
    selectedCitizenshipCountry === "China"
  ) {
    privacyTermsConditions.innerHTML = `I have read and understood the Terms and Conditions in the <a href="#accidental_data_privacy">AIA Privacy Addendum for Mainland China</a>.`;
    chinaPrivacyNotice.classList.remove("china-privacy-notice-hidden");
  } else {
    privacyTermsConditions.innerHTML = `I have read and understood the Terms and Conditions in the <a href="#accidental_data_privacy">Data Privacy Statement</a>.`;
    generalPrivacyNotice.classList.remove("general-privacy-notice-hidden");
  }
});
generalPrivacyNotice.classList.remove("general-privacy-notice-hidden");

countryOfCitizenship.addEventListener("change", function () {
  w8Form.classList.add("w8-form-hidden");
  w9Form.classList.add("w9-form-hidden");
  chinaPrivacyNotice.classList.add("china-privacy-notice-hidden");
  generalPrivacyNotice.classList.add("general-privacy-notice-hidden");

  const selectedCitizenshipCountry = countryOfCitizenship.value;
  const selectedResidenceCountry = countryOfResidence.value;
  if (selectedCitizenshipCountry === "United States of America (USA)") {
    w9Form.classList.remove("w9-form-hidden");
  } else if (
    selectedResidenceCountry &&
    selectedResidenceCountry === "United States of America (USA)"
  ) {
    w8Form.classList.remove("w8-form-hidden");
  }

  if (
    selectedResidenceCountry === "China" ||
    selectedCitizenshipCountry === "China"
  ) {
    privacyTermsConditions.innerHTML = `I have read and understood the Terms and Conditions in the <a href="#accidental_data_privacy">AIA Privacy Addendum for Mainland China</a>.`;
    chinaPrivacyNotice.classList.remove("china-privacy-notice-hidden");
  } else {
    privacyTermsConditions.innerHTML = `I have read and understood the Terms and Conditions in the <a href="#accidental_data_privacy">Data Privacy Statement</a>.`;
    generalPrivacyNotice.classList.remove("general-privacy-notice-hidden");
  }
});
// end of addition

$(document).ready(function (event) {
  disableFutureDates();
  disableFutureDatesDOB();
  setCountryCode();
  let idleInterval = setInterval(timerIncrement, 1000);
  $(this).mousemove(resetTimer);
  $(this).keypress(resetTimer);
  $("#spin1").hide();
  $("#spin2").hide();
  $("#spin3").hide();
  $("#spin4").hide();
  var val = "Peso";
  if (val == "Peso") {
    $("#field_Bank").html(
      "<option value='BPI' >Bank of the Philippine Islands - BPI</option><option value='BFB'>BPI Family Savings Bank - BFB</option><option value='BDO'>Banco de Oro - BDO</option><option value='CBC'>China Banking Corporation - CBC</option><option value='CITI'>Citibank Philippines - CITI</option><option value='DBP'>Development Bank of the Phils - DBP</option><option value='EWB'>Eastwest Bank - EWB</option><option value='HSBC'>Hongkong Shanghai Banking Corp. Phils - HSBC</option><option value='LPB'>Land Bank of the Philippines - LPB</option><option value='MBTC'>Metropolitan Banks and Trust Company - MBTC</option><option value='PNB'>Philippine National Bank - PNB</option><option value='RCBC'>Rizal Commercial Banking Corp - RCBC</option><option value='SBTC'>Security Bank - SBTC</option><option value='UB'>Union Bank of the Philippines - UB</option>"
    );
  }
  $("#from_currency").change(function () {
    var val = $(this).val();
    if (val == "Peso") {
      $("#field_Bank").html(
        "<option value='BPI' >Bank of the Philippine Islands - BPI</option><option value='BFB'>BPI Family Savings Bank - BFB</option><option value='BDO'>Banco de Oro - BDO</option><option value='CBC'>China Banking Corporation - CBC</option><option value='CITI'>Citibank Philippines - CITI</option><option value='DBP'>Development Bank of the Phils - DBP</option><option value='EWB'>Eastwest Bank - EWB</option><option value='HSBC'>Hongkong Shanghai Banking Corp. Phils - HSBC</option><option value='LPB'>Land Bank of the Philippines - LPB</option><option value='MBTC'>Metropolitan Banks and Trust Company - MBTC</option><option value='PNB'>Philippine National Bank - PNB</option><option value='RCBC'>Rizal Commercial Banking Corp - RCBC</option><option value='SBTC'>Security Bank - SBTC</option><option value='UB'>Union Bank of the Philippines - UB</option>"
      );
    } else if (val == "USD") {
      $("#field_Bank").html(
        "<option value='BPI'>Bank of the Philippine Islands - BPI</option><option value='BDO'>Banco de Oro - BDO</option>"
      );
    }
  });
});

function resetTimer() {
  currSeconds = 0;
}

function timerIncrement() {
  currSeconds = currSeconds + 1;
  if (currSeconds == 1800) {
    window.top.location = "http://www.philamlife.com";
  }
}

/* Check Date should not be in future */
function futureDate(date) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  var systemdate = dd + "-" + mm + "-" + yyyy;
  if (date.length != 0) {
    if (process(date) > process(systemdate)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function futureDateDOB(date) {
  /*   let id = evt.target.id;*/
  var res = date.split("-");
  var year = res[0];
  var Month = res[1];
  var day = res[2];
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  // console.log("Logged-In Date:" + day, Month, year)
  // console.log("System Date:" + dd, mm, yyyy)

  /* This is for safari, not good way to handle */
  if (day.length == 4) {
    if (day == yyyy && Month == mm && year == dd) {
      return false;
    } else {
      return true;
    }
  } else {
    if (year == yyyy && Month == mm && day == dd) {
      return false;
    } else {
      return true;
    }
  }
}

function disableFutureDates() {
  var dtToday = new Date();
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate();
  var year = dtToday.getFullYear();
  if (month < 10) month = "0" + month.toString();
  if (day < 10) day = "0" + day.toString();
  var maxDate = year + "-" + month + "-" + day;
  $("#field_DOA").attr("max", maxDate);
}

function disableFutureDatesDOB() {
  var dtToday = new Date();
  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate();
  var dobdate = day - 1;
  var year = dtToday.getFullYear();
  if (month < 10) month = "0" + month.toString();
  if (day < 10) day = "0" + day.toString();
  var maxDate = year + "-" + month + "-" + dobdate;
  if (day <= 10) {
    maxDate = year + "-" + month + "-" + "0" + dobdate;
  }
  $("#field_DOB").attr("max", maxDate);
}

function setCountryCode() {
  $("#inlineFormCustomSelect").change(function () {
    $("select option")[0].value = $("select option:selected").val();
    $("select option")[0].innerHTML = "+" + $("select option:selected").val();
    $("select").val($("select option:selected").val());
    $("select option").css({ "background-color": "", color: "" });
  });
}

/**
 * Code refactor for this function
 * instead of sending list of file as input, for final list of files, send the form data with all the files in it
 * Along with that, send the file name that needs to be saved.
 */
const handleImageUpload = (formData, fileName) => {
  // const files = event.target.files
  // const formData = new FormData()
  fetch("https://staging.yellowmessenger.com/components/tataAia/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      var decoded = atob(response.data);
      var saveByteArray = function (data, name) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob(data, { type: "application/pdf" }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
      };
      var byteNumbers = Array(decoded.length);
      for (i = 0; i < decoded.length; i++) {
        byteNumbers[i] = decoded.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      saveByteArray([byteArray], fileName + ".pdf");
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 *
 * New function
 * instead of giving a PDF the as result
 * you will be getting the cdn link to the file in the bot
 */
const handleFileUpload = (formData, fileName) => {
  console.log("file upload new");
  var myHeaders = new Headers();
  console.log("form data : ");
  console.log(formData);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formData,
    redirect: "follow",
  };
  fetch(
    `https://app.yellowmessenger.com/api/chat/upload-file?bot=${botId}&uid=${fileName}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};
const getBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    console.log("reading file");
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log("reading file");
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const checkForVirus = (fileData) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({ data: fileData, type: "base64" });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  return fetch(
    "https://app.yellowmessenger.com/components/virus-scanner/scan",
    requestOptions
  );
};

listCheckBox.onchange = function () {
  if ($(listCheckBox).is(":checked")) {
    $(".feedback_label").show();
  } else {
    $(".feedback_label").hide();
  }
};

/* function loader() {
    var btnNextList = [].slice.call(document.querySelectorAll('.btn-next-form'))
    var stepperPanList = [].slice.call(stepperFormEl.querySelectorAll('.bs-stepper-pane'))
    var inputMailForm = document.getElementById('inputMailForm')
    var inputPasswordForm = document.getElementById('inputPasswordForm')
    var form = stepperFormEl.querySelector('.bs-stepper-content form')

    btnNextList.forEach(function (btn) {
        btn.addEventListener('click', function () {
            stepperForm.next()
        })
    })

    stepperFormEl.addEventListener('show.bs-stepper', function (event) {
        form.classList.remove('was-validated')
        var nextStep = event.detail.indexStep
        var currentStep = nextStep

        if (currentStep > 0) {
            currentStep--
        }

        var stepperPan = stepperPanList[currentStep]

        if ((stepperPan.getAttribute('id') === 'test-form-1' && !inputMailForm.value.length)
            || (stepperPan.getAttribute('id') === 'test-form-2' && !inputPasswordForm.value.length)) {
            event.preventDefault()
            form.classList.add('was-validated')
        }
    })
} */

/* 
function validateEmail(emailField) {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(emailField) == false) {
    $("#err_field_emailAddress").text('Invalid Email');
    $("#err_field_emailAddress").show();
    return false;
  }
  $("#err_field_emailAddress").text('');
  $("#err_field_emailAddress").hide();
  return true;
}
 */
function isNumber(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    $(`#err_${evt.target.id}`).text("Only numbers allowed!");
    $(`#err_${evt.target.id}`).show();
    return false;
  }
  $(`#err_${evt.target.id}`).text("");
  $(`#err_${evt.target.id}`).hide();
  return true;
}

function checkSpcialChar(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (
    !(
      (evt.charCode >= 65 && evt.charCode <= 90) ||
      (evt.charCode >= 97 && evt.charCode <= 122) ||
      (evt.charCode >= 48 && evt.charCode <= 57) ||
      evt.charCode == 32 ||
      evt.charCode == 13
    )
  ) {
    $(`#err_${evt.target.id}`).text("special character is not allowed");
    $(`#err_${evt.target.id}`).show();
    return false;
  }
  $(`#err_${evt.target.id}`).text("");
  $(`#err_${evt.target.id}`).hide();
  return true;
}

function isNotNumber(evt) {
  $(`#err_${evt.target.id}`).text("");
  $(`#err_${evt.target.id}`).hide();
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (
    (charCode > 31 && (charCode < 48 || charCode > 57)) ||
    evt.charCode == 13
  ) {
    $(`#err_${evt.target.id}`).text("");
    $(`#err_${evt.target.id}`).hide();
    return true;
  }
  validateNotNumber(evt);
  return false;
}

function validateNotNumber(evt) {
  let id = evt.target.id;
  $(`#err_${id}`).text("Numbers not allowed");
  $(`#err_${id}`).show();
  return;
}
function specialcharacterValidation(input) {
  var regex = /^[A-Za-z0-9 ]+$/;
  var firstNameValid = regex.test(input);
  if (!firstNameValid) {
    return true;
  } else {
    return false;
  }
}

function checkLength(evt, max_Length) {
  let id = evt.target.id;
  var val = document.getElementById(id).value;
  var length = val.length;
  if (length >= max_Length) {
    $(`#err_${id}`).text("Maximum " + max_Length + " characters allowed!");
    $(`#err_${id}`).show();
  } else {
    detection(evt);
  }
}

function fieldCheckLength(field, maxLength) {
  var length = field.length;
  if (length > maxLength) {
    return true;
  } else {
    return false;
  }
}

function detection(evt) {
  id = evt.target.id;
  document.getElementById(id).addEventListener("keydown", (event) => {
    if (event.key == "Backspace") {
      $(`#err_${id}`).text("");
      $(`#err_${id}`).hide();
    }
  });
}

function check_Mobile_Length(evt, max_Length) {
  let id = evt.target.id;
  var val = document.getElementById(id).value;
  var length = val.length;
  if (length !== max_Length) {
    detection(evt);
  } else {
    $(`#err_${id}`).text("Maximum " + max_Length + " number allowed!");
    $(`#err_${id}`).show();
  }
}

function numberValidation(input) {
  var regex = /^([^0-9]*)$/;
  var firstNameValid = regex.test(input);
  if (!firstNameValid) {
    return true;
  } else {
    return false;
  }
}

function onlyNumberValidate(input) {
  var regex = /^[0-9]*$/;
  var firstNameValid = regex.test(input);
  if (firstNameValid) {
    return true;
  } else {
    return false;
  }
}

// function fieldCheckLength(field, maxLength) {
//   var length = field.length;
//   if (length > maxLength) {
//     return true;
//   } else {
//     return false;
//   }
// }

function checkActualTime(field2_TOA, field3_DOA) {
  var today = new Date();
  var currentYear = today.getFullYear();
  var currentMonth = today.getMonth() + 1;
  var currentDate = today.getDate();
  var CurrentHour = today.getHours();
  var CurrentMinute = today.getMinutes();

  var UserEnterDate = field3_DOA.split("-");
  var userYear = UserEnterDate[0];
  var userMonth = UserEnterDate[1];
  var userDay = UserEnterDate[2];
  var istimeMatched = false;

  var UserTime = field2_TOA.split(":");
  var userEnterHours = UserTime[0];
  var userEnterMinute = UserTime[1];

  if (userDay.length == 4) {
    if (UserTime.length != 0) {
      var minSplit = userEnterMinute.split(" ");
      userEnterMinute = minSplit[0];
      var userAmPm = minSplit[1];
      var isAmPm = userAmPm == "am" ? "am" : "pm";
      if (isAmPm == "pm") {
        userEnterHours = (userEnterHours % 12) + 12;
      } else {
        userEnterHours = userEnterHours % 12;
      }
    }
  }

  if (field2_TOA.length != 0 && field3_DOA.length != 0) {
    /* This is for safari, not good way to handle */
    if (userDay.length == 4) {
      if (
        userDay == currentYear &&
        userMonth == currentMonth &&
        userYear == currentDate
      ) {
        istimeMatched = true;
      } else {
        return true;
      }
    } else {
      if (
        userYear == currentYear &&
        userMonth == currentMonth &&
        userDay == currentDate
      ) {
        istimeMatched = true;
      } else {
        return true;
      }
    }
    if (istimeMatched == true) {
      if (userEnterHours > CurrentHour) {
        return false;
      } else if (userEnterHours < CurrentHour) {
        return true;
      } else if (userEnterHours == CurrentHour) {
        if (userEnterMinute <= CurrentMinute) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

function process(date) {
  var parts = date.split("-");
  if (parts[2].length == 4) {
    // it is for safari
    //day     , mm          , yyyy
    return new Date(parts[2], parts[1] - 1, parts[0]);
  } else {
    //yyyy     , mm          , dd
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
}

function compareFun(DOB, DOA) {
  if (DOB.length != 0 && DOA.length != 0) {
    if (process(DOB) <= process(DOA)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function formatAMPM(date) {
  var time = date;
  var full_Time = time.split(":");
  var hours, minutes;
  hours = full_Time[0];
  minutes = full_Time[1];
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;

  return strTime;
}

// start of addition
function displayW8W9FormUpload() {
  const countryOfResidence = InsuredInformation.country_resident;
  const countryOfCitizenship = InsuredInformation.citizenship;
  console.log(countryOfResidence, countryOfCitizenship);
  w8w9FormUpload.classList.add("w8-w9-form-upload-hidden");

  if (countryOfCitizenship === "United States of America (USA)") {
    w8w9FormUpload.classList.remove("w8-w9-form-upload-hidden");
    w8w9FormUploadMessage.innerText = "W9 Form (For US citizen)";
  } else if (countryOfResidence === "United States of America (USA)") {
    w8w9FormUpload.classList.remove("w8-w9-form-upload-hidden");
    w8w9FormUploadMessage.innerText = "W8 Ben Form (For US resident)";
  }
}
// end of addition

function handleForm(event) {
  event.preventDefault();
  var field_firstName = $("#field_firstName").val();
  var field_middleName = $("#field_middleName").val();
  var field_injury = $("#field_injury").val();
  var field_lastName = $("#field_lastName").val();
  var field_lastName_Suffix = $("#field_lastName_Suffix").val();
  var field_DOB = $("#field_DOB").val();
  var field_mobileNum = $("#field_mobileNum").val();
  var field_emailAddress = $("#field_emailAddress").val();
  var field_homeAddress = $("#field_homeAddress").val();
  var field_DOA = $("#field_DOA").val();
  var field_TOA = $("#field_TOA").val();
  var field_POA = $("#field_POA").val();
  // start of addition
  var country_of_residence = $("#country-of-residence").val();
  var country_of_citizenship = $("#country-of-citizenship").val();
  // end of addition
  var full_TOA = formatAMPM(field_TOA);

  var comapareDates = compareFun(field_DOB, field_DOA);

  InsuredInformation["firstName"] = field_firstName;
  InsuredInformation["middleName"] = field_firstName;
  InsuredInformation["lastName"] = field_firstName;
  InsuredInformation["suffix"] = field_firstName;
  InsuredInformation["dateOfBirth"] = field_firstName;
  InsuredInformation["countryCode"] = field_firstName;
  InsuredInformation["phoneNumber"] = field_firstName;
  InsuredInformation["emailAddress"] = field_firstName;
  InsuredInformation["homeAddress"] = field_firstName;
  InsuredInformation["injuryDetails"] = field_firstName;
  InsuredInformation["accidentDate"] = field_firstName;
  InsuredInformation["accidentTime"] = field_firstName;
  InsuredInformation["accidentPlace"] = field_firstName;
  // InsuredInformation["firstName"] = field_firstName;

  var specFirstName = specialcharacterValidation(field_firstName);
  var specMiddleName = specialcharacterValidation(field_middleName);
  var specLastName = specialcharacterValidation(field_lastName);
  var numFirstName = numberValidation(field_firstName);
  var numMiddleName = numberValidation(field_middleName);
  var numLastName = numberValidation(field_lastName);
  var numMobile = onlyNumberValidate(field_mobileNum);
  var specLastNameSuffix = false;
  var numLastNameSuffix = false;
  var lenLastNameSuffix = false;

  if (field_lastName_Suffix != 0) {
    specLastNameSuffix = specialcharacterValidation(field_lastName_Suffix);
    numLastNameSuffix = numberValidation(field_lastName_Suffix);
    lenLastNameSuffix = fieldCheckLength(field_lastName_Suffix, 3);
  }

  var lenFirstName = fieldCheckLength(field_firstName, 25);
  var lenMiddleName = fieldCheckLength(field_middleName, 25);
  var leninjury = fieldCheckLength(field_injury, 500);
  var lenLastName = fieldCheckLength(field_lastName, 25);
  var lenMobileNum = fieldCheckLength(field_mobileNum, 10);
  var lenHomeAddress = fieldCheckLength(field_homeAddress, 250);
  var lenPOA = fieldCheckLength(field_POA, 120);

  if (field_DOB.length !== 0) {
    var futDOB = futureDate(field_DOB);
    var futExistDOB = futureDateDOB(field_DOB);
  }
  var timeCompare = false;
  var futDOA = false;

  if (field_DOA.length != 0) {
    futDOA = futureDate(field_DOA);
    if (field_TOA.length != 0) {
      timeCompare = checkActualTime(field_TOA, field_DOA);
    }
  }

  if (field_firstName.length === 0) {
    $("#err_field_firstName").text("Field is empty");
    $("#err_field_firstName").show();
  } else if (lenFirstName) {
    $("#err_field_firstName").text("Maximum 25 characters allowed!");
    $("#err_field_firstName").show();
  } else if (specFirstName == true) {
    $("#err_field_firstName").text("Special character is not allowed");
    $("#err_field_firstName").show();
  } else if (numFirstName) {
    $("#err_field_firstName").text("Number not allowed");
    $("#err_field_firstName").show();
  } else {
    $("#err_field_firstName").text("");
    $("#err_field_firstName").hide();
  }

  if (field_middleName.length === 0) {
    $("#err_field_middleName").text("Field is empty");
    $("#err_field_middleName").show();
  } else if (lenMiddleName) {
    $("#err_field_middleName").text("Maximum 25 characters allowed!");
    $("#err_field_middleName").show();
  } else if (specMiddleName) {
    $("#err_field_middleName").text("Special character is not allowed");
    $("#err_field_middleName").show();
  } else if (numMiddleName) {
    $("#err_field_middleName").text("Number not allowed");
    $("#err_field_middleName").show();
  } else {
    $("#err_field_middleName").text("");
    $("#err_field_middleName").hide();
  }

  if (field_injury.length === 0) {
    $("#err_field_injury").text("Field is empty");
    $("#err_field_injury").show();
  } else if (leninjury) {
    $("#err_field_injury").text("Maximum 500 characters allowed!");
    $("#err_field_injury").show();
  } else {
    $("#err_field_injury").text("");
    $("#err_field_injury").hide();
  }

  if (field_lastName.length === 0) {
    $("#err_field_lastName").text("Field is empty");
    $("#err_field_lastName").show();
  } else if (lenLastName) {
    $("#err_field_lastName").text("Maximum 25 characters allowed!");
    $("#err_field_lastName").show();
  } else if (specLastName) {
    $("#err_field_lastName").text("Special character is not allowed");
    $("#err_field_lastName").show();
  } else if (numLastName) {
    $("#err_field_lastName").text("Number not allowed");
    $("#err_field_lastName").show();
  } else {
    $("#err_field_lastName").text("");
    $("#err_field_lastName").hide();
  }

  if (field_lastName_Suffix.length === 0) {
    $("#err_field_lastName_Suffix").text("");
    $("#err_field_lastName_Suffix").hide();
  } else if (lenLastNameSuffix) {
    $("#err_field_lastName_Suffix").text("Maximum 3 characters allowed");
    $("#err_field_lastName_Suffix").show();
  } else if (specLastNameSuffix) {
    $("#err_field_lastName_Suffix").text("Special character is not allowed");
    $("#err_field_lastName_Suffix").show();
  } else if (numLastNameSuffix) {
    $("#err_field_lastName_Suffix").text("Number not allowed");
    $("#err_field_lastName_Suffix").show();
  } else {
    $("#err_field_lastName_Suffix").text("");
    $("#err_field_lastName_Suffix").hide();
  }

  if (field_DOB.length === 0) {
    $("#err_field_DOB").text("Field is empty");
    $("#err_field_DOB").show();
  } else if (!futDOB) {
    $("#err_field_DOB").text("Future date is  not Accepted!");
    $("#err_field_DOB").show();
  } else if (!futExistDOB) {
    $("#err_field_DOB").text("Current date is  not Applicable!");
    $("#err_field_DOB").show();
  } else if (!comapareDates) {
    $("#err_field_DOB").text(
      "Insured DOB can not be greater than accident date"
    );
    $("#err_field_DOB").show();
  } else {
    $("#err_field_DOB").text("");
    $("#err_field_DOB").hide();
  }

  if (field_mobileNum.length === 0) {
    $("#err_field_mobileNum").text("Field is empty");
    $("#err_field_mobileNum").show();
  } else if (lenMobileNum) {
    $("#err_field_mobileNum").text("Maximum 10 characters allowed!");
    $("#err_field_mobileNum").show();
  } else if (!numMobile) {
    $("#err_field_mobileNum").text("Only number is allowed!");
    $("#err_field_mobileNum").show();
  } else if (field_mobileNum.length !== 10) {
    $("#err_field_mobileNum").text("Minimum 10 number allowed!");
    $("#err_field_mobileNum").show();
  } else {
    $("#err_field_mobileNum").text("");
    $("#err_field_mobileNum").hide();
  }

  if (field_emailAddress.length === 0) {
    $("#err_field_emailAddress").text("Field is empty");
    $("#err_field_emailAddress").show();
  } else {
    validateEmail(field_emailAddress);
  }

  if (field_homeAddress.length === 0) {
    $("#err_field_homeAddress").text("Field is empty");
    $("#err_field_homeAddress").show();
  } else if (lenHomeAddress) {
    $("#err_field_homeAddress").text("Maximum 250 characters allowed!");
    $("#err_field_homeAddress").show();
  } else {
    $("#err_field_homeAddress").text("");
    $("#err_field_homeAddress").hide();
  }

  if (field_DOA.length === 0) {
    $("#err_field_DOA").text("Field is empty");
    $("#err_field_DOA").show();
  } else if (!futDOA) {
    $("#err_field_DOA").text("Future date is not accepted");
    $("#err_field_DOA").show();
  } else {
    $("#err_field_DOA").text("");
    $("#err_field_DOA").hide();
  }

  if (field_TOA.length === 0) {
    $("#err_field_TOA").text("Field is empty");
    $("#err_field_TOA").show();
  } else if (timeCompare == false) {
    $("#err_field_TOA").text("Time can not be greater than current time");
    $("#err_field_TOA").show();
  } else {
    $("#err_field_TOA").text("");
    $("#err_field_TOA").hide();
  }

  if (field_POA.length === 0) {
    $("#err_field_POA").text("Field is empty");
    $("#err_field_POA").show();
  } else if (lenPOA) {
    $("#err_field_POA").text("Maximum 120 characters allowed!");
    $("#err_field_POA").show();
  } else {
    $("#err_field_POA").text("");
    $("#err_field_POA").hide();
  }

  // start of addition
  if (country_of_citizenship === null) {
    $("#err_field_citizenship").text("Please select a country");
    $("#err_field_citizenship").show();
  } else {
    $("#err_field_citizenship").text("");
    $("#err_field_citizenship").hide();
  }
  // end of addition

  if (!$("#invalidCheck_basic").is(":checked")) {
    $("#err_invalidCheck_basic").text("Please select the field");
    $("#err_invalidCheck_basic").show();
  } else {
    $("#err_invalidCheck_basic").text("");
    $("#err_invalidCheck_basic").hide();
  }

  if (!$("#invalidCheck_privacy").is(":checked")) {
    $("#err_invalidCheck_privacy").text("Please select the field");
    $("#err_invalidCheck_privacy").show();
  } else {
    $("#err_invalidCheck_privacy").text("");
    $("#err_invalidCheck_privacy").hide();
  }

  if (
    field_firstName.length !== 0 &&
    field_middleName.length !== 0 &&
    field_injury.length !== 0 &&
    field_lastName.length !== 0 &&
    field_DOB.length !== 0 &&
    field_mobileNum.length == 10 &&
    field_emailAddress.length !== 0 &&
    field_homeAddress.length !== 0 &&
    field_DOA.length !== 0 &&
    field_TOA.length !== 0 &&
    field_POA.length !== 0 &&
    // start of addition
    country_of_citizenship !== null &&
    // end of addition
    $("#invalidCheck_basic").is(":checked") &&
    $("#invalidCheck_privacy").is(":checked") &&
    validateEmail(field_emailAddress) &&
    specFirstName == false &&
    specMiddleName == false &&
    specLastName == false &&
    numFirstName == false &&
    numMiddleName == false &&
    numLastName == false &&
    numMobile == true &&
    specLastNameSuffix == false &&
    numLastNameSuffix == false &&
    comapareDates == true &&
    timeCompare == true &&
    futDOA == true &&
    futDOB == true &&
    futExistDOB == true &&
    lenLastNameSuffix == false &&
    lenFirstName == false &&
    lenMiddleName == false &&
    leninjury == false &&
    lenMobileNum == false &&
    lenHomeAddress == false &&
    lenPOA == false
  ) {
    const data = {
      field_firstName,
      field_middleName,
      field_injury,
      field_lastName,
      field_lastName_Suffix,
      field_DOB,
      country_code: $("select#inlineFormCustomSelect option")
        .filter(":selected")
        .val(),
      field_mobileNum,
      field_emailAddress,
      field_homeAddress,
      field_DOA,
      full_TOA,
      /* field_TOA, */
      field_POA,
      //   start of addition
      country_of_citizenship,
      country_of_residence,
      //   end of addition
      basic_checkbox: $("#invalidCheck_basic").is(":checked"),
      privacy_checkbox: $("#invalidCheck_privacy").is(":checked"),
      privacy_consent_1: $("#privacy_consent_1").is(":checked"),
      privacy_consent_2: $("#privacy_consent_2").is(":checked"),
      // privacy_consent_3: $("#privacy_consent_3").is(":checked"),
    };

    $("#form_wrapper").hide();
    $("#stepper_intro").hide();
    $("#accidental_data_privacy").hide();
    $("#step1").addClass("done");
    $("#step2").addClass("active");
    $("#step2>div").addClass("active");
    $("#requirements").show();
    /*  $('#requirements')[0].scrollIntoView(true); */
    $("#customer_Name").text(
      `Hi ${field_firstName}, We have received your request and will provide an update within 7 to 10 working days. This will be sent to your mobile number on record. Note that we may require additional documents to support your request.`
    );
    console.log("Data -> ", data);

    InsuredInformation["firstName"] = field_firstName.toUpperCase();
    InsuredInformation["middleName"] = field_middleName.toUpperCase();
    InsuredInformation["lastName"] = field_lastName.toUpperCase();
    InsuredInformation["suffix"] = field_lastName_Suffix.toUpperCase();
    InsuredInformation["dateOfBirth"] =
      field_DOB.split("-")[1] +
      "/" +
      field_DOB.split("-")[2] +
      "/" +
      field_DOB.split("-")[0];
    InsuredInformation["countryCode"] = $(
      "select#inlineFormCustomSelect option"
    )
      .filter(":selected")
      .val();
    InsuredInformation["phoneNumber"] = field_mobileNum;
    InsuredInformation["emailAddress"] = field_emailAddress;
    InsuredInformation["homeAddress"] = field_homeAddress;
    InsuredInformation["injuryDetails"] = field_injury;
    InsuredInformation["accidentDate"] =
      field_DOA.split("-")[1] +
      "/" +
      field_DOA.split("-")[2] +
      "/" +
      field_DOA.split("-")[0];
    InsuredInformation["accidentTime"] = full_TOA;
    InsuredInformation["accidentPlace"] = field_POA;
    // start of addition
    InsuredInformation["citizenship"] = country_of_citizenship;
    InsuredInformation["country_resident"] = country_of_residence;
    InsuredInformation["has_form"] =
      country_of_citizenship === "United States of America (USA)" ||
      country_of_residence === "United States of America (USA)"
        ? 0
        : 2;
    // end of addition
    InsuredInformation["check1"] = data.privacy_consent_1;
    InsuredInformation["check2"] = data.privacy_consent_2;
    // for otp screen
    document.getElementById("user_mobile").innerHTML = field_mobileNum.replace(
      /.(?=.{4})/g,
      "*"
    );
    // for otp screen
    let stageOneData = {
      stageOne: true,
      type: "Accident",
      referenceNumber: referenceNumber,
      data: InsuredInformation,
    };
    window.parent.postMessage(
      JSON.stringify({
        event_code: "ym-client-event",
        data: JSON.stringify({
          event: {
            code: "personalinfo",
            data: JSON.stringify(stageOneData),
          },
        }),
      }),
      "*"
    );
    // start of addition
    displayW8W9FormUpload();
    // end of addition
  } else if (comapareDates == false && field_DOB !== "" && field_DOA != "") {
    $("#popUp_DOB").modal("show");
  } else {
    $("#popUp").modal("show");
  }
}

function removeErr(event) {
  $(`#err_${event.target.id}`).text("");
  $(`#err_${event.target.id}`).hide();
}

const proceedScan = async (fileObj, button, pageid, formData, fileName) => {
  console.log(button);
  console.log("code is here");
  $(`#file_loader_icon_${button}`).show();

  let baseData = await toBase64(fileObj);
  const regex = /data:application\/pdf;base64,/gi;
  let newBaseData = baseData.replace(regex, "");
  await checkForVirus(newBaseData)
    .then((response) => response.text())
    .then((result) => {
      let parsedJson = JSON.parse(result);
      console.log(parsedJson);
      if (parsedJson.hasVirus) {
        console.log("Netering");

        if (pageid == 1) {
          $("#warning_parent").show();
          $("#upload_warning").text(
            "Warning : We detected a virus/malware in your uploaded documents. Please re-upload a clean, virus-free document to proceed."
          );
        }
        if (pageid == 2) {
          $("#warning_parent_acct").show();
          $("#upload_warning_acct").text(
            "Warning : We detected a virus/malware in your uploaded documents. Please re-upload a clean, virus-free document to proceed."
          );
        }
        if (pageid == 3) {
          $("#warning_parent_acct1").show();
          $("#upload_warning_acct1").text(
            "Warning : We detected a virus/malware in your uploaded documents. Please re-upload a clean, virus-free document to proceed."
          );
        }

        $(`#file_loader_icon_${button}`).hide();
        $(`#file_Upload_Tick_${button}`).hide();
        $(`#file_upload_cancle_${button}`).show();
        return;
      } else {
        scanDoc = true;
        $("#warning_parent").hide();
        $("#warning_uploads_docs").hide();

        $("#warning_parent_acct").hide();
        $("#warning_parent_acct1").hide();
        $(`#file_loader_icon_${button}`).hide();
        $(`#file_Upload_Tick_${button}`).show();
        $(`#file_upload_cancle_${button}`).hide();
        return;
      }
    })
    .catch((error) => {
      console.log("error", error);
      if (pageid == 1) {
        $("#warning_parent").show();
        $("#warning_uploads_docs").show();
      }
      if (pageid == 2) {
        $("#warning_parent_acct").show();
      }
      $(`#file_loader_icon_${button}`).hide();
      $(`#file_Upload_Tick_${button}`).hide();
      $(`#file_upload_cancle_${button}`).show();
      $("#upload_warning").text(
        "Looks like the file you are trying to upload is Virus infected. Please upload a virus free document."
      );
      return;
    });
};

const fileCheck = (file, button, pageid, formData, fileName) => {
  console.log(button);

  var _URL = window.URL || window.webkitURL;
  console.log("FILE OBJECT -> ", file);
  var img = new Image();
  console.log("Before on load --> ");

  img.onload = async function () {
    console.log("inside image load --> ");
    console.log(this.width + " " + this.height);
    if (this.width < 400 && this.height < 400) {
      if (pageid == 1) {
        $(`#warning_uploads_docs`).show();
        $("#upload_warning").text(
          "We noticed that your uploaded documents are unclear and unreadable. Kindly ensure to upload clear copies of your documents to proceed."
        );
      }
      if (pageid == 2) {
        $("#warning_parent_acct").show();
        $("#upload_warning_acct").text(
          "We noticed that your uploaded documents are unclear and unreadable. Kindly ensure to upload clear copies of your documents to proceed."
        );
      }
      if (pageid == 3) {
        $("#warning_parent_acct1").show();
        $("#upload_warning_acct1").text(
          "We noticed that your uploaded documents are unclear and unreadable. Kindly ensure to upload clear copies of your documents to proceed."
        );
      }

      $(`#file_loader_icon_${button}`).hide();
      $(`#file_Upload_Tick_${button}`).hide();
      $(`#file_upload_cancle_${button}`).show();
      $("#upload_warning").text(
        "We noticed that your uploaded documents are unclear and unreadable. Kindly ensure to upload clear copies of your documents to proceed."
      );
      console.log("Image is bad");
    } else {
      console.log("This is right JPG");
      await proceedScan(file, button);
      if (scanDoc == true) {
        handleFileUpload(formData, fileName);
        scanDoc = false;
      }
    }
  };
  img.onerror = function () {
    console.log("inside image error");
    alert("not a valid file: " + file.type);
  };
  img.src = _URL.createObjectURL(file);
};

const isFileSizeValid = (file) => {
  if (file.size == 0) {
    fileSizeZero = true;
    return false;
    //
  } else if (file.size < 5242880) {
    return true;
  }
  return false;
};

file1.onchange = async function (e) {
  console.log("file 1 upload ");
  docType = "LIDC001";
  tranType = "CIF-MIN";
  $("#file_upload_cancle_1").hide();
  $("#file_Upload_Tick_1").hide();
  console.log("Starting");
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 1;
      var pageID = 1;
      var sizevalid = isFileSizeValid(file, buttonNum);

      console.log("size blur:");
      console.log(sizevalid);
      if (sizevalid) {
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          console.log("setting file data : ");
          let accident = {};
          // accident['LIDC001Front'] = {
          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = "LIDC001"),
            (accident["documentDescription"] = "Front copy of doc");
          // }

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          fileCheck(file, buttonNum, pageID, formData, fileName);
        } else {
          proceedScan(file, buttonNum, pageID);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          console.log("setting file data : ");
          let accident = {};
          // accident['LIDC001Front'] = {
          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = "LIDC001"),
            (accident["documentDescription"] = "Front copy of doc");
          // }

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        // $("#warning_uploads_docs").attr("style", "display: block !important;")
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_1").hide();
          $("#file_Upload_Tick_1").hide();
          $("#file_upload_cancle_1").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_1").hide();
          $("#file_Upload_Tick_1").hide();
          $("#file_upload_cancle_1").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_uploads_docs").show();
      $("#file_Upload_Tick_1").hide();
      $("#file_upload_cancle_1").show();
      $("#upload_warning").text(
        "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
      );
      this.value = "";
  }
};

file2.onchange = async function (e) {
  docType = "LIDC001";
  tranType = "CIB-MIN";
  $("#file_upload_cancle_2").hide();
  $("#file_Upload_Tick_2").hide();
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 2;
      var pageId = 1;
      var sizevalid = isFileSizeValid(file, buttonNum);
      if (sizevalid) {
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};
          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = "LIDC001"),
            (accident["documentDescription"] = "Back copy of doc");

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          fileCheck(file, buttonNum, pageId, formData, fileName);
        } else {
          proceedScan(file, buttonNum, pageId);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};
          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = "LIDC001"),
            (accident["documentDescription"] = "Back copy of doc");

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_2").hide();
          $("#file_Upload_Tick_2").hide();
          $("#file_upload_cancle_2").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_2").hide();
          $("#file_Upload_Tick_2").hide();
          $("#file_upload_cancle_2").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_uploads_docs").show();
      $("#file_Upload_Tick_2").hide();
      $("#file_upload_cancle_2").show();
      $("#upload_warning").text(
        "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
      );
      this.value = "";
  }
};

file3.onchange = async function (e) {
  docType = "LIDC034";
  tranType = "APSF-MIN";
  $("#file_upload_cancle_3").hide();
  $("#file_Upload_Tick_3").hide();
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 3;
      var pageId = 1;
      var sizevalid = isFileSizeValid(file, buttonNum);
      if (sizevalid) {
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] =
              "Attending Physician’s Statement");

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          fileCheck(file, buttonNum, pageId, formData, fileName);
        } else {
          proceedScan(file, buttonNum, pageId);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] =
              "Attending Physician’s Statement");

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_3").hide();
          $("#file_Upload_Tick_3").hide();
          $("#file_upload_cancle_3").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_3").hide();
          $("#file_Upload_Tick_3").hide();
          $("#file_upload_cancle_3").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_uploads_docs").show();
      $("#file_Upload_Tick_3").hide();
      $("#file_upload_cancle_3").show();
      $("#upload_warning").text(
        "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
      );
      this.value = "";
  }
};

file4.onchange = async function (e) {
  docType = "LIDC036";
  tranType = "PIR-MIN";
  $("#file_upload_cancle_4").hide();
  $("#file_Upload_Tick_4").hide();
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 4;
      var pageId = 1;
      var sizevalid = isFileSizeValid(file, buttonNum);
      if (sizevalid) {
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Police or Narration Report");

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          fileCheck(file, buttonNum, pageId, formData, fileName);
        } else {
          proceedScan(file, buttonNum, pageId);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Police or Narration Report");

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_4").hide();
          $("#file_Upload_Tick_4").hide();
          $("#file_upload_cancle_4").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_4").hide();
          $("#file_Upload_Tick_4").hide();
          $("#file_upload_cancle_4").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_uploads_docs").show();
      $("#file_Upload_Tick_4").hide();
      $("#file_upload_cancle_4").show();
      $("#upload_warning").text(
        "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
      );
      this.value = "";
  }
};

file5.onchange = async function (e) {
  docType = "LIDC035";
  tranType = "MR-MIN";
  $("#file_upload_cancle_5").hide();
  $("#file_Upload_Tick_5").hide();
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 5;
      var pageId = 1;
      var sizevalid = isFileSizeValid(file, buttonNum);
      if (sizevalid) {
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Official Receipts (ORs)");

          addFileToList(accident, `${fileName}.pdf`);

          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          fileCheck(file, buttonNum, pageId, formData, fileName);
        } else {
          proceedScan(file, buttonNum, pageId);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Official Receipts (ORs)");

          addFileToList(accident, `${fileName}.pdf`);

          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_5").hide();
          $("#file_Upload_Tick_5").hide();
          $("#file_upload_cancle_5").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_5").hide();
          $("#file_Upload_Tick_5").hide();
          $("#file_upload_cancle_5").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_uploads_docs").show();
      $("#file_Upload_Tick_5").hide();
      $("#file_upload_cancle_5").show();
      $("#upload_warning").text(
        "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
      );
      this.value = "";
  }
};

// start of addition
file8.onchange = async function (e) {
  const countryOfResidence = InsuredInformation.country_resident;
  const countryOfCitizenship = InsuredInformation.citizenship;
  console.log(countryOfResidence, countryOfCitizenship);
  let docDesc;
  if (countryOfCitizenship === "United States of America (USA)") {
    docType = "LITC001";
    tranType = "TC-MIN";
    docDesc = "Taxpayer Identification Number and Certification (W9)";
  } else if (countryOfResidence === "United States of America (USA)") {
    docType = "LIUT001";
    tranType = "UT-MIN";
    docDesc = "U.S. Tax Certification (W8)";
  }

  $("#file_upload_cancle_8").hide();
  $("#file_Upload_Tick_8").hide();
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 8;
      var pageId = 1;
      var sizevalid = isFileSizeValid(file, buttonNum);
      if (sizevalid) {
        InsuredInformation.has_form = 1;
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;
          let accident = {};
          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = docDesc);

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          fileCheck(file, buttonNum, pageId, formData, fileName);
        } else {
          proceedScan(file, buttonNum, pageId);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};
          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = docDesc);

          addFileToList(accident, `${fileName}.pdf`);
          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_8").hide();
          $("#file_Upload_Tick_8").hide();
          $("#file_upload_cancle_8").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_8").hide();
          $("#file_Upload_Tick_8").hide();
          $("#file_upload_cancle_8").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_parent").show();
      $("#file_Upload_Tick_8").hide();
      $("#file_upload_cancle_8").show();
      $("#upload_warning").text(
        "Your documents should only be in .jpg, or .pdf formats and should not be larger than 5MB. Please re-upload in the correct format and file size to proceed."
      );
      this.value = "";
  }
};
// end of addition

file6.onchange = async function (e) {
  docType = "LIBA001";
  tranType = "BA-MIN";
  $("#file_upload_cancle_6").hide();
  $("#file_Upload_Tick_6").hide();
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 6;
      var pageId = 2;
      var sizevalid = isFileSizeValid(file, buttonNum);
      if (sizevalid) {
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Proof of Bank Account");

          addFileToList(accident, `${fileName}.pdf`);

          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          fileCheck(file, buttonNum, pageId, formData, fileName);
        } else {
          proceedScan(file, buttonNum, pageId);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Proof of Bank Account");

          addFileToList(accident, `${fileName}.pdf`);

          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_6").hide();
          $("#file_Upload_Tick_6").hide();
          $("#file_upload_cancle_6").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_6").hide();
          $("#file_Upload_Tick_6").hide();
          $("#file_upload_cancle_6").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_parent_acct").show();
      $("#file_Upload_Tick_6").hide();
      $("#file_upload_cancle_6").show();
      $("#upload_warning_acct").text(
        "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
      );
      this.value = "";
  }
};
file7.onchange = async function (e) {
  docType = "LIBA001";
  tranType = "BA-MIN";
  $("#file_upload_cancle_7").hide();
  $("#file_Upload_Tick_7").hide();
  var ext = this.value.match(/\.([^\.]+)$/)[1];
  switch (ext) {
    case "jpg":
    case "pdf":
      var file = this.files[0];
      var buttonNum = 7;
      var pageId = 3;
      var sizevalid = isFileSizeValid(file, buttonNum);
      if (sizevalid) {
        if (ext == "jpg") {
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Proof of Bank Account");

          addFileToList(accident, `${fileName}.pdf`);

          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          // e.target.value = ''
          fileCheck(file, buttonNum, pageId, formData, fileName);
        } else {
          // e.target.value = ''
          proceedScan(file, buttonNum, pageId);
          let fileName = referenceNumber + "-" + docType + "-" + tranType;

          let accident = {};

          (accident["beneficiaryNo"] = beneficiaryCount),
            (accident["filename"] = `${fileName}.pdf`),
            (accident["docType"] = "PDF"),
            (accident["docTypeCode"] = docType),
            (accident["documentDescription"] = "Proof of Bank Account");

          addFileToList(accident, `${fileName}.pdf`);

          const formData = new FormData();
          formData.append("file", file, fileName + `.${ext}`);
          handleFileUpload(formData, fileName);
        }
      } else {
        if (fileSizeZero) {
          fileSizeZero = false;
          $("#warning_parent").show();
          $("#file_loader_icon_7").hide();
          $("#file_Upload_Tick_7").hide();
          $("#file_upload_cancle_7").show();
          $("#upload_warning").text(
            "Your file seems to be empty. Please check your file and its contents, then re-upload to proceed. Note: You may only upload documents not exceeding 5MB in size."
          );
        } else {
          $("#warning_parent").show();
          $("#file_loader_icon_7").hide();
          $("#file_Upload_Tick_7").hide();
          $("#file_upload_cancle_7").show();
          $("#upload_warning").text(
            "The file size of your documents should not be larger than 5MB. Please re-upload the correct file size to proceed."
          );
        }
      }
      break;
    default:
      $("#warning_parent_acct1").show();
      $("#file_Upload_Tick_7").hide();
      $("#file_upload_cancle_7").show();
      $("#upload_warning_acct1").text(
        "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
      );
      this.value = "";
  }
};
// file7.onchange = async function (e) {
//   $("#file_upload_cancle_7").hide();
//   $("#file_Upload_Tick_7").hide();
//   var ext = this.value.match(/\.([^\.]+)$/)[1];
//   switch (ext) {
//     case "jpg":
//     case "pdf":
//       var file = this.files[0];
//       var buttonNum = 7;
//       var sizevalid = isFileSizeValid(file, buttonNum);
//       if (sizevalid) {

//         if (ext == "jpg") {
//           // var isFileBlur = fileCheck(file, buttonNum)
//           // if (isFileBlur == false) {
//           //   file1Buffer = await getBuffer(file);
//           //   console.log("file buffer : ")
//           //   console.log(file1Buffer);
//           //   filesMap["file7"] = file1Buffer;
//           // }

//         }
//         else {
//           proceedScan(file, buttonNum);

//           file1Buffer = await getBuffer(file);
//           console.log("file buffer : ")
//           console.log(file1Buffer);
//           filesMap["file7"] = file1Buffer;

//         }

//       } else {
//         $("#warning_uploads_docs").show();
//         $("#file_loader_icon_7").hide();
//         $("#file_Upload_Tick_7").hide();
//         $("#file_upload_cancle_7").show();
//         $("#upload_warning").text(
//           "You may only upload documents not exceeding 5MB in file size. Please re-upload in the correct format and file size proceed."
//         );
//       }
//       break;
//     default:
//       $("#warning_uploads_docs").show();
//       $("#file_Upload_Tick_7").hide();
//       $("#file_upload_cancle_7").show();
//       $("#upload_warning").text(
//         "You may only upload documents that are in .jpg, .pdf formats and must not exceed 5MB in file size. Please re-upload in the correct format and file size proceed."
//       );
//       this.value = "";
//   }
// };

function buttonSubmitClicked(event) {
  event.preventDefault();
  // console.log(!$('#file_Upload_Tick_1').is(":hidden"));
  // console.log(!$('#file_Upload_Tick_2').is(":hidden"));
  // console.log(!$('#file_Upload_Tick_3').is(":hidden"));
  // console.log(!$('#file_Upload_Tick_4').is(":hidden"));
  // console.log(!$('#file_Upload_Tick_5').is(":hidden"));

  if (!file1.value || $("#file_Upload_Tick_1").is(":hidden")) {
    $("#warning_parent").show();
    $("#upload_warning").text("Please upload your Valid Government ID (Front)");
    $("#popUp").modal("show");
    return;
  }

  if (!file2.value || $("#file_Upload_Tick_2").is(":hidden")) {
    $("#warning_parent").show();
    $("#upload_warning").text("Please upload your Valid Government ID (Back)");
    $("#popUp").modal("show");
    return;
  }

  if (!file3.value || $("#file_Upload_Tick_3").is(":hidden")) {
    $("#warning_parent").show();
    $("#upload_warning").text(
      "Please upload your Attending Physician’s Statement (APS)!"
    );
    $("#popUp").modal("show");
    return;
  }

  if (!file4.value || $("#file_Upload_Tick_4").is(":hidden")) {
    $("#warning_parent").show();
    $("#upload_warning").text("Please upload your Police or Narration Report!");
    $("#popUp").modal("show");
    return;
  }

  if (!file5.value || $("#file_Upload_Tick_5").is(":hidden")) {
    $("#warning_parent").show();
    $("#upload_warning").text("Please upload your Official Receipts (ORs)!");
    $("#popUp").modal("show");
    return;
  }

  if (!$("#upload_invalidCheck_2").is(":checked")) {
    $("#upload_warning").text(
      "Please don’t forget to tick the box is certify the accuracy of the documents submitted"
    );
    $("#warning_parent").show();
    $("#popUp").modal("show");
    return;
  }

  const upload_data = {
    upload_file_1: file1.value,
    upload_file_2: file2.value,
    upload_file_3: file3.value,
    upload_file_4: file4.value,
    upload_file_5: file5.value,
    // start of addition
    upload_file_8: file8.value,
    // end of addition
    aia_Philam_Life_Checkbox: $("#upload_invalidCheck_1").is(":checked"),
    insurance_Checkbox: $("#upload_invalidCheck_2").is(":checked"),
  };

  // $("#step2").addClass("active");
  // $("#step2>div").addClass("active");
  // if (otpSubmitted == false) { otpTimer(); } else {

  //   $('#requirements').hide();
  //   $('#payment').show();
  // }

  preSubmitCall();
}

function enableDottedLoader() {
  document.getElementById("upload_docs_btn").style.display = "none";
  document.getElementById("upload_waiting_btn").style.display = "block";

  document.getElementById("account_details1_btn").style.display = "none";
  // document.getElementById('account_details1_btn_waiting').style.display = 'block'

  document.getElementById("pick_up_btn").style.display = "none";
  // document.getElementById('pick_up_btn_waiting').style.display = 'block'

  document.getElementById("submit9").style.display = "none";
  // document.getElementById('submit9_waiting_btn').style.display = 'block'
}
function disableDottedLoader() {
  document.getElementById("upload_docs_btn").style.display = "block";
  document.getElementById("upload_docs_btn").disabled = false;
  document.getElementById("upload_docs_btn").style.cursor = "pointer";
  document.getElementById("upload_waiting_btn").style.display = "none";

  document.getElementById("account_details1_btn").style.display = "block";
  // document.getElementById('account_details1_btn_waiting').style.display = 'none'

  document.getElementById("pick_up_btn").style.display = "block";
  // document.getElementById('pick_up_btn_waiting').style.display = 'none'

  document.getElementById("submit9").style.display = "block";
  // document.getElementById('submit9_waiting_btn').style.display = 'none'
}
// function refreshPage() {
//   window.top.location="http://www.philamlife.com"
//   // window.location.href = "main.html";
//   // window.clear = clear
//   // window.location.reload()
//   // window.location.href = window.location.href
// }
var timerVal = null;
function otpTimerFunction() {
  timerVal = setTimeout(() => {
    if (isOtpPopShown == false) {
      disableDottedLoader();
      document.getElementById("fallbackMessage").innerHTML =
        '<p id="otp-text">Your request is taking a while to get through due to intermittent connection. Stay with us! <br> Please refresh the page and re-submit your request to continue.</p>';
      $("#fallbackMessagePopUp").modal("show");
    }
  }, 300000);
}

//to call preSubmit api
function preSubmitCall() {
  enableDottedLoader();
  //Basic Information
  //Insured information
  //Beneficiary list
  var source = "Accident";
  var raw = JSON.stringify({
    basicInformation: basicInformation,
    insuredInformation: InsuredInformation,
    beneficiaryList: [],
  });

  var preSubmitPayload = {};
  preSubmitPayload["source"] = source;
  preSubmitPayload["data"] = raw;
  document.getElementById("upload_docs_btn").disabled = true;
  document.getElementById("upload_docs_btn").style.cursor = "no-drop";
  // timer(0, 50)
  window.parent.postMessage(
    JSON.stringify({
      event_code: "ym-client-event",
      data: JSON.stringify({
        event: {
          code: "preSubmit",
          data: preSubmitPayload,
        },
      }),
    }),
    "https://app.yellowmessenger.com"
  );

  otpTimerFunction();

  window.addEventListener("message", function (eventData) {
    // console.log(eventData.origin, "presubmit event origin");
    if (eventData.origin !== "https://app.yellowmessenger.com") return;
    try {
      if (eventData.data) {
        let event = JSON.parse(eventData.data);
        console.log(event);
        if (event.event_code == "preSubmitResponse") {
          //sucess
          clearTimeout(timerVal);
          if (isOtpPopShown == false) {
            console.log("receiving presubmit event in acc");
            if (event.data.returnCode == "0" || event.data.retCode == "0") {
              disableDottedLoader();
              // timer(50, 100).then(async () => {
              $("#step2").addClass("active");
              $("#step2>div").addClass("active");
              if (otpSubmitted == false) {
                otpTimer();
                isOtpPopShown = true;
              } else {
                $("#requirements").hide();
                $("#payment").show();
              }

              // })
            } else {
              document.getElementById("returnMessage").innerHTML =
            event.data.returnMessage
              $("#invalidReturnCode").modal("show");
            }
          }
        } else {
        }
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  });
}

function finalSubmitCall() {
  // enableDottedLoader();
  let filesObject = {};
  filesObject["folderName"] = `CLAIMS/PAL/${referenceNumber}`;
  filesObject["fileList"] = filesList;

  // var field_AccountName = $("#field_AccountName").val();
  // var field_AccountNumber = $("#field_AccountNumber").val();
  // var field_Bank = $("#field_Bank").val();
  // var field_currency = $("from_currency").val();
  // var field_Branch = $("#field_Branch").val();
  let BankDetailsList = [];
  BankDetailsList.push(BankDetails);
  InsuredInformation["payoutOption"] = payoutOption;
  var finalData = {};
  var source = "Accident";
  var raw = JSON.stringify({
    companyName: "PAL",
    webReferenceNumber: referenceNumber,
    payoutOption: payoutOption,
    bankDetailsList: BankDetailsList,
    isChangeInPayoutOption: isChangeInPayoutOption,
    isChangeInBankDetails: isChangeInBankDetails,
    filesInformation: filesObject,

    BasicInformation: basicInformation,
    InsuredInformation: InsuredInformation,
    BeneficiaryList: [],
  });
  finalData["source"] = source;
  finalData["data"] = raw;
  timer(0, 2).then(async () => {
    window.parent.postMessage(
      JSON.stringify({
        event_code: "ym-client-event",
        data: JSON.stringify({
          event: {
            code: "finalSubmit",
            data: finalData,
          },
        }),
      }),
      "https://app.yellowmessenger.com"
    );
    timer(2, 85).then(async () => {});
  });

  window.addEventListener("message", function (eventData) {
    // console.log(eventData.origin, "finalsubmit event origin");
    if (eventData.origin !== "https://app.yellowmessenger.com") return;
    try {
      if (eventData.data) {
        let event = JSON.parse(eventData.data);
        console.log(event);
        if (event.event_code == "uploadSuccess") {
          //sucess
          clearTimeout(cleartime);
          console.log("upload success event received");
          timer(85, 95).then(async () => {});
        } else {
          // $("#popUp").modal("show");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  window.addEventListener("message", function (eventData) {
    // console.log(event.data.event_code)
    try {
      if (eventData.data) {
        let event = JSON.parse(eventData.data);
        console.log(event);
        if (event.event_code == "finalSubmitResponse") {
          //sucess
          clearTimeout(cleartime);
          console.log("finalsubmit event received");
          if (event.data.returnCode == "0" || event.data.retCode == "0") {
            // disableDottedLoader();
            myDisable();
            document.getElementById("ref_number").innerHTML =
              event.data?.transactionNumber;
            // timer(50, 100).then(async () => {
            timer(95, 100).then(async () => {
              $("#step2").addClass("done");

              $("#step3_circle").addClass("md-step-step3-circle ");
              $("#step3_span").addClass("md-step3-span");
              $("#step3_reference").addClass("md-step3-span");
              $("#account_details").hide();
              $("#account_details1").hide();
              $("#pickUp").hide();
              $("#process_confirmation").show();
            });

            // });
          } else {
            // alert(event.data.returnMessage + 'returnCode not 0 ')
            document.getElementById("returnMessage").innerHTML =
          event.data.returnMessage
            $("#invalidReturnCode").modal("show");
          }
        } else {
          // $("#popUp").modal("show");
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
}

function handleAccountInfo(event) {
  event.preventDefault();
  var field_AccountName = $("#field_AccountName").val();
  var field_AccountNumber = $("#field_AccountNumber").val();
  var field_Bank = $("#field_Bank").val();
  var field_currency = $("from_currency").val();
  var field_Branch = $("#field_Branch").val();
  if (haveBankDetails == false) {
    var speCharAccountName = specialcharacterValidation(field_AccountName);
    var numAccountName = numberValidation(field_AccountName);
    var specAccountNumber = specialcharacterValidation(field_AccountNumber);
    var numAccountNumber = onlyNumberValidate(field_AccountNumber);

    var lenAccountName = fieldCheckLength(field_AccountName, 90);
    var lenAccountNumber = fieldCheckLength(field_AccountNumber, 20);
    var lenBranch = fieldCheckLength(field_Branch, 50);

    if (field_AccountName.length === 0) {
      $("#err_field_AccountName").text("Field is empty");
      $("#err_field_AccountName").show();
    } else if (lenAccountName) {
      $("#err_field_AccountName").text("Maximum 90 characters allowed!");
      $("#err_field_AccountName").show();
    } else if (speCharAccountName) {
      $("#err_field_AccountName").text("special character is not allowed");
      $("#err_field_AccountName").show();
    } else if (numAccountName) {
      $("#err_field_AccountName").text("Number not allowed");
      $("#err_field_AccountName").show();
    } else {
      $("#err_field_AccountName").text("");
      $("#err_field_AccountName").hide();
    }

    if (field_AccountNumber.length === 0) {
      $("#err_field_AccountNumber").text("Field is empty");
      $("#err_field_AccountNumber").show();
    } else if (lenAccountNumber) {
      $("#err_field_AccountNumber").text("Maximum 20 characters allowed!");
      $("#err_field_AccountNumber").show();
    } else if (!numAccountNumber || specAccountNumber) {
      $("#err_field_AccountNumber").text("Only number is allowed");
      $("#err_field_AccountNumber").show();
    } else {
      $("#err_field_AccountNumber").text("");
      $("#err_field_AccountNumber").hide();
    }

    if (field_Bank.length <= 0) {
      $("#err_field_Bank").text("Field is empty");
      $("#err_field_Bank").show();
    } else {
      $("#err_field_Bank").text("");
      $("#err_field_Bank").hide();
    }

    if (field_Branch.length === 0) {
      $("#err_field_Branch").text("Field is empty");
      $("#err_field_Branch").show();
    } else if (lenBranch) {
      $("#err_field_Branch").text("Maximum 50 characters allowed!");
      $("#err_field_Branch").show();
    } else {
      $("#err_field_Branch").text("");
      $("#err_field_Branch").hide();
    }

    if (field_currency <= 0) {
      $("#err_field_Currency").text("Field is empty");
      $("#err_field_Currency").show();
    } else {
      $("#err_field_Currency").text("");
      $("#err_field_Currency").show();
    }

    if (!file6.value) {
      $("#upload_feedback_label").show();
      $("#upload_feedback_label").text(
        "Please upload your Bank Account Ownership"
      );
    } else {
      $("#upload_feedback_label").hide();
      $("#upload_feedback_label").text("");
    }

    if (
      field_AccountName.length !== 0 &&
      field_AccountNumber.length !== 0 &&
      field_Bank.length !== 0 &&
      field_Branch.length !== 0 &&
      file6.length !== 0 &&
      speCharAccountName == false &&
      numAccountName == false &&
      numAccountNumber == true &&
      lenAccountName == false &&
      lenAccountNumber == false &&
      lenBranch == false &&
      file6.value &&
      !$("#file_Upload_Tick_6").is(":hidden")
    ) {
      const data = {
        field_AccountName,
        field_AccountNumber,
        field_Bank,
        field_Branch,
        field_Currency: $("select#from_currency option")
          .filter(":selected")
          .val(),
        upload_file_6: file6.value,
      };
      let BankDetailsList = [];
      let BeneficiaryList = [];
      BankDetails["beneficiaryNo"] = 1;
      BankDetails["bankName"] = field_Bank;
      BankDetails["bankBranch"] = field_Branch;
      BankDetails["accountName"] = field_AccountName;
      BankDetails["accountNumber"] = field_AccountNumber;
      BankDetails["accountCurrency"] = field_currency
        ? field_Currency
        : $("select#from_currency option").filter(":selected").val();

      BankDetailsList.push(BankDetails);

      let filesObject = {};
      filesObject["folderName"] = `CLAIMS/PAL/${referenceNumber}`;
      filesObject["filesList"] = filesList;

      // InsuredInformation["PayoutOption"] = "CTA";
      BeneficiaryList["payoutOption"] = "CTA";

      // var finalData = {}
      // var source = 'Accident';
      // var raw = {};
      // raw['basicInformation'] = basicInformation;
      // raw['insuredInformation'] = InsuredInformation;
      // raw['bankDetailsList'] = BankDetailsList;
      // raw['filesInformation'] = filesObject;
      // raw["beneficiaryList"] = BeneficiaryList;
      // finalData['source'] = source;
      // finalData['data'] = JSON.stringify(raw);

      // myDisable()
      // timer().then(async () => {
      //   $("#step2").addClass("done");
      //   /*  $("#step3").addClass("active");
      //    $("#step3>div").addClass("active"); */
      //   /* $("#step3").addClass("done"); */
      //   $("#step3_circle").addClass("md-step-step3-circle ");
      //   $("#step3_span").addClass("md-step3-span");
      //   $("#step3_reference").addClass("md-step3-span")
      //   $("#account_details").hide();
      //   $("#process_confirmation").show();
      //   console.log("Data -> ", data);
      // });
      // document.getElementById("account_details_btn").disabled = true;
      // document.getElementById("account_details_btn").style.cursor = "no-drop";
      document.getElementById("submit9").disabled = true;
      document.getElementById("submit9").style.cursor = "no-drop";
      var nodes = document
        .getElementById("bank_form")
        .getElementsByTagName("*");
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].disabled = true;
        nodes[i].style.cursor = "no-drop";
      }
      document.getElementById("bank_form").style.opacity = "0.65";
      finalSubmitCall();
    } else {
      $("#popUp").modal("show");
    }
  } else {
    let BankDetailsList = [];
    let BeneficiaryList = [];
    BankDetails["beneficiaryNo"] = 1;
    BankDetails["bankName"] = field_Bank;
    BankDetails["bankBranch"] = field_Branch;
    BankDetails["accountName"] = field_AccountName;
    BankDetails["accountNumber"] = field_AccountNumber;
    BankDetails["accountCurrency"] = field_currency
      ? field_Currency
      : $("select#from_currency option").filter(":selected").val();

    BankDetailsList.push(BankDetails);

    let filesObject = {};
    filesObject["FolderName"] = `CLAIMS/PAL/${referenceNumber}`;
    filesObject["fileList"] = filesList;

    // InsuredInformation["PayoutOption"] = "CTA";
    BeneficiaryList["payoutOption"] = "CTA";
    // document.getElementById("account_details_btn").disabled = true;
    // document.getElementById("account_details_btn").style.cursor = "no-drop";
    document.getElementById("submit9").disabled = true;
    document.getElementById("submit9").style.cursor = "no-drop";
    var nodes = document.getElementById("bank_form").getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].disabled = true;
      nodes[i].style.cursor = "no-drop";
    }
    document.getElementById("bank_form").style.opacity = "0.65";
    finalSubmitCall();
  }
}

function disableBankDetailsOnHavingData() {
  document.getElementById("field_AccountName").disabled = true;
  document.getElementById("field_AccountNumber").disabled = true;
  document.getElementById("field_Branch").disabled = true;
  document.getElementById("from_currency").disabled = true;
  document.getElementById("field_Bank").disabled = true;

  document.getElementById("field_AccountName").style.cursor = "no-drop";
  document.getElementById("field_AccountNumber").style.cursor = "no-drop";
  document.getElementById("field_Branch").style.cursor = "no-drop";
  document.getElementById("from_currency").style.cursor = "no-drop";
  document.getElementById("field_Bank").style.cursor = "no-drop";
}

function getBankDetails() {
  var finalPayload = {};
  var source = "Accident";
  $("#cover-spin").show(0);

  var raw = JSON.stringify({
    companyName: "PAL",
    webReferenceNumber: referenceNumber,
  });
  finalPayload["source"] = source;
  finalPayload["data"] = raw;
  window.parent.postMessage(
    JSON.stringify({
      event_code: "ym-client-event",
      data: JSON.stringify({
        event: {
          code: "getPayoutDetails",
          data: finalPayload,
        },
      }),
    }),
    "https://app.yellowmessenger.com"
  );

  window.addEventListener("message", function (eventData) {
    console.log("receiving payout  event in acc");
    // console.log(eventData.origin, "getpayoutdetails event origin");
    if (eventData.origin !== "https://app.yellowmessenger.com") return;
    // console.log(event.data.event_code)
    try {
      if (eventData.data) {
        let event = JSON.parse(eventData.data);
        console.log(event);
        if (event.event_code == "payoutDetails") {
          //sucess
          if (event.data.returnCode == "0" || event.data.retCode == "0") {
            $("#cover-spin").hide(0);
            if (event.data.accountName != null) {
              $("#proof_BAO_display").hide();
              haveBankDetails = true;
              isChangeInPayoutOption = "Y";
              document.getElementById("have_bank_details").innerHTML =
                " We have your bank details on file.";
              field_AccountName = event.data?.accountName;
              document.getElementById("field_AccountName").value =
                field_AccountName;
              document.getElementById("field_AccountName1").value =
                field_AccountName;

              field_AccountNumber = event.data?.maskedAccountNumber?.replace(
                /.(?=.{4})/g,
                "*"
              );
              document.getElementById("field_AccountNumber").value =
                field_AccountNumber;
              document.getElementById("field_AccountNumber1").value =
                field_AccountNumber;
              field_Branch = "";
              document.getElementById("field_Branch").value = field_Branch;
              document.getElementById("field_Branch1").value = field_Branch;

              field_Bank = event.data?.bankName;
              document.getElementById("field_Bank").value = field_Bank;
              document.getElementById("field_Bank1").value = field_Bank;

              field_Currency = event.data?.accountCurrency;
              if (field_Currency.toLowerCase() == "php") {
                field_Currency = "peso";
              }
              $("#from_currency option").each(function () {
                if ($(this).text().toLowerCase() == field_Currency) {
                  $(this).attr("selected", "selected");
                }
              });
              $("#from_currency1 option").each(function () {
                if ($(this).text().toLowerCase() == field_Currency) {
                  $(this).attr("selected", "selected");
                }
              });

              if (field_Currency?.toLowerCase() == "peso") {
                $("#field_Bank").html(
                  "<option value='BPI' >Bank of the Philippine Islands - BPI</option><option value='BFB'>BPI Family Savings Bank - BFB</option><option value='BDO'>Banco de Oro - BDO</option><option value='CBC'>China Banking Corporation - CBC</option><option value='CITI'>Citibank Philippines - CITI</option><option value='DBP'>Development Bank of the Phils - DBP</option><option value='EWB'>Eastwest Bank - EWB</option><option value='HSBC'>Hongkong Shanghai Banking Corp. Phils - HSBC</option><option value='LPB'>Land Bank of the Philippines - LPB</option><option value='MBTC'>Metropolitan Banks and Trust Company - MBTC</option><option value='PNB'>Philippine National Bank - PNB</option><option value='RCBC'>Rizal Commercial Banking Corp - RCBC</option><option value='SBTC'>Security Bank - SBTC</option><option value='UB'>Union Bank of the Philippines - UB</option>"
                );
                $("#field_Bank option").each(function () {
                  if (
                    $(this).text().split("-")[1].toLowerCase().trim() ==
                    field_Bank?.toLowerCase().trim()
                  ) {
                    $(this).attr("selected", "selected");
                  }
                });
              } else if (field_Currency?.toLowerCase() == "usd") {
                $("#field_Bank").html(
                  "<option value='BPI'>Bank of the Philippine Islands - BPI</option><option value='BDO'>Banco de Oro - BDO</option>"
                );
                $("#field_Bank option").each(function () {
                  if (
                    $(this).text().split("-")[1].toLowerCase().trim() ==
                    field_Bank?.toLowerCase().trim()
                  ) {
                    $(this).attr("selected", "selected");
                  }
                });
              }

              if (field_Currency?.toLowerCase() == "peso") {
                $("#field_Bank1").html(
                  "<option value='BPI' >Bank of the Philippine Islands - BPI</option><option value='BFB'>BPI Family Savings Bank - BFB</option><option value='BDO'>Banco de Oro - BDO</option><option value='CBC'>China Banking Corporation - CBC</option><option value='CITI'>Citibank Philippines - CITI</option><option value='DBP'>Development Bank of the Phils - DBP</option><option value='EWB'>Eastwest Bank - EWB</option><option value='HSBC'>Hongkong Shanghai Banking Corp. Phils - HSBC</option><option value='LPB'>Land Bank of the Philippines - LPB</option><option value='MBTC'>Metropolitan Banks and Trust Company - MBTC</option><option value='PNB'>Philippine National Bank - PNB</option><option value='RCBC'>Rizal Commercial Banking Corp - RCBC</option><option value='SBTC'>Security Bank - SBTC</option><option value='UB'>Union Bank of the Philippines - UB</option>"
                );
                $("#field_Bank1 option").each(function () {
                  if (
                    $(this).text().split("-")[1].toLowerCase().trim() ==
                    field_Bank?.toLowerCase().trim()
                  ) {
                    $(this).attr("selected", "selected");
                  }
                });
              } else if (field_Currency?.toLowerCase() == "usd") {
                $("#field_Bank1").html(
                  "<option value='BPI'>Bank of the Philippine Islands - BPI</option><option value='BDO'>Banco de Oro - BDO</option>"
                );
                $("#field_Bank1 option").each(function () {
                  if (
                    $(this).text().split("-")[1].toLowerCase().trim() ==
                    field_Bank?.toLowerCase().trim()
                  ) {
                    $(this).attr("selected", "selected");
                  }
                });
              }
              disableBankDetailsOnHavingData();
            }
            $("#payment").hide();
            $("#account_details").show();
            $("#step2").addClass("active");
            $("#step2>div").addClass("active");
          } else if (event.data.returnCode == "1") {
            $("#cover-spin").hide(0);
            $("#payment").hide();
            $("#account_details").show();
            $("#step2").addClass("active");
            $("#step2>div").addClass("active");
            $("#change_bank_account").hide();
          }
        } else {
          $("#change_bank_account").hide();
        }
      } else {
        $("#change_bank_account").hide();
      }
    } catch (error) {
      console.log(error);
    }
  });

  // var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // var raw = JSON.stringify({ "companyName": "PAL", "webReferenceNumber": referenceNumber });
  // var requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: raw
  // };
  // fetch("http://localhost:3000/disbursement_details", requestOptions).then((response) => response.json())
  //   .then(response => {

  //     if (response.returnCode == '0') {
  //       if (response.accountName != '') {

  //         document.getElementById('have_bank_details').innerHTML = ' We have your bank details on file.'
  //         field_AccountName = response.accountName;
  //         document.getElementById('field_AccountName').value = field_AccountName;

  //         field_AccountNumber = response.maskedAccountNumber.replace(/.(?=.{4})/g, '*');
  //         document.getElementById('field_AccountNumber').value = field_AccountNumber;

  //         field_Bank = response.bankName;

  //         field_Currency = response.accountCurrency;
  //         $("#from_currency option").each(function () {
  //           if ($(this).text() == field_Currency) {
  //             $(this).attr('selected', 'selected');
  //           }
  //         });

  //         if (field_Currency.toLowerCase() == "peso") {

  //           $("#field_Bank").html(
  //             "<option value='Bank of the Philippine Islands - BPI' >Bank of the Philippine Islands - BPI</option><option value='BPI Family Savings Bank - BFB'>BPI Family Savings Bank - BFB</option><option value='Banco de Oro - BDO'>Banco de Oro - BDO</option><option value='China Banking Corporation - CBC'>China Banking Corporation - CBC</option><option value='Citibank Philippines - CITI'>Citibank Philippines - CITI</option><option value='Development Bank of the Phils - DBP'>Development Bank of the Phils - DBP</option><option value='Eastwest Bank - EWB'>Eastwest Bank - EWB</option><option value='Hongkong Shanghai Banking Corp. Phils - HSBC'>Hongkong Shanghai Banking Corp. Phils - HSBC</option><option value='Land Bank of the Philippines - LPB'>Land Bank of the Philippines - LPB</option><option value='Metropolitan Banks and Trust Company - MBTC'>Metropolitan Banks and Trust Company - MBTC</option><option value='Philippine National Bank - PNB'>Philippine National Bank - PNB</option><option value='Rizal Commercial Banking Corp - RCBC'>Rizal Commercial Banking Corp - RCBC</option><option value='Security Bank - SBTC'>Security Bank - SBTC</option><option value='Union Bank of the Philippines - UB'>Union Bank of the Philippines - UB</option>"
  //           );
  //           $("#field_Bank option").each(function () {

  //             if ($(this).text().split('-')[1].toLowerCase().trim() == field_Bank.toLowerCase().trim()) {

  //               $(this).attr('selected', 'selected');
  //             }
  //           });
  //         }
  //         else if (field_Currency.toLowerCase() == "usd") {
  //           $("#field_Bank").html(
  //             "<option value='Bank of the Philippine Islands - BPI'>Bank of the Philippine Islands - BPI</option><option value='Banco de Oro - BDO'>Banco de Oro - BDO</option>"
  //           );
  //           $("#field_Bank option").each(function () {

  //             if ($(this).text().split('-')[1].toLowerCase().trim() == field_Bank.toLowerCase().trim()) {

  //               $(this).attr('selected', 'selected');
  //             }
  //           });
  //         }

  //       }

  //     }
  //     else {
  //       $('#change_bank_account').hide()
  //     }
  //   }).catch(error => {
  //     console.log(error)
  //   });
}

function bankTranfer() {
  document.getElementById("ref_number").innerHTML = referenceNumber;
  payoutOption = "CTA";
  getBankDetails();
}

function pickUp() {
  document.getElementById("ref_number").innerHTML = referenceNumber;
  document.getElementById("spin_loader_1").style.display = "none";
  payoutOption = "PUA";
  let filesObject = {};
  filesObject["folderName"] = `CLAIMS/PAL/${referenceNumber}`;
  filesObject["fileList"] = filesList;
  let BankDetailsList = [];
  BankDetailsList.push(BankDetails);

  // filesMap["Accident"] = accident
  // InsuredInformation["PayoutOption"] = "PUA";
  finalPayload["BasicInformation"] = basicInformation;
  finalPayload["InsuredInformation"] = InsuredInformation;
  finalPayload["BankDetailsList"] = BankDetailsList;
  finalPayload["FilesInformation"] = filesObject;
  // finalPayload["stageThree"] = true;
  // finalPayload["referenceNumber"] = referenceNumber;

  // console.log("pick up payload : ")
  // console.log(finalPayload)
  // window.parent.postMessage(JSON.stringify({
  //   event_code: 'ym-client-event', data: JSON.stringify({
  //     event: {
  //       code: "finalEvent",
  //       data: JSON.stringify(finalPayload)
  //     }
  //   })
  // }), '*');
  $("#payment").hide();
  /* $('#process_confirmation').show(); */
  $("#pickUp").show();
  $("#step2").addClass("active");
  $("#step2>div").addClass("active");
  $("#step2").addClass("done");
}

function pickup_Bpi() {
  document.getElementById("pick_up_btn").disabled = true;
  document.getElementById("pick_up_btn").style.cursor = "no-drop";
  document.getElementById("msg").style.display = "none";
  document.getElementById("spin_loader_1").style.display = "block";
  document.getElementById("goback_pickup").style.display = "none";
  var nodes = document.getElementById("pickUp").getElementsByTagName("*");
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].disabled = true;
    nodes[i].style.cursor = "no-drop";
  }
  document.getElementById("pickUp").style.opacity = "0.65";

  finalSubmitCall();

  // var finalData = {}
  // var source = 'Accident';
  // var raw = {};
  // let filesObject = {};
  // filesObject["FolderName"] = `CLAIMS/PAL/${referenceNumber}`
  // filesObject["FileList"] = filesList;
  // let BankDetailsList = [];
  // let BeneficiaryList = [];
  // BeneficiaryList['payoutOption'] = 'PUA'
  // // BankDetailsList.push(BankDetails);
  // raw['basicInformation'] = basicInformation;
  // raw['insuredInformation'] = InsuredInformation;
  // raw['bankDetailsList'] = BankDetailsList;
  // raw['filesInformation'] = filesObject;
  // raw["beneficiaryList"] = BeneficiaryList;
  // finalData['source'] = source;
  // finalData['data'] = JSON.stringify(raw);
}

function addBank(event) {
  event.preventDefault();
  $("#account_details").hide();
  $("#requirements").hide();
  $("#account_details1").show();
  event.target.value = "";
  /*   $('#account_details1')[0].scrollIntoView(true); */
}

function handleAddBankInfo(event) {
  event.preventDefault();
  isChangeInBankDetails = "Y";
  var field_AccountName1 = $("#field_AccountName1").val();
  var field_AccountNumber1 = $("#field_AccountNumber1").val();
  var field_currency1 = $("#from_currency1").val();
  var field_Bank1 = $("#field_Bank1").val();
  var field_Branch1 = $("#field_Branch1").val();
  var speCharAddAccountName = specialcharacterValidation(field_AccountName1);
  var numAddAccountName = numberValidation(field_AccountName1);
  var numAddAccountNumber = onlyNumberValidate(field_AccountNumber1);

  if (field_AccountName1.length === 0) {
    $("#err_field_AccountName1").text("Field is empty");
    $("#err_field_AccountName1").show();
  } else if (speCharAddAccountName) {
    $("#err_field_AccountName1").text("special character is not allowed");
    $("#err_field_AccountName1").show();
  } else if (numAddAccountName) {
    $("#err_field_AccountName1").text("Number not allowed");
    $("#err_field_AccountName1").show();
  } else {
    $("#err_field_AccountName1").text("");
    $("#err_field_AccountName1").hide();
  }

  if (field_AccountNumber1.length === 0) {
    $("#err_field_AccountNumber1").text("Field is empty");
    $("#err_field_AccountNumber1").show();
  } else if (!numAddAccountNumber) {
    $("#err_field_AccountNumber1").text("Only number is allowed");
    $("#err_field_AccountNumber1").show();
  } else {
    $("#err_field_AccountNumber1").text("");
    $("#err_field_AccountNumber1").hide();
  }

  if (field_currency1 <= 0) {
    $("#err_field_Currency1").text("Field is empty");
    $("#err_field_Currency1").show();
  } else {
    $("#err_field_Currency1").text("");
    $("#err_field_Currency1").show();
  }

  if (field_Bank1.length <= 0) {
    $("#err_field_Bank1").text("Field is empty");
    $("#err_field_Bank1").show();
  } else {
    $("#err_field_Bank1").text("");
    $("#err_field_Bank1").hide();
  }

  if (field_Branch1.length === 0) {
    $("#err_field_Branch1").text("Field is empty");
    $("#err_field_Branch1").show();
  } /*  else if (specCharAddBRANCH) {
    $("#err_field_Branch1").text('special character is not allowed');
    $("#err_field_Branch1").show();
  } else if (numAddBranch) {
    $("#err_field_Branch1").text('Number not allowed');
    $("#err_field_Branch1").show();
  }  */ else {
    $("#err_field_Branch1").text("");
    $("#err_field_Branch1").hide();
  }

  if (!file7.value) {
    $("#upload_feedback_label1").show();
    $("#upload_feedback_label1").text(
      "Please upload your Bank Account Ownership"
    );
  } else {
    $("#upload_feedback_label1").hide();
    $("#upload_feedback_label1").text("");
  }

  if (
    field_AccountName1.length !== 0 &&
    field_AccountNumber1.length !== 0 &&
    field_currency1.length !== 0 &&
    field_Bank1.length !== 0 &&
    field_Branch1.length !== 0 &&
    file7.length !== 0 &&
    speCharAddAccountName == false &&
    numAddAccountName == false &&
    numAddAccountNumber == true
  ) {
    const data = {
      field_AccountName1,
      field_AccountNumber1,
      field_Bank1,
      field_Branch1,
      field_Currency1: $("select#from_currency1 option")
        .filter(":selected")
        .val(),
      upload_file_6: file6.value,
    };
    // var BankDetails = {}
    let BankDetailsList = [];
    // let BeneficiaryList = [];
    BankDetails["beneficiaryNo"] = 1;
    BankDetails["bankName"] = field_Bank1;
    BankDetails["bankBranch"] = field_Branch1;
    BankDetails["accountName"] = field_AccountName1;
    BankDetails["accountNumber"] = field_AccountNumber1;
    (BankDetails["accountCurrency"] = $("select#from_currency1 option")
      .filter(":selected")
      .val()),
      BankDetailsList.push(BankDetails);

    // let filesObject = {};
    // filesObject["FolderName"] = `CLAIMS/PAL/${referenceNumber}`
    // filesObject["FileList"] = filesList;

    // // InsuredInformation["PayoutOption"] = "CTA";
    // BeneficiaryList['payoutOption'] = 'CTA';

    // var finalData = {}
    // var source = 'Accident';
    // var raw = {};
    // raw['basicInformation'] = basicInformation;
    // raw['insuredInformation'] = InsuredInformation;
    // raw['bankDetailsList'] = BankDetailsList;
    // raw['filesInformation'] = filesObject;
    // raw["beneficiaryList"] = BeneficiaryList;
    // finalData['source'] = source;
    // finalData['data'] = JSON.stringify(raw);
    document.getElementById("account_details1_btn").disabled = true;
    document.getElementById("account_details1_btn").style.cursor = "no-drop";
    var nodes = document
      .getElementById("addbank_form")
      .getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].disabled = true;
      nodes[i].style.cursor = "no-drop";
    }
    document.getElementById("addbank_form").style.opacity = "0.65";
    finalSubmitCall();
  }
}
function closeModal() {
  removeTimer();
  document.getElementById("otp").value = "";
  $("#otpPopUp").modal("hide");
  $("#otpExpiry").modal("hide");
}

function openlink() {
  window.open(
    "https://www.google.com/maps/search/bpi+branch+locator/@14.6079731,120.9860096,14z/data=!3m1!4b1"
  );
}

function validateEmail(my_email) {
  var ind0 = my_email.indexOf("@");
  var my_username = my_email.slice(0, ind0);
  var ind = my_email.indexOf("@");
  var my_domain = my_email.substr(ind + 1);
  var ind3 = my_domain.indexOf(".");
  var my_final_domain = my_domain.slice(0, ind3);
  var ind1 = my_domain.indexOf(".");
  var my_extension = my_domain.slice(ind1 + 1, my_domain.length);

  var usernamesize = stringlength(my_username, 2, 30);
  var domainsize = stringlength(my_final_domain, 2, 10);
  var extension = stringlength(my_extension, 2, 3);

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(my_email) == false) {
    $("#err_field_emailAddress").text("Invalid Email");
    $("#err_field_emailAddress").show();
    return false;
  } else {
    if (!usernamesize) {
      $("#err_field_emailAddress").text(
        "UserName should have minimum 2 and maximum 30 character"
      );
      $("#err_field_emailAddress").show();
      return false;
    } else if (!domainsize) {
      $("#err_field_emailAddress").text(
        "Domain should have minimum 2 and maximum 10 character"
      );
      $("#err_field_emailAddress").show();
      return false;
    } else if (!extension) {
      $("#err_field_emailAddress").text(
        "Extension should have minimum 2 and maximum 3 characters"
      );
      $("#err_field_emailAddress").show();
      return false;
    } else {
      $("#err_field_emailAddress").text("");
      $("#err_field_emailAddress").hide();
      return true;
    }
  }
}

function stringlength(inputtxt, minlength, maxlength) {
  var field = inputtxt;
  var mnlen = minlength;
  var mxlen = maxlength;

  if (field.length < mnlen || field.length > mxlen) {
    return false;
  } else {
    return true;
  }
}

function goBack() {
  console.log("go back!!!");
  $("#step2").removeClass("active");
  $("#step2>div").removeClass("active");
  $("#step2").removeClass("done");

  $("#requirements").hide();
  $("#form_wrapper").show();
  $("#accidental_data_privacy").show();
  /* $('#form_wrapper')[0].scrollIntoView(true); */
}

function goBackPickup() {
  $("#step3").removeClass("done");
  $("#pickUp").hide();
  $("#requirements").show();
}

function goBack1() {
  console.log("go back!!!");
  $("#step3").removeClass("done");
  $("#account_details").hide();
  $("#requirements").show();

  /* $('#form_wrapper')[0].scrollIntoView(true); */
}

//drop-2 methods

// otp timer function
function otpTimer() {
  document.getElementById("otp-btn").style.display = "block";
  document.getElementById("otp-invalid-btn").style.display = "block";
  document.getElementById("otp-expiry-btn").style.display = "block";
  document.getElementById("loader-btn").style.display = "none";
  document.getElementById("loader-btn-expiry").style.display = "none";
  document.getElementById("loader-btn-invalid").style.display = "none";
  if (resendCount <= 5) {
    $("#otpPopUp").modal("show");
    if (remaining == 120) {
      duration = setInterval(otpTimer, 1000);
    }
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    document.getElementById("otpTimer").innerHTML = m + ":" + s;
    remaining -= 1;
    if (remaining == 0) {
      //  timeout stuff here
      removeTimer();
      $("#otpPopUp").modal("hide"); // to hide otp modal on timer exceed
      $("#otpExpiry").modal("show"); //show otp expiry  modal on timer exceed
    }
  } else {
    $("#otpExpiry").modal("hide");
    $("#invalidOtp").modal("hide");
    $("#maxResendOtp").modal("show");
  }
}

// to refresh the otp otp timer

function removeTimer() {
  clearInterval(duration);
  document.getElementById("otpTimer").innerHTML = "";
  remaining = 120;
}

function resendOtp(type) {
  removeTimer();
  resendCount++;
  if (resendCount > 5) {
    // on reaching max resend (5 times)
    $("#otpPopUp").modal("hide");
    $("#invalidOtp").modal("hide");
    $("#maxResendOtp").modal("show");
    $("#otpExpiry").modal("hide");
  } else {
    if (type == "otpExpire") {
      document.getElementById("otp-expiry-btn").style.display = "none";
      document.getElementById("loader-btn-expiry").style.display = "block";
    } else if (type == "invalidInput") {
      document.getElementById("otp-invalid-btn").style.display = "none";
      document.getElementById("loader-btn-invalid").style.display = "block";
    }
    document.getElementById("otp-btn").style.display = "none";
    document.getElementById("loader-btn").style.display = "block";
    var source = "Accident";
    var validateOtpPayload = {};

    var raw = JSON.stringify({
      companyName: "PAL",
      webReferenceNumber: referenceNumber,
    });

    validateOtpPayload["source"] = source;
    validateOtpPayload["data"] = raw;
    window.parent.postMessage(
      JSON.stringify({
        event_code: "ym-client-event",
        data: JSON.stringify({
          event: {
            code: "resetOtp",
            data: validateOtpPayload,
          },
        }),
      }),
      "https://app.yellowmessenger.com"
    );

    window.addEventListener("message", function (eventData) {
      console.log("receiving otp event in acc");
      // console.log(eventData.origin, "resetotp event origin");
      if (eventData.origin !== "https://app.yellowmessenger.com") return;
      // console.log(event.data.event_code)
      try {
        if (eventData.data) {
          let event = JSON.parse(eventData.data);
          if (event.event_code == "resetResponse") {
            //sucess

            console.log(event.data);
            if (event.data.returnCode == "0" || event.data.retCode == "0") {
              $("#invalidOtp").modal("hide");
              $("#otpExpiry").modal("hide");
              if (type != "resend") {
                $("#otpPopUp").modal("show");
              }
              document.getElementById("otp").value = "";
              otpTimer();
            } else {
              $("#invalidOtp").modal("hide");
              $("#otpExpiry").modal("hide");
              document.getElementById("returnMessage").innerHTML =
            event.data.returnMessage
              $("#invalidReturnCode").modal("show");
              // $('#otpPopUp').modal('hide');
            }
          } else {
            // $('#otpPopUp').modal('hide');
          }
        } else {
          // $('#otpPopUp').modal('hide');
        }
      } catch (error) {
        console.log(error);
        alert(error);
        // $('#otpPopUp').modal('hide');
      }
    });
  }

  //api call for resend otp
  // removeTimer();
  // resendCount++;
  // if (resendCount > 5) { // on reaching max resend (5 times)
  //   $('#otpPopUp').modal('hide');
  //   $('#invalidOtp').modal('hide');
  //   $('#maxResendOtp').modal('show');

  // }
  // else {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
  //   var raw = JSON.stringify({

  //     "companyName": "PAL",
  //     "webReferenceNumber": referenceNumber

  //   });
  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw
  //   };
  //   fetch("http://localhost:3000/resend_otp", requestOptions).then((response) => response.json())
  //     .then(response => {
  //       console.log(response)
  //       if (response.returnCode == '0') { //sucess
  //         $('#otpPopUp').modal('hide');
  //         $('#requirements').hide();
  //         $('#payment').show();
  //       }
  //       else {
  //         invalidOtp++;
  //         if (invalidOtp <= 3) {
  //           $('#invalidOtp').modal('show');
  //         }
  //         else {
  //           $('#invalidOtp').modal('hide');
  //           $('#maxInvalidOtp').modal('show');
  //         }

  //       }

  //     }).catch(error => {
  //       console.log(error)
  //     });

  //   $('#invalidOtp').modal('hide');
  //   if (type != 'resend') { $('#otpPopUp').modal('show'); }
  //   document.getElementById('otp').value = ''
  //   otpTimer();
  // }
  // $('#otpExpiry').modal('hide');

  //--befre api intgrtn--//
  // removeTimer();
  // resendCount++;
  // if (resendCount > 5) {
  //   $('#otpPopUp').modal('hide');
  //   $('#invalidOtp').modal('hide');
  //   $('#maxResendOtp').modal('show');

  // }
  // else {
  //   $('#invalidOtp').modal('hide');
  //   if (type != 'resend') { $('#otpPopUp').modal('show'); }
  //   document.getElementById('otp').value = ''
  //   otpTimer();

  // }
  // $('#otpExpiry').modal('hide');
}

function submitOtp() {
  document.getElementById("otp-btn").style.display = "none";
  document.getElementById("loader-btn").style.display = "block";
  removeTimer();
  // $('#three-dot-loader').show()
  var source = "Accident";
  var raw = JSON.stringify({
    oneTimePINInformation: {
      companyName: "PAL",
      webReferenceNumber: referenceNumber,
      oneTimePIN: document.getElementById("otp").value,
    },
  });

  var validateOtpPayload = {};
  validateOtpPayload["source"] = source;
  validateOtpPayload["data"] = raw;

  window.parent.postMessage(
    JSON.stringify({
      event_code: "ym-client-event",
      data: JSON.stringify({
        event: {
          code: "validateOtp",
          data: validateOtpPayload,
        },
      }),
    }),
    "https://app.yellowmessenger.com"
  );

  // document.getElementById('time-left').style.display = 'none'
  window.addEventListener("message", function (eventData) {
    // console.log(eventData.origin, "validateotp event origin");
    console.log("receiving otp event in acc");
    if (eventData.origin !== "https://app.yellowmessenger.com") return;
    // console.log(event.data.event_code)
    try {
      if (eventData.data) {
        let event = JSON.parse(eventData.data);
        if (event.event_code == "validationResponse") {
          //sucess
          console.log(event.data);
          if (event.data.returnCode == "0" || event.data.retCode == "0") {
            document.getElementById("back_btn1").style.display = "none";
            // document.getElementById("back_btn1").disabled = true;
            $("#invalidOtp").modal("hide");
            $("#otpPopUp").modal("hide");
            $("#requirements").hide();
            $("#payment").show();
            otpSubmitted = true;
            document.getElementById("otp").value = "";
            // document.getElementById('otp-btn').style.display = 'block'
          } else if (
            event.data.returnCode == "1" ||
            event.data.returnCode == "2"
          ) {
            invalidOtp++;
            if (invalidOtp <= 3) {
              $("#otpPopUp").modal("hide");
              $("#invalidOtp").modal("show");
            } else {
              $("#otpExpiry").modal("hide");
              $("#maxResendOtp").modal("hide");
              $("#otpPopUp").modal("hide");
              $("#invalidOtp").modal("hide");
              $("#maxInvalidOtp").modal("show");
            }
            document.getElementById("otp").value = "";
            $("#cover-spin").hide(0);
          } else {
            $("#invalidOtp").modal("hide");
            document.getElementById("returnMessage").innerHTML =
          event.data.returnMessage
            $("#invalidReturnCode").modal("show");
          }
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  //--api call fro submit otp--//
  // removeTimer();
  // var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  // var raw = JSON.stringify({
  //   "oneTimePINInformation": {
  //     "companyName": "PAL",
  //     "webReferenceNumber": referenceNumber,
  //     "oneTimePIN": document.getElementById('otp').value
  //   }
  // });
  // var requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: raw
  // };
  // fetch("http://localhost:3000/otp_verification", requestOptions).then((response) => response.json())
  //   .then(response => {
  //     console.log(response)
  //     if (response.returnCode == '0') { //sucess
  //       $('#otpPopUp').modal('hide');
  //       $('#requirements').hide();
  //       $('#payment').show();
  //       otpSubmitted = true;
  //     }
  //     else {
  //       invalidOtp++;
  //       if (invalidOtp < 3) {
  //         $('#invalidOtp').modal('show');
  //       }
  //       else {
  //         $('#invalidOtp').modal('hide');
  //         $('#maxInvalidOtp').modal('show');
  //       }
  //     }

  //   }).catch(error => {
  //     console.log(error)
  //   });
  // document.getElementById('otp').value = '';

  //--api call fro submit otp--//

  //--before api--//
  // var dummy_otp = '1234'
  // removeTimer();

  // if (document.getElementById('otp').value != dummy_otp) {
  //
  //   invalidOtp++;
  //   if (invalidOtp < 3) {
  //     $('#invalidOtp').modal('show');
  //   }
  //   else {
  //     $('#invalidOtp').modal('hide');
  //     $('#maxInvalidOtp').modal('show');
  //   }

  // }
  // else {
  //   $('#otpPopUp').modal('hide');
  //   $('#requirements').hide();
  //   $('#payment').show();
  // }
  // document.getElementById('otp').value = '';
}

// When the user clicks anywhere outside of the modal, close it and remove timer
// window.onclick = function (event) {
//   if (event.target == otpModal || event.target == otpExpModal || event.target == invalidOtpModal || event.target == maxResendOtp) {
//     console.log(event.target)
//     removeTimer();
//   }
// }

// when user clicks exit button from OTP pop up
function backToFileClaim() {
  window.location.href = "main";
}

//drop-2 methods
