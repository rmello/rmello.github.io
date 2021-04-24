(function (SpellingGame, EventDispatcher, $) {

  /**
   * Controls all the operations for each card.
   *
   * @class H5P.SpellingGame.Word
   * @extends H5P.EventDispatcher
   * @param {Object} image
   * @param {number} id
   * @param {Object} l10n Localization
   * @param {string} [description]
   * @param {Object} [styles]
   */
  SpellingGame.Word = function (wordData, id) {
    /** @alias H5P.SpellingGame.Word# */
    var self = this;

    // Initialize event inheritance
    EventDispatcher.call(self);

    var $wrapper, $image, audioPlayer;
    var currentLetter;

    if (wordData?.image?.path) {
      $image = $('<img/>', { src: H5P.getPath(wordData.image.path, id) })
    }

    var audio = wordData.audio;
    if (audio) {
      // Check if browser supports audio.
      audioPlayer = document.createElement('audio');
      if (audioPlayer.canPlayType !== undefined) {
        // Add supported source files.
        for (var i = 0; i < audio.length; i++) {
          if (audioPlayer.canPlayType(audio[i].mime)) {
            var source = document.createElement('source');
            source.src = H5P.getPath(audio[i].path, id);
            source.type = audio[i].mime;
            audioPlayer.appendChild(source);
          }
        }
        audioPlayer.controls = 'controls';
        audioPlayer.preload = 'auto';
      }
    }

    /**
     * Append word to the given container.
     *
     * @param {H5P.jQuery} $container
     */
    self.appendTo = function ($container) {
      $wrapper = $('<div></div>').appendTo($container);

      if ($image) {
        $image.appendTo($wrapper);
      }

      if (wordData.audio) {
        $(audioPlayer).appendTo($wrapper);
      }

      let $letters = $('<div class="letters"></div>').appendTo($wrapper);
      for (var j = 0; j < wordData.word.length; j++) {
        let letter = new SpellingGame.Letter(wordData.word[j], id);
        letter.on('playaudio', self.playAudio);
        letter.on('correct', self.selectCurrentLetter);
        letter.on('selectCurrentLetter', self.selectCurrentLetter);
        letter.appendTo($letters);
      }

      self.playAudio();
    };

    /**
     * Stop any audio track that might be playing.
     */
    self.stopAudio = function () {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
    };

    self.playAudio = function(event) {
      var playbackRate = event?.data || 1.0;
      audioPlayer.playbackRate = playbackRate;
      audioPlayer.play();
    };

    self.selectCurrentLetter = function(event) {
      let currentLetter = $wrapper.find('.letters input').not(".correct")[0];
      if (!currentLetter) {
        self.trigger('finishedWord')
      }
      currentLetter.focus();
    }
  };

  // Extends the event dispatcher
  SpellingGame.Word.prototype = Object.create(EventDispatcher.prototype);
  SpellingGame.Word.prototype.constructor = SpellingGame.Word;

  /**
   * Check to see if the given object corresponds with the semantics for
   * a memory game card.
   *
   * @param {object} params
   * @returns {boolean}
   */
  SpellingGame.Word.isValid = function (params) {
    return (params !== undefined &&
             (params.image !== undefined &&
             params.image.path !== undefined) ||
           params.audio);
  };

})(H5P.SpellingGame, H5P.EventDispatcher, H5P.jQuery);
