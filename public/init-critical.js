// Critical initialization scripts
// This file contains scripts that were previously inline for CSP compliance

// Wrap in DOMContentLoaded to ensure DOM is ready before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  // Async CSS Loading - Non-blocking stylesheet loading
  var links = document.getElementsByTagName('link');
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.rel === 'stylesheet' && link.href.includes('index-') && link.href.includes('.css')) {
      link.media = 'print';
      link.onload = function() { this.media = 'all'; };
    }
  }
});
