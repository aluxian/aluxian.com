var canClick = true;

var sendButton = $('form button.green'),
    nameInput = $('[placeholder="Name"]'),
    emailInput = $('[placeholder="Email Address"]'),
    subjectInput = $('[placeholder="Subject"]'),
    messageInput = $('[placeholder="Message"]');

// Switch the active class on the send button
// in order to change the button state
var switchClass = function (newClass) {
    sendButton.removeClass('send');
    sendButton.removeClass('sending');
    sendButton.removeClass('sent');
    sendButton.removeClass('error');
    sendButton.addClass(newClass);
};

// Clear some values from the form
var clearForm = function () {
    subjectInput.val('');
    messageInput.val('');
};

// Make sure there's at least one second delay
// between `time` and the run of the function `func`
var ensureDelay = function (time, func) {
    setTimeout(func, 1000 - (Date.now() - time));
};

// Handle clicks on the send email button
sendButton.click(function (event) {
    if (!canClick) {
        event.preventDefault();
        return false;
    }

    canClick = false;

    var name = nameInput.val(),
        email = emailInput.val(),
        subject = subjectInput.val(),
        message = messageInput.val();

    var handleError = function () {
        switchClass('error');
        setTimeout(function () {
            switchClass('send');
            canClick = true;
        }, 2000);
    };

    if (name && email && subject && message) {
        event.preventDefault();
        switchClass('sending');
        var startedAt = Date.now();

        $.ajax({
            type: 'POST',
            url: 'https://mandrillapp.com/api/1.0/messages/send.json',
            dataType: 'json',

            data: {
                key: atob('MjN0UVpmbVVWR1A3Vjc1NlZyTEdxdw=='),
                message: {
                    from_email: 'email@aluxian.com',
                    from_name: name,
                    to: [
                        {
                            email: 'me@aluxian.com',
                            name: 'Alexandru Rosianu'
                        }
                    ],
                    headers: {
                        'Reply-To': email
                    },
                    subject: subject,
                    text: message + '\n\n\n---\nvia aluxian.com',
                    auto_html: true
                }
            },

            success: ensureDelay.bind(null, startedAt, function () {
                switchClass('sent');

                setTimeout(function () {
                    clearForm();
                    switchClass('send');
                    canClick = true;
                }, 2000);
            }),

            error: ensureDelay.bind(null, startedAt, handleError)
        });
    } else {
        handleError();
    }

    return false;
});
