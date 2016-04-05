'use strict';

/**
 * @fileoverview Animating ajax on scroll
 * @author JoshJRogan@gmail.com (Josh Rogan)
 * @author ritwikg2004@live.com (Ritwik Gupta)
 * @author jjnaughton93@gmail.com (JJ Naughton)
 */

module.exports = (function() {
    let modernizr = require('browsernizr');
    
    var docElem = window.document.documentElement;

    function getViewportH() {
        var client = docElem['clientHeight'],
            inner = window['innerHeight'];
        
        if( client < inner )
            return inner;
        else
            return client;
    }

    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
    }

    // http://stackoverflow.com/a/5598797/989439
    function getOffset( el ) {
        var offsetTop = 0, offsetLeft = 0;
        do {
            if ( !isNaN( el.offsetTop ) ) {
                offsetTop += el.offsetTop;
            }
            if ( !isNaN( el.offsetLeft ) ) {
                offsetLeft += el.offsetLeft;
            }
        } while( el = el.offsetParent )

        return {
            top : offsetTop,
            left : offsetLeft
        }
    }

    function inViewport( el, h ) {
        var elH = el.offsetHeight,
            scrolled = scrollY(),
            viewed = scrolled + getViewportH(),
            elTop = getOffset(el).top,
            elBottom = elTop + elH,
            // if 0, the element is considered in the viewport as soon as it enters.
            // if 1, the element is considered in the viewport only when it's fully inside
            // value in percentage (1 >= h >= 0)
            h = h || 0;

        return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
    }

    function extend( a, b ) {
        for( var key in b ) { 
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }

    function AnimOnScroll( el, options ) {  
        this.el = el;
        this.options = extend( this.defaults, options );
        this._init();
    }

    AnimOnScroll.prototype = {
        defaults : {
            // Minimum and a maximum duration of the animation (random value is chosen)
            minDuration : 0,
            maxDuration : 0,
            // The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation
            // if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport. 
            // If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
            viewportFactor : 0
        },
        _init : function() {
            this.items = Array.prototype.slice.call( document.querySelectorAll( '#' + this.el.id + ' > li' ) );
            this.itemsCount = this.items.length;
            this.itemsRenderedCount = 0;
            this.didScroll = false;

            var self = this;

            // the items already shown...
            self.items.forEach(function(el, i) {
                if(inViewport(el)) {
                    self._checkTotalRendered();
                    el.className += " shown";
                }
            });

            // animate on scroll the items inside the viewport
            window.addEventListener('scroll', function() {
                self._onScrollFn();
            }, false);
            window.addEventListener('resize', function() {
                self._resizeHandler();
            }, false);
        },
        _onScrollFn : function() {
            var self = this;
            if( !this.didScroll ) {
                this.didScroll = true;
                setTimeout(function() {
                    self._scrollPage();
                }, 60 );
            }
        },
        _scrollPage : function() {
            var self = this;
            this.items.forEach( function(el, i) {
                //check for classes
                var hasShown = (' ' + el.className + ' ').indexOf(' ' + 'shown' + ' ') > -1;
                var hasAnimate = (' ' + el.className + ' ').indexOf(' ' + 'animate' + ' ') > -1;

                if(!hasShown && !hasAnimate && inViewport(el, self.options.viewportFactor)) {
                    setTimeout(function() {
                        var perspY = scrollY() + getViewportH() / 2;
                        self.el.style.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
                        self.el.style.MozPerspectiveOrigin = '50% ' + perspY + 'px';
                        self.el.style.perspectiveOrigin = '50% ' + perspY + 'px';

                        self._checkTotalRendered();

                        if(self.options.minDuration && self.options.maxDuration) {
                            var randDuration = (Math.random() * (self.options.maxDuration - self.options.minDuration) + self.options.minDuration) + 's';
                            el.style.WebkitAnimationDuration = randDuration;
                            el.style.MozAnimationDuration = randDuration;
                            el.style.animationDuration = randDuration;
                        }
                        
                        //add class
                        el.className += " animate";
                    }, 25 );
                }
            });
            this.didScroll = false;
        },
        _resizeHandler : function() {
            var self = this;
            function delayed() {
                self._scrollPage();
                self.resizeTimeout = null;
            }
            if ( this.resizeTimeout ) {
                clearTimeout( this.resizeTimeout );
            }
            this.resizeTimeout = setTimeout( delayed, 1000 );
        },
        _checkTotalRendered : function() {
            ++this.itemsRenderedCount;
            if( this.itemsRenderedCount === this.itemsCount ) {
                window.removeEventListener( 'scroll', this._onScrollFn );
            }
        }
    };

    //module object:
    let scrollload = {};

    scrollload.init = function() {
        new AnimOnScroll(document.getElementById('grid'), {
            minDuration: 0.4,
            maxDuration: 0.7,
            viewportFactor: 0.2
        });
    };


    //return module
    return scrollload;

})();
