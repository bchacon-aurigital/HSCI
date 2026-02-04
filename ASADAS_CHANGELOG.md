# Registro de ASADAs - Changelog

Este documento mantiene un registro histórico de todas las ASADAs agregadas al sistema de monitoreo HSCI, incluyendo fechas de implementación y códigos de acceso.

## Índice
- [Casos Recientes (Últimos 4 meses)](#casos-recientes-últimos-4-meses)
- [Historial Completo](#historial-completo)
- [Estadísticas](#estadísticas)

---

## Casos Recientes (Últimos 4 meses)

> Periodo: Octubre 2025 - Enero 2026

### Febrero 2026

#### `codigo1` - ASADA Los Sueños *(Reactivado)*
- **Fecha de Reactivación:** 2026-02-04
- **Archivo de Configuración:** `devicesConfig.ts`
- **Autor:** Aurigital
- **Notas:** Se descomentó el caso en `dynamicDeviceLoader.ts` para restaurar el acceso con código `codigo1`. Anteriormente fue comentado el 2025-07-10 (commit 2a67bac8).

---

### Enero 2026

#### `ACP2026` - ASADA Costa Pajaros
- **Fecha de Implementación:** 2026-01-09
- **Commit:** cf7cc611
- **Archivo de Configuración:** `devicesConfig11.ts`
- **Autor:** Aurigital
- **Notas:** Se corrigió el código de login en commit posterior el mismo día

---

### Diciembre 2025

#### `belen2025` - Municipalidad BELEN
- **Fecha de Implementación:** 2025-12-04
- **Commit:** cfb9df99
- **Archivo de Configuración:** `devicesConfig10.ts`
- **Autor:** bchacon-aurigital
- **Tipo:** Subsistemas (usa `subsystems` en lugar de `devices`)
- **Actualización:** 2026-01-12 - Se actualizó la implementación de subsistemas

---

### Noviembre 2025
*No se agregaron nuevas ASADAs en este mes*

---

### Octubre 2025

#### `sanmarcanda2025` - ASADA Sanmarcanda
- **Fecha de Implementación:** 2025-10-01
- **Commit:** 4a3915fc
- **Archivo de Configuración:** `devicesConfig9.ts`
- **Autor:** bchacon-aurigital

---

## Historial Completo

### Septiembre 2025

#### `zapotal2025` - Zapotal Beach Club
- **Fecha de Implementación:** 2025-09-29
- **Commit:** 0008d4f1
- **Archivo de Configuración:** `devicesConfig8.ts`
- **Autor:** bchacon-aurigital

#### `AQG2025` - ASADA Quebrado Ganado
- **Fecha de Implementación:** 2025-09-24
- **Commit:** e52f1c9d
- **Archivo de Configuración:** `devicesConfig7.ts`
- **Autor:** bchacon-aurigital
- **Tipo:** Subsistemas (usa `subsystems` en lugar de `devices`)
- **Actualización:** 2026-01-15 - Se actualizó la implementación de subsistemas

---

### Agosto 2025

#### `catsa2025` - Central Azucarera del Tempisque
- **Fecha de Implementación:** 2025-08-18
- **Commit:** 0990889b
- **Archivo de Configuración:** `devicesConfig6.ts`
- **Autor:** bchacon-aurigital
- **Características Especiales:**
  - 2025-08-19: Se agregó el logo de FluidSmart para esta ASADA (commit 7fabf87)

#### `coyol2025` - Hacienda el Coyol
- **Fecha de Implementación:** 2025-08-03
- **Commit:** 7f4e3168
- **Archivo de Configuración:** `devicesConfig5.ts`
- **Autor:** bchacon-aurigital

---

### Mayo 2025

#### `alajuela2025` - Acueducto Municipal Alajuela
- **Fecha de Implementación:** 2025-05-16
- **Commit:** 90365818
- **Archivo de Configuración:** `devicesConfig4.ts`
- **Autor:** bchacon-aurigital
- **Actualización:** 2025-05-19 - Se actualizó el nombre completo (commit c21fa8f)

#### `codigo2` - ASADA Control
- **Fecha de Implementación:** 2025-05-15
- **Commit:** d41355ce
- **Archivo de Configuración:** `devicesConfig3.ts`
- **Autor:** bchacon-aurigital

#### `asroa2537` - ASADA San Rafael
- **Fecha de Implementación:** 2025-05-15
- **Commit:** d41355ce
- **Archivo de Configuración:** `devicesConfig2.ts`
- **Autor:** bchacon-aurigital

---

### Casos Comentados

> No hay casos comentados actualmente. Todos los casos están activos.

---

## Estadísticas

### Por Año
- **2026:** 3 entradas (Febrero: 1 reactivación, Enero: 2)
- **2025:** 9 ASADAs
  - Diciembre: 1
  - Octubre: 1
  - Septiembre: 2
  - Agosto: 2
  - Mayo: 3

### Por Tipo
- **Devices (dispositivos estándar):** 9 ASADAs
- **Subsystems (subsistemas):** 2 ASADAs (AQG2025, belen2025)
- **Comentados:** 0

### Total Activo
**11 ASADAs** activas en el sistema

---

## Notas Técnicas

### Archivo de Referencia
- **Ubicación:** `src/hooks/dynamicDeviceLoader.ts`
- **Función Principal:** `loadDevicesForAsada(codigoAsada: string): Promise<AsadaData>`

### Estructura de Configuración
- Cada ASADA tiene su propio archivo de configuración: `devicesConfigN.ts` (donde N es el número)
- Las configuraciones se cargan dinámicamente usando imports asíncronos
- Dos tipos de retorno: `devices` para configuración estándar, `subsystems` para sistemas más complejos

### Proceso de Agregado
1. Crear archivo de configuración (`devicesConfigN.ts`)
2. Agregar caso al switch en `dynamicDeviceLoader.ts`
3. Asignar código de acceso único
4. Definir nombre de visualización

---

**Última actualización de este documento:** 2026-02-04
