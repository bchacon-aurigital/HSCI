# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application called "3bahias-monitor" that serves as a water system monitoring platform for HSCI (Hydraulic Systems Control and Infrastructure). The application monitors water infrastructure including tanks, pumps, wells, and valves in real-time through Firebase integration.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production (static export to `/out` directory)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Note**: No testing framework is currently configured. Manual testing is done through the WaterSystemDebugger component.

## Architecture

### Core Structure
- **Next.js App Router**: Uses `src/app/` directory structure with layout.tsx and page.tsx
- **Static Export**: Configured for static site generation (`output: 'export'`) with unoptimized images
- **TypeScript**: Strict mode disabled (`"strict": false`) for development flexibility
- **Tailwind CSS**: Utility-first styling with custom animations and dark theme variables
- **Dependencies**: Chart.js for visualizations, Radix UI components, Lucide React icons, shadcn/ui

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
1. Login with ASADA code → loads specific device configuration (`devicesConfig.ts`, `devicesConfig2.ts`, etc.)
2. Device data fetched from Firebase URLs or aggregated endpoints using custom hooks
3. Real-time updates through client-side polling (configurable real-time mode)
4. Visual indicators update based on device states and thresholds with custom animations

## Key Features

- **Real-time Monitoring**: Live data updates for water infrastructure
- **Multi-ASADA Support**: Dynamic device loading based on login codes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Debug Tools**: Built-in debugging interface for system diagnostics
- **Alert System**: Visual indicators for device warnings and errors
- **Custom Branding**: ASADA-specific logo display (FluidSmart logo for 'catsa2025')

## Development Notes

- **TypeScript**: Strict mode is disabled (`"strict": false`) for development flexibility
- **Font Optimization**: Uses Next.js font optimization with Geist fonts (GeistVF.woff, GeistMonoVF.woff)
- **Static Assets**: Images are unoptimized (`unoptimized: true`) for static export compatibility
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports
- **Build Output**: Static export generates files in `/out` directory for CDN deployment
- **Client-Side Only**: All Firebase operations are client-side for static deployment compatibility

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── data/              # Device configurations (devicesConfig.ts, devicesConfig2.ts, etc.)
│   ├── types/             # TypeScript type definitions
│   ├── fonts/             # Local Geist fonts
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── indicators/        # Device-specific indicators (PumpIndicator, WaterTankIndicator, etc.)
│   ├── ui/               # UI components (MultiDeviceCard, WaterSystemColumns, etc.)
│   └── [various components]
├── hooks/                 # Custom React hooks for data fetching and state management
├── lib/                  # Utility libraries
└── utils/                # Utility functions (Firebase write, time utils, etc.)
```

## Component Patterns

- Use `'use client'` directive for client-side components (required for Firebase and state management)
- Implement proper loading states and error handling in all components
- Follow the existing device indicator pattern for new device types (see `src/components/indicators/`)
- Use the custom hooks for data fetching to maintain consistency (`useDeviceData`, `useAggregatedData`, etc.)
- Utilize Tailwind's custom animations and dark theme CSS variables
- Structure components with clear separation: UI components in `src/components/ui/`, indicators in `src/components/indicators/`

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

## Custom Branding System

### FluidSmart Logo Implementation
- **Location**: Header section of WaterSystemColumns component
- **Condition**: Displays only when `codigoAsada === 'catsa2025'`
- **File**: `/public/assets/fluidsmart-logo.png`
- **Behavior**: 
  - When displayed: Replaces the default blue circular water drop icon
  - When not displayed: Shows standard blue circular background with water drop SVG
  - Maintains same height (h-14) and spacing as default icon
  - Uses white background with rounded corners for logo contrast

### Implementation Details
- **Component**: `src/components/ui/WaterSystemColumns.tsx:308-324`
- **Logic**: Conditional rendering using ternary operator
- **Classes**: `h-14 w-auto mr-4 object-contain bg-white rounded-md`
- **Accessibility**: Includes proper alt text "FluidSmart Logo"

### Adding New ASADA Logos
To add logos for other ASADAs:
1. Add logo file to `/public/assets/`
2. Update the conditional logic in WaterSystemColumns header
3. Follow the same pattern: replace blue icon when specific ASADA code is detected
4. Maintain consistent sizing and spacing (h-14, mr-4)