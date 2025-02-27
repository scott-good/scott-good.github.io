var timesArr = ["12:00 AM &TZ","1:00 AM &TZ","2:00 AM &TZ","3:00 AM &TZ","4:00 AM &TZ","5:00 AM &TZ","6:00 AM &TZ","7:00 AM &TZ","8:00 AM &TZ","9:00 AM &TZ","10:00 AM &TZ","11:00 AM &TZ","12:00 PM &TZ",
    "1:00 PM &TZ","2:00 PM &TZ","3:00 PM &TZ","4:00 PM &TZ","5:00 PM &TZ","6:00 PM &TZ","7:00 PM &TZ","8:00 PM &TZ","9:00 PM &TZ","10:00 PM &TZ","11:00 PM &TZ","Continue running"];
var daysList = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]; 

function selectDay(dayVal){
    checkHideWhens();
    let thisCheckbox = document.getElementsByClassName('daySelector')[dayVal];
    if (!thisCheckbox.checked) {
        let curEndVal = document.getElementById('end' + dayVal).value;
        if (curEndVal == "Continue running"){
            let nextDayVal = (dayVal === 6) ? 0 : dayVal + 1;
            let nextDayChkbx = document.getElementsByClassName('daySelector')[nextDayVal];
            nextDayChkbx.disabled = false;
            nextDayChkbx.checked = true;
            buildDropdowns(nextDayVal, true, false);
        }
    } else {
        buildDropdowns(dayVal, true, true);
    } 
}
function buildDropdowns (row, startBool, endBool) {
    let allRows = document.getElementsByClassName('schedLine');
    let singleValue = false;
    let rowsArr = [];
    if (row === 'all'){
        rowsArr = allRows;
    } else {
        rowsArr = [allRows[row]];
        singleValue = true;
    }
    let thisRow;
    let startCol;
    let endCol;
    for (a = 0; a <= rowsArr.length; a++){
        thisRow = rowsArr[a];
        if (startBool) {
            startCol = thisRow.getElementsByClassName('start')[0];
            startCol.innerHTML = getDropdownHtml('start' + ((singleValue) ? row : a), timesArr, 7, true);
        }
        if (endBool) {
            endCol = thisRow.getElementsByClassName('end')[0];
            endCol.innerHTML = getDropdownHtml('end' + ((singleValue) ? row : a), timesArr, 19, false);
        }
    }
    checkHideWhens();
}
function getDropdownHtml(name, values, selectedVal, isStartTimeList) {
    let outHTML = "<select id='" + name + "' class='timePicker' name='" + name + "' onchange='checkHideWhens(this)'>";
    for (var b = ((isStartTimeList)?0:1); b < ((isStartTimeList) ? values.length-1:values.length); b++){
        outHTML += "<option value='" + values[b] + "'";
        outHTML += (b === selectedVal) ? " selected ":"";
        outHTML += ">" + values[b];
    }
    outHTML += "</select>";
    return outHTML;
}
function checkSchedType(){
    let curVal = document.querySelector('input[name="scheduleType"]:checked').value;
    document.getElementById('customSchedArea').style.display = (curVal === "custom") ? "block" : "none";
}
function checkHideWhens(objRef){
    let allRows = document.getElementsByClassName('schedLine');
    if (objRef) {
        // set or unset the next day if CONTINUE RUNNING is selected
        let thisID = objRef.getAttribute("id");
        let thisRow = parseInt(thisID.charAt(thisID.length-1));
        let nextRow = allRows[(thisRow === 6)?0 : thisRow + 1];
        if (objRef.options[objRef.selectedIndex].value === "Continue running"){
            let dayCheckbox = nextRow.getElementsByClassName('daySelector')[0];
            dayCheckbox.checked = true;
            dayCheckbox.disabled = true;
            nextRow.getElementsByClassName('start')[0].innerHTML = "<span class='continuedText'>Continued from " + daysList[thisRow] + "</span>";
            
        } else if (nextRow.getElementsByClassName('start')[0].innerHTML.includes("Continued from")) {
        //} else if (nextRow.getElementsByClassName('start')[0].innerHTML.startsWith("<span")) {
            // need to reset the next start field
            nextRow.getElementsByClassName('start')[0].innerHTML = getDropdownHtml('start' + nextRow, timesArr, 7, true);
            nextRow.getElementsByClassName('daySelector')[0].disabled = false;
            
        }
    }
    let checkBx;
    let rowId;
    for (let a = 0; a < allRows.length; a++){
        checkBx = allRows[a].getElementsByClassName('daySelector')[0];
        rowId = allRows[a].getAttribute("id");
        document.getElementById(rowId + 'Start').style.display = (checkBx.checked) ? 'grid': 'none';
        document.getElementById(rowId + 'End').style.display =  (checkBx.checked) ? 'grid': 'none'; 
        validateFields(allRows[a]);
    }
}
function validateFields(rowObj){
    if (rowObj.getElementsByClassName('daySelector')[0].checked){
        hasCheckedDay = true;
        // only check active rows
        let isContinued = (rowObj.getElementsByClassName('start')[0].innerHTML.includes("Continued from")) ? true : false;
        if (!isContinued) {
            // don't need to check if continued from prev day
            //let startIndex = document.getElementById('start' + rowNum).selectedIndex;
            let startCell = rowObj.getElementsByClassName('start')[0];
            let startIndex = startCell.getElementsByClassName('timePicker')[0].selectedIndex;
            //let endIndex = document.getElementById('end' + rowNum).selectedIndex;
            let endCell = rowObj.getElementsByClassName('end')[0];
            let endIndex = endCell.getElementsByClassName('timePicker')[0].selectedIndex;
            if (startIndex > endIndex) {
                rowObj.getElementsByClassName('errorMsg')[0].innerHTML = "Start time must be before the end time.";
            } else {
                rowObj.getElementsByClassName('errorMsg')[0].innerHTML = "";
            }
        }
    }
    validateOneRowEnabled();
}
function validateOneRowEnabled(){
    let allRows = document.getElementsByClassName('schedLine');
    let hasCheckedDay = false;
    for (let a = 0; a < allRows.length; a++){
        if (allRows[a].getElementsByClassName('daySelector')[0].checked) {
            hasCheckedDay = true;
            break;
        }
    }
    document.getElementById('primaryError').innerHTML = (!hasCheckedDay) ? 'You must select at least one day for a custom schedule.' : "";
}
function setTimeZone(){
    var timeZone = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
    for(var i=0; i < timesArr.length; i++) {
        timesArr[i] = timesArr[i].replace(/&TZ/g, timeZone);
    }
    document.querySelector('label[for=schedType1]').innerHTML = 'Monday-Friday 7:00 AM-7:00 PM ' + timeZone;
}
setTimeZone();
buildDropdowns('all', true, true);
checkSchedType();

