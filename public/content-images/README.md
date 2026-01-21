# Content Images

This folder contains images for the grid content cards.

## Naming Convention

Images are matched to cards using a **slugified version** of the card name.

### Slug Format
- Lowercase
- Spaces replaced with hyphens
- Special characters removed
- Example: "Power to the People" → `power-to-the-people`

### File Naming

For each card, create files with this pattern:
```
{slug}-{number}.{extension}
```

Examples:
- `power-to-the-people-1.jpg`
- `power-to-the-people-2.png`
- `quarantine-dreams-1.jpg`
- `dancing-monkey-1.jpg`
- `dancing-monkey-2.jpg`

### Supported Extensions
- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## Current Content Keys → Slugs

| Card Name | Slug |
|-----------|------|
| About | `about` |
| Companies | `companies` |
| Residency | `residency` |
| Grants | `grants` |
| Contributors | `contributors` |
| Quarantine Dreams | `quarantine-dreams` |
| Dancing Monkey | `dancing-monkey` |
| Power to the People | `power-to-the-people` |
| Experiments in Reincarnation | `experiments-in-reincarnation` |
| Made You Think | `made-you-think` |
| BGM | `bgm` |
| Awaken | `awaken` |
| Ikenga Wines | `ikenga-wines` |
| Kira | `kira` |
| Mount Lawrence | `mount-lawrence` |
| Fullstack Human | `fullstack-human` |
| Black Brick Project | `black-brick-project` |
| Double Zero | `double-zero` |
| Telepath | `telepath` |
| Ship By Friday | `ship-by-friday` |
| Etched | `etched` |
| Bot or Not | `bot-or-not` |
| Onwards And Beyond | `onwards-and-beyond` |
| Original music | `original-music` |
| Two Take Flight | `two-take-flight` |
| Lance Weiler | `lance-weiler` |

## Usage

Once you add images following this convention, the ContentCard component will automatically detect and display them.

Multiple images per card are supported and will be displayed in a gallery grid.
