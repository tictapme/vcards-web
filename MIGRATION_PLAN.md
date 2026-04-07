# Vcards Astro Migration Plan

## Objetivo

Migrar `vcards-web` desde un export estático heredado de WordPress a un sitio mantenible con Astro, manteniendo las URLs y el comportamiento SEO actuales mientras `src/` sigue siendo la salida publicada.

## Estado de partida

- La web publicada vive en `src/`.
- Hay contenido en `es`, `en` y `de`.
- El sitio contiene páginas comerciales, blog, taxonomías, páginas legales y utilidades.
- No existía todavía un pipeline Astro comparable al de `tictap-web`.

## Principios

- No romper URLs existentes.
- Mantener `src/` como fuente efectiva de producción hasta cerrar la migración.
- Migrar por plantillas y familias de páginas, no una página aislada cada vez.
- Reducir JS/CSS legacy solo cuando la ruta ya esté controlada por Astro.

## Fases

### Fase 0. Arranque técnico

- Crear `astro/` y configurar Astro para leer desde `astro/src`.
- Crear rutas Astro que reemitan el HTML actual desde `src/`.
- Añadir scripts de `astro:build`, `sync:astro` y `preview`.
- Documentar estructura, riesgos y objetivo del repo.

Resultado esperado:
- El repositorio ya tiene un pipeline Astro mínimo sin perder cobertura de rutas existentes.

### Fase 1. Inventario y segmentación de plantillas

- Clasificar rutas por tipo:
  - home por idioma
  - páginas comerciales
  - blog index y posts
  - categorías y archivos
  - páginas legales y utilitarias
- Detectar shells repetidos de header/footer y bundles CSS/JS comunes.
- Identificar páginas con Elementor raw y páginas candidatas a layout limpio.

Resultado esperado:
- lista priorizada de plantillas a sustituir, no solo lista de URLs

### Fase 2. Shell global y layout base

- Extraer layout base de Vcards con `<head>`, header, footer y scripts imprescindibles.
- Reemplazar la home en `es`, `en` y `de` por layouts Astro controlados.
- Mover estilos globales compartidos a archivos del proyecto Astro.

Resultado esperado:
- home multidioma ya renderizada desde Astro con shell compartida

### Fase 3. Páginas comerciales

- Migrar familia de páginas de producto, pricing, contact y onboarding.
- Reutilizar bloques comunes: hero, logos, CTA, FAQs, forms, cards, feature sections.
- Reducir CSS inline por página.

Resultado esperado:
- principales landings comerciales mantenidas desde componentes Astro

### Fase 4. Blog y taxonomías

- Crear colección de contenido o pipeline híbrido para posts.
- Migrar `blog/`, posts y categorías a layouts Astro.
- Mantener SEO, breadcrumbs, canonicals y hreflang.

Resultado esperado:
- contenido editorial centralizado y reusable

### Fase 5. Limpieza y validación final

- Revisar `_redirects`, sitemaps y `robots.txt`.
- Eliminar dependencias legacy ya innecesarias.
- Minimizar JS heredado y paths no usados.
- Dejar pipeline estable de preview y publicación.

Resultado esperado:
- repo mantenible, con `src/` generado desde Astro y deuda legacy acotada

## Prioridad recomendada

1. Base Astro de passthrough
2. Home multidioma
3. Pricing, contact y páginas comerciales principales
4. Blog y categorías
5. Limpieza de assets y SEO técnico

## Primer slice implementado en esta iteración

- documentación del repo
- plan de migración
- scaffold Astro mínimo para empezar la transición sin romper el export actual
