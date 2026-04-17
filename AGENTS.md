# AGENTS

## Qué es este proyecto

Este repositorio contiene la web estática de Vcards by TicTAP.
Ahora mismo la web publicada sigue siendo un export legacy de WordPress, con páginas en varios idiomas y assets copiados en `src/`.
La migración a Astro acaba de empezar y convivirá un tiempo con ese export.

Asunción operativa importante:
- cada `push` a `main` puede acabar publicando exactamente lo que haya en `src/`

Eso implica que cualquier error en SEO técnico, redirecciones, `robots.txt`, sitemaps o HTML exportado se puede publicar tal cual.

## Estructura esperada

### Raíz del repositorio

- `src/`: salida estática publicada. Debe tratarse como la verdad actual de producción.
- `astro/`: nueva fuente Astro para ir sustituyendo el export legacy por layouts y rutas mantenibles.
- `bin/`: scripts operativos del export y de la transición Astro.
- `functions/`: funciones heredadas del despliegue estático.
- `wp-src/`: material heredado del origen WordPress si sigue siendo necesario para referencias o regeneración.
- `package.json`: scripts de build, sync y preview local.

### Dentro de `src/`

- `index.html` y carpetas con `index.html`: páginas servidas en producción.
- `en/` y `de/`: versiones internacionales del sitio.
- `blog/`, `category/` y sus equivalentes por idioma: contenido editorial heredado.
- `_redirects`, `robots.txt`, `sitemap*.xml`: señales SEO y routing estático.
- `wp-content/`, `wp-includes/`: assets del export del CMS anterior.

## Reglas de mantenimiento

- `src/` sigue siendo la verdad de producción mientras la migración no esté cerrada.
- la migración a Astro debe respetar URLs existentes, canonicals, hreflang y metadatos actuales salvo corrección explícita.
- no asumir comportamiento dinámico del WordPress original en runtime.
- evitar editar a mano grandes bloques HTML exportados si el cambio puede centralizarse en Astro.
- cuando una ruta entre en Astro, debe quedar claro qué parte sigue siendo legacy y qué parte ya es layout reutilizable.

## Objetivo de la migración

- pasar de export raw por página a un pipeline Astro reproducible
- mantener `src/` como salida publicada
- centralizar layouts compartidos de home, páginas comerciales, blog, categorías y páginas legales
- reducir dependencia de HTML inline, CSS acoplado por página y JS heredado innecesario

## Fase actual

- existe una base Astro inicial de passthrough legacy
- el build Astro debe poder regenerar páginas HTML a partir de `src/`
- todavía no hay layouts específicos migrados para Vcards

## Flujo recomendado antes de commit

1. Hacer los cambios en `astro/`, `bin/` o `src/` según corresponda.
2. Si la ruta ya está cubierta por Astro, ejecutar `npm run astro:build`.
3. Sincronizar el resultado con `npm run sync:astro`.
4. Previsualizar localmente con `npm run preview` o `npm run preview:src`.
5. Revisar especialmente `src/index.html`, `src/en/index.html`, `src/de/index.html`, `robots.txt`, sitemaps y `_redirects`.

## Política de commits

- después de cambios suficientemente importantes, hacer un commit y dejarlo guardado antes de seguir con otra pieza de trabajo
- entender como "cambio suficientemente importante" cualquier modificación que afecte a varias rutas, a comportamiento visible, al pipeline de build/sync, a SEO técnico o a estructuras compartidas
- priorizar commits pequeños, claros y reversibles para que cualquier persona del repositorio pueda volver a un estado anterior fácilmente
- no acumular cambios grandes no committeados si ya existe un punto estable del trabajo

## Qué no asumir

- no asumir que el export actual es semánticamente limpio
- no asumir que Elementor/Astra seguirán siendo la base final del sitio
- no asumir que un cambio en `astro/` llega a producción si no acaba materializado en `src/`
