(function () {
    if (/(?:ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        document.getElementsByTagName('html')[0].classList.add('js-is-idevice');
    }
})();