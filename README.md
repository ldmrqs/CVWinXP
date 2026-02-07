# Retro PC Interactive Resume — Windows XP Emulation

An interactive portfolio site that emulates a classic **Windows XP** desktop inside a retro CRT monitor, built entirely from scratch. More than just a resume — it's a love letter to the early 2000s internet and the first PC I ever used.

![Preview](public/images/monitor/pcretro.png)

---

## About

This project reflects my love for retro tech aesthetics. The entire experience is designed to look and feel like booting up a beige CRT monitor running Windows XP — complete with scanline effects, a glowing screen, sound effects, and fully interactive desktop applications.

The wallpaper is a tribute to one of my favorite bands, and the overall design is inspired by my childhood memories of MSN, Orkut, and clickgames.com.br.

---

## Features

- **CRT Monitor** — a fully styled retro monitor with power button, LED indicators, scanlines, screen glow animation, and sticky notes
- **Windows XP Login Screen** — click your username to log in, with a fade transition
- **Internet Explorer** — opens a retro-themed resume site styled like a 2000s personal homepage (dark theme, skull GIFs, and all), with pages for about, skills, experience, projects, and contact
- **Notepad (Guestbook)** — visitors can leave messages that get sent via email through a backend API
- **Paint** — a working MS Paint clone with pencil, brush, eraser, fill bucket, line, rectangle tools, color palette, and brush sizes
- **Winamp** — a fully functional music player with a pixel-perfect Winamp 2.x skin, spectrum visualizer, playlist, shuffle/repeat, and transport controls
- **Trash (Recycle Bin)** — contains a hidden copy of DOOM that runs via Archive.org embed
- **Command Prompt** — a fake terminal with commands like `help`, `whoami`, `dir`, `ping`, `color`, `matrix` (rain effect), and hidden easter eggs
- **Taskbar** — functional taskbar with window management (minimize, restore, focus)
- **Clock** — live clock displayed in the taskbar
- **Sound Effects** — mouse click and keyboard typing sounds throughout the experience
- **Mobile Warning** — a message prompting users to switch to desktop for the full experience

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Build Tool | Vite |
| Backend | Node.js, Express |
| Email | EmailJS |
| Deployment | Hosted at [cv.ldmrqs.com](https://cv.ldmrqs.com) |

---

## Project Structure

```
├── index.html              # CRT monitor shell (parent page)
├── windowsxp.html          # Windows XP desktop (loaded in iframe)
├── resume/                 # Resume site pages (Internet Explorer content)
│   ├── index.html
│   ├── about.html
│   ├── skills.html
│   ├── experience.html
│   ├── projects.html
│   ├── contact.html
│   └── resume.js
├── src/
│   ├── css/
│   │   ├── pcretro.css     # CRT monitor styles
│   │   ├── windowsxp.css   # Windows XP desktop styles
│   │   └── resume.css      # Resume site styles (retro dark theme)
│   └── js/
│       ├── main.js          # Entry point (power, sounds, iframe setup)
│       ├── power.js         # Monitor/PC power toggle logic
│       ├── windows.js       # Window manager (create, drag, taskbar)
│       ├── desktop-icons.js # Desktop icon double-click handlers
│       ├── clock.js         # Taskbar clock
│       ├── winamp.js        # Winamp music player
│       ├── paint.js         # MS Paint clone
│       ├── doom.js          # DOOM embed
│       ├── terminal.js      # Command Prompt simulator
│       ├── guestbook.js     # Guestbook (Notepad) logic
│       └── api-config.js    # API URL configuration
├── server/
│   └── server.js            # Express API for guestbook emails
├── data/
│   └── resume-data.json     # All resume content (JSON)
├── public/                  # Static assets (images, sounds, music)
├── vite.config.js
└── package.json
```

---

## Getting Started

```bash
# install dependencies
npm install

# run dev server (frontend + backend)
npm run dev

# build for production
npm run build
```

---

## Inspirations

- The beige CRT monitors from the early 2000s
- [TurboWarp Windows XP Emulator](https://turbowarp.org/235298186/fullscreen) for design reference
- [Ste_16bit's retro PC project](https://ste16bit.com)
