/* Everything4Shell — parody microsite behaviour
   Three independent widgets: the triage quiz, the naming engine, the chart. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ utils */

  // Deterministic string hash, so the same component always gets the same
  // "launch readiness" verdict. Security theatre should at least be reproducible.
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function pick(list, seed) { return list[seed % list.length]; }
  function titleCase(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function syllables(s) {
    var m = s.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g);
    return m ? m.length : 1;
  }

  /* ------------------------------------------------------------- the triage */

  var quiz = document.getElementById('quiz');
  if (quiz) {
    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var boxes = quiz.querySelectorAll('input[name="q"]');
      var n = 0;
      boxes.forEach(function (b) { if (b.checked) n++; });

      var text;
      if (n === 0) {
        text = 'You checked nothing, which means you are affected transitively, through a vendor ' +
               'you have never heard of, who is affected through a dependency they have never audited. ' +
               'This is the most common finding.';
      } else if (n < 3) {
        text = 'You checked ' + n + ' of 6. That is enough. Everything4Shell requires only one ' +
               'true statement, and the first one is load-bearing.';
      } else if (n < 6) {
        text = 'You checked ' + n + ' of 6. Your exposure is described internally as "comprehensive" ' +
               'and externally as "in line with industry peers".';
      } else {
        text = 'You checked all six. Congratulations — you are the reference implementation. ' +
               'The Shell Naming Authority would like to use your environment in the keynote.';
      }

      document.getElementById('verdict-text').textContent = text;
      var v = document.getElementById('verdict');
      v.hidden = false;
      v.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ------------------------------------------------------- the naming engine */

  var LOGO_BRIEFS = [
    'A flame, but corporate.', 'A bleeding padlock.', 'A skull wearing a lanyard.',
    'An isometric diagram nobody can read.', 'A ghost holding a terminal.',
    'A broken shield, 40% opacity.', 'A snake eating a YAML file.'
  ];
  var TRACKS = [
    'Black Hat briefing, 50-minute slot', 'DEF CON main track, with a demo that fails',
    'Keynote, immediately after the coffee break', 'RSA expo booth, free socks',
    'BSides, 9am Sunday', 'Vendor webinar, 1,400 registrations, 40 attendees'
  ];
  var SHIRT = ['6 days', '2 weeks', 'already shipping', 'pre-order only', 'sold out before disclosure'];
  var DOMAIN = [
    { t: 'AVAILABLE · $11.99/yr', c: 'good' },
    { t: 'AVAILABLE · buy it now', c: 'good' },
    { t: 'TAKEN · a researcher got there in 2023', c: 'bad' },
    { t: 'AVAILABLE · .io is $39, worth it', c: 'good' },
    { t: 'PARKED · $4,500, the registrar knows', c: 'bad' }
  ];
  var DISCOVERERS = [
    'a stealth-mode startup with no product',
    'a threat-intel vendor that needed a Q4 win',
    'a consultancy that was already mid-engagement',
    'a university lab with excellent graphic design',
    'a direct competitor of the affected vendor'
  ];

  function blend(t) {
    // redis -> RediShell, kafka -> KafkShell. Drop a trailing vowel or s, add Shell.
    var base = t.replace(/[aeious]$/i, '');
    return titleCase(base) + 'Shell';
  }

  function brandings(t) {
    var T = titleCase(t);
    return [
      { name: T + '2Shell', note: 'the sequel' },
      { name: blend(t), note: 'portmanteau, premium tier' },
      { name: 'Proxy' + T, note: 'implies a chain of three bugs' },
      { name: T + 'bleed', note: 'if it leaks memory' },
      { name: T + 'ageddon', note: 'ecosystem-wide, needs a war room' },
      { name: 'regre' + T, note: 'if it was already fixed in 2009' },
      { name: T + 'Gate', note: 'if a vendor denies it first' }
    ];
  }

  function pressRelease(T, name, cve, seed) {
    var who = pick(DISCOVERERS, seed >> 3);
    return 'FOR IMMEDIATE RELEASE — ' + name + ' (' + cve + ')\n\n' +
      'Researchers at ' + who + ' today disclosed ' + name + ', a pre-authentication, ' +
      'unauthenticated, wormable remote code execution vulnerability affecting all versions of ' +
      T + ', including the ones that do not exist yet.\n\n' +
      'The bug was found by an intern in their second week, who has not been named. The bug has.\n\n' +
      '"This is the most serious vulnerability since the last most serious vulnerability," said ' +
      'the person who registered the domain. "We are still determining whether the bug is real, ' +
      'but the logo tested extremely well."\n\n' +
      'Organizations running ' + T + ' should patch immediately. Organizations not running ' + T +
      ' should patch anyway, as ' + T + ' is present in your environment via a dependency you ' +
      'inherited in an acquisition.\n\n' +
      'A patch is expected. A website is already live. We are also hiring.\n\n' +
      '### \n\nPress contact: the Shell Naming Authority. Satire; do not actually file this.';
  }

  var genForm = document.getElementById('gen');
  if (genForm) {
    var out = document.getElementById('gen-out');

    function generate(raw) {
      var t = (raw || '').toLowerCase().replace(/[^a-z0-9+#.\- ]/g, '').trim().replace(/\s+/g, '');
      if (!t) return;
      var T = titleCase(t);
      var seed = hash(t);
      var name = T + '4Shell';
      var syl = syllables(name);
      var cve = 'CVE-2026-' + (4000 + (seed % 5999));
      var hype = Math.max(6, 11 - Math.max(0, syl - 4));
      var dom = pick(DOMAIN, seed >> 1);

      document.getElementById('gen-cve').textContent = cve + ' · fictional · severity: branded';
      document.getElementById('gen-name').innerHTML =
        T.replace(/[<>&]/g, '') + '<b>4</b>Shell';
      document.getElementById('gen-sub').textContent =
        'Affects all versions of ' + T + '. Also affects everything adjacent to ' + T + '.';

      var alts = document.getElementById('gen-alts');
      alts.innerHTML = '';
      brandings(t).forEach(function (b) {
        var li = document.createElement('li');
        var strong = document.createElement('b');
        strong.textContent = b.name;
        var sp = document.createElement('span');
        sp.textContent = b.note;
        li.appendChild(strong);
        li.appendChild(sp);
        alts.appendChild(li);
      });

      var meta = [
        ['CVSS', '11.0 / 10', 'bad'],
        ['Hype index', hype + ' / 11', 'good'],
        ['Syllables', syl + (syl <= 4 ? ' · compliant' : ' · the SNA will rename this'), syl <= 4 ? 'good' : 'bad'],
        ['Domain', t + '4shell.com — ' + dom.t, dom.c],
        ['Logo brief', pick(LOGO_BRIEFS, seed >> 2), ''],
        ['Talk slot', pick(TRACKS, seed >> 4), ''],
        ['T-shirts', pick(SHIRT, seed >> 5), ''],
        ['Patch ETA', 'unscheduled', 'bad']
      ];
      var dl = document.getElementById('gen-meta');
      dl.innerHTML = '';
      meta.forEach(function (row) {
        var dt = document.createElement('dt');
        dt.textContent = row[0];
        var dd = document.createElement('dd');
        dd.textContent = row[1];
        if (row[2]) dd.className = row[2];
        dl.appendChild(dt);
        dl.appendChild(dd);
      });

      document.getElementById('gen-pr').textContent = pressRelease(T, name, cve, seed);
      out.hidden = false;
    }

    genForm.addEventListener('submit', function (e) {
      e.preventDefault();
      generate(document.getElementById('tech').value);
    });

    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var v = chip.getAttribute('data-tech');
        document.getElementById('tech').value = v;
        generate(v);
      });
    });

    var copyBtn = document.getElementById('copy-pr');
    copyBtn.addEventListener('click', function () {
      var text = document.getElementById('gen-pr').textContent;
      var done = function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }

  /* ------------------------------------------------------------- the chart */

  var DATA = [
    { name: 'Heartbleed',       year: 2014, cvss: 7.5,  hype: 10 },
    { name: 'Shellshock',       year: 2014, cvss: 9.8,  hype: 9 },
    { name: 'EternalBlue',      year: 2017, cvss: 8.1,  hype: 8 },
    { name: 'Spectre',          year: 2018, cvss: 5.6,  hype: 10 },
    { name: 'Log4Shell',        year: 2021, cvss: 10.0, hype: 10 },
    { name: 'Spring4Shell',     year: 2022, cvss: 9.8,  hype: 7 },
    { name: 'Text4Shell',       year: 2022, cvss: 9.8,  hype: 4 },
    { name: 'regreSSHion',      year: 2024, cvss: 8.1,  hype: 7 },
    { name: 'Everything4Shell', year: 2026, cvss: 11.0, hype: 11 }
  ];
  var SERIES = [
    { key: 'cvss', label: 'CVSS base score', color: '#3987e5' },
    { key: 'hype', label: 'Hype Index (fabricated)', color: '#d95926' }
  ];

  var svg = document.getElementById('chart');
  if (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    var W = 760, H = 430;
    var PAD = { t: 26, r: 50, b: 44, l: 152 };
    var plotW = W - PAD.l - PAD.r;
    var plotH = H - PAD.t - PAD.b;
    var MAX = 11;
    var rowH = plotH / DATA.length;
    var barH = 14, gap = 2;

    var x = function (v) { return PAD.l + (v / MAX) * plotW; };

    function el(tag, attrs, text) {
      var n = document.createElementNS(NS, tag);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (text != null) n.textContent = text;
      svg.appendChild(n);
      return n;
    }
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    // gridlines + x axis — recessive
    for (var g = 0; g <= MAX; g += 2) {
      el('line', { x1: x(g), y1: PAD.t, x2: x(g), y2: PAD.t + plotH, stroke: '#2f2f2a', 'stroke-width': 1 });
      el('text', { x: x(g), y: H - 22, fill: '#8c8b80', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'ui-monospace, Menlo, monospace' }, String(g));
    }
    // the CVSS ceiling, which branding ignores
    el('line', { x1: x(10), y1: PAD.t, x2: x(10), y2: PAD.t + plotH, stroke: '#e66767', 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: .75 });
    el('text', { x: x(10) + 5, y: 13, fill: '#e66767', 'font-size': 10.5, 'font-family': 'ui-monospace, Menlo, monospace' }, 'CVSS ceiling');
    el('text', { x: PAD.l + plotW / 2, y: H - 4, fill: '#8c8b80', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'ui-monospace, Menlo, monospace' }, 'Score (0–11)');

    var tip = document.getElementById('viz-tip');
    var plot = svg.parentNode;

    DATA.forEach(function (d, i) {
      var top = PAD.t + i * rowH;
      var mid = top + rowH / 2;
      var groupH = SERIES.length * barH + gap;
      var y0 = mid - groupH / 2;

      // category label
      el('text', {
        x: PAD.l - 12, y: mid - 2, fill: '#f6f5ef', 'font-size': 12.5, 'text-anchor': 'end',
        'font-family': 'ui-monospace, Menlo, monospace'
      }, d.name);
      el('text', {
        x: PAD.l - 12, y: mid + 13, fill: '#8c8b80', 'font-size': 10.5, 'text-anchor': 'end',
        'font-family': 'ui-monospace, Menlo, monospace'
      }, d.year);

      SERIES.forEach(function (s, si) {
        var v = d[s.key];
        var w = Math.max(2, x(v) - PAD.l);
        var y = y0 + si * (barH + gap);
        // 4px rounded data-end, square against the baseline
        var r = 4;
        var path = 'M' + PAD.l + ' ' + y +
                   'H' + (PAD.l + w - r) + 'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r +
                   'V' + (y + barH - r) + 'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + r +
                   'H' + PAD.l + 'Z';
        el('path', { d: path, fill: s.color });

        // selective direct labels: only the opening and closing rows
        if (i === 0 || i === DATA.length - 1) {
          el('text', {
            x: PAD.l + w + 7, y: y + barH - 3, fill: '#c3c2b7', 'font-size': 11,
            'font-family': 'ui-monospace, Menlo, monospace'
          }, v.toFixed(1));
        }
      });

      // full-row hit target, larger than the marks
      var hit = el('rect', {
        x: PAD.l, y: top, width: plotW, height: rowH, fill: 'transparent',
        tabindex: '0', role: 'img',
        'aria-label': d.name + ', ' + d.year + ': CVSS ' + d.cvss + ', Hype Index ' + d.hype
      });

      function show(ev) {
        tip.innerHTML = '';
        var b = document.createElement('b');
        b.textContent = d.name + ' · ' + d.year;
        tip.appendChild(b);
        SERIES.forEach(function (s) {
          var row = document.createElement('div');
          row.className = 'row';
          var sw = document.createElement('i');
          sw.style.background = s.color;
          row.appendChild(sw);
          row.appendChild(document.createTextNode(s.label.replace(' (fabricated)', '') + ': ' + d[s.key].toFixed(1)));
          tip.appendChild(row);
        });
        tip.hidden = false;
        var pr = plot.getBoundingClientRect();
        var hr = hit.getBoundingClientRect();
        var px = ev && ev.clientX ? ev.clientX - pr.left : hr.left - pr.left + hr.width / 2;
        tip.style.left = Math.min(Math.max(px, 70), pr.width - 70) + 'px';
        tip.style.top = (hr.top - pr.top + hr.height) + 'px';
      }
      function hide() { tip.hidden = true; }

      hit.addEventListener('mousemove', show);
      hit.addEventListener('mouseleave', hide);
      hit.addEventListener('focus', show);
      hit.addEventListener('blur', hide);
    });

    // legend — identity never by colour alone
    var legend = document.getElementById('viz-legend');
    SERIES.forEach(function (s) {
      var sp = document.createElement('span');
      var i2 = document.createElement('i');
      i2.style.background = s.color;
      sp.appendChild(i2);
      sp.appendChild(document.createTextNode(s.label));
      legend.appendChild(sp);
    });

    // table view
    var wrap = document.getElementById('chart-table');
    var rows = DATA.map(function (d) {
      return '<tr><td>' + d.name + '</td><td>' + d.year + '</td><td>' + d.cvss.toFixed(1) +
             '</td><td>' + d.hype.toFixed(1) + '</td></tr>';
    }).join('');
    wrap.innerHTML = '<table><caption>Same data, as a table</caption><thead><tr>' +
      '<th scope="col">Vulnerability</th><th scope="col">Year</th><th scope="col">CVSS</th>' +
      '<th scope="col">Hype Index</th></tr></thead><tbody>' + rows + '</tbody></table>';

    var toggle = document.getElementById('toggle-table');
    toggle.addEventListener('click', function () {
      var open = wrap.hidden;
      wrap.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Hide data table' : 'Show data table';
    });
  }
})();
