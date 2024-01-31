//*********************************************************************
// LOAD JS_VARS AND DEFINE CONSTANTS/VARS
//*********************************************************************

var lQuestions    = js_vars.lQuestions; // List of Questions attributes (JSON objects)
var iQuestion = 0; // index of active question
var iCorrect = 0;

// Body id to identify (might be loaded somewhere else)
const sBodyName     = js_vars.sBodyName;

// Constants
const PageBody      = document.getElementById(sBodyName);
const maxQ          = lQuestions.length;
const sCorrectName  = 'iCorrect';
const likertScale = [ 'Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
const likertValues = [1,2,3,4,5];
const warningAutocomplete = 'Please select one item from the list';
const warningEmpty = 'Please do not leave this question unanswered';
const emptyWarning = 'Please answer the question'
const lValidAge = [18,122];
const warningAge = `Please provide a valid answer (number from ${lValidAge[0]} to ${lValidAge[1]})`;
const likertLimits = ['Strongly Disagree','Strongly Agree'];
const figValues = [1,2,3];
const sWrapperClass = 'question-wrapper';
const sButtonsClass = 'questionnaire-btns';
const lAlwaysNextBtn = ['shortOpen','autocomplete','longOpen']
function validInt(str) {return (!isNaN(parseInt(str)))};
function validAge(str) {
    num = parseInt(str);
    return (num>=lValidAge[0] && num<= lValidAge[1]); 
}
function nonEmpty(str) {
    return str!='';
}




const Countries = [ "My country is not listed", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];







//*********************************************************************
// ADD EVENT LISTENERS
//*********************************************************************
document.addEventListener("DOMContentLoaded",()=>{
    for (let i=0;i<maxQ;i++) {
        // input predetermined functions
        processItems(lQuestions[i]);
        // Establish defaults
        processDefaults(lQuestions[i]);
        // add question to page
        drawQuestion(lQuestions[i],i);
    }
    let inputCorrect = document.createElement('input');
    inputCorrect.type  = 'hidden';
    inputCorrect.id    = sCorrectName;
    inputCorrect.name  = sCorrectName;
    PageBody.append(inputCorrect);
    // go to first question
    goToQuestion(iQuestion);
});

document.addEventListener("keydown",(e)=>{
    // Prevent autosubmit when pressin Enter
    if (e.key=='Enter') { e.preventDefault();}
})

// *********************************************************************
// Function Name:   processDefaults
// Functionality:   
//                  1. Adds default options depending on questions characteristics
//
// input:           Question, JSON Object
//
// returns:         void
// *********************************************************************

function processDefaults(Question) {
    // Required answers
    if (Question.confirmRequired && Question.validate===undefined) {
        Question.validate = nonEmpty;
    }
    if (Question.invalidMessage!==undefined) {
        if (Question.validate.name == 'nonEmpty') {
            Question.invalidMessage = warningEmpty;
        }
    }
}

// *********************************************************************
// Function Name:   goToQuestion
// Functionality:   
//                  1. Goes to a specific question
//
// input:           i, integer: question index
//
// returns:         void
// *********************************************************************
function goToQuestion(idx) {
    // Hide all questions
    let lWrappers = document.getElementsByClassName(sWrapperClass);
    for (let i=0;i<lWrappers.length;i++){
        lWrappers[i].classList.add('inactive');
    }
    iQuestion = idx;
    if (iQuestion>=maxQ) {
        checkCorrectAnswers()
        document.getElementById("form").submit();
    }
    document.getElementById(`wrapper-${idx}`).classList.remove('inactive');
}

function checkCorrectAnswers() {
    for (let i=0;i<lQuestions.length;i++) {
        let question = lQuestions[i];
        if (question.correct!==undefined) {
            console.log(`${question.name} - ${question.correct}`)
            console.log(`${question.name}-input`)
            let answer = document.getElementById(`${question.name}-input`).value
            iCorrect += answer==String(question.correct);
            document.getElementById(sCorrectName).value = iCorrect;
        }
    }
}
// *********************************************************************
// Function Name:   nextQuestion()
// Functionality:   
//                  1. advance to next question
//
// input:           void
//
// returns:         void
// *********************************************************************
function nextQuestion() {
    goToQuestion(iQuestion+=1);
}
// *********************************************************************
// Function Name:   prevQuestion()
// Functionality:   
//                  1. advance to next question
//
// input:           void
//
// returns:         void
// *********************************************************************
function prevQuestion() {
    goToQuestion(iQuestion+=-1);
}
// *********************************************************************
// Function Name:   drawButtons
// Functionality:   
//                  1. Creates all buttons required for the question wrapper
//
// input:           Question, JSON object
//
// returns:         void
// *********************************************************************

function drawButtons(parent,Question,bBack=true) {
    let bNext = (Question.confirmRequired || lAlwaysNextBtn.includes(Question.type));
    // buttons wrapper
    let div = document.createElement('div');
    div.classList = 'btns-wrapper';
    console.log(parent,div)
    if (bBack) {
        let btnBack = document.createElement('button');
        btnBack.type = 'button';
        btnBack.classList = sButtonsClass;
        btnBack.onclick = prevQuestion;
        btnBack.innerHTML = 'Back'
        div.append(btnBack);
    }
    if (bNext) {
        let btnNext = document.createElement('button');
        btnNext.type = 'button';
        btnNext.classList = sButtonsClass;
        btnNext.innerHTML = 'Next';
        btnNext.onclick = ()=>{
            // Save answer if long text
            if (Question.type=='longOpen') {
                document.getElementById(`${Question.name}-input`).value = document.getElementById(`answer-${Question.name}`).value
            }
            // validate answer
            let bValid = validateInput(Question);
            let invalidMsg = document.getElementById(`${Question.name}-invalidMsg`);
            if (bValid) {
                console.log('valid answer')
                invalidMsg.classList.add('hidden');
                nextQuestion();
            } else {
                console.log('invalid answer')
                invalidMsg.classList.remove('hidden');
            }
        }
        
        div.append(btnNext);
    };
    parent.append(div);

}
// *********************************************************************
// Function Name:   drawInvalidMsg
// Functionality:   
//                  1. creates warning message in case invalid answers
//
// input:           parent, HTML element
//                  Question, JSON object
//
// returns:         void
// *********************************************************************

function drawInvalidMsg(parent,Question) {
    let div = document.createElement('div');
    div.classList = 'invalid-msg hidden';
    div.id = `${Question.name}-invalidMsg`;
    div.innerHTML = replaceDefault(Question.invalidMessage,'Invalid answer');
    if (Question.type=='autocomplete') {div.innerHTML = warningAutocomplete};
    parent.append(div);
}
// *********************************************************************
// Function Name:   createInput
// Functionality:   
//                  name, question name
//                  type, type of input
//
// input:           Question, JSON object
//
// returns:         validate, function(string) function that processes input
// *********************************************************************

function createInput(sName, sType) {
    let input   = document.createElement('input');
    input.type  = sType;
    input.name  = `Q_${sName}`;
    input.id    = `${sName}-input`;
    return input;
}


// *********************************************************************
// Function Name:   drawInvalidMsg
// Functionality:   
//                  1. processes validation function
//
// input:           Question, JSON object
//
// returns:         validate, function(string) function that processes input
// *********************************************************************


function validateInput(Question) {
    let validate=()=>{return true}; // if no validation method is provided
    if (Question.validate!==undefined) { 
        validate = Question.validate
    } else if (Question.type =='autocomplete') {
        validate=(str)=> { return Question.list.includes(str)};
    } 
    let input = document.getElementById(`${Question.name}-input`);
    if (input== null && Question.type=="text") {
        return true
    } else {
        return validate(input.value);
    }
}
// *********************************************************************
// Function Name:   drawQuestion
// Functionality:   
//                  1. Creates a question based on JSON object
//
// input:           Question, JSON object
//
// returns:         void
// *********************************************************************

function drawQuestion(Question,idx) {
    // Insert Question
    let div;
    switch(Question.type) {
        case 'shortOpen':
        case 'autocomplete':
            div = createTextInput(Question);
            break
        case 'Likert':
            div = createLikert(Question);
            break;
        case 'radio':
            div = createRadio(Question);
            break;
        case 'longOpen':
            div = createLongText(Question);
            break;
        case 'multiple':
            div = createMultipleChoice(Question);
            break;
        case 'imgBtn':
            div = createMultipleChoice(Question,true);
            console.log(div)
            break;
        default:
            div = document.createElement('div');
            div.classList= sWrapperClass+' inactive';
            let text    = document.createElement('p');
            text.innerHTML = Question.question;
            div.append(text);
            break;
    }
    div.id = `wrapper-${idx}`;
    // Invalid Msg
    drawInvalidMsg(div,Question);
    // Next button if requested or text input, Back btn only if it's not the first question
    drawButtons(div,Question,idx>0);
    drawProgBar(div,idx);
    PageBody.append(div);
}
// *********************************************************************
// Function Name:   createMultipleChoice
// Functionality:   
//                  1. creates the HTML elements for multiple choice questions
//
// input:           Question, JSON object
//
// returns:         void
// *********************************************************************

function createMultipleChoice(Question,bImg=false) {
    // wrapper
    let div = document.createElement('div');
    // Add attributes
    div.classList= sWrapperClass+' inactive';
    // question text
    let text    = document.createElement('p');
    text.innerHTML = Question.question;
    div.append(text);
    // options
    let direction = replaceDefault(Question.direction,'vertical');
    let opts     = document.createElement('div');
    opts.classList = `multiple-opts ${direction}`;
    let values = Question.values;
    let labels = replaceDefault(Question.labels, Question.values);
    // Check that labels and values have the same length
    if (labels.length != values.length) {
        console.log(`Question ${Question.name}: Dimensions of labels and values do not match`)
    };

    for (let i=0; i<values.length; i++) {
        if (bImg) {
            opts.append(addMultipleOption(Question,labels[i],values[i],Question.path))
        } else {
            opts.append(addMultipleOption(Question,labels[i],values[i]))
        }
    }
    let input = createInput(Question.name,'hidden')
    div.append(opts);
    div.append(input);
    return div;
}
// *********************************************************************
// Function Name:   addMultipleOption
// Functionality:   
//                  1. add button for likert-scale
//
// input:           
//                  Question, JSON object
//                  text, text in button
//                  value, value to add to input when clicked
//                  path, default is "" if different, button appends an image with source "path/text"
//
// returns:         div, HTML element
// *********************************************************************

function addMultipleOption(Question,text,value, path="") {
    let div;
    if (value==undefined) {value=text}

    // If limit is div, if not a button
    div = document.createElement('button');
    div.type = 'button';
    div.onclick = ()=>{
        let input = document.getElementById(`${Question.name}-input`);
        // update value
        if (div.classList.contains("selected")) {
            div.classList.remove("selected");
            // Remove from values
            input.value.replace(value,"").replace("  "," ");
        } else {
            div.classList.add('selected');
            input.value+=` ${value}`;
            // add values
        }
        if (path!="") {
            nextQuestion();
        }

    } 
    // if path is not null, it assumes it's an image
    // Path used is "path/text"
    if (path!="") {
        content = document.createElement('img');
        content.src = `${path}/${text}`;
        div.appendChild(content);
        div.classList.add('img-btn');
    } else {
        div.innerHTML = `${text}`;
        div.classList.add('likert-mid');
    }
    // determine properties

    return div;
}

// *********************************************************************
// Function Name:   createTextInput
// Functionality:   
//                  1. creates the HTML elements for a likert-scale question
//
// input:           Question, JSON object
//
// returns:         void
// *********************************************************************

function createTextInput(Question) {
    // wrapper
    let div = document.createElement('div');
    // Add attributes
    div.classList= sWrapperClass+' inactive';
    // question text
    let text    = document.createElement('p');
    text.innerHTML = Question.question;
    div.append(text);
    // Create input
    let input = createInput(Question.name,'text')
    input.rows = '1';
    input.cols  = '50';
    input.placeholder = 'Type here...'
    // Add autocomplete
    if (Question.type ==='autocomplete') {
        input.className = 'autocomplete';
        autocomplete(input, Question.list);
    } else {
        input.className = 'input-text';
    }
    div.append(input)
    return div;
}
// *********************************************************************
// Function Name:   createLongText
// Functionality:   
//                  1. creates the HTML elements for a likert-scale question
//
// input:           Question, JSON object
//
// returns:         void
// *********************************************************************

function createLongText(Question) {
    // wrapper
    let div = document.createElement('div');
    // Add attributes
    div.classList= sWrapperClass+' inactive';
    // question text
    let text    = document.createElement('p');
    text.innerHTML = Question.question;
    div.append(text);
    let textArea   = document.createElement('textarea');
    textArea.rows  = '3';
    textArea.type  = 'text';
    textArea.className = 'input-text';
    textArea.id    = `answer-${Question.name}`;
    textArea.cols  = '50';
    div.append(textArea);
    let input = createInput(Question.name,'hidden')
    div.append(input);
    return div

}
// *********************************************************************
// Function Name:   createLikert
// Functionality:   
//                  1. creates the HTML elements for a likert-scale question
//
// input:           Question, JSON object
//
// returns:         void
// *********************************************************************

function createLikert(Question) {
    // wrapper
    let div = document.createElement('div');
    // Add attributes
    div.classList= sWrapperClass+' inactive';
    // question text
    let text    = document.createElement('p');
    text.innerHTML = Question.question;
    div.append(text);
    // options
    let row     = document.createElement('div');
    row.classList = 'likert-row';
    row.append(addLikertOption('left',Question.limits[0]));
    for (let i=1;i<=Question.likertMax;i++) {
        row.append(addLikertOption('mid',i,i,Question));
    }
    row.append(addLikertOption('right',Question.limits[1]));
    let input = createInput(Question.name,'hidden')
    div.append(row);
    div.append(input);
    return  div;
}
// *********************************************************************
// Function Name:   addLikertOption
// Functionality:   
//                  1. add button for likert-scale
//
// input:           
//                  type, corner or mid item
//                  text, text in button
//                  value, value to add to input when clicked
//                  Question, JSON object
//
// returns:         div, HTML element
// *********************************************************************

function addLikertOption(type,text,value,Question) {
    let div;
    if (value==undefined) {value=text}

    // If limit is div, if not a button
    switch (type) {
        case 'left':
        case 'right': 
            div = document.createElement('div');
            break;
        case 'mid':
            div = document.createElement('button');
            div.type = 'button';
            div.onclick = ()=>{
                // update value
                document.getElementById(`${Question.name}-input`).value = value;
                // Is there a confirm button?
                if (Question.confirmRequired===undefined || !Question.confirmRequired) {
                    // if not, go to next question
                    nextQuestion();
                } else {
                    // if yes, tag this button
                    let lBtns = div.parentNode.getElementsByTagName('button');
                    for (let i=0;i<lBtns.length;i++) {
                        lBtns[i].classList.remove('selected');
                    }
                    div.classList.add('selected');
                }
            } 
            break;
    }
    // determine properties
    div.classList = `likert-${type}`;
    div.innerHTML = `${text}`;

    return div;
}


// *********************************************************************
// Function Name:   createRadio
// Functionality:   
//                  1. creates the HTML elements for a radio question
//
// input:           Question, JSON object
//
// returns:         void
// *********************************************************************

function createRadio(Question) {
    // wrapper
    let div = document.createElement('div');
    // Add attributes
    div.classList= sWrapperClass+' inactive';
    // question text
    let text    = document.createElement('p');
    text.innerHTML = Question.question;
    div.append(text);
    // options
    let direction = replaceDefault(Question.direction,'vertical');
    let opts     = document.createElement('div');
    opts.classList = `radio-opts ${direction}`;
    let values = Question.values;
    let labels = replaceDefault(Question.labels, Question.values);
    // Check that labels and values have the same length
    if (labels.length != values.length) {
        console.log(`Question ${Question.name}: Dimensions of labels and values do not match`)
    };

    for (let i=0; i<values.length; i++) {
        opts.append(createRadioOption(Question,values[i],labels[i],i))
    }
    let input = createInput(Question.name,'hidden')
    div.append(opts);
    div.append(input);
    
    return  div;
}
// *********************************************************************
// Function Name:   createRadioOption
// Functionality:   
//                  1. creates the HTML element for one radio input option
//
// input:           Question, JSON object
//                  value, value to be added to input
//                  label, label for input
//
// returns:         void
// *********************************************************************

function createRadioOption(Question,value,label) {

    let divItem = document.createElement('div');
    divItem.classList = 'radio-item';
    let inputRadio = document.createElement('input');
    inputRadio.type = 'radio';
    let divLabel = document.createElement('label');
    divLabel.innerHTML = label;
    divItem.append(inputRadio);
    divItem.append(divLabel);
    divItem.onclick = ()=> {
        document.getElementById(`${Question.name}-input`).value = value;
        if (!Question.confirmRequired) {nextQuestion()};
    }
    return divItem;
}


// *********************************************************************
// Function Name:   drawProgBar()
// Functionality:
//                  1. writes a Tag with the specified requirements
//
// input:           div, html element where it should be added
//                  
// returns:         void
// ********************************************************************
function drawProgBar(div,idx) {
    let pbar = document.createElement('div');
    pbar.classList = 'pbar-wrapper'
    pbar.innerHTML = `<label> 0% </label>
    <progress class="progress-bar" min="0" max="${lQuestions.length}" value="${idx+1}"></progress>
                        <label> 100% </label> `;
    div.append( pbar)
}

// *********************************************************************
// Function Name:   processItems
// Functionality:   
//                  1. Converts all properties described as a string in the JSON file to the actual variable/function. 
//
// input:           Question, JSON object
//
// returns:         Question
// *********************************************************************

function processItems(Question) {
    for (let x in Question) {
        Question[x] = property4JSON(Question[x]);
    }
    return Question;
}

// *********************************************************************
// Function Name:   property4JSON
// Functionality:   
//                  1. converts string into variable/function from a pre-specified list
//
// input:           key, string
//
// returns:         value, multiple
// *********************************************************************

function property4JSON(key) {
    let value;
    switch (key) {
        case 'countryList':
            value = Countries;
            break;
        case 'validInt':
            value = validInt;
            break;
        case 'validAge':
            value = validAge;
            break;
        case 'likertScale':
            value = likertScale;
            break
        case 'likertScale':
            value = likertScale;
            break;
        case 'warningEmpty':
            value = warningEmpty;
            break;
        case 'warningAge':
            value = warningAge;
            break;
        case 'likertLimits':
            value = likertLimits;
            break;
        case 'likertValues':
            value = likertValues;
            break;
        case 'figValues':
            value = figValues;
            break;
        case 'emptyWarning':
            value = emptyWarning;
            break;
        case 'nonEmpty':
            value = nonEmpty;
            break;
        default:
            value = key;
            break;
    }
    return value;
};

// *********************************************************************
// Function Name:   autocomplete
// Functionality:   Create autocomplete for text inputs
// Source: https://www.w3schools.com/howto/howto_js_autocomplete.asp
// input:           inp: HTML object, input that needs autocomplete
//                  arr: array of autocomplete options
// returns:         void
// ********************************************************************

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a               = document.createElement("div");
        a.id            = this.id + "autocomplete-list";
        a.classList     = "autocomplete-items";
        let rect = inp.getBoundingClientRect();
        a.style.top = `${rect.bottom}px`;
        a.style.left = `${rect.left}px`;
        a.style.width = `${rect.width}px`;
        /*append the DIV element as a child of the autocomplete container:*/
        PageBody.insertAdjacentElement('beforeend',a);

        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        switch (e.key) {
            case 'ArrowDown':  /* If the arrow DOWN key is pressed, increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
                break;
            case 'ArrowUp': /*If the arrow UP key is pressed, decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
                break;
            case 'Enter': /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();    
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
                break;
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


