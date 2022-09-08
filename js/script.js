// Select for the name input and focus
let nameInput = document.querySelector("#name")
nameInput.focus()

// Job selection
let jobInput = document.querySelector("#title")
let jobOther = document.querySelector("#other-job-role")
// Set the default display to hide the other job input block
jobOther.style.display = "none"
jobInput.addEventListener("change", e => {
    // If the "other" option is selected, display the other job input block
    if (jobInput.value === "other") {
        jobOther.style.display = "block"
    }
    // If any except "other" is selected, hide the other job input block
    else {
        jobOther.style.display = "none"
    }
})

// Shirt selection
let shirtColor = document.querySelector("#color")
let shirtDesign = document.querySelector("#design")
// Disable the shirt color selection button as default
shirtColor.disabled = true
// Set event listener to dynamically disable/enable shirt color selection and hide shirt color value depending on chosen design
shirtDesign.addEventListener("change", e => {
    // If the shirt design has not been selected, disable shirt color selection
    if (!shirtDesign.value) {
        shirtColor.disabled = true
    }
    // If the shirt design has been selected, enable shirt color selection
    else {
        shirtColor.disabled = false
    }

    let options = shirtColor.children
    // Set boolean for determining default color selection when design option is chosen
    let firstShown = true
    // Cycle through the color options
    for (let i = 0; i < options.length; i++) {
        let theme = options[i].getAttribute('data-theme')
        // If the shirt design does not match the theme of the color option, or the color option is the "select a color" option, hide the option
        if ((i === 0 || shirtDesign.value === "js puns" && theme === "heart js") ||
            (shirtDesign.value === "heart js" && theme === "js puns")) {
            options[i].hidden = true
            options[i].selected = false
        }
        // If the shirt design matches the theme of the color option, display the option
        else {
            options[i].hidden = false
            // If the option is the first to be displayed in the series, default select that option
            if (firstShown) {
                options[i].selected = true
                firstShown = false
            }
        }
    }
})

// Activity selection 
let activities = document.querySelector("#activities-box")
let activitiesField = document.querySelector("#activities")
let cost = document.querySelector("#activities-cost")
let totalCost = 0
activities.addEventListener("change", e => {
    let choices = activities.children
    let checked = {}
    // Restate here so that totalCost is able to reset
    totalCost = 0
    // Loop through the all the activity options
    for (let i = 0; i < choices.length; i++) {
        let activityCheckbox = choices[i].children[0]
        // If the checkbox has been checked, add that activity's price to the total cost.
        if (activityCheckbox.checked) {
            totalCost += parseInt(activityCheckbox.getAttribute("data-cost"))
            let checkedDate = activityCheckbox.getAttribute("data-day-and-time")
            checked[checkedDate] = true
        }
    }
    // Loop through the items again to see if there are conflicted dates/times with checked items
    for (let j = 0; j < choices.length; j++) {
        let activityCheckbox = choices[j].children[0]
        let otherDate = activityCheckbox.getAttribute("data-day-and-time")
        // Disable activity if there is a time conflict
        if (!activityCheckbox.checked && checked[otherDate]) {
            choices[j].className = "disabled"
            activityCheckbox.disabled = true
        }
        // Enable activity when there are no time conflicts
        else {
            choices[j].classList.remove("disabled")
            activityCheckbox.disabled = false
        }
    }
    //Change the displayed price to reflect the total cost of the checked activities
    cost.textContent = ""
    cost.textContent = `Total = $${totalCost}`
})

// Payment section structuring
let creditCardInfo = document.querySelector("#credit-card")
let paypalInfo = document.querySelector("#paypal")
let bitcoinInfo = document.querySelector("#bitcoin")
// Set the default layout to select credit card out of the options
let paymentSelection = document.querySelector("#payment")
paymentSelection[1].selected = true
// Hide the payment information sections for bitcoin and paypal
paypalInfo.hidden = true
bitcoinInfo.hidden = true
// Update the payment section based on payment type
paymentSelection.addEventListener("change", e => {
    // If credit card is selected, hide bitcoin and paypal sections and show credit card section
    if (paymentSelection[1].selected) {
        paypalInfo.hidden = true
        bitcoinInfo.hidden = true
        creditCardInfo.hidden = false
    }
    // If paypal card is selected, hide bitcoin and credit card sections and show paypal section
    else if (paymentSelection[2].selected) {
        paypalInfo.hidden = false
        bitcoinInfo.hidden = true
        creditCardInfo.hidden = true
    }
    // If bitcoin is selected, hide credit card and paypal sections and show bitcoin section
    else {
        paypalInfo.hidden = true
        bitcoinInfo.hidden = false
        creditCardInfo.hidden = true
    }
})

// Form validation
let form = document.querySelector("form")

function addRemoveValidation(input, func, e) {
    if (!func()) {
        e.preventDefault()
        input.className = "not-valid"
        input.classList.remove("valid")
        input.lastElementChild.style.display = "block"
    } else {
        input.className = "valid"
        input.classList.remove("not-valid")
        input.lastElementChild.style.display = "none"
    }
}
// Form submission event listener that prevents submission if any validators flag an issue
form.addEventListener("submit", e => {
    addRemoveValidation(nameInput.parentElement, nameValidator, e)
    addRemoveValidation(emailInput.parentElement, emailValidator, e)
    // Conditional error message for email input; message for blank, and message for incorrect formatting
    if (!emailInput.value) {
        emailInput.parentElement.lastElementChild.textContent = "Please include an email address"
    } else {
        emailInput.parentElement.lastElementChild.textContent = "Email address must be formatted correctly"
    }
    addRemoveValidation(activitiesField, activityValidator, e)
    if (paymentSelection[1].selected) {
        addRemoveValidation(ccInput.parentElement, ccNumValidator, e)
        addRemoveValidation(zipInput.parentElement, zipCodeValidator, e)
        addRemoveValidation(cvvInput.parentElement, cvvValidator, e)
    }
})

// Form component validation functions
function nameValidator() {
    // Check that there is at least a first name, but can include middle and last as well
    return /^[A-Za-z-]+ ?[A-Za-z-]*? ?[A-Za-z-]*?$/.test(nameInput.value)
}
let emailInput = document.querySelector("#email")
function emailValidator() {
    //Check that there are non-@ characters, then an @ sign, then non-@ and non-. characters, then ., then non-@ and non-. characters 
    return /^[^@]+@[^@.]+\.[A-Za-z]+$/.test(emailInput.value)
}
function activityValidator() {
    // Check that at least one activity is selected by checking that the price is above $0
    return totalCost > 0
}
let ccInput = document.querySelector("#cc-num")
function ccNumValidator() {
    // Check that there are 13-16 numbers only
    return /^\d{13,16}$/.test(ccInput.value)
}
let zipInput = document.querySelector("#zip")
function zipCodeValidator() {
    // Check that there are 5 numbers only
    return /^\d{5}$/.test(zipInput.value)
}
let cvvInput = document.querySelector("#cvv")
function cvvValidator() {
    // Check that there are 3 numbers only
    return /^\d{3}$/.test(cvvInput.value)
}

// Real time error messaging for the zipcode input
zipInput.addEventListener("keyup", e => {

})


// Accessibility
// Adding visual focus cue when focus is on activity
activities.addEventListener("focusin", e => {
    if (e.target.tagName === "INPUT") {
        let activityLabel = e.target.parentElement
        activityLabel.className = "focus"
    }
})
// Removing visual focus cue when focus is removed from activity
activities.addEventListener("focusout", e => {
    e.target.parentElement.className = ""
})