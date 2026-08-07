/* ====================================================================
   THE FRONT END, BEFORE THE FIRST PAINT

   Two things every public page needs in the head, and both of them
   were copied into six files until this one existed.

   1 · THE THEME. The public site wears the desk's clothes. Elixir is
   what it ships with; ?theme=iris|paper|signal|darkroom swaps it,
   because a theme here is the same one file of tokens it is in the
   app.

   2 · THE TAB ICON, drawn the way the app draws it: from the live
   tokens, so it follows the theme, in the same viewBox with the same
   three units of air around the mark. The static file next to the app
   is the same drawing, and it paints first, before this runs.
   ==================================================================== */
(function () {
  var THEMES = ['paper', 'iris', 'elixir', 'signal', 'darkroom'];
  var m = /[?&]theme=([a-z]+)/i.exec(location.search);
  var id = m && THEMES.indexOf(m[1].toLowerCase()) >= 0 ? m[1].toLowerCase() : 'elixir';

  var link = document.getElementById('ttTheme');
  if (link) link.setAttribute('href', 'assets/css/theme-' + id + '.css');
  document.documentElement.setAttribute('data-theme', id);

  /* how light a hex is, roughly. Enough to decide which of the theme's
     two extremes reads against the tab strip. */
  function light(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n)) return false;
    return (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) > 128;
  }

  /* the stylesheet has to be in before the tokens can be read */
  function icon() {
    var s = getComputedStyle(document.documentElement);
    var ink = (s.getPropertyValue('--tt-ink') || '#23201b').trim();
    var page = (s.getPropertyValue('--tt-page') || '#ffffff').trim();
    var soft = (s.getPropertyValue('--tt-accentsoft') || ink).trim();

    /* The tab strip belongs to the browser, not to the page, so the
       mark follows the browser's scheme and not the theme's. A light
       theme on a dark strip draws itself in its own page color, and a
       dark theme on a light strip does the same. Without this, elixir
       on a dark macOS is dark ink on dark chrome. */
    var chromeIsDark = matchMedia('(prefers-color-scheme: dark)').matches;
    if (light(ink) !== chromeIsDark) ink = page;
    var bar = function (y, w) {
      return '<rect x="0" y="' + y + '" width="' + w + '" height="3.5" rx="1.75" fill="' + ink + '"/>';
    };
    var sq = function (x, fill) {
      return '<rect x="' + x + '" y="30" width="13" height="13" rx="2.5" fill="' + fill + '"/>';
    };
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 49 49">'
      + bar(0, 43) + bar(7.5, 43) + bar(15, 43) + bar(22.5, 26)
      + sq(0, ink) + sq(15, ink) + sq(30, soft) + '</svg>';
    var el = document.getElementById('ttIcon');
    if (el) el.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(svg));
  }
  setTimeout(icon, 60);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', icon);
})();
