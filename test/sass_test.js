var assert = require('assert');
var exec = require('child_process').exec;
var Tempfile = require('temporary/lib/file');
var utils = require('./utils');

describe('An array of image positions, dimensions, and names', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` into SASS', function () {
    before(function () {
      this.options = {format: 'sass'};
      this.filename = 'sass.sass';
    });
    utils.runTemplater();
    before(function writeSassToFile () {
      // Add some SASS to our result
      var sassStr = this.result;
      sassStr += '\n' + [
        '.feature',
        '  height: $sprite-dash-case-height',
        '  @include sprite-width($sprite-snake-case)',
        '  @include sprite-image($sprite-camel-case)',
        '',
        '.feature2',
        '  @include sprite($sprite-snake-case)',
        '',
        '@include sprites($spritesheet-sprites)'
      ].join('\n');

      // Save the SASS to a file for processing
      var tmp = new Tempfile();
      tmp.writeFileSync(sassStr);
      this.tmp = tmp;
    });
    after(function () {
      this.tmp.unlinkSync();
    });

    utils.assertMatchesAsExpected();

    describe('processed by SASS into CSS', function () {
      // Process the SASS
      before(function (done) {
        var that = this;
        exec('sass ' + this.tmp.path, function (err, css, stderr) {
          // Assert no errors during conversion
          assert.strictEqual(stderr, '');
          assert.strictEqual(err, null);
          assert.notEqual(css, '');

          // Save CSS for later and callback
          that.css = css;
          done(err);
        });
      });

      // Assert agains the generated CSS
      utils.assertValidCss();
    });
  });
});

describe('An array of 1 image', function () {
  utils.setupImages();

  describe('processed by `spritesheet-templates` into SASS', function () {
    before(function () {
      this.options = {format: 'sass'};
      this.filename = 'sass-single.sass';
    });
    utils.runTemplater();
    before(function writeSassToFile () {
      // Add some SASS to our result
      var sassStr = this.result;
      sassStr += '\n' + [
        '@include sprites($spritesheet-sprites)'
      ].join('\n');

      // Save the SASS to a file for processing
      var tmp = new Tempfile();
      tmp.writeFileSync(sassStr);
      this.tmp = tmp;
    });
    after(function () {
      this.tmp.unlinkSync();
    });

    utils.assertMatchesAsExpected();

    describe('processed by SASS into CSS', function () {
      // Process the SASS
      before(function (done) {
        var that = this;
        exec('sass ' + this.tmp.path, function (err, css, stderr) {
          // Assert no errors during conversion
          assert.strictEqual(stderr, '');
          assert.strictEqual(err, null);
          assert.notEqual(css, '');

          // Save CSS for later and callback
          that.css = css;
          done(err);
        });
      });

      // Assert agains the generated CSS
      utils.assertValidCss();
    });
  });
});
