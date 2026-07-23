(function () {
  var CYCLE_MS = 10000;
  var TYPE_SPEED_MS = 70;

  function startTyping(el) {
    var text = el.getAttribute('data-typing-text') || '';

    function cycle() {
      el.textContent = '';
      var i = 0;
      var timer = setInterval(function () {
        i++;
        el.textContent = text.slice(0, i);
        if (i >= text.length) {
          clearInterval(timer);
        }
      }, TYPE_SPEED_MS);
    }

    cycle();
    setInterval(cycle, CYCLE_MS);
  }

  document.querySelectorAll('[data-typing-text]').forEach(startTyping);
})();
