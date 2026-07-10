# Technical Handoff - 3bahias-monitor

## Project Overview

**3bahias-monitor** is a real-time water infrastructure monitoring platform for HCSI (Hydraulic Control Systems and Infrastructure). The application monitors ASADAs (Costa Rican community water associations) infrastructure including tanks, pumps, wells, and valves through Firebase Realtime Database integration.

**Production URL**: Static export deployed to CDN
**Repository**: HCSI (local)
**Framework**: Next.js 14 with App Router
**Deployment**: Static export (`output: 'export'`)

---

## Quick Start

```bash
# Development
npm run dev              # http://localhost:3000

# Production
npm run build            # Generates /out directory for static deployment
npm run start            # Preview production build

# Linting
npm run lint
```

**Note**: No testing framework configured. Manual testing via WaterSystemDebugger component.

---

## Technology Stack

### Core Framework
- **Next.js 14.2.14**: App Router architecture
- **React 18**: Client-side rendering only
- **TypeScript 5**: Strict mode disabled (`strict: false`)
- **Tailwind CSS 3.4**: Utility-first styling with custom animations

### Key Dependencies
- **Firebase**: Realtime Database (client-side only)
- **Chart.js 4.4.9** + **react-chartjs-2 5.3.0**: Data visualizations
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **next-pwa 5.6.0**: Progressive Web App support
- **shadcn/ui**: Component library

### Development Tools
- **Path Alias**: `@/*` → `./src/*`
- **Font Optimization**: Geist fonts (GeistVF.woff, GeistMonoVF.woff)
- **ESLint**: Next.js configuration

---

## Architecture Deep Dive

### Directory Structure

```
src/
├── app/
│   ├── data/                      # 14 device configuration files
│   │   ├── devicesConfig.ts       # ASADA code: '3bahias' (default)
│   │   ├── devicesConfig2.ts      # ASADA code: 'catsa2025'
│   │   ├── devicesConfig3.ts      # ASADA code: 'catsa2026'
│   │   ├── devicesConfig4.ts      # ASADA code: 'sanrafael'
│   │   ├── devicesConfig5.ts      # ASADA code: 'nosara'
│   │   ├── devicesConfig6.ts      # ASADA code: 'samara'
│   │   ├── devicesConfig7.ts      # ASADA code: 'orotina'
│   │   ├── devicesConfig8.ts      # ASADA code: 'coco'
│   │   ├── devicesConfig9.ts      # ASADA code: 'alajuela'
│   │   ├── devicesConfig10.ts     # ASADA code: 'acara'
│   │   ├── devicesConfig11.ts     # ASADA code: 'delicias'
│   │   ├── devicesConfig12.ts     # ASADA code: 'valverde'
│   │   ├── devicesConfig13.ts     # ASADA code: 'tarcoles'
│   │   └── devicesConfig14.ts     # ASADA code: 'potrero'
│   ├── types/
│   │   └── types.ts               # TypeScript interfaces
│   ├── fonts/                     # Geist font files
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main entry point
├── components/
│   ├── indicators/                # Device-specific visualizations
│   │   ├── WaterTankIndicator.tsx
│   │   ├── PumpIndicator.tsx
│   │   ├── WellIndicator.tsx
│   │   ├── ValveIndicator.tsx
│   │   ├── CentrifugalPumpIndicator.tsx
│   │   ├── PressureIndicator.tsx
│   │   └── FlowIndicator.tsx
│   ├── ui/                        # UI components
│   │   ├── WaterSystemColumns.tsx # Main dashboard
│   │   ├── MultiDeviceCard.tsx    # Grouped device display
│   │   ├── WaterTankCard.tsx      # Single tank display
│   │   ├── TabSelector.tsx        # Tab navigation
│   │   └── card.tsx               # Base card component
│   ├── ResetButton.tsx            # Firebase write functionality
│   ├── WaterSystemDebugger.tsx    # Debug interface
│   └── [other components]
├── hooks/                         # Custom React hooks
│   ├── useDeviceData.ts           # Main data hook (routing)
│   ├── useAggregatedData.ts       # Grouped device fetching
│   ├── useIndividualDeviceData.ts # Single device fetching
│   ├── useDeviceGroups.ts         # Device organization
│   └── dynamicDeviceLoader.ts     # Dynamic config loading
├── utils/
│   ├── firebaseWrite.ts           # Firebase read/write operations
│   ├── timeUtils.ts               # Time formatting utilities
│   └── [other utilities]
└── lib/                           # Shared libraries
```

