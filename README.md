# Battlefield 6 Stats Tracker

A modern web application for tracking Battlefield 6 player statistics and browsing live servers.

## Features

- **Player Search** - Look up any BF6 player by exact name
- **Platform Support** - Filter by PC, PlayStation, Xbox, or Steam
- **Live Server Browser** - View active servers with player counts and maps
- **Recent Searches** - Quick access to previously searched players
- **Responsive Design** - Beautiful gradient UI inspired by tracker.gg

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- React Router v6
- Headless UI

## API

Powered by [GameTools.Network](https://api.gametools.network) API:

| Endpoint | Description |
|----------|-------------|
| `/bf6/stats/?name=` | Get player statistics |
| `/bf6/servers/` | List active servers |
| `/bf6/detailedserver/?name=` | Detailed server info |
| `/bf6/storecatalog/` | Get DLC catalog |
| `/bf6/gameevents/` | Current game events |

## Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=https://api.gametools.network" > .env

# Start dev server
npm run dev
```

## Usage

1. **Search for Players** - Enter exact player name (case-sensitive)
2. **Select Platform** - Choose specific platform or search all
3. **Browse Servers** - View live servers and player counts
4. **Recent Searches** - Click cached players for quick lookup

## Note

Player search requires exact name match. Future updates will include backend autocomplete database for partial name matching.

## License

MIT

---

## Security

Please refer to [SECURITY.md](SECURITY.md) for vulnerability reporting guidelines.

## Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## Author

Developed and maintained by **[Krishna Patil](https://github.com/kriss2012)**.
