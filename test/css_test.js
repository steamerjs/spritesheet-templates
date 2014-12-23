var utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` into CSS', function () {
    before(function () {
      this.options = null;
      this.filename = 'css.css';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
    utils.runFakeJigsaw();
    it('is valid CSS', function (done) {
      var css = this.result;
      utils._assertValidCss(css, done);
    });
  });

  // Edge case test for https://github.com/Ensighten/grunt-spritesmith/issues/104
  describe('processed by `spritesheet-templates` into CSS with an escapable selector', function () {
    before(function () {
      this.options = {
        formatOpts: {
          cssSelector: function (item) {
            return '.hello > .icon-' + item.name;
          }
        }
      };
      this.filename = 'css-escapable.css';
    });
    utils.runTemplater();

    utils.assertMatchesAsExpected();
    utils.runFakeJigsaw();
    it('is valid CSS', function (done) {
      var css = this.result;
      utils._assertValidCss(css, done);
    });
  });
});