---

## Data Flow & Architecture

### 1. Login Flow
```
User enters ASADA code (e.g., 'catsa2025')
    ↓
dynamicDeviceLoader.ts loads corresponding devicesConfigX.ts
    ↓
Devices are organized by groups via useDeviceGroups
    ↓
WaterSystemColumns renders columns with MultiDeviceCards
```

### 2. Data Fetching Strategy

**Hook Hierarchy**:
```
useDeviceData (router)
    ├─→ useIndividualDeviceData    # For devices with direct URLs
    │       └─→ Fetches from Firebase URL (e.g., https://...firebaseio.com/.../ALSH_3B.json)
    └─→ useAggregatedData          # For devices with keys
            └─→ Fetches from aggregated endpoint using ASADA code
                └─→ Returns data[key] or data[key][pumpKey]
```

**Data Resolution**:
- **Individual URL** (`device.url` exists): Direct Firebase fetch
- **Key-based** (`device.key` exists): Aggregated endpoint lookup
- **Real-time Mode**: `window.isRealTimeActive` enables live updates
- **Polling**: Client-side polling with configurable intervals

### 3. Device Types

| Type | Description | Key Properties |
|------|-------------|----------------|
| `tank` | Water storage tanks | `key`, level monitoring |
| `pump` | Water pumps | `pumpKey`, operational status |
| `well` | Water wells with pumps | `key`, `pumpKey`, combined monitoring |
| `valve` | Control valves | State management (open/closed/partial) |
| `pressure` | Pressure monitoring | `pressureRanges`, `pressureUnit` |
| `centrifugal` | Centrifugal pumps | Specialized pump type |
| `multi` | Grouped devices | `multiDevices[]` array |

### 4. Configuration Structure

**Device Interface** (src/app/types/types.ts):
```typescript
export interface Device {
  name: string;              // Display name
  url?: string;              // Direct Firebase URL (individual)
  key?: string;              // Aggregated endpoint key
  type: DeviceType;          // Device type
  pumpKey?: string;          // Pump identifier in aggregated data
  group: string;             // Group identifier for organization
  order: number;             // Display order within group
  historicoKey?: string;     // Historical data key
  databaseKey?: string;      // Database identifier
  pressureRanges?: PressureRanges;  // Pressure thresholds
  pressureUnit?: 'PSI' | 'L/s' | 'Bar';
  historicalConfig?: HistoricalConfig;
}
```

**Multi-Device Pattern**:
```typescript
{
  name: 'BOMBA1',
  type: 'multi',
  group: 'bomba-group',
  order: 1,
  multiDevices: [
    { name: 'Bomba Principal', type: 'centrifugal', key: 'MAIN', pumpKey: 'BOMBA1' },
    { name: 'Presión', type: 'pressure', key: 'MAIN', databaseKey: 'PRESION' },
    { name: 'Flujo', type: 'pressure', key: 'MAIN', databaseKey: 'FLUJO' }
  ]
}
```

---

## Firebase Integration

### Endpoints
- **Individual Devices**: `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/{KEY}.json`
- **Aggregated Data**: Loaded dynamically per ASADA configuration
- **Reset Endpoint**: `https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/PRUEBA/RESETAURI.json`

### Data Structure Example
```json
{
  "ALSH_3B": {
    "fecha": "2026-06-16 10:30:45",
    "NIVEL": 75.5,
    "ESTADO": 1
  },
  "MONTANA": {
    "BOMBAHE35": { "ESTADO": 1, "fecha": "..." },
    "BOMBAHE05": { "ESTADO": 0, "fecha": "..." }
  }
}
```

