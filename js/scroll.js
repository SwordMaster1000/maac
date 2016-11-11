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
window.onrouterload.push(function() {
    function updateWatchedElems() {
        scrollWatched = document.querySelectorAll('.scroll-watched');
        scrolling();
    }

    router.on('remoteviewloaded', updateWatchedElems);
    router.on('viewchanged', updateWatchedElems);
});

window.addEventListener('resize', scrolling);

function scrolling() {
    for (var i = 0, l = scrollWatched.length; i < l; i++) {
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
    var height = elementBoundary.height;
    
    return ((elementBoundary.top + height >= 0) && (height + window.innerHeight >= elementBoundary.bottom));
}