var router;

function transitionEndEventName() {
    var i,
        el = document.createElement('div'),
        transitions = {
            'transition': 'transitionend',
            'OTransition': 'otransitionend', // oTransitionEnd in very old Opera
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }
    return false;

}
var transitionend = transitionEndEventName();

function jRouter() {
    this.initialized = true;
    console.info('Checking jRouter requirements . . .');
    if (!Modernizr.history) {
        console.warn('History API: Fail');
        this.initialized = false;
    } else {
        console.info('History API: Pass');
    }
    if (!transitionend) {
        console.warn('transitionend event: Fail');
    } else {
        console.info('transitionend event: Pass');
    }
    if (!Map || !Map.prototype.keys) {
        console.warn('ES6 Map: Fail');
        this.initialized = false;
    } else {
        console.info('ES6 Map: Pass');
    }
    if (!Modernizr.promises) {
        console.warn('ES6 Promises: Fail');
        this.initialized = false;
    } else {
        console.info('ES6 Promises: Pass');
    }
    if (!this.initialized) {
        console.error('Some requirements were not met. Terminating jRouter.');
        return this;
    }
    console.info('All requirements met. Initializing jRouter.');
    this.routes = new Map();
    this._onChanged = this._onChanged.bind(this);
    this._currentView = document.querySelector('.viewing');

    this._addRoutes();

    window.addEventListener('popstate', function () {
        router.go(window.location.href);
    });

    this.onremoteviewloaded = [];
}
jRouter.prototype.addRoute = function (route, view) {
    if (this.routes.has(route)) {
        return;
    }

    this.routes.set(route, view);
};
jRouter.prototype._addRoutes = function () {
    this._removeRoutes();
    var links = document.querySelectorAll('a[href^="/"]'),
        i,
        link;
    for (i = 0; i < links.length; i++) {
        link = links[i];

        if (!link.marked) {
            link.marked = true;
            link.addEventListener('click', (function (link) {
                return function (evt) {
                    evt.preventDefault();
                    router.go(link.getAttribute('href'));
                };
            })(link), false);
        }
    }

    var view, route, j,
        views = document.querySelectorAll('.page__base');

    for (j = 0; j < views.length; j++) {
        view = views[j];
        if (view.getAttribute('data-route')) {
            route = view.getAttribute('data-route');
            this.addRoute(new RegExp(route, 'i'), view);
        }
    }
};
jRouter.prototype._removeRoutes = function () {
    this.routes.clear();
};

jRouter.prototype.on = function (evt, fn) {
    jRouter['on' + evt] = jRouter['on' + evt] || [];
    if (fn)
        jRouter['on' + evt].push(fn);
    else {
        for (var i = 0; i < jRouter['on' + evt].length; i++) {
            if (jRouter['on' + evt][i] !== null)
                jRouter['on' + evt][i]();
        }
    }
};
jRouter.prototype.removeListener = function (evt, fn) {
    for (var i = 0; i < jRouter['on' + evt].length; i++) {
        if (jRouter['on' + evt][i] === fn) {
            jRouter['on' + evt][i] = null;
        }
    }
};

jRouter.prototype._onChanged = function () {
    var path = window.location.pathname,
        routes = Array.from(this.routes.keys()),
        route = routes.find(function (r) {
            return r.test(path);
        }),
        data = route.exec(path);
    if (!route)
        return;

    this._newView = this.routes.get(route);

    if (this._isTransitioningBetweenViews)
        return Promise.resolve();
    this._isTransitioningBetweenViews = true;

    var outViewPromise = Promise.resolve();

    if (this._currentView) {
        if (this._currentView === this._newView) {
            this._isTransitioningBetweenViews = false;

            return this._currentView.update(data);
        }

        outViewPromise = this._currentView.out(data);
    }

    return outViewPromise
        .then(function () {
            this._currentView = this._newView;
            this._isTransitioningBetweenViews = false;
            return this._newView.in(data);
        }.bind(this));
};

jRouter.prototype.go = function (url) {
    window.history.pushState(null, null, url);
    this._addRoutes();
    return this._onChanged();
};

window.addEventListener('load', function () {
    router = new jRouter();
    for (var i = 0; i < window.onrouterload.length; i++) {
        window.onrouterload[i]();
    }
    router.on('remoteviewloaded');
    router.on('viewchanged');
});
// Elements
HTMLDivElement.prototype._spinnerTimeout = undefined;
HTMLDivElement.prototype._view = null;
HTMLDivElement.prototype._isRemote = function () {
    return (this.getAttribute('data-remote') !== null);
};

HTMLDivElement.prototype._hideSpinner = function () {
    this.classList.remove('pending');
};
HTMLDivElement.prototype._showSpinner = function () {
    this.classList.add('pending');
};

HTMLDivElement.prototype._loadView = function (data) {
    // Wait for half a second then show the spinner.
    var spinnerTimeout = setTimeout(function () {
        this._showSpinner();
    }.bind(this), 500);

    this.loaded = true;
    var xhr = new XMLHttpRequest();

    xhr.onload = function (evt) {
        var newView = evt.target.response.querySelector('.page__base.viewing');
        this.innerHTML = newView.innerHTML;
        router._addRoutes();
        // Clear the timeout and remove the spinner if needed.
        clearTimeout(spinnerTimeout);
        this._hideSpinner();
        router.on('remoteviewloaded');
    }.bind(this);
    xhr.responseType = 'document';
    xhr.open('GET', data[0] + '?partial');
    xhr.send();
};


HTMLDivElement.prototype.in = function (data) {
    console.info('ViewElement.in(', data, ')');
    if (this._isRemote() && !this.loaded)
        this._loadView(data);
    
    router.on('viewchanged');
    return new Promise(function (resolve) {
        var onTransitionEnd = function () {
            this.removeEventListener(transitionend, onTransitionEnd);
            resolve();
        };
        this.classList.remove('hide-view');
        this.classList.remove('pending');
        this.classList.add('viewing');
        this.addEventListener(transitionend, onTransitionEnd);
    }.bind(this));
};

HTMLDivElement.prototype.out = function (data) {
    console.info('ViewElement.out(', data, ')');
    return new Promise(function (resolve) {
        var onTransitionEnd = function () {
            window.scrollTo(0, 0);
            this.classList.add('hide-view');
            this.removeEventListener(transitionend, onTransitionEnd);
            resolve();
        };

        window.nav.close();
        document.querySelector('html').focus();
        this.classList.remove('viewing');
        this.addEventListener(transitionend, onTransitionEnd);
    }.bind(this));
};

HTMLDivElement.prototype.update = function (data) {
    console.info('ViewElement.update(', data, ')');
    window.nav.close();
    var onAnimationEnd = function () {
        this.removeEventListener('animationend', onAnimationEnd);
        this.classList.remove('fadeIn');
    }.bind(this);
    this.classList.add('animated');
    this.classList.add('fadeIn');
    this.addEventListener('animationend', onAnimationEnd);
    return Promise.resolve();
};