(function (SpellingGame, Timer) {

  /**
   * Adapter between spelling game and H5P.Timer
   *
   * @class H5P.SpellingGame.Timer
   * @extends H5P.Timer
   * @param {Element} element
   */
  SpellingGame.Timer = function (element) {
    /** @alias H5P.SpellingGame.Timer# */
    var self = this;

    // Initialize event inheritance
    Timer.call(self, 100);

    /** @private {string} */
    var naturalState = element.innerText;

    /**
     * Set up callback for time updates.
     * Formats time stamp for humans.
     *
     * @private
     */
    var update = function () {
      var time = self.getTime();

      var minutes = Timer.extractTimeElement(time, 'minutes');
      var seconds = Timer.extractTimeElement(time, 'seconds') % 60;

      // Update duration attribute
      element.setAttribute('datetime', 'PT' + minutes + 'M' + seconds + 'S');

      // Add leading zero
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      element.innerText = minutes + ':' + seconds;
    };

    // Setup default behavior
    self.notify('every_tenth_second', update);
    self.on('reset', function () {
      element.innerText = naturalState;
      self.notify('every_tenth_second', update);
    });
  };

  // Inheritance
  SpellingGame.Timer.prototype = Object.create(Timer.prototype);
  SpellingGame.Timer.prototype.constructor = SpellingGame.Timer;

})(H5P.SpellingGame, H5P.Timer);
