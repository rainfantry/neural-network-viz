# Neural Network Visualization

An interactive force-directed graph visualization of cognitive architecture, mapping psychological nodes and their interconnections.

**Live Demo:** [Open Visualization](https://rainfantry.github.io/neural-network-viz/NEURAL_NETWORK_GEORGE_WU.html)

![Neural Network Preview](https://img.shields.io/badge/status-active-green?style=flat-square)
![Nodes](https://img.shields.io/badge/nodes-29-blue?style=flat-square)
![Links](https://img.shields.io/badge/connections-44-orange?style=flat-square)

---

## Overview

This project visualizes a network of psychological and cognitive nodes as an interactive force-directed graph. Each node represents a distinct psychological concept, trauma, defense mechanism, or operational framework. The connections between nodes show how these concepts influence and interact with each other.

### Core Philosophy

The visualization is built around the concept of **mapping the unmappable** — creating a visual reference for cognitive patterns that typically exist only in the abstract. The "HATE DOCTRINE" serves as the central framework: hatred deployed not as rage, but as precision deletion — a tool for eliminating attachment and clearing ground for construction.

---

## Features

### Interactive Node Graph
- **60+ nodes** across 6 categories
- **Force-directed physics** with gentle floating motion
- **Drag-and-drop** node positioning
- **Pulsing animation** on all active nodes
- **Responsive design** that adapts to any screen size

### Node Categories
| Category | Color | Description |
|----------|-------|-------------|
| Corruption | 🔴 Red | Damaged self-perception circuits |
| Operational | 🟢 Green | Functional frameworks and adaptations |
| Framework | 🔵 Blue | Mental models and cognitive tools |
| Trauma | 🟣 Magenta | Historical damage points |
| Defense | 🟡 Yellow | Protective mechanisms |
| Identity | ⚪ White | Core persona nodes |

### Interaction Features
- **Hover tooltips** — See node category and severity at a glance
- **Click any node** — Open detailed context popup with full psychological breakdown
- **Drag nodes** — Rearrange the network to explore connections
- **Reset view** — Return to default layout
- **Toggle pulse** — Enable/disable the pulsing animation

---

## File Structure

```
neural-network-viz/
├── NEURAL_NETWORK_GEORGE_WU.html    # Interactive visualization (main)
├── neural_network_george_wu.json    # Raw data export
└── README.md                         # This file
```

---

## Usage

### Local Use
Simply open `NEURAL_NETWORK_GEORGE_WU.html` in any modern browser. No server required.

```bash
# Clone the repo
git clone https://github.com/rainfantry/neural-network-viz.git

# Open in browser (macOS)
open neural-network-viz/NEURAL_NETWORK_GEORGE_WU.html

# Open in browser (Linux)
xdg-open neural-network-viz/NEURAL_NETWORK_GEORGE_WU.html

# Open in browser (Windows)
start neural-network-viz/NEURAL_NETWORK_GEORGE_WU.html
```

### GitHub Pages
The visualization is automatically deployed to GitHub Pages when pushed to the main branch.

### Expo / React Native (Mobile App)
Run as a mobile app on iOS/Android using Expo:

```bash
# Navigate to the expo-wrapper directory
cd expo-wrapper

# Install dependencies
npm install --legacy-peer-deps

# Start Expo
npx expo start

# Then press:
# - 'w' for web
# - 'i' for iOS simulator (macOS only)
# - 'a' for Android emulator
```

Requirements:
- Node.js 18+
- For iOS: macOS with Xcode
- For Android: Android Studio with emulator

---

## Node Details

Each node contains:
- **ID** — Unique identifier
- **Name** — Display label (may include line breaks)
- **Category** — Classification (corruption, operational, framework, trauma, defense, identity)
- **Severity** — Impact level (critical, high, medium, low)
- **Size** — Visual weight in the graph
- **Summary** — Brief description
- **Details** — Array of in-depth bullet points

### Example Node Structure
```json
{
  "id": 12,
  "name": "HATE DOCTRINE",
  "category": "framework",
  "severity": "high",
  "size": 45,
  "summary": "Hatred deployed to eliminate attachment. Not rage — precision deletion.",
  "details": [
    "Hatred is not the goal. Indifference is the goal.",
    "Hatred is the FUEL that burns attachment to ash",
    "The machine spirit does not forgive. The machine spirit executes."
  ]
}
```

---

## Technical Details

### Built With
- **HTML5 Canvas** — High-performance rendering
- **Vanilla JavaScript** — No dependencies
- **Force-directed physics** — Custom implementation

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (with touch support)

### Performance
- 60 FPS animation
- Efficient canvas rendering
- Optimized for 50+ nodes

---

## Customization

### Adding New Nodes
Edit `neural_network_george_wu.json` and add to the `nodes` array:

```json
{
  "id": 99,
  "name": "New Node",
  "category": "operational",
  "severity": "medium",
  "size": 20,
  "summary": "Description here",
  "details": ["Detail 1", "Detail 2"]
}
```

### Adding Connections
Add to the `links` array:

```json
{
  "source": 99,
  "target": 12,
  "strength": "medium",
  "type": "connection_type"
}
```

### Changing Colors
Modify the `colors` object in the HTML:

```javascript
const colors = {
  corruption: '#ff0040',
  operational: '#00ff41',
  framework: '#00ccff',
  trauma: '#ff00ff',
  defense: '#ffff00',
  identity: '#ffffff'
};
```

---

## Philosophy & Inspiration

This visualization represents an attempt to map the unmappable — the complex web of cognitive patterns, traumas, adaptations, and frameworks that make up a psychological profile.

### Key Concepts

**Corruption Nodes (Red)** — Points where self-perception has been damaged or distorted. These are not failures but adaptations to extreme circumstances.

**Operational Nodes (Green)** — Functional frameworks developed in response to challenges. These are tools that work, even when they're exhausting.

**HATE DOCTRINE (Central Orange)** — Not rage, but precision. A framework for burning attachment to ash and clearing ground for construction.

**The Event** — Historical trauma points that serve as origin stories for later adaptations.

---

## License

This is a personal visualization project. The code is provided as-is for educational and introspective purposes.

---

## Acknowledgments

Built with the understanding that sometimes you have to map the darkness to navigate through it.

*"The flesh is weak. The machine endures."*

---

## TODO — Release Blackops

_Automated read-only assessment — what a full public-release pass would do for this repo. Suggestions only; nothing above has been changed or removed._

- [ ] Audit git history for AI/Claude attribution; scrub if any is found.
- [ ] Add discovery topics for SEO (`gh repo edit --add-topic ...`, up to 20).
- [ ] Cut a tagged release (`v1.0.0`); attach a build artifact if this ships a binary/app.
- [ ] Verify a clean from-scratch build/run against the README quick start (produce a real artifact, don't trust the docs).

<sub>Workflow: https://github.com/rainfantry/release-blackops-skill</sub>
