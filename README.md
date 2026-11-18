# everything4shell.com

A parody vulnerability microsite for the era in which every bug ships with a
name, a logo, a landing page and a press embargo — `log4shell`, `spring4shell`,
`text4shell`, `nginx2shell`, and whatever gets named tomorrow.

**Everything4Shell is satire.** There is no vulnerability, no CVE, no advisory
and no patch. Historical vulnerability names are referenced as commentary on
industry naming practice. Not affiliated with MITRE, the CVE Program, NIST,
FIRST, CISA, the Apache Software Foundation, or any vendor.

## What's on the site

| Section | What it does |
|---|---|
| Hero advisory | CVSS 11.0 / 10, with a severity vector made of marketing fields |
| Am I affected? | A six-checkbox triage flow. Every path ends in `AFFECTED` |
| The Naming Engine | Type a technology, get a brand, a hype score, domain status and a ready-to-send press release |
| The Taxonomy | The seven approved suffix families, with prior art and logo requirements |
| Severity vs. Hype | A chart of published CVSS scores against a completely fabricated Hype Index |
| Timeline | Heartbleed (2014) through to total naming saturation (2026) |
| Responsible Naming Disclosure | The 90-day process, where day 0 is buying the domain |
| Press kit | Wordmark, brand colors, pronunciation, boilerplate |

## Running it locally

Static files, no build step, no dependencies:

```sh
python3 -m http.server 8000
# http://localhost:8000
```

## Layout

```
index.html            the whole site
404.html              40(4)Shell
assets/css/style.css  dark advisory-microsite theme
assets/js/app.js      triage quiz, naming engine, chart
assets/img/           wordmark, favicon, social preview
CNAME                 everything4shell.com
```

The chart is hand-built SVG — grouped horizontal bars, hover tooltips, keyboard
focus per row, and a data-table view for anyone who would rather read the
numbers. Colors are checked for color-vision deficiency separation against the
dark surface.

## Deployment

GitHub Pages serves `main` from the repository root. `CNAME` binds the custom
domain; DNS is the four GitHub Pages apex A records plus a `www` CNAME. See
[DNS.md](DNS.md) for the exact GoDaddy settings.

## License

MIT — see [LICENSE](LICENSE). Use the names. Verify the bug first.
