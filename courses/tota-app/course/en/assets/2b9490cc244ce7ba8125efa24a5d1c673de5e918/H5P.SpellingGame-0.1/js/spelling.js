H5P.SpellingGame = (function (EventDispatcher, $) {

  // We don't want to go smaller than 100px per input(including the required margin)
  var INPUT_MIN_SIZE = 100; // PX
  var INPUT_STD_SIZE = 116; // PX
  var STD_FONT_SIZE = 16; // PX
  var LIST_PADDING = 1; // EMs
  var numInstances = 0;

  /**
   * Memory Game Constructor
   *
   * @class H5P.SpellingGame
   * @extends H5P.EventDispatcher
   * @param {Object} parameters
   * @param {Number} id
   */
  function SpellingGame(parameters, id) {
    /** @alias H5P.SpellingGame# */
    var self = this;

    // Initialize event inheritance
    EventDispatcher.call(self);

    var $wrapper;
    var words = [];
    var currentWordIndex = 0;
    numInstances++;

    // Add defaults
    parameters = $.extend(true, {
      l10n: {
        feedback: 'Good work!'
      }
    }, parameters);

    /**
     * Attach this game's html to the given container.
     *
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      this.triggerXAPI('attempted');
      // TODO: Only create on first attach!
      $wrapper = $container.addClass('h5p-spelling-game').html('');
      let $button = $('<button>INICIAR</button>').appendTo($wrapper).
                    on('click', playCurrentWord)
    };

    playCurrentWord = function (event) {
      $wrapper = $wrapper.html('<canvas id="canvas"></canvas>');
      words[currentWordIndex].appendTo($wrapper);
      self.trigger('resize');
    };

    finishedWord = function (event) {
      currentWordIndex += 1;
      if (currentWordIndex == words.length) {
        return;
      }

      audioPlayer = document.createElement('audio');
      var source = document.createElement('source');
      source.src = H5P.getLibraryPath('H5P.SpellingGame-0.1') + '/audios/cheer_clap.mp3';
      source.type = 'audio/mpeg';
      audioPlayer.appendChild(source);
      audioPlayer.controls = null;
      audioPlayer.preload = 'auto';
      audioPlayer.play();

      setTimeout(playCurrentWord,5000)
    };

    /**
     * Will try to scale the game so that it fits within its container.
     * which improves the playability on multiple devices.
     *
     * @private
     */
    self.on('resize', function() {
      // canvas = document.getElementById("canvas");
      // canvas.width = window.innerWidth;
      // canvas.height = window.innerHeight;
    });

    for (var i = 0; i < parameters.words.length; i++) {
      let word = new SpellingGame.Word(parameters.words[i], id);
      word.on('finishedWord', finishedWord);
      words.push(word);
    }
  }

  // Extends the event dispatcher
  SpellingGame.prototype = Object.create(EventDispatcher.prototype);
  SpellingGame.prototype.constructor = SpellingGame;

  return SpellingGame;
})(H5P.EventDispatcher, H5P.jQuery);
