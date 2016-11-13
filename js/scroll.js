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
var parallaxHandler = function () { };

document.addEventListener("DOMContentLoaded", scrolling, false);

var scrollWatched = document.querySelectorAll('.scroll-watched');
window.onrouterload.push(function () {
    function updateWatchedElems() {
        scrollWatched = document.querySelectorAll('.scroll-watched');
        if (window.innerWidth > 850) {
            var parallax = document.getElementById("parallax");
            var elBgPos;
            if (parallax) {
                parallaxHandler = function () {
                    var windowYOffset = window.pageYOffset;
                    elBgPos = "center " + (-windowYOffset * 0.5) + "px";
                    parallax.style.backgroundPosition = elBgPos;
                };
            }
        }
        scrolling();
    }

    router.on('remoteviewloaded', updateWatchedElems);
    router.on('viewchanged', updateWatchedElems);
});

window.addEventListener('resize', scrolling);

function scrolling() {
    parallaxHandler();
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