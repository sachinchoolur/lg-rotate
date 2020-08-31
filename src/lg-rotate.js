(function () {
    'use strict';

    var defaults = {
        rotate: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
    };

    var Rotate = function (element) {
        this.core = $(element).data('lightGallery');

        this.core.s = $.extend({}, defaults, this.core.s);

        if (this.core.s.rotate && this.core.doCss()) {
            this.init();
        }

        return this;
    };

    Rotate.prototype.buildTemplates = function () {
        var rotateIcons = '';
        if (this.core.s.flipHorizontal) {
            rotateIcons += '<button aria-label="Flip horizontal" class="lg-flip-hor lg-icon"></button>';
        }
        if (this.core.s.flipVertical) {
            rotateIcons += '<button aria-label="flip vertical" class="lg-flip-ver lg-icon"></button>';
        }
        if (this.core.s.rotateLeft) {
            rotateIcons += '<button aria-label="Rotate left" class="lg-rotate-left lg-icon"></button>';
        }
        if (this.core.s.rotateRight) {
            rotateIcons += '<button aria-label="Rotate right" class="lg-rotate-right lg-icon"></button>';
        }
        this.core.$outer.find('.lg-toolbar').append(rotateIcons);
    };

    Rotate.prototype.init = function () {
        var _this = this;
        this.buildTemplates();
        this.resetRotateValues();

        // event triggered after appending slide content
        this.core.$el.on('onAferAppendSlide.lg.tm.rotate', function (event, index) {
            // Get the current element
            var $imageWrap = _this.core.$slide.eq(index).find('.lg-img-wrap');
            $imageWrap.wrap('<div class="lg-img-rotate"></div>');
        });

        this.core.$outer
            .find('.lg-rotate-left')
            .on('click.lg', this.rotateLeft.bind(this));

        this.core.$outer
            .find('.lg-rotate-right')
            .on('click.lg', this.rotateRight.bind(this));
        this.core.$outer
            .find('.lg-flip-hor')
            .on('click.lg', this.flipHorizontal.bind(this));

        this.core.$outer
            .find('.lg-flip-ver')
            .on('click.lg', this.flipVertical.bind(this));

        // Reset rotate on slide change
        this.core.$el.on('onBeforeSlide.lg.tm.rotate', function () {
            _this.resetRotateValues();
        });
    };

    Rotate.prototype.applyStyles = function () {
        var $image = this.core.$slide.eq(this.core.index).find('.lg-img-rotate');
        $image.css(
            'transform',
            'rotate(' + this.rotateValues.rotate + 'deg) scale3d(' + this.rotateValues.flipVertical + ', ' + this.rotateValues.flipHorizontal + ', 1)'
        );
    };

    Rotate.prototype.rotateLeft = function () {
        this.rotateValues.rotate -= 90;
        this.applyStyles();
    };

    Rotate.prototype.rotateRight = function () {
        this.rotateValues.rotate += 90;
        this.applyStyles();
    };

    Rotate.prototype.flipHorizontal = function () {
        this.rotateValues.flipHorizontal *= -1;
        this.applyStyles();
    };

    Rotate.prototype.flipVertical = function () {
        this.rotateValues.flipVertical *= -1;
        this.applyStyles();
    };

    // Reset rotate effect
    Rotate.prototype.resetRotateValues = function () {
        this.rotateValues = {
            rotate: 0,
            flipHorizontal: 1,
            flipVertical: 1,
        };
    };

    Rotate.prototype.destroy = function () {
        // Unbind all events added by lightGallery rotate plugin
        this.core.$el.off('.lg.tm.rotate');
        this.resetRotateValues();
    };

    $.fn.lightGallery.modules.rotate = Rotate;
})();