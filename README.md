# SE Project Hub – InnoFest 2026 Games

Two quick booth games that explain **SE Project Hub**, our senior project. It's a web platform where students submit projects, advisors review and grade them with rubrics, and coordinators manage courses, rosters and reports.

School of Applied Digital Technology, Mae Fah Luang University.

- **Match the Pairs! / จับคู่ให้ไว!**: peek at 10 cards for 3 seconds, then find all 5 pairs in 20 seconds.
- **Spin the Hub Wheel! / หมุนวงล้อ Hub!**: 3 spins, each one lands on a topic with a random question (or a free Bonus point).

Thai is the default language. The TH/EN switch in the top-right corner remembers the choice on each device.

Built with Vite, React, TypeScript, Tailwind CSS v4, framer-motion and canvas-confetti. It's a static site with no backend and no login.

## Run it on your computer

You need Node.js 20 or newer (`node -v` shows your version).

```bash
npm install       # first time only
npm run dev       # start the dev server
```

Open the address it prints, usually http://localhost:5173.

Other commands:

```bash
npm run build     # type-check and build the production site into dist/
npm run preview   # serve the built dist/ folder locally
npm run lint      # lint the code
```

## Test on your phone or tablet over Wi-Fi

1. Connect your computer and the phone to the **same Wi-Fi network**.
2. Start the dev server so it accepts connections from other devices:

   ```bash
   npm run dev -- --host
   ```

3. Vite prints a `Network:` line such as `http://192.168.1.23:5173/`. Type that address into the phone's browser.

If the phone can't connect:
- Allow Node through your computer's firewall. On macOS, choose "Allow" when it asks about incoming connections.
- Some university or guest Wi-Fi networks block devices from reaching each other. Use your phone's hotspot instead, with the computer joined to that hotspot.

## Deploy to Vercel

Vercel detects Vite automatically. The build command is `npm run build`, the output folder is `dist`, and you don't need a config file.

**Option A: import from GitHub (recommended)**

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new, sign in, and **Import** the repository.
3. Keep the detected settings (Framework preset: Vite) and click **Deploy**.

Every later `git push` to the main branch redeploys the site automatically.

**Option B: deploy from the terminal**

```bash
npx vercel          # first run: log in, link the project, create a preview deployment
npx vercel --prod   # publish to the production URL
```

## Booth checklist

- Open the site once on every booth device while you're online. The fonts come from Google Fonts. If the network drops, the games still work but use a fallback font.
- Turn the screen brightness up, and turn off auto-lock so the screen doesn't go dark between players.
- **Prize rules:** in Match the Pairs, a player wins by finding all 5 pairs within 20 seconds. In the Wheel, a player wins with a score of 2 or more out of 3. The winning screen shows a gold "You win a prize!" banner.
- Tap **SE Project Hub** (top left) at any time to return to the home screen for the next player.

## Project structure

```
src/
  i18n.ts              all Thai + English text, language provider (saved in localStorage)
  data.ts              game data: PAIRS, TOPICS, QS, timers and wheel weights
  motion.ts            shared framer-motion variants (page transition, stagger)
  art/                 drawn SVG artwork: <Avatar>, <Icon>, <Hubby> (no emoji anywhere)
  components/          Button, GlassCard, ResultScreen, Background, Confetti, LangToggle, ...
  screens/Home.tsx     home screen
  games/MemoryMatch.tsx   intro, play and result for Match the Pairs
  games/SpinWheel.tsx     play and result for Spin the Hub Wheel
public/favicon.svg     Hubby favicon
```

To change any wording, edit `src/i18n.ts`. To change the quiz questions, edit `src/data.ts`.
