function Nav() {
    this.toggleBtn = document.querySelector('.nav-btn');
    this.body = document.getElementsByTagName('body')[0];
    this.nav__base = document.querySelector('.nav__base');
    this.backdrop = this.nav__base.querySelector('.backdrop');
    this.dropdowns = document.querySelectorAll('.dropdown');
    this.dropdownOptions = document.querySelectorAll('.dropdown__content');
    this.dropdownOpen = false;
    this.actionTimeout = false;
    this.open = function () {
        return this.body.classList.contains('nav-open');
    };
    var self = this;
    for (var i = 0; i < this.dropdowns.length; i++) {
        this.dropdowns[i].addEventListener('click', (function (_i) {
            return function () {
                if (self.actionTimeout)
                    return;
                self.dropdowns[_i].classList.add('open');
                self.dropdownOpen = true;
                self.toggleBtn.classList.add('close-sub-menu');
            };
        })(i));
    }

    for (var j = 0; j < this.dropdownOptions.length; j++) {
        this.dropdownOptions[j].addEventListener('click', (function (_i) {
            return function () {
                self.dropdownOptions[_i].classList.add('tmp_close');
                setTimeout(function() {
                    self.dropdownOptions[_i].classList.remove('tmp_close');
                }, 1000);
            };
        })(j));
    }

    this.backdrop.addEventListener('click', function (evt) {
        evt.preventDefault();
        this.close();
    }.bind(this));

    this.toggleBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        if (this.actionTimeout)
            return;
        this.actionTimeout = true;
        setTimeout(function () {
            self.actionTimeout = false;
        }, 200);

        if (this.dropdownOpen) {
            this.dropdownOpen = false;
            this.toggleBtn.classList.remove('close-sub-menu');
            var d = document.querySelectorAll('.dropdown.open');
            for (i = 0; i < d.length; i++) {
                d[i].classList.remove('open');
            }
            return;
        }

        if (!this.body.classList.contains('nav-open')) {
            this.body.classList.add('nav-open');
        } else {
            this.close();
        }
    }.bind(this));

    this.startX = 0;
    this.startY = 0;
    this.nav__base.addEventListener('touchstart', function (evt) {
        if (!this.open())
            return;
        this.startX = evt.touches[0].clientX;
        this.startY = evt.touches[0].clientY;
    }.bind(this), false);
    this.nav__base.addEventListener('touchend', function (evt) {
        if (!this.open())
            return;
        if (this.startX - evt.changedTouches[0].clientX < -50 && Math.abs(this.startY - evt.changedTouches[0].clientY) < Math.abs(this.startX - evt.changedTouches[0].clientX)) {
            this.close();
        }
    }.bind(this), false);

    this.close = function () {
        self.actionTimeout = true;
        setTimeout(function () {
            self.actionTimeout = false;
        }, 200);
        this.dropdownOpen = false;
        this.toggleBtn.classList.remove('close-sub-menu');
        var d = document.querySelectorAll('.dropdown.open');
        for (i = 0; i < d.length; i++) {
            d[i].classList.remove('open');
        }
        this.body.classList.remove('nav-open');
    };
}

window.nav = new Nav();