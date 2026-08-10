/* ====================================================================
   POSTHOG

   The page has one job: get the reader to the source, to the demo blog,
   or to the mail. This file counts how often each of those happens.

   Three layers, from cheap to specific:

   1 · AUTOCAPTURE, which PostHog does by itself: the page view, the
   page leave, and every click with the element it hit. It costs one
   line and it catches what the other two layers forget.

   2 · NAMED CLICKS. Autocapture identifies an element by its markup, so
   a rewritten class name renames the event. The links that matter carry
   a data-track name instead, and that name is what the funnel is built
   on. A link without one still reports, under its own text.

   3 · READING. Which sections came into view, how far down the page the
   reader got, and whether the docker line was copied. That is the whole
   of "did the page work", and none of it is a click.
   ==================================================================== */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="an ln init xn Cn Br kn In capture Fn nn calculateEventProperties On register register_once register_for_session unregister unregister_for_session Ln getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Dn identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty An Rn createPersonProfile setInternalOrTestUser $n yn jn opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Tn debug Ur Rt getPageViewId captureTraceFeedback captureTraceMetric pn".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

posthog.init('phc_uEy5BZ4d9DmPyr6UAbRRU5aKqURYTYJG5tBp8XznV2f7', {
  api_host: 'https://eu.i.posthog.com',
  defaults: '2026-05-30',
  person_profiles: 'identified_only',

  /* Nothing is written to the browser. No cookie and no local storage,
     so the page needs no consent banner, which is the only answer that
     agrees with what the page says two sections above about the
     product.

     The price is the visitor count: the id lives in the tab and dies
     with it, so a reload is a new anonymous person and "unique
     visitors" means "sessions with the page open". Everything the page
     was built to answer survives it, because a click, a section and a
     scroll mark all happen inside one visit. */
  persistence: 'memory'
});

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ================================================================
       WHAT A LINK IS

       Cloudflare rewrites every mailto on a proxied domain into a
       /cdn-cgi/l/email-protection URL and decodes it in the browser.
       Left alone, the one event that matters most on this page would
       report a scrambled address, so the href is read back before it
       is sent.
       ================================================================ */
    function href(a) {
      var h = a.getAttribute('href') || '';
      if (h.indexOf('/cdn-cgi/l/email-protection') === 0) return 'mailto:klaus@texttile.blog';
      return h;
    }

    function kind(h) {
      if (h.indexOf('mailto:') === 0) return 'mail';
      if (h.charAt(0) === '#') return 'anchor';
      if (h.indexOf('github.com') > -1) return 'source';
      if (h.indexOf('demo.texttile.blog') > -1) return 'demo';
      if (/^https?:/.test(h)) return 'external';
      return 'internal';
    }

    /* the section a click came out of, so the same CTA can be told
       apart in the hero and in the hosting band */
    function where(el) {
      var s = el.closest('section[id]');
      if (s) return s.id;
      if (el.closest('header')) return 'header';
      if (el.closest('footer')) return 'footer';
      return 'page';
    }

    /* ================================================================
       LAYER 2 · NAMED CLICKS
       One listener on the document, so nothing has to be rebound and
       markup added later is covered without touching this file.
       ================================================================ */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a, button');
      if (!a) return;
      var h = a.tagName === 'A' ? href(a) : '';
      posthog.capture('cta_click', {
        name: a.getAttribute('data-track') || null,
        label: (a.textContent || '').trim().slice(0, 80),
        href: h || null,
        kind: a.tagName === 'A' ? kind(h) : 'button',
        section: where(a),
        new_tab: a.target === '_blank'
      });
    }, true);

    /* ================================================================
       LAYER 3 · READING
       ================================================================ */

    /* which sections were actually looked at. Half of a section on
       screen counts as read, and each one reports once. */
    var seen = {};
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var id = en.target.id;
          if (!en.isIntersecting || seen[id]) return;
          seen[id] = true;
          posthog.capture('section_viewed', { section: id });
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('section[id]').forEach(function (s) { io.observe(s); });
    }

    /* how far down the reader got. Four marks are enough to see where
       the page loses people, and each fires once. */
    var marks = [25, 50, 75, 100], hit = 0, ticking = false;
    function depth() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max <= 0 ? 100 : Math.round((h.scrollTop / max) * 100);
      while (hit < marks.length && pct >= marks[hit]) {
        posthog.capture('scroll_depth', { percent: marks[hit] });
        hit++;
      }
    }
    addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; depth(); });
    }, { passive: true });
    depth();

    /* the docker line. Copying it is the strongest signal on the page
       that somebody means to run the thing. */
    var code = document.querySelector('pre.code');
    if (code) code.addEventListener('copy', function () {
      posthog.capture('docker_command_copied');
    });
  });
})();
