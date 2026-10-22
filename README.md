# Gamacraft

A small block world you can play in your browser while Claude works. Walk around, break and place blocks, and build with whoever else is online. Nothing to install and no account needed.

**Play:** https://alexandermacscott-del.github.io/GamaCraft/

| Key | Does |
| --- | --- |
| WASD | walk (Shift to sprint) |
| Space | jump |
| Mouse | look around |
| Left / right click | break / place a block |
| 1–9 or mouse wheel | pick a block |
| Esc | menu |

Players connect straight to each other through public relays, so there's no game server. Everyone who opens the link joins the same world. Your builds are saved in your browser and handed to whoever joins while you're online.

## Play button for Claude Code

This repository is also a Claude Code plugin. Once it's installed, Gamacraft opens in your browser by itself when Claude starts working (at most once every 20 minutes), and a **Play Gamacraft** link shows above your prompt while Claude works.

- `/play` opens the game right now
- `/play off` stops it opening by itself
- `/play on` turns that back on

At the prompt of a Claude Code session:

```
/plugin install gamacraft --marketplace alexandermacscott-del/GamaCraft
```

Answer `y` to add the marketplace, then pick a scope.

From a shell:

```
claude plugin install gamacraft --marketplace alexandermacscott-del/GamaCraft
```
