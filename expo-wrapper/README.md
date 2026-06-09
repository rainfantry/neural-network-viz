# Neural Network Viz - Expo Wrapper

Expo/React Native wrapper for the Neural Network visualization. Runs on iOS, Android, and Web.

## Quick Start

```bash
# From this directory
npx expo start
```

## Platform Commands

```bash
# Web (fastest)
npx expo start --web

# iOS (requires macOS + Xcode)
npx expo start --ios

# Android (requires Android Studio + emulator)
npx expo start --android
```

## Controls

- **Tap any node** - Opens detailed context modal with neural concept analysis
- **Drag nodes** - Reposition the network (desktop only)
- **Close modal** - Tap outside or tap Close button

## Features

- 29 psychological/cognitive nodes mapped
- 6 categories: Corruption, Operational, Framework, Trauma, Defense, Identity
- Interactive force-directed graph
- Click for detailed analysis of each concept
- Mobile-optimized touch interface
- Dark terminal aesthetic

## Technical

The visualization is embedded as an inline HTML WebView with a custom canvas-based force-directed graph. All node data and rendering logic is self-contained in `App.js`.
