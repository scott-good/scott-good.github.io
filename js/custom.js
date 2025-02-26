var timesArr = ["12:00 AM EDT","1:00 AM EDT","2:00 AM EDT","3:00 AM EDT","4:00 AM EDT","5:00 AM EDT","6:00 AM EDT","7:00 AM EDT","8:00 AM EDT","9:00 AM EDT","10:00 AM EDT","11:00 AM EDT","12:00 PM EDT",
    "1:00 PM EDT","2:00 PM EDT","3:00 PM EDT","4:00 PM EDT","5:00 PM EDT","6:00 PM EDT","7:00 PM EDT","8:00 PM EDT","9:00 PM EDT","10:00 PM EDT","11:00 PM EDT"];
var endTimesArr = ["1:00 AM EDT","2:00 AM EDT","3:00 AM EDT","4:00 AM EDT","5:00 AM EDT","6:00 AM EDT","7:00 AM EDT","8:00 AM EDT","9:00 AM EDT","10:00 AM EDT","11:00 AM EDT","12:00 PM EDT",
        "1:00 PM EDT","2:00 PM EDT","3:00 PM EDT","4:00 PM EDT","5:00 PM EDT","6:00 PM EDT","7:00 PM EDT","8:00 PM EDT","9:00 PM EDT","10:00 PM EDT","11:00 PM EDT","Continue running"];
var daysList = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];    
function selectDay(dayVal){
    checkHideWhens();
}
function buildDropdowns (row) {
    let debug = false;
    let allRows = document.getElementsByClassName('schedLine');
    let rowsArr = [];
    if (row === 'all'){
        rowsArr = allRows;
    } else {
        rowsArr = allRows[row];
    }
    let thisRow;
    let startCol;
    let endCol;
    for (a = 0; a < rowsArr.length; a++){
        thisRow = rowsArr[a];
        startCol = thisRow.getElementsByClassName('start')[0];
        startCol.innerHTML = getDropdownHtml('start' + a, timesArr, 7);
        endCol = thisRow.getElementsByClassName('end')[0];
        endCol.innerHTML = getDropdownHtml('end' + a, endTimesArr, 18);
    }
    checkHideWhens();
}
function getDropdownHtml(name, values, selectedVal) {
    let outHTML = "<select id='" + name + "' class='timePicker' name='" + name + "' onchange='checkHideWhens(this)'>";
    for (var b = 0; b < values.length; b++){
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
            nextRow.getElementsByClassName('start')[0].innerHTML = "Continued from " + daysList[thisRow];
            
        } else if (nextRow.getElementsByClassName('start')[0].innerHTML.startsWith("Continued from")) {
            // need to reset the next start field
            nextRow.getElementsByClassName('start')[0].innerHTML = getDropdownHtml('start' + nextRow, timesArr, 7);
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
        let isContinued = (rowObj.getElementsByClassName('start')[0].innerHTML.startsWith("Continued from")) ? true : false;
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
buildDropdowns('all');
checkSchedType();