### Client-Side Only
All Firebase operations are **client-side** for static export compatibility:
- No server-side rendering (SSR)
- No API routes
- All components use `'use client'` directive

---

## Special Features

### 1. Reset Functionality

**Location**: [MultiDeviceCard.tsx](src/components/ui/MultiDeviceCard.tsx)
**Components**: [ResetButton.tsx](src/components/ResetButton.tsx), [firebaseWrite.ts](src/utils/firebaseWrite.ts)

**Current Implementation**:
- Available for groups named "BOMBA1"
- Endpoint: `/BASE_DATOS/PRUEBA/RESETAURI.json`
- Flow: Consultar Reset → Show State (0/1) → Toggle → Query Again

**UI Behavior**:
```typescript
// Button states
- Idle: "Consultar Reset" (blue)
- Showing 0: "Cambiar a 1" (green)
- Showing 1: "Cambiar a 0" (red)
```

**Toggle Logic**:
```typescript
// src/utils/firebaseWrite.ts
export async function queryResetStatus(): Promise<number>
export async function toggleResetValue(currentValue: number): Promise<void>
```

**Scaling Pattern**:
To add reset to other ASADAs:
1. Update condition in MultiDeviceCard: `isBOMBA1Group` check
2. Configure endpoint in firebaseWrite.ts
3. Adjust group name matching logic

### 2. Custom Branding System

