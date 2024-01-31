    // ----------------------------------------------------- //
//  Initialize 
// ----------------------------------------------------- //
    // Vars and Constants
    var lSlides, lSlideNames; // List of slide objects, list of slide names
    var iCurrentSlide   = 0; // Counter for current slide
    var sOS             = '';
    const SLIDECLASS    = 'msgCal'; // Class name for all slides
    const TIMEOUT       = 5*60000; // Timeout after 5 minutes 
    const LINK          = js_vars.linkOther
    // When page is loaded
    document.addEventListener("DOMContentLoaded",()=>{
        let sBrowser = getBrowser()
        document.getElementById('sBrowser').value = sBrowser;
        console.log(sBrowser)

        // If in fullscreen already, skip this page
        if (isFS() && getBrowser()!='Brave') {
            console.log('ending page')
            endPage()
        }
        // Add link to copy in case of unfitting browser
        document.getElementById('copy-link').addEventListener('click',()=>{
            navigator.clipboard.writeText(LINK);
        });

        setupSlides(SLIDECLASS)
        goToSlide(iCurrentSlide);
        setTimeout(()=>{
            goToSlide('2long')
        },TIMEOUT)
    })
    // When resizing check if FS
    window.addEventListener("resize",()=>{
        if (isFS()) {
            goToSlide('success')
        }
    })

// ----------------------------------------------------- //
//  Function:       Gathers slides and slides' ids in two lists
// ----------------------------------------------------- //
function setupSlides(sClass) {

    lSlides = document.getElementsByClassName(sClass);
    lSlideNames = [];
    for (let i=0;i<lSlides.length;i++) {
        lSlideNames.push(lSlides[i].id)
    }
}
// ----------------------------------------------------- //
//  Function:       removes slides with classname = sClass
// ----------------------------------------------------- //
function removeSlides(sClass) {
    let lRemove = document.getElementsByClassName(sClass);
    while (lRemove.length>0) {
        lRemove[0].parentNode.removeChild(lRemove[0]);
    }
    setupSlides(SLIDECLASS)
}
// ----------------------------------------------------- //
//  Function:       Moves current slide in +iN (positive or negative)
// ----------------------------------------------------- //
function nextSlide(iN=1){
    iCurrentSlide += iN;
    goToSlide(iCurrentSlide);
}
// ----------------------------------------------------- //
//  Function:       Goes to slide based on slide number or id
// ----------------------------------------------------- //
function goToSlide(slide) {
    hideAll();
    let iN;
    if (typeof slide == 'string') {
        // If string, get number from lNames
        iN = lSlideNames.indexOf(slide);
    } else {
        // If number, go to lSlide[iN]
        iN = slide;
    }
    iCurrentSlide = iN;
    lSlides[iCurrentSlide].classList.remove('hidden-cal');
}
// ----------------------------------------------------- //
//  Function:       Hides all other Msgs and reveals message
//                  with name "msg-sName", where sName is an input
// ----------------------------------------------------- //
function hideAll(){
    for (let i=0;i<lSlides.length;i++){
        lSlides[i].classList.add('hidden-cal');
    }
}
// ----------------------------------------------------- //
//  Function:       Copies link for participant to go to other browser
// ----------------------------------------------------- //

function copyLink() {
    // Copy the text inside the text field
    navigator.clipboard.writeText(js_vars.linkOther);
}
// ----------------------------------------------------- //
//  Function:       Opens new tab with link to return experiment
// ----------------------------------------------------- //

function returnExp() {
    // Copy the text inside the text field
    window.open(js_vars.linkReturn, "_blank");
}

// ----------------------------------------------------- //
//  Function:       Gets browser 
// ----------------------------------------------------- //

function getBrowser() {
    let userAgent = navigator.userAgent;
    let browser = "Unknown";
    
    // Detect Brave
    if (navigator.brave && navigator.brave.isBrave() || false) {
        browser = "Brave"
    }   
    // Detect Chrome
    else if (/Chrome/.test(userAgent) && !/Chromium/.test(userAgent)) {
        browser = "Google Chrome";
    }
    // Detect Chromium-based Edge
    else if (/Edg/.test(userAgent)) {
        browser = "Microsoft Edge";
    }
    // Detect Firefox
    else if (/Firefox/.test(userAgent)) {
        browser = "Mozilla Firefox";
    }
    // Detect Safari
    else if (/Safari/.test(userAgent)) {
        browser = "Apple Safari";
    }
    // Detect Internet Explorer
    else if (/Trident/.test(userAgent)) {
        browser = "Internet Explorer";
    }
    
    return browser;
}
