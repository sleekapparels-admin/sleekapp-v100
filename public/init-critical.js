// Critical CSS Loader - Async CSS Loading for Performance
(function() {
  'use strict';
  
  // Feature detection
  var supportsIntersectionObserver = 'IntersectionObserver' in window;
  var supportsLoading = 'loading' in HTMLImageElement.prototype;
  
  // Async CSS Loading Helper
  function loadCSS(href, before, media, attributes) {
    var doc = window.document;
    var ss = doc.createElement('link');
    var ref;
    if (before) {
      ref = before;
    } else {
      var refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
      ref = refs[refs.length - 1];
    }
    
    var sheets = doc.styleSheets;
    if (attributes) {
      for (var attributeName in attributes) {
        if (attributes.hasOwnProperty(attributeName)) {
          ss.setAttribute(attributeName, attributes[attributeName]);
        }
      }
    }
    ss.rel = 'stylesheet';
    ss.href = href;
    ss.media = 'only x';
    
    function ready(cb) {
      if (doc.body) {
        return cb();
      }
      setTimeout(function() {
        ready(cb);
      });
    }
    
    ready(function() {
      ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
    });
    
    var onloadcssdefined = function(cb) {
      var resolvedHref = ss.href;
      var i = sheets.length;
      while (i--) {
        if (sheets[i].href === resolvedHref) {
          return cb();
        }
      }
      setTimeout(function() {
        onloadcssdefined(cb);
      });
    };
    
    function loadCB() {
      if (ss.addEventListener) {
        ss.removeEventListener('load', loadCB);
      }
      ss.media = media || 'all';
    }
    
    if (ss.addEventListener) {
      ss.addEventListener('load', loadCB);
    }
    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined(loadCB);
    return ss;
  }
  
  // Lazy Image Loading Polyfill (for browsers without native lazy loading)
  if (!supportsLoading && supportsIntersectionObserver) {
    var imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var image = entry.target;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
          }
          if (image.dataset.srcset) {
            image.srcset = image.dataset.srcset;
            image.removeAttribute('data-srcset');
          }
          image.classList.remove('lazy');
          observer.unobserve(image);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Observe all lazy images
    document.addEventListener('DOMContentLoaded', function() {
      var lazyImages = document.querySelectorAll('img.lazy, img[loading="lazy"]');
      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    });
  }
  
  // Defer third-party scripts until interaction or page load
  var scriptsLoaded = false;
  function loadDeferredScripts() {
    if (scriptsLoaded) return;
    scriptsLoaded = true;
    
    // Load analytics scripts
    var scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(function(script) {
      var newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      }
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      }
      Array.from(script.attributes).forEach(function(attr) {
        if (attr.name !== 'data-defer') {
          newScript.setAttribute(attr.name, attr.value);
        }
      });
      script.parentNode.replaceChild(newScript, script);
    });
  }
  
  // Load deferred scripts on user interaction or after page load
  var events = ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'];
  events.forEach(function(event) {
    window.addEventListener(event, loadDeferredScripts, { once: true, passive: true });
  });
  
  // Also load after 3 seconds as fallback
  window.addEventListener('load', function() {
    setTimeout(loadDeferredScripts, 3000);
  });
  
  // Export loadCSS for external use
  window.loadCSS = loadCSS;
})();
