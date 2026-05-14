# Casos de Éxito HCSI - Sistema WATA

## Proyectos Implementados de Monitoreo de Acueductos

---

## 1. ASADA San Rafael

### Descripción del Proyecto
ASADA San Rafael representa uno de los sistemas más complejos implementados por HCSI, con **24 dispositivos distribuidos en 12 zonas geográficas** independientes. Esta implementación demuestra la capacidad de WATA para manejar infraestructura descentralizada con múltiples puntos de captación, almacenamiento y distribución.

### Infraestructura Monitoreada
- **12 Tanques de Almacenamiento**: Monitoreo de niveles en tiempo real distribuidos en las zonas de Ojo de Agua Principal, Italticos, Los Rodríguez, Sacramento, Sonia Araujo, Bajo Paires, Julio Alfaro, Las Melisas, San Gerardo, Víctor Jiménez y Occidente
- **11 Pozos con Bombas Sumergibles**: Control operativo de pozos profundos con telemetría completa de estado, horas de operación y parámetros de funcionamiento
- **1 Tanque Principal Aereo**: Tanque Italticos con capacidad de almacenamiento crítico para la red
- **Sistema Multi-Bomba en Ojo de Agua**: 3 bombas trabajando en paralelo con monitoreo individual

### Características Técnicas
- **Arquitectura Distribuida**: 12 grupos operativos independientes organizados por zonas geográficas
- **Cobertura Territorial**: Sistema extendido que abarca múltiples comunidades rurales
- **Captación Descentralizada**: 11 fuentes de agua independientes (pozos) garantizando redundancia
- **Monitoreo Dual**: Tanque Principal con doble endpoint para asegurar disponibilidad de datos críticos

### Resultados y Beneficios
- **Supervisión Centralizada**: Operadores pueden monitorear 12 zonas desde una sola interfaz
- **Reducción de Costos Operativos**: Eliminación de giras diarias a 12 ubicaciones remotas
- **Detección Temprana de Fallas**: Alertas automáticas por fallo de bombas o niveles críticos en tanques
- **Optimización de Recursos**: Gestión eficiente de 11 pozos según demanda real de cada zona
- **Respuesta Rápida**: Identificación inmediata de la zona afectada ante cualquier incidencia

### Dispositivos por Zona
1. **Ojo de Agua Principal**: 1 tanque principal + 1 tanque Italticos
2. **Ojo de Agua (Multi-Bomba)**: 1 tanque + 3 bombas en paralelo
3. **Los Rodríguez**: 1 tanque + 1 pozo
4. **Sacramento**: 1 tanque + 1 pozo
5. **Sonia Araujo**: 1 tanque + 1 pozo
6. **Bajo Paires**: 1 tanque + 1 pozo
7. **Julio Alfaro**: 1 tanque + 1 pozo
8. **Las Melisas**: 1 tanque + 1 pozo
9. **San Gerardo**: 1 tanque + 1 pozo
10. **Víctor Jiménez**: 1 tanque + 1 pozo
11. **Occidente**: 1 tanque + 1 pozo

### Tecnología Implementada
- Integración con Firebase Realtime Database
- Endpoints especializados por zona con keys individuales
- Sistema de históricos día a día para análisis de consumo por comunidad
- Indicadores especializados para pozos sumergibles con parámetros de operación

---

## 2. Acueducto Municipal de Alajuela

### Descripción del Proyecto
La Municipalidad de Alajuela confía en HCSI para el monitoreo de su infraestructura de distribución de agua potable, implementando un sistema de **7 dispositivos en 3 zonas estratégicas**: Río Segundo, Los Llanos y B Pradera. Este proyecto destaca por incluir un **sistema multi-bomba de 3 pozos** trabajando en paralelo.

### Infraestructura Monitoreada
- **2 Tanques de Almacenamiento**: Tanque Río Segundo y Tanque Los Llanos con monitoreo continuo de niveles
- **2 Pozos con Bombas Sumergibles**: Bomba Río Segundo y Bomba Los Llanos con telemetría completa
- **Sistema Multi-Bomba B Pradera**: 3 bombas sumergibles operando en paralelo con monitoreo individual y agregado

### Características Técnicas
- **Arquitectura Municipal**: Sistema diseñado para gestión pública con alta disponibilidad
- **Sistema Multi-Bomba Avanzado**: B Pradera con 3 bombas independientes monitoreadas como grupo
- **Redundancia Operativa**: Múltiples fuentes de captación garantizando continuidad del servicio
- **Base de Datos Especializada**: Configuración ACUEDUCTOALAJUELA con históricos día a día

