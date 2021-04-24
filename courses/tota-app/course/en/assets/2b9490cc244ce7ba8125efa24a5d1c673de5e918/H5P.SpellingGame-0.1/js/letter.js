(function (SpellingGame, EventDispatcher, $) {

  /**
   * Controls all the operations for each letter.
   *
   * @class H5P.SpellingGame.Letter
   * @extends H5P.EventDispatcher
   * @param {Object} letter
   * @param {number} id
   */
  SpellingGame.Letter = function (letter, id) {
    /** @alias H5P.SpellingGame.Letter# */
    var self = this;

    // Initialize event inheritance
    EventDispatcher.call(self);

    var completed;
    var errorCount = 0;

    var $wrapper = $('<input type="text" maxLength="1" size="1" pattern="[a-zA-Z0-9]{1}" />');
    $wrapper.on('keyup', function (e) {
    });

    $wrapper.on('input', function (e) {
      this.value = this.value.toUpperCase()
      if (this.value.length == 0) {
        return;
      }

      self.checkLetter();
    });

    $wrapper.on('keydown', function (e) {
      $wrapper.stop(true, false);
      $wrapper.css('color', '#000');
      $wrapper.val('');
    });

    $wrapper.on('click', function (e) {
      self.trigger('selectCurrentLetter');
      return false;
    });

    /**
     * Append letter to the given container.
     *
     * @param {H5P.jQuery} $container
     */
    self.appendTo = function ($container) {
      $wrapper.appendTo($container);

    };

    self.moveToNext = function () {
      sib = $wrapper.next('input');
      if (!sib || !sib.length) {
        sib = body.find('input').eq(0);
      }
      sib.select().focus();
    }

    self.checkLetter = function () {
      if ($wrapper.val() == letter) {
        self.setCorrect();
      } else {
        self.trigger('playaudio', 0.5);
        errorCount += 1;
        $wrapper.animate({
          color: '#fff'
        }, {
          duration: 500,
          complete: self.restoreState
        });
      }
    };

    self.setCorrect = function () {
      completed = true
      $wrapper.css('color', 'green');
      $wrapper.addClass('correct');
      self.trigger('correct');
    };

    self.restoreState = function () {
      $wrapper.css('color', '#000');
      $wrapper.val('');
      if (errorCount > 2) {
        self.showTip();
      }      
    };

    self.showTip = function () {
      $wrapper.css('color', '#eee');
      $wrapper.val(letter);
    };
  };

  // Extends the event dispatcher
  SpellingGame.Letter.prototype = Object.create(EventDispatcher.prototype);
  SpellingGame.Letter.prototype.constructor = SpellingGame.Letter;

})(H5P.SpellingGame, H5P.EventDispatcher, H5P.jQuery);
