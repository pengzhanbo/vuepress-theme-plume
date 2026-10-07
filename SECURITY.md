# Security Policy

## Supported Versions

| Version          | Supported          |
| ---------------- | ------------------ |
| >= 1.0.0-rc.210  | :white_check_mark: |
| < 1.0.0-rc.210   | :x:                |

Only the latest release line is supported. Please make sure you are on a
supported version before reporting an issue.

## Reporting a Vulnerability

We take security issues seriously. If you believe you have found a security
vulnerability, please report it **privately** and do **not** open a public issue
with technical details.

The preferred channel is GitHub's private vulnerability reporting:

- [Report a vulnerability](https://github.com/pengzhanbo/vuepress-theme-plume/security/advisories/new)

If you cannot use GitHub, you may [open an issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new?assignees=pengzhanbo&title=%5BSecurity%5D)
that only states that you have a security concern — **without any details** — and
we will arrange a private channel to follow up.

Please include as much of the following as possible:

- The affected package(s) and version(s).
- A description of the vulnerability and its impact.
- Reproduction steps, or a minimal proof of concept.
- Any known mitigations or workarounds.

### What to expect

- **Acknowledgement** within 3 business days.
- **Initial assessment** (severity, affected versions, planned fix) within 7 business days.
- **Fix and disclosure**: we aim to ship a patch as soon as possible and will
  coordinate a disclosure date with you. Credit will be given unless you prefer to
  remain anonymous.

Please give us a reasonable amount of time to release a fix before any public
disclosure.

## Encryption is not a security boundary

The theme ships an optional **client-side encryption** feature (`encrypt`). Because
VuePress produces a **static site**, the encrypted content and the password hashes
are shipped to the browser, so this feature is **obfuscation, not cryptographic
protection**:

- Encrypted content is not pre-rendered into HTML, but it is still recoverable from
  the built site assets.
- Unlocking state is stored per session in the browser and can be cleared or forged.
- Do **not** use this feature for content that must be kept strictly confidential.

Reports that only demonstrate that client-side encryption can be bypassed are
therefore **not** considered vulnerabilities. See the
[encryption documentation](https://theme-plume.vuejs.press/guide/features/encryption/)
for the user-facing limitations.
