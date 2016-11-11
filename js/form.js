window.onrouterload.push(function () {
    router.on('remoteviewloaded', function () {
        if (document.getElementById('contactForm') !== null)
            var contactForm = new Form(document.getElementById('contactForm'));
    });
});

waitFrame = requestAnimationFrame || function (cb) {
    cb();
};

// Creates a form that will send info to the server over an AJAX Request (XMLHttpRequest)
function Form(form) {
    var self = this;
    this.form = form;
    this.inputs = this.form.querySelectorAll('[name]');
    this.submitBtn = this.form.querySelector('button');

    this.canSubmit = function () {
        var regex = {
            text: /^.+$/,
            textarea: /.+/,
            email: /^[^@\s]+@[^@\s\.]+\.[\w\.]+$/
        };
        var canSubmit = true;
        for (var i = 0; i < self.inputs.length; i++) {
            var input = self.inputs[i];
            if (input.required && regex[input.type] && !regex[input.type].test(input.value)) {
                input.classList.add('animated');
                input.classList.remove('headShake');
                waitFrame((function (_input) {
                    return function () {
                        _input.classList.add('headShake');
                    };
                })(input));
                canSubmit = false;
            } else
                input.classList.remove('headShake');
        }
        return canSubmit;
    };

    this.submit = function () {
        if (!self.canSubmit())
            return;
        window.clientName = document.getElementById('name').value;
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                router.go('/thankyou/');
                var name = document.querySelector('#submiterName');
                if (name)
                    name.innerHTML = ' ' + window.clientName + '. Y';
            }
        };
        var data = '?';
        for (var i = 0; i < this.inputs.length; i++) {
            var input = this.inputs[i];
            if (input.value !== '')
                if (i === 0)
                    data += input.name + '=' + input.value;
                else
                    data += '&' + input.name + '=' + input.value;
        }
        console.log(data);
        xhr.open('POST', '/static/inc/submitform.php' + encodeURI(data), true);
        xhr.send();
    };

    this.submitBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        self.submit();
    });
}