/* @ds-bundle: {"format":4,"namespace":"FounderSquare","components":[{"name":"Logo"},{"name":"Header"},{"name":"Footer"},{"name":"Button"},{"name":"TextLink"},{"name":"CopyEmail"},{"name":"Hero"},{"name":"EventRow"},{"name":"PageHead"},{"name":"About"},{"name":"RegisterBand"},{"name":"Schedule"},{"name":"Questions"}]} */
/* Founder Square behaviours, vanilla: the footer's copy-address button. */
(function () {
  'use strict';
  function copyButtons(root, address) {
    (root || document).querySelectorAll('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy address'; }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(address || 'team@foundersquare.org').then(done, function () { b.textContent = address || 'team@foundersquare.org'; });
        else b.textContent = address || 'team@foundersquare.org';
      });
    });
  }
  window.FounderSquare = { copyButtons: copyButtons };
})();