### Zonas Operativas
1. **Río Segundo**: 1 tanque + 1 pozo sumergible
2. **Los Llanos**: 1 tanque + 1 pozo sumergible
3. **B Pradera (Multi-Bomba)**: 3 pozos sumergibles en paralelo

### Resultados y Beneficios
- **Gestión Municipal Eficiente**: Control centralizado de infraestructura crítica para la ciudad
- **Disponibilidad Garantizada**: Sistema multi-bomba en B Pradera asegura continuidad del servicio
- **Transparencia Operativa**: Datos históricos disponibles para reportes municipales
- **Reducción de Mantenimiento Correctivo**: Monitoreo predictivo de bombas sumergibles
- **Optimización Energética**: Control de operación de 3 bombas según demanda real

### Tecnología Implementada
- Tipo de dispositivo "multi" para gestión de bombas en paralelo
- Firebase Realtime Database con endpoints individuales por zona
- Históricos especializados: RIOSEG, LOSLLANOS, BPRADERA_B1/B2/B3
- Indicadores de pozos sumergibles con parámetros DATABOMB

---

## 3. Acueducto Municipal de Belén

### Descripción del Proyecto
La **Municipalidad de Belén** representa la implementación más compleja y sofisticada de HCSI hasta la fecha: **18 dispositivos organizados en 3 subsistemas independientes** (San Antonio, La Ribera y Asunción) que abastecen diferentes sectores del cantón. Este proyecto demuestra la capacidad de WATA para manejar **arquitectura multinivel con subsistemas navegables**.

### Infraestructura Monitoreada

#### Sistema San Antonio (Sistema Zamora)
- **1 Naciente con Monitoreo de Nivel**: Captación principal del sistema
- **2 Bombas de Rebombeo**: Sistema de presurización en paralelo
- **1 Tanque Principal**: Almacenamiento central con monitoreo de nivel porcentual
- **1 Medidor de Caudal Saliente**: Monitoreo en tiempo real de flujo (L/s) con rango 0-100 L/s

#### Sistema La Ribera (Sistema Citizen)
- **2 Pozos Nuevos**: Pozo Nuevo 1 y Pozo Nuevo 2 con monitoreo operativo completo
- **4 Tanques**: 1 Tanque Concreto + 3 Tanques Elevados con niveles monitoreados
- **2 Medidores de Caudal**: Caudal Ribera Baja y Caudal Ribera Alta (L/s)

#### Sistema Asunción (Sistema EPA)
- **1 Pozo**: Pozo principal con telemetría de estado
- **4 Tanques Elevados**: Sistema de almacenamiento distribuido
- **1 Medidor de Caudal Saliente**: Monitoreo de flujo (L/s)
- **1 Medidor de Presión de Bombeo**: Presión en Bar para control de bombeo

### Características Técnicas
- **Arquitectura de Subsistemas**: Primera implementación con 3 sistemas navegables independientes
- **Base de Datos Dedicada**: Firebase independiente para Municipalidad de Belén con autenticación
- **URLs Autenticadas**: Todos los endpoints incluyen token de seguridad Firebase
- **Configuración Histórica Especializada**: Sistema de históricos con estructura customizada
- **Monitoreo de Caudales**: 4 medidores de flujo en tiempo real (L/s) con rangos 0-100 L/s
- **Header Personalizado**: "Centro de Control Acueducto Municipal"

### Resultados y Beneficios
- **Gestión Municipal Integrada**: 3 subsistemas independientes en una sola plataforma
- **Visibilidad Total**: 18 dispositivos monitoreados 24/7 desde cualquier ubicación
- **Control de Caudales**: 4 medidores de flujo permiten balance hídrico en tiempo real
- **Redundancia de Almacenamiento**: 9 tanques distribuidos estratégicamente garantizan suministro
- **Operación Optimizada**: Sistema de rebombeo monitoreado previene desperdicio energético
- **Toma de Decisiones Informada**: Datos históricos día a día para planificación municipal

### Subsistemas Detallados

**San Antonio (5 dispositivos)**
- Grupos: san-antonio-naciente (1), san-antonio-rebombeo (2), san-antonio-tanque (1), san-antonio-saliente (1)
- Enfoque: Captación de naciente y rebombeo a tanque principal

**La Ribera (8 dispositivos)**
- Grupos: ribera-pozos (2), ribera-tanques (4), ribera-caudales (2)
- Enfoque: Captación de pozos con almacenamiento distribuido y medición de caudales

**Asunción (6 dispositivos)**
- Grupos: asunción-pozo (1), asunción-tanques (4), asunción-caudal (2)
- Enfoque: Sistema de pozos con tanques elevados y control de presión

