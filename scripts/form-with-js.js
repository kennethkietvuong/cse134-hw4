window.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('dom loaded!');

    let form = document.getElementById('contact-form');
    let formErrors = document.getElementById('form-errors');
    let formInfo = document.getElementById('form-info');
    let formErrorsArray = document.getElementById('form-errors-array');
    let form_errors_array = [];

    let nameElement = document.getElementById('name');
    let emailElement = document.getElementById('email');
    let commentsElement = document.getElementById('comments');
    let commentsLength = document.getElementById('commentsLength');

    function tempMessage(message, milliseconds = 1800) {
        if (!message) {
            return;
        }

        formErrors.textContent = message;
        formErrors.style.opacity = 1;

        window.clearTimeout(tempMessage._t);
        tempMessage._t = setTimeout(() => {
            formErrors.style.opacity = 0;
        }, milliseconds);
    }

    function logError(field, reason, val) {
        form_errors_array.push({
            time: new Date().toString(),
            field,
            reason,
            val
        });
    }

    /// Constraint API Functions ///
    function validateNameInput() {
        let originalName = nameElement.value;

        if (!nameElement.checkValidity()) {
            // if input is left empty
            if (!nameElement.value.length) {
                nameElement.setCustomValidity('Please enter your name (letters and spaces only).');
                tempMessage('A name is required to be filled in!');
                logError('name', 'empty name field', originalName);

                nameElement.classList.add('flash');
                setTimeout(() => nameElement.classList.remove('flash'), 200);
            }
    
            // if input has a pattern mismatch
            else if (nameElement.validity.patternMismatch) {
                nameElement.setCustomValidity('Name must contain letters and spaces only.');
                tempMessage('Only letters and spaces are allowed!');
                logError('name', 'illegal characters in name field', originalName);

                nameElement.classList.add('flash');
                setTimeout(() => nameElement.classList.remove('flash'), 200);
            }
    
            // reset custom error message
            else {
                nameElement.setCustomValidity('');
            }
        }
    }

    // something is wrong with this
    function validateEmailInput() {
        let originalEmail = emailElement.value;

        if (!emailElement.checkValidity()) {
            // if input is left empty
            if (!emailElement.value.length) {
                emailElement.setCustomValidity('Please enter your email.');
                tempMessage('An email is required to be filled in!');
                logError('email', 'empty email field', originalEmail);

                emailElement.classList.add('flash');
                setTimeout(() => emailElement.classList.remove('flash'), 200);
            }

            // if input has pattern mismatch
            else if (emailElement.validity.patternMismatch) {
                emailElement.setCustomValidity('Please enter a valid email address (e.g., example@email.com).');
                tempMessage('Error! Email entered is not valid!');
                logError('email', 'invalid email in email field', originalEmail);

                emailElement.classList.add('flash');
                setTimeout(() => emailElement.classList.remove('flash'), 200);
            }

            // reset custom error message
            else {
                emailElement.setCustomValidity('');
            }
        }
    }

    // preferrably put this in the corner of the textbox and make the textbox fixed and not draggable/expandable
    function updateCommentLength() {
        let maxChar = commentsElement.maxLength;
        let usedChar = commentsElement.value.length;
        let remainingChar = maxChar - usedChar;

        // if input is left empty
        if (usedChar == 0) {
            commentsElement.setCustomValidity('Please enter a message.');
            tempMessage('A comment is required to be filled in.');
            logError('comments', 'empty comments field', commentsElement.value);

            commentsElement.classList.add('flash');
            setTimeout(() => commentsElement.classList.remove('flash'), 200);
            return;
        }

        // if input goes past the limit somehow
        else if (remainingChar < 0) {
            commentsElement.setCustomValidity('Error: You have exceeded the maximum character limit.');
        }

        // reset custom error message
        else {
            commentsElement.setCustomValidity('');
        }

        commentsLength.textContent = `${remainingChar} characters remaining`;
        commentsLength.className = 'count-valid';

        if (remainingChar <= 100) {
            commentsLength.className = 'count-warning';
        }
        
        if (remainingChar <= 0) {
            commentsLength.className = 'count-error';
        }
    }

    // Event Listeners
    nameElement.addEventListener('input', validateNameInput);
    nameElement.addEventListener('blur', () => {
        // validateNameInput();
        // if (!nameElement.checkValidity()) {
        //     tempMessage(nameElement.validationMessage);
        //     logError('name', 'invalid', nameElement.value);
        //     // nameElement.reportValidity();
        // }
        // nameElement.reportValidity();
    });

    emailElement.addEventListener('input', validateEmailInput);
    emailElement.addEventListener('blur', () => {
        // validateEmailInput();
        // if (!emailElement.checkValidity()) {
        //     tempMessage(emailElement.validationMessage);
        //     logError('email', 'invalid', emailElement.value);
        // }
        // emailElement.reportValidity();
    });

    commentsElement.addEventListener('input', updateCommentLength);
    commentsElement.addEventListener('blur', () => {
        // updateCommentLength();
        // if (!commentsElement.checkValidity()) {
        //     tempMessage(commentsElement.validationMessage);
        //     logError('comments', 'invalid', commentsElement.value);
        // }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        validateNameInput();
        validateEmailInput();
        updateCommentLength();

        if (!form.checkValidity()) {
            e.preventDefault();

            // show first invalid message
            let firstInvalidMessage = form.querySelector(':invalid');
            if (firstInvalidMessage) {
                firstInvalidMessage.focus();
                tempMessage(firstInvalidMessage.validationMessage, 2500);
                logError(firstInvalidMessage.name || firstInvalidMessage.id || 'unknown', 'submit-invalid', firstInvalidMessage.value);
            }

            return;
        }

        formErrorsArray.value = JSON.stringify(form_errors_array);
        formInfo.textContent = 'Submitting...';
    });
}