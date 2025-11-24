# Baby Log

A simple, calming web app for tracking newborn feeding and diaper changes. Perfect for parents who want to keep detailed records of their baby's activities without the complexity of larger apps.

## Features

### Feeding Tracking
- **Session-based timing**: Start and end a feeding session
- **Per-breast tracking**: Log time spent on each breast (left/right) independently
- **Live timers**: See elapsed seconds while feeding from each breast
- **Edit history**: Click any past feeding entry to adjust breast durations
- **Duration display**: Shows total time and breakdown (e.g., "23m · (12l + 11r)")

### Diaper Log
- **Flexible logging**: Select poop, pee, or both in a single entry
- **Visual indicators**: Shows what type of diaper change was logged
- **Quick entry**: One-click logging after selection

### Stats & History
- **24-hour overview**: Feeding count, poop count, and pee count for the last 24 hours
- **Activity log**: Chronological history of all entries with delete option
- **Formatted timestamps**: Entries show dates and times in your locale format

### Data Persistence
- **LocalStorage**: All data is saved locally in your browser, no server needed
- **Automatic saving**: Changes save instantly as you log
- **Persistent across sessions**: Data survives browser refreshes

## How to Use

1. **Open the app**: Simply open `index.html` in your web browser
2. **Log a feeding**:
   - Click "Start Feeding" to begin a session
   - Click "Start" on the left/right breast to begin timing
   - Click "End" when baby finishes that breast (duration is saved)
   - Click "End Session" when feeding is complete
3. **Log a diaper change**:
   - Click "Diaper" button
   - Toggle poop and/or pee options
   - Click "Save" to log
4. **View history**: Scroll down to see recent activity with timestamps
5. **Edit a feeding**: Click any feeding entry to adjust left/right breast durations
6. **Delete entries**: Hover over any entry and click the ✕ button

## Technology

- **Vue.js 3**: Reactive UI framework
- **Tailwind CSS**: Utility-first styling for a calm, clean design
- **LocalStorage**: Client-side data persistence
- **Vanilla JavaScript**: No build tools required

## Browser Compatibility

Works on any modern browser with LocalStorage support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## No Installation Required

This is a completely client-side app. Just open the HTML file in your browser—no server, no installation, no internet connection required.

## Data Privacy

All data is stored locally on your device using the browser's LocalStorage. Nothing is sent to any server.
