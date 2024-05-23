var lPaths,timeEnter, sDT, sAOI;


function hideEverything() {
    // get all elements to be hidden
    lOpen = document.getElementsByClassName('open');
    lClose = document.getElementsByClassName('close');
    // add hidden class
    for (let i=0;i<lOpen.length; i++) {
        lOpen[i].classList.add('hidden');
    }
    for (let i=0;i<lClose.length; i++) {
        lClose[i].classList.remove('hidden');
    }
}
 
function openButton(img) {
    hideEverything();
    img.parentElement.getElementsByClassName("close")[0].classList.add('hidden');
    img.parentElement.getElementsByClassName("open")[0].classList.remove('hidden');
    let now = new Date();
    let dt  = now - timeEnter;
    timeEnter = now;
    let aoi = img.parentElement.id;
    if (sDT =="") {
        sDT = `${dt}`
        sAOI = `${aoi}`
    } else {
        sDT = `${sDT},${dt}`
        sAOI = `${sAOI},${aoi}`
    }
}



function submitForm(answer) {
    document.getElementsByClassName("InputText")[0].value = answer;
    document.getElementById("NextButton").click(); 
}

Qualtrics.SurveyEngine.addOnReady(function()
{
    document.getElementsByClassName("InputText")[0].classList.add("hidden");
    document.getElementById("NextButton").classList.add("hidden");
    let lClose = document.getElementsByClassName('close');
    let lOpen = document.getElementsByClassName('open');

	/*Place your JavaScript here to run when the page loads*/
    // add hidden class
    for (let i=0;i<lClose.length; i++) {
        lClose[i].addEventListener("click",()=>{
            openButton(lOpen[i])
        })
    }

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

    // Add the last dwell time
	let now = new Date();
    let dt  = now - timeEnter;
    timeEnter = now;
    let aoi = img.parentElement.id;
    if (sDT =="") {
        sDT = `${dt}`
    } else {
        sDT = `${sDT},${dt}`
    }

});