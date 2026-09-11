  // Progressive enhancement: everything above is already visible and correct
  // without this. All it does is hide the two sections you do not need, so a
  // phone is not asked to scroll past instructions for other devices.
  (function () {
    try {
      var ua = navigator.userAgent || "";
      var isIOS = /iPad|iPhone|iPod/.test(ua) ||
        // iPadOS 13+ reports itself as a Mac, but a touchscreen gives it away.
        (/Macintosh/.test(ua) && typeof document.ontouchend !== "undefined");
      var isAndroid = /Android/.test(ua);
      if (!isIOS && !isAndroid) return;   // desktop: leave everything shown

      var hide = isIOS ? ["android", "desktop"] : ["ios", "desktop"];
      hide.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
    } catch (e) {
      // Any failure just leaves all three sets of instructions visible, which
      // is the correct page, only longer.
    }
  })();