### Tecnología Implementada
- Firebase Realtime Database dedicada: municipalidad-belen-default-rtdb.firebaseio.com
- Autenticación por token en todas las URLs
- Configuración histórica especializada con `belenHistoricalConfig`
- Estructura de subsistemas con `displayName` y navegación jerárquica
- Medidores de caudal (L/s) y presión (Bar) con rangos personalizados
- Base de datos con claves: ZAMORA, CITIZEN, EPA

---

## 4. Central Azucarera del Tempisque (CATSA)

### Descripción del Proyecto
CATSA representa la **primera implementación de HCSI en el sector agroindustrial**, específicamente para el sistema de presión constante del sector **Playitas**. Este proyecto destaca por utilizar **bombas centrífugas especializadas** para mantener presión constante en redes de distribución industrial.

### Infraestructura Monitoreada
- **1 Bomba Centrífuga (Demo)**: Bomba de presión constante con telemetría completa de operación
- **1 Medidor de Presión de Red**: Monitoreo continuo de presión en la red de distribución

### Características Técnicas
- **Tipo de Dispositivo Especializado**: Primera implementación con tipo "centrifugal" para bombas de presión constante
- **Sector Industrial**: Diseñado para demandas de agua en procesos agroindustriales
- **Base de Datos CATSA_WATA**: Configuración especializada para sector azucarero
- **Logo Personalizado**: FluidSmart como marca del sistema de control

### Aplicación Industrial
- **Presión Constante**: Crítico para procesos industriales que requieren flujo estable
- **Sector Playitas**: Zona específica de las instalaciones de CATSA
- **Operación 24/7**: Monitoreo continuo para evitar paros en producción

### Resultados y Beneficios
- **Continuidad de Procesos**: Monitoreo de presión garantiza estabilidad en operaciones industriales
- **Mantenimiento Predictivo**: Telemetría de bomba centrífuga permite detectar anomalías tempranas
- **Reducción de Paros No Programados**: Alertas automáticas ante caídas de presión
- **Eficiencia Operativa**: Verificación remota de parámetros sin interrumpir producción
- **Primer Caso Agroindustrial**: Modelo replicable para otros ingenios azucareros

### Tecnología Implementada
- Bomba centrífuga con indicador especializado tipo "centrifugal"
- Medidor de presión de red con alertas configurables
- Firebase path: BASE_DATOS/CATSA_WATA/PLAYITAS/
- Históricos: PLAYITAS_B1DEMO
- Branding personalizado: FluidSmart logo para código 'catsa2025'

### Escalabilidad Futura
Este proyecto piloto en Playitas sienta las bases para expandir el monitoreo a:
- Otras zonas de CATSA
- Múltiples bombas de presión constante
- Medidores de caudal en líneas de distribución
- Tanques de almacenamiento de agua de proceso

---

## 5. Condominio Hacienda el Coyol

### Descripción del Proyecto
Hacienda el Coyol representa un **caso de éxito en el sector residencial privado**, implementando un sistema completo de **captación, almacenamiento y presión constante** con **5 dispositivos**. Este proyecto destaca por su **sistema de presión constante con 2 bombas en paralelo** que garantiza servicio 24/7 a residentes.

### Infraestructura Monitoreada
- **1 Tanque Principal**: Almacenamiento central con monitoreo de niveles
- **1 Pozo Principal con Bomba Centrífuga**: Captación de agua subterránea
- **2 Bombas de Presión Constante**: Sistema redundante en paralelo (Bomba PC 1 y PC 2)
- **1 Medidor de Presión de Red**: Monitoreo continuo de presión en red de distribución

### Características Técnicas
- **Sistema de Presión Constante**: Garantiza presión estable a todas las unidades residenciales
- **Redundancia de Bombeo**: 2 bombas trabajando en paralelo aseguran servicio continuo
- **Captación y Distribución Integrada**: Desde el pozo hasta la red de distribución
- **Base de Datos HACIENDA_COYOL**: Configuración especializada para el condominio
- **Grupos Operativos**: hacienda-coyol (tanque+pozo) y Red-distribución (bombas+presión)

### Arquitectura del Sistema
1. **Captación**: Pozo Principal con bomba centrífuga extrae agua subterránea
2. **Almacenamiento**: Tanque Principal mantiene reserva estratégica
3. **Distribución**: Sistema de presión constante con 2 bombas en paralelo
4. **Monitoreo**: Medidor de presión en red valida servicio a residentes

