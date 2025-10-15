/**
 * Validador de configuraciones de dispositivos
 * Previene regresiones asegurando que todas las bombas/pozos tengan historicoKey/databaseKey
 */

import type { Device, MultiDevice } from '../app/types/types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  file: string;
  device: string;
  type: string;
  issue: string;
  line?: number;
}

export interface ValidationWarning {
  file: string;
  device: string;
  message: string;
}

/**
 * Valida que todos los dispositivos tipo pump/well/centrifugal tengan historicoKey y databaseKey
 */
export function validateHistoricalKeys(
  devices: (Device | MultiDevice)[],
  configFileName: string
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  devices.forEach((device, index) => {
    // Validar dispositivos multi
    if (device.type === 'multi' && 'multiDevices' in device && device.multiDevices) {
      device.multiDevices.forEach((subDevice: any, subIndex: number) => {
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
              line: undefined,
            });
          }
          if (!subDevice.databaseKey) {
            errors.push({
              file: configFileName,
              device: `${device.name} → ${subDevice.name}`,
              type: subDevice.type,
              issue: 'Falta databaseKey',
              line: undefined,
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
      if (!('historicoKey' in device) || !device.historicoKey) {
        errors.push({
          file: configFileName,
          device: device.name,
          type: device.type,
          issue: 'Falta historicoKey para bomba/pozo',
          line: undefined,
        });
      }
      if (!('databaseKey' in device) || !device.databaseKey) {
        errors.push({
          file: configFileName,
          device: device.name,
          type: device.type,
          issue: 'Falta databaseKey para bomba/pozo',
          line: undefined,
        });
      }
    }

    // Advertencias para tanques sin historicoKey (opcional pero recomendado)
    if (device.type === 'tank') {
      if (!('historicoKey' in device) || !device.historicoKey) {
        warnings.push({
          file: configFileName,
          device: device.name,
          message: 'Tanque sin historicoKey - histórico no estará disponible',
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valida consistencia de nomenclatura de historicoKey
 */
export function validateHistoricoKeyNaming(
  devices: (Device | MultiDevice)[],
  configFileName: string
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const historicoKeys = new Set<string>();

  devices.forEach((device) => {
    // Validar dispositivos multi
    if (device.type === 'multi' && 'multiDevices' in device && device.multiDevices) {
      device.multiDevices.forEach((subDevice: any) => {
        if (subDevice.historicoKey) {
          if (historicoKeys.has(subDevice.historicoKey)) {
            warnings.push({
              file: configFileName,
              device: subDevice.name,
              message: `historicoKey duplicado: "${subDevice.historicoKey}"`,
            });
          }
          historicoKeys.add(subDevice.historicoKey);

          // Validar formato (debe ser UPPERCASE con guiones bajos)
          if (!/^[A-Z0-9_]+$/.test(subDevice.historicoKey)) {
            warnings.push({
              file: configFileName,
              device: subDevice.name,
              message: `historicoKey "${subDevice.historicoKey}" no sigue convención (debe ser UPPERCASE con _)`,
            });
          }
        }
      });
    }

    // Validar dispositivos individuales
    if ('historicoKey' in device && device.historicoKey) {
      if (historicoKeys.has(device.historicoKey)) {
        warnings.push({
          file: configFileName,
          device: device.name,
          message: `historicoKey duplicado: "${device.historicoKey}"`,
        });
      }
      historicoKeys.add(device.historicoKey);

      // Validar formato
      if (!/^[A-Z0-9_]+$/.test(device.historicoKey)) {
        warnings.push({
          file: configFileName,
          device: device.name,
          message: `historicoKey "${device.historicoKey}" no sigue convención (debe ser UPPERCASE con _)`,
        });
      }
    }
  });

  return warnings;
}

/**
 * Función helper para generar reporte de validación
 */
export function generateValidationReport(
  results: Map<string, ValidationResult>,
  namingWarnings: Map<string, ValidationWarning[]>
): string {
  let report = '# Reporte de Validación de Configuraciones de Dispositivos\n\n';

  let totalErrors = 0;
  let totalWarnings = 0;

  results.forEach((result, file) => {
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  });

  namingWarnings.forEach((warnings) => {
    totalWarnings += warnings.length;
  });

  if (totalErrors === 0 && totalWarnings === 0) {
    report += '✅ **TODAS LAS VALIDACIONES PASARON**\n\n';
    report += 'No se encontraron errores ni advertencias.\n';
    return report;
  }

  report += `## Resumen\n\n`;
  report += `- **Errores críticos**: ${totalErrors}\n`;
  report += `- **Advertencias**: ${totalWarnings}\n\n`;

  if (totalErrors > 0) {
    report += `## ❌ Errores Críticos (${totalErrors})\n\n`;
    results.forEach((result, file) => {
      if (result.errors.length > 0) {
        report += `### ${file}\n\n`;
        result.errors.forEach((error) => {
          report += `- **${error.device}** (${error.type}): ${error.issue}\n`;
        });
        report += '\n';
      }
    });
  }

  if (totalWarnings > 0) {
    report += `## ⚠️ Advertencias (${totalWarnings})\n\n`;

    results.forEach((result, file) => {
      if (result.warnings.length > 0) {
        report += `### ${file}\n\n`;
        result.warnings.forEach((warning) => {
          report += `- **${warning.device}**: ${warning.message}\n`;
        });
        report += '\n';
      }
    });

    namingWarnings.forEach((warnings, file) => {
      if (warnings.length > 0) {
        report += `### ${file} (nomenclatura)\n\n`;
        warnings.forEach((warning) => {
          report += `- **${warning.device}**: ${warning.message}\n`;
        });
        report += '\n';
      }
    });
  }

  return report;
}

/**
 * Valida todos los archivos de configuración
 */
export async function validateAllConfigs(): Promise<{
  success: boolean;
  report: string;
}> {
  const results = new Map<string, ValidationResult>();
  const namingWarnings = new Map<string, ValidationWarning[]>();

  // Importar y validar cada config
  const configs = [
    { name: 'devicesConfig.ts', importPath: '../app/data/devicesConfig' },
    { name: 'devicesConfig2.ts', importPath: '../app/data/devicesConfig2' },
    { name: 'devicesConfig3.ts', importPath: '../app/data/devicesConfig3' },
    { name: 'devicesConfig4.ts', importPath: '../app/data/devicesConfig4' },
    { name: 'devicesConfig5.ts', importPath: '../app/data/devicesConfig5' },
    { name: 'devicesConfig6.ts', importPath: '../app/data/devicesConfig6' },
    { name: 'devicesConfig7.ts', importPath: '../app/data/devicesConfig7' },
    { name: 'devicesConfig8.ts', importPath: '../app/data/devicesConfig8' },
    { name: 'devicesConfig9.ts', importPath: '../app/data/devicesConfig9' },
  ];

  for (const config of configs) {
    try {
      const importedModule = await import(config.importPath);
      const devices = importedModule.devices;

      if (devices && Array.isArray(devices)) {
        const result = validateHistoricalKeys(devices, config.name);
        results.set(config.name, result);

        const namingWarns = validateHistoricoKeyNaming(devices, config.name);
        if (namingWarns.length > 0) {
          namingWarnings.set(config.name, namingWarns);
        }
      }
    } catch (error) {
      console.error(`Error al cargar ${config.name}:`, error);
    }
  }

  const report = generateValidationReport(results, namingWarnings);

  let hasErrors = false;
  results.forEach((result) => {
    if (!result.valid) hasErrors = true;
  });

  return {
    success: !hasErrors,
    report,
  };
}
