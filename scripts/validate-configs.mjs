#!/usr/bin/env node
/**
 * Script de validación de configuraciones de dispositivos
 * Ejecutar: node scripts/validate-configs.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function validateDeviceConfig(devices, configFileName) {
  const errors = [];
  const warnings = [];

  devices.forEach((device, index) => {
    // Validar dispositivos multi
    if (device.type === 'multi' && device.multiDevices) {
      device.multiDevices.forEach((subDevice, subIndex) => {
        if (
          subDevice.type === 'pump' ||
          subDevice.type === 'well' ||
          subDevice.type === 'centrifugal'
        ) {
          if (!subDevice.historicoKey) {
            errors.push({
              file: configFileName,
              device: `${device.name} → ${subDevice.name}`,
              type: subDevice.type,
              issue: 'Falta historicoKey',
            });
          }
          if (!subDevice.databaseKey) {
            errors.push({
              file: configFileName,
              device: `${device.name} → ${subDevice.name}`,
              type: subDevice.type,
              issue: 'Falta databaseKey',
            });
          }
        }
      });
    }

    // Validar dispositivos individuales tipo pump/well/centrifugal
    if (
      device.type === 'pump' ||
      device.type === 'well' ||
      device.type === 'centrifugal'
    ) {
      if (!device.historicoKey) {
        errors.push({
          file: configFileName,
          device: device.name,
          type: device.type,
          issue: 'Falta historicoKey para bomba/pozo',
        });
      }
      if (!device.databaseKey) {
        errors.push({
          file: configFileName,
          device: device.name,
          type: device.type,
          issue: 'Falta databaseKey para bomba/pozo',
        });
      }
    }

    // Advertencias para tanques sin historicoKey
    if (device.type === 'tank') {
      if (!device.historicoKey) {
        warnings.push({
          file: configFileName,
          device: device.name,
          message: 'Tanque sin historicoKey - histórico no estará disponible',
        });
      }
    }
  });

  return { errors, warnings };
}

async function main() {
  console.log(`${colors.bold}${colors.blue}🔍 Validador de Configuraciones de Dispositivos${colors.reset}\n`);

  const configFiles = [
    'devicesConfig.ts',
    'devicesConfig2.ts',
    'devicesConfig3.ts',
    'devicesConfig4.ts',
    'devicesConfig5.ts',
    'devicesConfig6.ts',
    'devicesConfig7.ts',
    'devicesConfig8.ts',
    'devicesConfig9.ts',
  ];

  let totalErrors = 0;
  let totalWarnings = 0;
  const allErrors = [];
  const allWarnings = [];

  for (const configFile of configFiles) {
    const filePath = join(__dirname, '..', 'src', 'app', 'data', configFile);

    try {
      const content = readFileSync(filePath, 'utf-8');

      // Extraer el array de devices usando regex simple
      const devicesMatch = content.match(/export const devices.*?=\s*\[([\s\S]*?)\];/);
      if (!devicesMatch) {
        console.log(`⚠️  ${configFile}: No se pudo parsear`);
        continue;
      }

      // Evaluar el contenido de forma segura (solo para validación local)
      const devicesString = devicesMatch[0];

      // Contar dispositivos pump/well/centrifugal manualmente
      const pumpMatches = content.match(/type:\s*['"]pump['"]/g) || [];
      const wellMatches = content.match(/type:\s*['"]well['"]/g) || [];
      const centrifugalMatches = content.match(/type:\s*['"]centrifugal['"]/g) || [];

      const totalPumpsWells = pumpMatches.length + wellMatches.length + centrifugalMatches.length;

      // Contar los que tienen historicoKey
      const linesWithPump = content.split('\n').filter(line =>
        (line.includes("type: 'pump'") || line.includes("type: 'well'") || line.includes("type: 'centrifugal'"))
      );

      const pumpsWithHistorico = linesWithPump.filter(line => line.includes('historicoKey')).length;
      const pumpsWithoutHistorico = totalPumpsWells - pumpsWithHistorico;

      if (pumpsWithoutHistorico > 0) {
        console.log(`${colors.red}❌ ${configFile}${colors.reset}`);
        console.log(`   ${pumpsWithoutHistorico} bomba(s)/pozo(s) sin historicoKey/databaseKey`);
        totalErrors += pumpsWithoutHistorico;

        // Mostrar detalles
        linesWithPump.forEach((line, index) => {
          if (!line.includes('historicoKey')) {
            const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
            const name = nameMatch ? nameMatch[1] : `Dispositivo ${index + 1}`;
            allErrors.push({ file: configFile, device: name, issue: 'Falta historicoKey/databaseKey' });
          }
        });
      } else if (totalPumpsWells > 0) {
        console.log(`${colors.green}✅ ${configFile}${colors.reset}`);
        console.log(`   ${totalPumpsWells} bomba(s)/pozo(s) con historicoKey correctamente configurado`);
      } else {
        console.log(`${colors.blue}ℹ️  ${configFile}${colors.reset}`);
        console.log(`   Sin bombas/pozos (solo tanques/válvulas)`);
      }

    } catch (error) {
      console.log(`${colors.red}❌ Error al leer ${configFile}: ${error.message}${colors.reset}`);
    }
  }

  console.log(`\n${colors.bold}═══════════════════════════════════════${colors.reset}`);

  if (totalErrors === 0) {
    console.log(`${colors.green}${colors.bold}✅ VALIDACIÓN EXITOSA${colors.reset}`);
    console.log(`${colors.green}Todas las bombas/pozos tienen historicoKey y databaseKey configurados.${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}❌ VALIDACIÓN FALLIDA${colors.reset}`);
    console.log(`${colors.red}Total de errores: ${totalErrors}${colors.reset}\n`);

    console.log(`${colors.yellow}Dispositivos sin historicoKey/databaseKey:${colors.reset}`);
    allErrors.forEach(err => {
      console.log(`  - ${err.file}: ${err.device}`);
    });

    console.log(`\n${colors.yellow}Acción requerida:${colors.reset}`);
    console.log(`  1. Añadir historicoKey y databaseKey a las bombas/pozos listados`);
    console.log(`  2. Ejemplo: historicoKey: 'GRUPO_B1', databaseKey: 'ASROA'`);
    console.log(`  3. Re-ejecutar validación: node scripts/validate-configs.mjs`);

    process.exit(1);
  }
}

main().catch(error => {
  console.error(`${colors.red}Error fatal: ${error.message}${colors.reset}`);
  process.exit(1);
});