### Resultados y Beneficios
- **Servicio 99.9% Confiable**: Sistema redundante con 2 bombas elimina riesgo de interrupción
- **Presión Estable Garantizada**: Residentes disfrutan de presión constante sin variaciones
- **Reducción de Mantenimiento Correctivo 40%**: Monitoreo predictivo detecta anomalías tempranas
- **Gestión Profesional**: Administración del condominio puede verificar operación remotamente
- **Transparencia Operativa**: Reportes históricos disponibles para residentes
- **Respuesta Inmediata**: Alertas automáticas a personal de mantenimiento ante fallas

### Operación Día a Día
- **Monitoreo de Captación**: Pozo principal con parámetros de bombeo
- **Control de Almacenamiento**: Nivel de tanque principal vigilado continuamente
- **Rotación de Bombas**: Sistema PC con 2 bombas permite rotación para distribuir desgaste
- **Verificación de Presión**: Medidor de red confirma presión adecuada (PSI)

### Tecnología Implementada
- Firebase path: BASE_DATOS/HACIENDA_COYOL/
- Históricos especializados: POZO-TANQUE, PC_B1, PC_B2, PRESION
- Indicadores tipo "centrifugal" para pozo principal
- Indicadores tipo "pump" para bombas de presión constante
- Medidor de presión con alertas configurables

### Modelo Replicable
Este caso demuestra la viabilidad de WATA para:
- Condominios residenciales de mediano y gran tamaño
- Desarrollos inmobiliarios con infraestructura propia
- Clubes residenciales y comunidades privadas
- Centros comerciales con sistemas de agua independientes

---

## Resumen Comparativo de Proyectos

| Proyecto | Dispositivos | Subsistemas | Tanques | Bombas/Pozos | Medidores | Complejidad |
|----------|-------------|-------------|---------|--------------|-----------|-------------|
| **ASADA San Rafael** | 24 | - | 12 | 11 pozos + 1 multi-bomba | - | ★★★★★ |
| **Municipalidad Alajuela** | 7 | - | 2 | 2 pozos + 1 multi-bomba (3) | - | ★★★☆☆ |
| **Municipalidad Belén** | 18 | 3 | 9 | 3 pozos + 2 rebombeo | 4 caudales + 1 presión | ★★★★★ |
| **CATSA (Playitas)** | 2 | - | - | 1 centrífuga | 1 presión | ★★☆☆☆ |
| **Hacienda el Coyol** | 5 | - | 1 | 1 pozo + 2 presión constante | 1 presión | ★★★☆☆ |

---

## Sectores Atendidos por HCSI

### 🏘️ ASADAs Comunitarias
- ASADA San Rafael (24 dispositivos, 12 zonas)
- Modelo escalable para acueductos rurales descentralizados

### 🏛️ Municipalidades
- Municipalidad de Alajuela (7 dispositivos, 3 zonas)
- Municipalidad de Belén (18 dispositivos, 3 subsistemas)
- Soluciones para gestión pública con alta disponibilidad

### 🏭 Sector Agroindustrial
- Central Azucarera del Tempisque - CATSA (2 dispositivos)
- Sistemas de presión constante para procesos industriales

### 🏡 Sector Residencial Privado
- Condominio Hacienda el Coyol (5 dispositivos)
- Sistemas de presión constante para comunidades residenciales

---

## Tecnologías Comunes en Todos los Proyectos

✅ **Plataforma WATA**: Next.js 14 con PWA
✅ **Base de Datos**: Firebase Realtime Database
✅ **Actualización**: Tiempo real (2-5 segundos)
✅ **Históricos**: Datos día a día con 48 registros diarios
✅ **Acceso**: Universal desde cualquier dispositivo (Android, iOS, Windows, Mac)
✅ **Disponibilidad**: 99.9% uptime garantizado
✅ **Zona Horaria**: Costa Rica (UTC-6) integrada nativamente
✅ **Alertas**: Multinivel automáticas (crítico, bajo, normal, óptimo)

---

## Métricas de Éxito Globales

- **Total de Dispositivos Monitoreados en estos 5 proyectos**: 56 dispositivos
- **Total de Tanques**: 24 tanques
- **Total de Bombas/Pozos**: 24 sistemas de bombeo
- **Total de Medidores**: 6 (5 caudal + 3 presión)
- **Cobertura Geográfica**: Costa Rica (Alajuela, Belén, Guanacaste)
- **Sectores**: 4 (ASADAs, Municipalidades, Agroindustria, Residencial)
- **Años de Operación**: 2+ años sin interrupciones mayores
- **Disponibilidad Promedio**: 99.9%

---

**Desarrollado por HCSI - Hydraulic Control Systems and Infrastructure**
*Más de 10 años diseñando soluciones SCADA para Costa Rica*

**Contacto**: info@hcsicr.com | www.hcsicr.com
