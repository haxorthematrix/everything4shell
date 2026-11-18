# Pointing everything4shell.com at GitHub Pages (GoDaddy)

The repository publishes to `https://haxorthematrix.github.io/everything4shell/`.
The `CNAME` file in this repo tells GitHub to serve it as `everything4shell.com`.
DNS has to agree.

## 1. GoDaddy DNS records

GoDaddy → **My Products** → next to *everything4shell.com* click **DNS** →
**Manage DNS** (Domain Portfolio → the domain → *DNS* tab on newer accounts).

**Delete first:** the default parked `A` record for host `@` (it points at a
GoDaddy parking IP), and any `CNAME` for `www` pointing to
`@`/`parkingpage...`. Leave MX/TXT records alone.

**Then add these.** Type `@` exactly — GoDaddy shows it as the root domain.

| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | `185.199.108.153` | 600 |
| A | @ | `185.199.109.153` | 600 |
| A | @ | `185.199.110.153` | 600 |
| A | @ | `185.199.111.153` | 600 |
| AAAA | @ | `2606:50c0:8000::153` | 600 |
| AAAA | @ | `2606:50c0:8001::153` | 600 |
| AAAA | @ | `2606:50c0:8002::153` | 600 |
| AAAA | @ | `2606:50c0:8003::153` | 600 |
| CNAME | www | `haxorthematrix.github.io` | 600 |

All four A records are required — they are GitHub's anycast edge, not
alternatives. The AAAA records are optional but add IPv6. The `www` CNAME value
ends with a dot in some UIs; GoDaddy adds it for you.

Do **not** use GoDaddy's *Domain Forwarding* for this. Forwarding breaks the
HTTPS certificate issuance and serves the site from a GoDaddy redirect frame.

## 2. GitHub Pages settings

Repo → **Settings** → **Pages**:

- **Source:** Deploy from a branch → `main` → `/ (root)`
- **Custom domain:** `everything4shell.com` → Save
  (this is already set by the `CNAME` file in the repo; the field should
  populate itself)
- Wait for *DNS check successful*, then tick **Enforce HTTPS**

The HTTPS checkbox stays greyed out until GitHub finishes issuing the
Let's Encrypt certificate. That happens after DNS resolves correctly, usually
within 10–30 minutes, occasionally up to 24 hours.

## 3. Verify

```sh
dig +short everything4shell.com            # expect the four 185.199.x.153 addresses
dig +short www.everything4shell.com        # expect haxorthematrix.github.io
curl -sI https://everything4shell.com | head -1
```

GoDaddy's nameservers usually publish within a few minutes; propagation to
other resolvers can take an hour. If `dig` still shows a GoDaddy parking IP,
the old `A @` record was not deleted.

## Troubleshooting

- **"Domain does not resolve to the GitHub Pages server"** — the parked A record
  is still present, or you added `everything4shell.com` as the *Name* instead of `@`.
- **404 after DNS is correct** — Pages is building, or the source branch is not
  `main` / root.
- **Certificate errors** — remove the custom domain in Pages settings, save,
  re-add it, and let GitHub re-issue.
- **`CNAME` keeps disappearing** — something is force-pushing over it; the file
  must stay at the repository root.
