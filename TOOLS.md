# Tools catalogue

The swiss army knife part of 1000110.xyz: many small tools, one simple site. This file is the idea list and the build order for Phase 3 in `TASKS.md`. Pick the first unchecked tool unless told otherwise.

## Principles
- **Client-side only.** Nothing is uploaded. Privacy is a feature and it keeps the server static.
- **Zero bloat.** Plain TypeScript first. Any runtime dependency needs the user's OK (see "Dependency gate").
- **One registry.** Every tool is a small module (`id`, `title`, `category`, `run`, optional UI). `/tools/` lists them like `ls tools/`; `site.ts` and `vite.config.js` stay small. Details are decided in the first task below, not here.
- **Same look.** `renderPage`, Gruvbox variables, phone first (check 360px and 390px), keyboard friendly. A `/` or `Ctrl-K` command palette comes almost free once the registry exists.
- **Shareable state.** Where it makes sense, tool input lives in the URL hash so a result can be linked.

Tags: **[T]** plain TypeScript, **[API]** browser API, **[LIB]** needs a library (approval), **[SRV]** needs a server or third party.

## Dependency gate
Ask the user before adding any of these. Group them on one "media lab" page so the cost is paid once and never touches the other tools.
- `ffmpeg.wasm` for audio/video: core is about 32 MB, lazy-load it; multi-threading needs cross-origin isolation headers (COOP/COEP) on nginx; phones have memory limits.
- A PDF library (merge, split, text to PDF), a HEIC decoder, a ZIP library, a YAML/TOML/XML parser, a SQL formatter, bcrypt.

## Not planned
- **YouTube to MP3.** Needs a server that downloads from YouTube: breaks their ToS, copyright and takedown risk, gets blocked and abused. The legal version is "extract audio from a video file you drop in" (media lab).
- Whois, ping, traceroute, SSL checker, currency rates: need a server or a third-party API and attract abuse. Revisit after the admin/backend work (Phase 6a).

## First ten (build order)
Cheap, popular, no dependency.
- [ ] 0. Registry + `/tools/` listing + one tool page shape (plan shown in the terminal first)
- [ ] 1. Encode / decode playground: binary, hex, Base64, ROT13, URL, HTML entities, Morse [T]
- [ ] 2. Hash generator: MD5, SHA-1/256/512, HMAC [API]
- [ ] 3. Password and passphrase generator with entropy meter [API]
- [ ] 4. JSON formatter, validator, minifier [T]
- [ ] 5. IP range / CIDR / subnet calculator, IPv4 and IPv6 [T]
- [ ] 6. Unix timestamp and time zone converter [API]
- [ ] 7. Regex tester with explanation [T]
- [ ] 8. Color converter (HEX, RGB, HSL) and contrast checker [T]
- [ ] 9. Case converter and text counter [T]
- [ ] 10. Diff checker [T]

Existing Phase 3 items map here: playground = 1, JSON formatter = 4, scratchpad = Writing / life below. Image to ASCII / dither studio and the fluid dynamics experiment stay in `TASKS.md`.

## Encode / decode / crypto
- [ ] Caesar / Vigenere / Atbash / XOR cipher tool [T]
- [ ] JWT decoder [T]
- [ ] UUID / ULID / NanoID generator [API]
- [ ] AES encrypt/decrypt with a passphrase [API]
- [ ] Text to binary "hidden message" maker, tied to the binary footers [T]
- [ ] Bcrypt hash and verify [LIB]