**Location**: [WaterSystemColumns.tsx:308-324](src/components/ui/WaterSystemColumns.tsx#L308-L324)

**FluidSmart Logo**:
```typescript
{codigoAsada === 'catsa2025' ? (
  <img
    src="/public/assets/fluidsmart-logo.png"
    alt="FluidSmart Logo"
    className="h-14 w-auto mr-4 object-contain bg-white rounded-md"
  />
) : (
  // Default blue circular water drop icon
)}
```

**Pattern for New Logos**:
1. Add logo to `/public/assets/{asada}-logo.png`
2. Add conditional in WaterSystemColumns header
3. Maintain `h-14 mr-4` spacing

### 3. PWA Configuration

**File**: [next.config.mjs](next.config.mjs)

```javascript
withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: false,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.firebaseio\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-data',
        expiration: { maxEntries: 32, maxAgeSeconds: 300 } // 5 minutes
      }
    }
  ]
})
```

**Service Worker**: [public/sw.js](public/sw.js)

---

## Subsystem Architecture

### Subsystem Pattern (ASADA Alajuela Example)

Some ASADAs use **subsystems** for complex infrastructure:

```typescript
export const asadaData: AsadaData = {
  name: 'ASADA Alajuela Municipal',
  headerLabel: 'Centro de Control Acueducto Municipal',
  subsystems: [
    {
      name: 'san-rafael',
      displayName: 'San Rafael',
      devices: [
        { name: 'Tanque Ojo de Agua', key: 'OJODEAGUA', type: 'tank', ... },
        {
          name: 'Bomba Ojo de Agua',
          type: 'multi',
          multiDevices: [
            { name: 'Bomba 1', type: 'centrifugal', key: 'OJODEAGUA', pumpKey: 'BOMBA1' },
            { name: 'Bomba 2', type: 'centrifugal', key: 'OJODEAGUA', pumpKey: 'BOMBA2' },
            { name: 'Bomba 3', type: 'centrifugal', key: 'OJODEAGUA', pumpKey: 'BOMBA3' }
          ]
        }
      ]
    },
    {
      name: 'rio-segundo',
      displayName: 'Rio Segundo',
      devices: [ ... ]
    }
  ]
};
```

**Rendering**:
- WaterSystemColumns detects `subsystems` property
- Renders tabs with TabSelector
- Each subsystem displays as separate column group

---

## Historical Data Configuration

### HistoricalConfig Interface
```typescript
interface HistoricalConfig {
  baseUrl: string;              // Base Firebase URL
  authToken?: string;           // Optional authentication
  historicalDataPath: string;   // Path to historical data
  useSubfolders: boolean;       // Subfolder organization flag
}
```

### Usage Example
```typescript
{
  name: 'Pozo 4',
  key: 'POZO4',
  type: 'well',
  pumpKey: 'BOMBA',
  historicoKey: 'HISTORICO_POZO4',
  historicalConfig: {
    baseUrl: 'https://prueba-labview-default-rtdb.firebaseio.com',
    historicalDataPath: '/HISTORICOS/NOSARA',
    useSubfolders: true
  }
}
```

---

## State Management

### Global State (window object)
```typescript
window.isRealTimeActive?: boolean  // Real-time polling toggle
```

### Component State Patterns
- **Loading States**: All data hooks return `{ data, loading, error }`
- **Optimized Re-renders**: `useDeviceData` uses `useRef` to prevent unnecessary updates
- **Memoization**: Data comparison via JSON.stringify

---

## Styling & Theming

### Tailwind Configuration
- **Custom Animations**: Water level animations, pulse effects
- **Dark Theme**: CSS variables for dark mode support
- **Responsive Design**: Mobile-first approach

### Component Classes Pattern
```typescript
// Example from WaterTankIndicator
className="transition-all duration-1000 ease-in-out"
```

---

## Key Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| [WaterSystemColumns.tsx](src/components/ui/WaterSystemColumns.tsx) | Main dashboard, login, subsystem routing | ~500 |
| [MultiDeviceCard.tsx](src/components/ui/MultiDeviceCard.tsx) | Grouped device display, reset functionality | ~400 |
| [useDeviceData.ts](src/hooks/useDeviceData.ts) | Data fetching router | ~150 |
| [dynamicDeviceLoader.ts](src/hooks/dynamicDeviceLoader.ts) | Config loader by ASADA code | ~80 |
| [types.ts](src/app/types/types.ts) | TypeScript definitions | ~78 |
| [devicesConfig.ts](src/app/data/devicesConfig.ts) | 3bahias configuration | ~23 |

---

## Common Tasks

### Adding a New ASADA

1. **Create Configuration File**:
```typescript
// src/app/data/devicesConfig15.ts
import { AsadaData } from '../types/types';

export const asadaData: AsadaData = {
  name: 'ASADA Nueva',
  devices: [
    { name: 'Tanque 1', key: 'T1', type: 'tank', group: 'main', order: 1 }
  ]
};
```

2. **Register in Dynamic Loader**:
```typescript
// src/hooks/dynamicDeviceLoader.ts
case 'nueva':
  return (await import('@/app/data/devicesConfig15')).asadaData;
```

3. **Test**: Login with code 'nueva'

### Adding a New Device Type

1. **Create Indicator Component**:
```typescript
// src/components/indicators/NewDeviceIndicator.tsx
'use client';

export function NewDeviceIndicator({ data, loading }: Props) {
  // Implementation
}
```

2. **Update Types**:
```typescript
// src/app/types/types.ts
export type BaseDeviceType = '...' | 'newtype';
```

3. **Add to MultiDeviceCard**:
```typescript
case 'newtype':
  return <NewDeviceIndicator ... />;
```

### Adding Reset to Another Group

1. **Identify Group Name**: Check devicesConfig for target group
2. **Update Condition**:
```typescript
// MultiDeviceCard.tsx
const isBOMBA1Group = groupName === 'BOMBA1' || groupName === 'YOUR_GROUP_NAME';
```
3. **Configure Endpoint** (if different):
```typescript
// firebaseWrite.ts
const RESET_URL = determineResetUrl(groupName);
```

---

## Deployment

### Build Process
```bash
npm run build
```
**Output**: `/out` directory with static files

### Deployment Targets
- CDN (Vercel, Netlify, etc.)
- Static file hosting
- **Requirements**: HTTPS for service worker

### Environment Notes
- No environment variables required
- All Firebase URLs are hardcoded in device configs
- No backend API needed

---

## Debugging

### WaterSystemDebugger Component
**Access**: Available in UI (toggle visibility)

**Features**:
- Device data inspection
- Firebase connection testing
- Real-time data monitoring
- Error logging

### Console Logging
```typescript
// Key debug points
console.warn('No data found for key:', identifier); // useDeviceData.ts:70
```

### Common Issues

1. **No Data Displayed**:
   - Check Firebase URL in devicesConfig
   - Verify key/pumpKey spelling
   - Check browser console for CORS errors

2. **Reset Button Not Working**:
   - Verify group name matches condition
   - Check Firebase write permissions
   - Inspect network tab for failed requests

3. **Subsystems Not Showing**:
   - Ensure `subsystems` property exists (not `devices`)
   - Check TabSelector rendering logic

---

## Security Considerations

### Current Implementation
- **Client-Side Only**: No server-side secrets
- **Public Firebase URLs**: Read-only for most endpoints
- **Write Operations**: Limited to reset functionality

### Best Practices
- Firebase URLs are public but data is non-sensitive (infrastructure monitoring)
- Write operations should be protected by Firebase security rules
- CORS is configured at Firebase level

---

## Performance Optimization

### Current Optimizations
1. **Data Memoization**: useRef in useDeviceData prevents rerenders
2. **PWA Caching**: Firebase data cached for 5 minutes
3. **Static Export**: No server-side overhead
4. **Lazy Loading**: Dynamic imports for device configs

### Potential Improvements
- Implement React.memo for indicator components
- Add virtualization for large device lists
- Optimize image assets (logos, icons)

---

## TypeScript Configuration

### Key Settings
```json
{
  "strict": false,           // Disabled for development flexibility
  "noImplicitAny": false,
  "skipLibCheck": true
}
```

**Rationale**: Rapid prototyping prioritized over strict typing. Consider enabling for production hardening.

---

## Git Status (as of 2026-06-16)

**Current Branch**: main
**Modified Files**:
- `next.config.mjs` (PWA configuration)
- `public/sw.js` (Service worker)

**Recent Commits**:
- `086958a`: Fix pressure ranges for ASADA Las Delicias de Nosara
- `7ce5447`: Add detailed success cases for 5 HCSI projects
- `4b74391`: ASADA Las Delicias
- `3d89214`: Add well 4 data and historical records
- `55f20ae`: Add commercial documentation for WATA system

---

## Next Steps for New Developer

### Immediate Actions
1. Run `npm install` and `npm run dev`
2. Test login with multiple ASADA codes ('3bahias', 'catsa2025', 'alajuela')
3. Explore WaterSystemDebugger for data structure understanding
4. Review device configuration files in `src/app/data/`

### Key Concepts to Understand
1. **Data Flow**: How useDeviceData routes between individual and aggregated
2. **Multi-Device Pattern**: How complex systems are grouped
3. **Subsystem Architecture**: How Alajuela uses tabs for different zones
4. **Reset Functionality**: Client-side Firebase write operations

### Suggested Improvements
- Add unit tests (no framework currently)
- Enable TypeScript strict mode incrementally
- Implement error boundaries for better error handling
- Add authentication layer for write operations
- Create comprehensive component documentation

---

## Contact & Resources

- **CLAUDE.md**: Project-specific guidance for Claude Code
- **README.md**: Basic Next.js setup instructions
- **Firebase Console**: Access to real-time database (URL in configs)

---

## Glossary

- **ASADA**: Asociaciones Administradoras de Sistemas de Acueductos y Alcantarillados (Costa Rican community water associations)
- **HCSI**: Hydraulic Control Systems and Infrastructure (parent organization)
- **Multi-Device**: Grouped devices displayed in single card
- **Subsystem**: Organizational unit for complex ASADAs (e.g., geographic zones)
- **Reset Functionality**: Remote toggle for pump control systems
- **Aggregated Endpoint**: Single Firebase URL containing multiple device data
- **Individual URL**: Direct Firebase URL for single device

---

**Document Version**: 1.0
**Last Updated**: 2026-06-16
**Prepared for**: Claude Code (Next Instance)
