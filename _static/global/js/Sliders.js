// *********************************************************************
// * VARIABLES AND CONSTANTS *
// *********************************************************************
var iSlideIndex     = 0;                // Which slide is active
var tBefore, tNow, tStart;              // timers
var inputSlideSeq, inputSlideTim;       // inputs
var lSlides, lDots, leftBtn, rightBtn;  // list of slides and buttons below

// *********************************************************************
// * WHEN LOADING PAGE *
// *********************************************************************

document.addEventListener("DOMContentLoaded", ()=> {
    tStart          = new Date().getTime();                             // Start Timer
    lSlides     = document.getElementsByClassName("slide");
    for (let i=0; i<lSlides.length; i++){
        lSlides[i].id = `slide-${i}`;
        addSpan(i);
    }
    lDots     = document.getElementsByClassName("dot");
    // adjustElem(slides[iSlideIndex]);                // adjust slide size
    inputSlideSeq   = document.getElementById('sSlideSequence');
    inputSlideTim   = document.getElementById('sSlideTime');
    leftBtn         = document.getElementById('prevDiv');
    rightBtn        = document.getElementById('nextDiv');
    activeSlide();
    hideHints();
});


// *********************************************************************
// * KEYPRESS COMMANDS *
// *********************************************************************
document.addEventListener('keydown', (event) => {
    let keypress = event.key;
    switch (keypress) {
        case 'ArrowLeft':
        // case 'a':
        // case 'A':
            plusSlides(-1);
            break;
        case 'ArrowRight':
        // case 'D':
        // case 'd':
            plusSlides(1);
            break;
        default:
            break;
    }

});

// *********************************************************************
// * FUNCTIONS FOR MOVING SLIDES *
// *********************************************************************
// *********************************************************************
// Function Name:   activeSlide
// Functionality:   
//                  1. activates slide depending on iSlideindex
//
// input:           void
//
// returns:         void
// *********************************************************************

function activeSlide() {
    hideSlides();
    lSlides[iSlideIndex].classList.remove('inactive');
    lDots[iSlideIndex].classList.add('active');
    if (iSlideIndex==0) { leftBtn.classList.add('hidden') } else { leftBtn.classList.remove('hidden') };
    if (iSlideIndex==lSlides.length-1) { rightBtn.classList.add('hidden') } else { rightBtn.classList.remove('hidden') };
}
// *********************************************************************
// Function Name:   currentSlide
// Functionality:   
//                  1. advances slides 'i' slides
//
// input:           i: integer (positive or negative)
//
// returns:         void
// *********************************************************************

function plusSlides(i) {
    if (canMove()) {
        tNow = new Date().getTime(); 
        let dif = tNow - tBefore
        inputSlideTim.value    += `${dif},`
        tBefore = tNow;
        inputSlideSeq.value += `${iSlideIndex},`;

        let iSlide = iSlideIndex + i;
        if (iSlide>=lSlides.length){iSlide=lSlides.length-1}; // upper limit
        if (iSlide<0){iSlide=0}; // upper limit
        currentSlide(iSlide)
    }
}
// *********************************************************************
// Function Name:   currentSlide
// Functionality:   
//                  1. activates specific slide
//
// input:           i: integer denoting slide index
//
// returns:         void
// *********************************************************************

function currentSlide(i) {
    iSlideIndex = i;
    activeSlide();
}
// *********************************************************************
// Function Name:   hideSlides
// Functionality:   
//                  1. Hides all slides
//
// input:           void
//
// returns:         void
// *********************************************************************
function hideSlides() {
    for (let i =0; i<lSlides.length;i++) {
        lSlides[i].classList.add('inactive');
        lDots[i].classList.remove('active');
    }
}
// *********************************************************************
// * AUXILIARY FUNCTIONS *
// *********************************************************************

// *********************************************************************
// * Please add here any constraints for the slides. 
// * For example: Participants do something special before they can move the slides again
// Function Name:   canMove
// Functionality:   
//                  1. Checks if slides can be passed
//
// input:           void
//
// returns:         boolean
// *********************************************************************

if (typeof canMove==='undefined') {
    function canMove(slide=iSlideIndex) {
        return true;
    };
}

// *********************************************************************
// Function Name:   addSpan
// Functionality:   
//                  1. draws a span that activates slide i when clicked
//
// input:           i: integer denoting slide index
//
// returns:         void
// *********************************************************************

function addSpan(i) {
    let Dot = document.createElement('span');
    Dot.classList.add('dot');
    Dot.onclick = ()=>{currentSlide(i)};
    document.getElementById('spans').append(Dot);
}

// *********************************************************************
// Function Name:   hideHints
// Functionality:   
//                  1. Hides all the divs with class hint
//
// input:           void
//
// returns:         void
// *********************************************************************
function hideHints() {
    let lHints      = document.getElementsByClassName("hint");                          // make array of hints
    if (lHints!==undefined){
        for (i = 0; i < lHints.length; i++) { 
            lHints[i].classList.add('hidden');
        }
    }
}
// *********************************************************************
// Function Name:   showHint
// Functionality:   
//                  1. displays one hint
//
// input:           iQuestion, integer denoting # of hint to be displayed
//
// returns:         void
// *********************************************************************

function showHint(iQuestion) {
    let lHints      = document.getElementsByClassName("hint"); 
    if (lHints!=undefined) {
        lHints[iQuestion].classList.remove('hidden');
    }                        
}
// *********************************************************************
// Function Name:   validateAnswers
// Functionality:   
//                  1. checks answers and displays hints if available
//
// input:           void
//
// returns:         void
// *********************************************************************

function validateAnswers(bToLowerCase=true) {
    hideHints();
    // Are there correct answers?
    if (isThere(lSolutions)!== undefined) {
        let lQuestions  = document.getElementsByClassName("ControlQuestions");              // make array of questions
        let iCorrect    = 0;                                                                // initialize counter for correct answers
        for (i = 0; i < lQuestions.length; i++) { 
            let solution, answer;
            if (bToLowerCase) {
                solution = lSolutions[i].toLowerCase();
                answer = lQuestions[i].value.toLowerCase();
                console.log(answer)
            } else {
                solution = lSolutions[i];
                answer = lQuestions[i].value;
                console.log(solution)
            }                                         // iterate through answers
            if (answer !== solution || lQuestions[i].value === null) {    // incorrect or empty field
                showHint(i);                                 // Show Hint
            } else {
                iCorrect +=1;                                                               // iCorrect: increase counter
            }
        }
        
        if (iCorrect === lQuestions.length) {                                               // if all correct, Submit
            tNow = new Date().getTime(); 
            inputSlideSeq.value += iSlideIndex;
            inputSlideTim.value += tNow - tBefore;
            document.getElementById("form").submit();
        }
    }


}