## Text
- [ ] Lorem ipsum generator [T]
- [ ] Slugify, remove duplicate lines, sort lines, find and replace [T]
- [ ] Markdown preview (reuses the blog's `renderMarkdown`) [T]
- [ ] Text to ASCII art (figlet-style) [T]
- [ ] Unicode inspector and fancy-text generator [T]
- [ ] Zalgo text, emoji picker [T]

## Dev
- [ ] JSON to YAML / CSV [T], YAML / TOML / XML converters [LIB]
- [ ] SQL formatter [LIB]
- [ ] Cron expression explainer [T]
- [ ] Chmod calculator [T]
- [ ] URL parser and query-string builder [T]
- [ ] HTTP status code reference [T]
- [ ] `.gitignore` generator and git cheat sheet [T]
- [ ] Number base converter (bin, oct, dec, hex) [T]
- [ ] CSS tools: gradient, box-shadow, `clamp()` calculator [T]
- [ ] Escape / unescape strings [T]
- [ ] HTML / CSS / JS minifier [T]
- [ ] Color palette from an image [API]

## Network
- [ ] IPv4 <-> IPv6 and MAC address tools, OUI vendor lookup [T]
- [ ] Browser, screen and user agent info [API]
- [ ] "What is my IP" (nginx can return it) [SRV]
- [ ] DNS lookup via DNS-over-HTTPS [API]
- [ ] Port number reference [T]
- [ ] Wake-on-LAN packet builder [T]

## Images
- [ ] Image to ASCII / dither studio [API] (also in `TASKS.md` Phase 3)
- [ ] Compress, resize, convert PNG / JPG / WebP [API]
- [ ] Crop, rotate, flip [API]
- [ ] EXIF viewer and stripper [T]
- [ ] Favicon generator [API]
- [ ] QR code generator and reader [T] or [LIB]
- [ ] Image to Base64 [API]
- [ ] SVG optimizer, barcode generator, meme maker [T]
- [ ] HEIC to JPG [LIB]

## Audio / video (media lab, needs the dependency gate)
- [ ] Extract audio from a video file [LIB]
- [ ] Convert audio / video, trim, GIF maker [LIB]
- [ ] Audio recorder, tone generator, metronome, BPM tapper [API]
- [ ] Screen recorder, webcam and mic test [API]
- [ ] Text to speech [API]

## Files / documents
- [ ] CSV viewer and CSV to JSON [T]
- [ ] File hash (verify a download) [API]
- [ ] Hex viewer for any file [T]
- [ ] File-type sniffer (magic bytes) [T]
- [ ] PDF merge, split, rotate, image to PDF, text to PDF [LIB]
- [ ] ZIP / unzip in the browser [LIB]

## Math / units / time
- [ ] Unit converter, including data sizes and bits vs bytes [T]
- [ ] Calculator with history, percentage and tip [T]
- [ ] Programmer calculator (bit ops, two's complement) [T]
- [ ] Date difference, "days until", age, week number [T]
- [ ] Roman numerals, prime checker, number to words [T]
- [ ] Random number, dice, coin, picker wheel, team splitter [T]
- [ ] World clock, Pomodoro, stopwatch, countdown [T]
- [ ] Currency converter [SRV]

## Fun / charm
- [ ] Matrix rain, `cowsay`, fortune, fake BIOS boot screen [T]
- [ ] Typing speed test [T]
- [ ] Game of Life [T]
- [ ] ASCII table, Braille, semaphore, NATO phonetic [T]
- [ ] Pixel art editor, 8x8 font viewer [T]
- [ ] Hidden commands and easter eggs (Konami code) [T]

## Writing / life
- [ ] Scratchpad that autosaves to localStorage [T] (the Phase 3 scratchpad)
- [ ] Todo list, habit counter [T]
- [ ] Markdown notes with export [T]

## Research notes
- Competitors: IT-Tools (about 86 tools; categories Crypto, Converter, Web, Images & Videos, Development, Network, Math, Measurement, Text, Data), CyberChef (300+ chainable operations), DevToys (desktop), Omni Tools, DevUtils. No reliable traffic ranking was found; this list is based on their feature sets.
- ffmpeg.wasm tradeoffs (size, COOP/COEP headers, mobile memory, GPL codecs) are in the dependency gate above.
- Sources: alternativeto.net (CyberChef, DevToys, Omni Tools), linux-magazine.com IT-Tools article, shotstack.io ffmpeg.wasm guide, dev.to ffmpeg-in-the-browser posts.
