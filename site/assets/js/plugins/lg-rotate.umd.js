/*!
 * lightgallery | 0.0.0 | April 11th 2021
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.lgRotate = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * List of lightGallery events
     * All events should be documented here
     * Below interfaces are used to build the website documentations
     * */
    var lGEvents = {
        afterAppendSlide: 'afterAppendSlide.lg',
        init: 'init.lg',
        hasVideo: 'hasVideo.lg',
        containerResize: 'containerResize.lg',
        updateSlides: 'updateSlides.lg',
        afterAppendSubHtml: 'afterAppendSubHtml.lg',
        beforeOpen: 'beforeOpen.lg',
        afterOpen: 'afterOpen.lg',
        slideItemLoad: 'slideItemLoad.lg',
        beforeSlide: 'beforeSlide.lg',
        afterSlide: 'afterSlide.lg',
        posterClick: 'posterClick.lg',
        dragStart: 'dragStart.lg',
        dragMove: 'dragMove.lg',
        dragEnd: 'dragEnd.lg',
        beforeNextSlide: 'beforeNextSlide.lg',
        beforePrevSlide: 'beforePrevSlide.lg',
        beforeClose: 'beforeClose.lg',
        afterClose: 'afterClose.lg',
    };

    var rotateSettings = {
        rotate: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
    };

    var Rotate = /** @class */ (function () {
        function Rotate(instance, $LG) {
            // get lightGallery core plugin instance
            this.core = instance;
            this.$LG = $LG;
            // extend module default settings with lightGallery core settings
            this.settings = __assign(__assign({}, rotateSettings), this.core.settings);
            if (this.settings.rotate) {
                this.init();
            }
            return this;
        }
        Rotate.prototype.buildTemplates = function () {
            var rotateIcons = '';
            if (this.settings.flipVertical) {
                rotateIcons +=
                    '<button type="button" id="lg-flip-ver" aria-label="flip vertical" class="lg-flip-ver lg-icon"></button>';
            }
            if (this.settings.flipHorizontal) {
                rotateIcons +=
                    '<button type="button" id="lg-flip-hor" aria-label="Flip horizontal" class="lg-flip-hor lg-icon"></button>';
            }
            if (this.settings.rotateLeft) {
                rotateIcons +=
                    '<button type="button" id="lg-rotate-left" aria-label="Rotate left" class="lg-rotate-left lg-icon"></button>';
            }
            if (this.settings.rotateRight) {
                rotateIcons +=
                    '<button type="button" id="lg-rotate-right" aria-label="Rotate right" class="lg-rotate-right lg-icon"></button>';
            }
            this.core.$toolbar.append(rotateIcons);
        };
        Rotate.prototype.init = function () {
            var _this = this;
            this.buildTemplates();
            // Save rotate config for each item to persist its rotate, flip values
            // even after navigating to diferent slides
            this.rotateValuesList = {};
            // event triggered after appending slide content
            this.core.LGel.on(lGEvents.afterAppendSlide + ".rotate", function (event) {
                var index = event.detail.index;
                var imageWrap = _this.core
                    .getSlideItem(index)
                    .find('.lg-img-wrap')
                    .first();
                imageWrap.wrap('lg-img-rotate');
            });
            this.core.outer
                .find('#lg-rotate-left')
                .first()
                .on('click.lg', this.rotateLeft.bind(this));
            this.core.outer
                .find('#lg-rotate-right')
                .first()
                .on('click.lg', this.rotateRight.bind(this));
            this.core.outer
                .find('#lg-flip-hor')
                .first()
                .on('click.lg', this.flipHorizontal.bind(this));
            this.core.outer
                .find('#lg-flip-ver')
                .first()
                .on('click.lg', this.flipVertical.bind(this));
            // Reset rotate on slide change
            this.core.LGel.on(lGEvents.beforeSlide + ".rotate", function (event) {
                if (!_this.rotateValuesList[event.detail.index]) {
                    _this.rotateValuesList[event.detail.index] = {
                        rotate: 0,
                        flipHorizontal: 1,
                        flipVertical: 1,
                    };
                }
            });
        };
        Rotate.prototype.applyStyles = function () {
            var $image = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first();
            $image.css('transform', 'rotate(' +
                this.rotateValuesList[this.core.index].rotate +
                'deg)' +
                ' scale3d(' +
                this.rotateValuesList[this.core.index].flipHorizontal +
                ', ' +
                this.rotateValuesList[this.core.index].flipVertical +
                ', 1)');
        };
        Rotate.prototype.rotateLeft = function () {
            this.rotateValuesList[this.core.index].rotate -= 90;
            this.applyStyles();
        };
        Rotate.prototype.rotateRight = function () {
            this.rotateValuesList[this.core.index].rotate += 90;
            this.applyStyles();
        };
        Rotate.prototype.getCurrentRotation = function (el) {
            if (!el) {
                return 0;
            }
            var st = this.$LG(el).style();
            var tm = st.getPropertyValue('-webkit-transform') ||
                st.getPropertyValue('-moz-transform') ||
                st.getPropertyValue('-ms-transform') ||
                st.getPropertyValue('-o-transform') ||
                st.getPropertyValue('transform') ||
                'none';
            if (tm !== 'none') {
                var values = tm.split('(')[1].split(')')[0].split(',');
                if (values) {
                    var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
                    return angle < 0 ? angle + 360 : angle;
                }
            }
            return 0;
        };
        Rotate.prototype.flipHorizontal = function () {
            var rotateEl = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first()
                .get();
            var currentRotation = this.getCurrentRotation(rotateEl);
            var rotateAxis = 'flipHorizontal';
            if (currentRotation === 90 || currentRotation === 270) {
                rotateAxis = 'flipVertical';
            }
            this.rotateValuesList[this.core.index][rotateAxis] *= -1;
            this.applyStyles();
        };
        Rotate.prototype.flipVertical = function () {
            var rotateEl = this.core
                .getSlideItem(this.core.index)
                .find('.lg-img-rotate')
                .first()
                .get();
            var currentRotation = this.getCurrentRotation(rotateEl);
            var rotateAxis = 'flipVertical';
            if (currentRotation === 90 || currentRotation === 270) {
                rotateAxis = 'flipHorizontal';
            }
            this.rotateValuesList[this.core.index][rotateAxis] *= -1;
            this.applyStyles();
        };
        Rotate.prototype.closeGallery = function () {
            this.rotateValuesList = {};
        };
        Rotate.prototype.destroy = function () {
            // Unbind all events added by lightGallery rotate plugin
            this.core.LGel.off('.lg.rotate');
        };
        return Rotate;
    }());

    return Rotate;

})));
//# sourceMappingURL=lg-rotate.umd.js.map
