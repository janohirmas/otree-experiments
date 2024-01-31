    // ----------------------------------------------------- //
//  Initialize 
// ----------------------------------------------------- //
const FS_DIV            = 'fs-instructions'; // classname for divs with instructions for FS
const BODYNAME          = 'page-content';
var iFS                 = 0;
var iFocus              = 0;
var dFocusTime          = 0;
var TBlur               = new Date().getTime();
var TFocus              = new Date().getTime();
var tStart,tNow;
var inputFocus, inputFS, inputFocusTime;



document.addEventListener("DOMContentLoaded",()=>{
    setInstructionsFS();

    InitializeChecks();
})



// ----------------------------------------------------- //
//  Function:       Detect if in fullscreen
//                      If not FS, increase FS counter 
//                      and Set FS cover
//                      
// ----------------------------------------------------- //
function InitializeChecks(){
    let noChecks = document.getElementById('no-checks');
    if (noChecks === null ) {
        let x = window.location.href.split('/')
        const PAGENAME = x[x.length-2] // Gets URL and based on otree structure, gets page name
        // console.log(PAGENAME)
        // Create inputs 
        inputFS         = createHiddenInput('iFS',`iFS_${PAGENAME}`,0);
        inputFocus      = createHiddenInput('iFocus',`iFocus_${PAGENAME}`,0);
        inputFocusTime  = createHiddenInput('dFocusTime',`dFocusTime_${PAGENAME}`,0);
        checkFS();
        window.addEventListener('resize',()=>{
            checkFS();
        });
        window.addEventListener('blur', pause);
        window.addEventListener('focus', play);
    
    } else {
        let div = document.getElementById('fs-cover')
        div.parentNode.removeChild(div)
    }
}
// ----------------------------------------------------- //
//  Function:       1. Starts recording a pausing timer
//                  2. Adds 1 to the LossFocusCounter
// ----------------------------------------------------- //
function pause() {
    TBlur      = new Date().getTime();
    console.log('FOCUS LOST!');
    iFocus     = iFocus+1;
    document.getElementById('iFocus').value = iFocus;

}
// ----------------------------------------------------- //
//  Function:       1. Stops recording a pausing timer
//                  2. 
// ----------------------------------------------------- //
function play() {
    TFocus            = new Date().getTime();
    console.log('Focus back');
    dFocusTime += TFocus-TBlur;
    document.getElementById('dFocusTime').value = dFocusTime;

}
// ----------------------------------------------------- //
//  Function:       Creates hidden input with id and name
//                      
// ----------------------------------------------------- //
function createHiddenInput(id,name,value=''){
    let input = document.createElement("input");
    input.type = "hidden";
    input.id = id;      // set id
    input.name = name;  // set name
    input.value = value // set value as empty if not set
    document.getElementById(BODYNAME).appendChild(input);
    return input;
}
// ----------------------------------------------------- //
//  Function:       Detect if in fullscreen
//                      If not FS, increase FS counter 
//                      and Set FS cover
//                      
// ----------------------------------------------------- //
function checkFS(){
    if (isFS()) {
        // console.log("is in FS")
        document.getElementById('fs-cover').style.display = 'none';
    } else {
        // console.log("out of FS")
        document.getElementById('fs-cover').style.display = 'flex';
        iFS++;
        document.getElementById('iFS').value = iFS;
    }
}

// ----------------------------------------------------- //
//  Function:       Return True if browser is Safari
// ----------------------------------------------------- //
    function isSafari() { 
        return isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification)); 
    }
// ----------------------------------------------------- //
//  Function:       Return OS or Safari (if browser is safari)
// ----------------------------------------------------- //

function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}


function setInstructionsFS() {
    // Detect type of OS + browser and set instructions test
    let sMsg;
    let os = getOS();
    // console.log(os)
    switch(os) {
        case 'Windows':
        case 'Linux':
            sMsg = 'Press "F11" or "Fn + F11"';
            break;
        case 'Mac':
            sMsg = 'In the menu above go to View > Enter Full Screen. <br> Also in View > Unclick "Always show toolbar in Fullscreen".'; 
            break;
        case 'iOS':
        case 'Android':
            // goToSlide('wrong-device');
            sMsg = ''
            break;
    }
 
    // Find divs and add message
    lDivs = document.getElementsByClassName(FS_DIV);
    // console.log(lDivs)
    for (let i = 0 ; i<lDivs.length; i++) {
        lDivs[i].innerHTML = sMsg;
    }
}

// ----------------------------------------------------- //
//  Function:       Detects Fullscreen
// ----------------------------------------------------- //
function isFS() { 
        let dWindowHeight   = Math.round(window.innerHeight);
        let dZoom = Math.round(100*window.outerWidth / window.innerWidth)/100;
        let dWHadjusted = Math.round(dWindowHeight*dZoom)
        let dScreenHeight   = Math.round(screen.height);
        console.log(`window height: ${dWindowHeight} (${dWHadjusted}), screen height: ${dScreenHeight}, Zoom: ${dZoom}`)
        return dWHadjusted >= dScreenHeight - 50
    }
