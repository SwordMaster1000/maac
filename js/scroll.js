var isScrolling = false, raf = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || oRequestAnimationFrame || function (cb) {
    setTimeout(cb, 16);
};

window.addEventListener("scroll", throttleScroll, false);

function throttleScroll() {
    if (isScrolling === false) {
        raf(function () {
            scrolling();
            isScrolling = false;
        });
    }
    isScrolling = true;
}

document.addEventListener("DOMContentLoaded", scrolling, false);

var scrollWatched = document.querySelectorAll('.scroll-watched');
window.onrouterload.push(function () {
    router.on('remoteviewloaded', function () {
        scrollWatched = document.querySelectorAll('.scroll-watched');
        scrolling();
    });
});

function scrolling() {
    for (var i = 0; i < scrollWatched.length; i++) {
        var elem = scrollWatched[i];
        if (isPartiallyVisible(elem)) {
            elem.classList.add("scroll-active");
        } else {
            elem.classList.remove("scroll-active");
        }
    }
}

function isPartiallyVisible(el) {
    var elementBoundary = el.getBoundingClientRect();

    var top = elementBoundary.top;
    var bottom = elementBoundary.bottom;
    var height = elementBoundary.height;

    return ((top + height >= 0) && (height + window.innerHeight >= bottom));
}