// randomly generates a number between the range of low and high
function getRandom(low = 1, high = 10) {
    let randomNumber;
    // calculate random number
    randomNumber = Math.round(Math.random() * (high - low)) + low;
    // returning value
    return randomNumber;
}
// Get keyboard input from the user
function addKey(functionToCall, myCode = "Enter") {
    // wire up event listener
    document.addEventListener("keydown", (e) => {
        // is the key released the provided key? Check keyCode via Event object
        if (e.code === myCode) {
            // pressing the enter key will force some browsers to refresh
            // this command stops the event from going further
            e.preventDefault();
            // call provided callback to do everything else that needs to be done
            functionToCall();
            // this also helps the event from propagating in some browsers
            return false;
        }
    });
}
// get XML data
function getXMLData(retrieveScript, success, failure) {
    // send out AJAX request
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", (e) => {
        if (xhr.status == 200) {
            success(xhr.responseXML);
            }
        
        else {
            failure();
        }        
    });
    xhr.addEventListener("error", (e) => {
        failure();
    });
    xhr.open("GET", retrieveScript, true);
    xhr.send();
}




export {getRandom, addKey, getXMLData};