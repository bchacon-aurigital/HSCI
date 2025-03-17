"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { WaterTankIndicator } from './indicators/WaterTankIndicator';
import { PumpIndicator } from './indicators/PumpIndicator';
import { WellIndicator } from './indicators/WellIndicator';

const WaterSystemDebugger = () => {
  const [deviceType, setDeviceType] = useState('tank');
  const [statusValue, setStatusValue] = useState(1); // 0-3 for pumps/wells, 0-100 for tanks

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-gray-800 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Water System Indicator Debugger</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-gray-200 block mb-2">Device Type:</label>
              <div className="flex space-x-4">
                <button 
                  className={`px-4 py-2 rounded ${deviceType === 'tank' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setDeviceType('tank')}
                >
                  Tank
                </button>
                <button 
                  className={`px-4 py-2 rounded ${deviceType === 'pump' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setDeviceType('pump')}
                >
                  Pump
                </button>
                <button 
                  className={`px-4 py-2 rounded ${deviceType === 'well' ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setDeviceType('well')}
                >
                  Well
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-200 block mb-2">
                {deviceType === 'tank' ? 'Water Level (%)' : 'Status (0-3)'}:
              </label>
              <input 
                type="range" 
                min={deviceType === 'tank' ? 0 : 0} 
                max={deviceType === 'tank' ? 100 : 3} 
                step={deviceType === 'tank' ? 1 : 1}
                value={statusValue}
                onChange={(e) => setStatusValue(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-white mt-1">{statusValue}</div>
            </div>
            
            <div className="mt-4 bg-gray-700 p-4 rounded">
              <h3 className="text-lg font-medium text-gray-200 mb-2">Debugging Tips:</h3>
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                <li>Check if the correct component is imported</li>
                <li>Verify that the prop types match exactly</li>
                <li>For MultiDeviceCard, ensure <code>device.type</code> is correctly set</li>
                <li>Verify data structure from backend contains expected keys</li>
                <li>Check network response in browser console</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Preview</h2>
            <div className="flex justify-center">
              {deviceType === 'tank' && <WaterTankIndicator percentage={statusValue} />}
              {deviceType === 'pump' && <PumpIndicator status={statusValue} />}
              {deviceType === 'well' && <WellIndicator status={statusValue} />}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-100">Tank Example</h2>
          </CardHeader>
          <CardContent>
            <WaterTankIndicator percentage={75} />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-100">Pump Example</h2>
          </CardHeader>
          <CardContent>
            <PumpIndicator status={1} />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-100">Well Example</h2>
          </CardHeader>
          <CardContent>
            <WellIndicator status={2} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterSystemDebugger;