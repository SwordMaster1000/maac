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
var parallax2Handler = function () { };

document.addEventListener("DOMContentLoaded", scrolling, false);

var scrollWatched = document.querySelectorAll('.scroll-watched');
window.onrouterload.push(function () {
    function updateWatchedElems() {
        scrollWatched = document.querySelectorAll('.scroll-watched');
        if (window.innerWidth > 850) {
            var parallax = document.getElementById("parallax");
            var parallax2 = document.getElementById("parallax2");
            var parallax3 = document.getElementById("parallax3");
            var parallax4 = document.getElementById("parallax4");
            var elBgPos;
            if (parallax) {
                parallaxHandler = function () {
                    var windowYOffset = window.pageYOffset;
                    elBgPos = "center " + (-windowYOffset * 0.5) + "px";
                    parallax.style.backgroundPosition = elBgPos;
                };
            }
            if (parallax2) {
                parallax2Handler = function () {
                    var windowYOffset = window.pageYOffset;
                    var pos = (windowYOffset * 0.25) + "px";
                    var npos = (-windowYOffset * 0.5) + "px";
                    parallax2.style.top = pos;
                    parallax3.style.top = npos;
                    parallax4.style.top = pos;
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
    parallax2Handler();
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