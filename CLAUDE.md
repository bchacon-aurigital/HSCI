# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application called "3bahias-monitor" that serves as a water system monitoring platform for HSCI (Hydraulic Systems Control and Infrastructure). The application monitors water infrastructure including tanks, pumps, wells, and valves in real-time through Firebase integration.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Core Structure
- **Next.js App Router**: Uses `src/app/` directory structure
- **Static Export**: Configured for static site generation (`output: 'export'`)
- **TypeScript**: Strict mode disabled for flexibility
- **Tailwind CSS**: Utility-first styling with custom configuration

### Key Components
- **WaterSystemColumns**: Main dashboard component managing device groups and login
- **WaterSystemDebugger**: Debug/testing interface for system diagnostics
- **Device Indicators**: Specialized components for tanks, pumps, wells, and valves
- **Multi-Device Cards**: Handles grouped device displays

### Data Management
- **Firebase Integration**: Real-time data from Firebase Realtime Database
- **Device Configuration**: Multiple config files (devicesConfig.ts, devicesConfig2.ts, etc.)
- **Custom Hooks**: Modular data fetching and state management
  - `useDeviceData`: Main data hook supporting both individual and aggregated data
  - `useAggregatedData`: Handles grouped device data
  - `useIndividualDeviceData`: Manages single device data
  - `useDeviceGroups`: Organizes devices by groups

### Device Types
- **tank**: Water storage tanks with level monitoring
- **pump**: Water pumps with operational status
- **well**: Water wells with pump integration
- **valve**: Control valves with multiple states
- **multi**: Grouped devices for complex systems

### Data Flow
1. Login with ASADA code → loads specific device configuration
2. Device data fetched from Firebase URLs or aggregated endpoints
3. Real-time updates through polling or WebSocket connections
4. Visual indicators update based on device states and thresholds

## Key Features

- **Real-time Monitoring**: Live data updates for water infrastructure
- **Multi-ASADA Support**: Dynamic device loading based on login codes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Debug Tools**: Built-in debugging interface for system diagnostics
- **Alert System**: Visual indicators for device warnings and errors

## Development Notes

- **TypeScript**: Strict mode is disabled (`"strict": false`) for development flexibility
- **Font Optimization**: Uses Next.js font optimization with Geist fonts
- **Static Assets**: Images are unoptimized for static export compatibility
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports

## Component Patterns

- Use `'use client'` directive for client-side components
- Implement proper loading states and error handling
- Follow the existing device indicator pattern for new device types
- Use the custom hooks for data fetching to maintain consistency

## Reset Functionality

### Current Implementation
- **Location**: Available in MultiDeviceCard for groups named "BOMBA1"
- **Endpoint**: `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/PRUEBA/RESETAURI.json`
- **Flow**: Consultar Reset → Show State (0/1) → Toggle Value → Query Again
- **Components**: 
  - `ResetButton.tsx` - Main reset component with state management
  - `firebaseWrite.ts` - Firebase read/write utilities

### UI Behavior
- Button appears in CardHeader between group name and "X/X en operación" indicator
- For "BOMBA1" groups: Title is hidden to save space, only button and operation status shown
- **Toggle Logic**: 
  - If current value is 0 → Button shows "Cambiar a 1" (green)
  - If current value is 1 → Button shows "Cambiar a 0" (red)
- **States**: Idle (blue "Consultar Reset") → Showing (green/red "Cambiar a X") → Back to Idle

### Key Functions
- `queryResetStatus()` - Reads current reset value from Firebase
- `toggleResetValue(currentValue)` - Writes opposite value (0→1 or 1→0)
- Static deployment compatible (client-side Firebase calls)

### Scaling for Other ASADAs
To add reset functionality to other groups:
1. Update `isBOMBA1Group` condition in `MultiDeviceCard.tsx` 
2. Configure appropriate Firebase endpoint in `firebaseWrite.ts`
3. Adjust group name conditions as needed

**Examples for future implementation:**
- San Rafael: "Ojo de Agua" group with 3-pump subgroup
- Alajuela Municipal: "Rio Segundo" → "Bomba rio Segundo" subgroup