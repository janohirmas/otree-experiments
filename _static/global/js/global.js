// Constants and Variables
var startTime;

// Initialize 
window.addEventListener('DOMContentLoaded', () => {
    startTime = new Date(); // Ensure that timer starts when the page is loaded
});


function isThere(sVar,defaultValue=undefined) {
  let actualVar;
  try {
    actualVar = eval(sVar);
  } catch (e) {
      console.log(e)
      if (e instanceof ReferenceError) {
          // Handle error as necessary
          actualVar = defaultValue;
      } 
  }
  if (actualVar === undefined) {actualVar = defaultValue}
  return actualVar
}

function replaceDefault(varAttr,defaultValue=undefined) {
  let actualVar=varAttr;
  if (actualVar===undefined){actualVar=defaultValue};
  return actualVar;
}

function endPage() {
  endTime = new Date();
  // Load Inputs
  let startTS = document.getElementById('sStart');
  let endTS = document.getElementById('sEnd');
  let dRT = document.getElementById('dRT');
  // If not null, write value
  if (startTS!=null)  {startTS.value = createTimeStamp(startTime)};
  if (endTS!=null)    {endTS.value = createTimeStamp(endTime)};
  if (dRT!=null)      {dRT.value = endTime - startTime};
  // Next Page
  document.getElementById('form').submit();       
}

function createTimeStamp(date) {
    iHH     = date.getHours();
    iMM     = date.getMinutes();
    iSS     = date.getSeconds();
    iMmm    = date.getMilliseconds();
    if (iMmm<100) {
        sMmm = `0${iMmm}`;
    } else {
        sMmm = `${iMmm}`;
    }
    return `${iHH}:${iMM}:${iSS}:${sMmm}`;
}