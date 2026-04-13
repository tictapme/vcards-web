# VCards by TicTAP - Style Guide

Referencia visual definitiva extraida de la home page de produccion (`src/index.html`).

---

## 1. Variables globales Elementor

```css
/* ── Colores ── */
--e-global-color-primary:        #02A56C;   /* Verde principal - botones, CTAs, acentos */
--e-global-color-secondary:      #153B44;   /* Azul oscuro - texto principal, fondos oscuros */
--e-global-color-accent:         #62CC62;   /* Verde brillante - hovers, detalles */
--e-global-color-text:           #153B44;   /* Color de texto base */

/* ── Tipografia ── */
--e-global-typography-primary-font-family:   "Varela Round";
--e-global-typography-primary-font-size:     42px;
--e-global-typography-primary-font-weight:   500;
--e-global-typography-primary-font-style:    normal;

--e-global-typography-secondary-font-family: "Varela Round";
--e-global-typography-secondary-font-size:   30px;
--e-global-typography-secondary-font-weight: 400;

--e-global-typography-text-font-family:      "Lato";
--e-global-typography-text-font-size:        20px;
--e-global-typography-text-font-weight:      400;

--e-global-typography-accent-font-family:    "Varela Round";
--e-global-typography-accent-font-weight:    500;
```

---

## 2. Paleta de colores

### Colores principales

| Token | Hex | Uso |
|-------|-----|-----|
| Primary | `#02A56C` | Botones, CTAs, enlaces, bordes activos |
| Secondary | `#153B44` | Texto principal, fondos oscuros (hero, secciones dark) |
| Accent | `#62CC62` | Hover de botones, detalles, iconos |

### Colores secundarios

| Hex | Uso |
|-----|-----|
| `#46C053` | Verde alternativo para iconos |
| `#24CC63` | Variante de verde claro |
| `#0170B9` | Azul (enlaces, elementos Astra) |
| `#0A66C2` | Azul LinkedIn / redes sociales |

### Neutros

| Hex | Uso |
|-----|-----|
| `#FFFFFF` | Fondos principales, texto sobre oscuro |
| `#F8F8F8` | Fondo gris muy suave |
| `#F5F5F5` | Fondo gris claro (secciones alternas) |
| `#E5E5E5` | Bordes suaves |
| `#D8D5D5` / `#D6D4D4` | Bordes medios, separadores |
| `#C6C6C6` | Gris medio |
| `#808080` / `#7A7A7A` / `#777777` | Texto secundario, descripciones |
| `#4B4F58` | Texto gris oscuro |
| `#3A3A3A` | Texto casi negro |
| `#000000` | Negro puro (raro, solo sombras) |

### Colores decorativos

| Hex | Uso |
|-----|-----|
| `#B0E5B0` | Verde palido (fondos) |
| `#B9EAB9` | Verde muy palido |
| `#DCF9DC` | Fondo verde pastel |
| `#E2F5E2` / `#E3F8E3` | Fondos degradado verde |
| `#BCDCFF` | Azul pastel |
| `#FFB266` / `#FFBC7D` | Naranja acento |
| `#FF8AB4` | Rosa acento |
| `#677BC6` | Azul-morado acento |

### Gradientes

```css
/* Gradiente principal de marca (badges AI, elementos premium) */
background: linear-gradient(90deg, #02A56C 0%, #62CC62 100%);

/* Gradiente fondo seccion verde */
background: linear-gradient(180deg, #E2F5E2 0%, #FFFFFF 53.85%);

/* Gradiente fondo suave */
background: linear-gradient(0deg, #DCF9DC 0%, #FFFFFF 100%);
```

---

## 3. Tipografia

### Fuentes

| Fuente | Rol | Pesos cargados |
|--------|-----|-----------------|
| **Varela Round** | Headings, botones, elementos de marca | 400 |
| **Lato** | Texto cuerpo, descripciones | 400, 600, 700 |
| **Nunito** | Headings alternativos | 400, 600, 700 |
| **Noto Sans** | Badges, etiquetas especiales | 500 |

### Escala tipografica

| Elemento | Font family | Font size | Font weight | Line height |
|----------|------------|-----------|-------------|-------------|
| H1 (hero desktop) | Varela Round | 42px - 69px | 500 - 700 | 125% |
| H2 (titulos seccion) | Varela Round | 30px - 42px | 400 - 600 | 130% |
| H3 (subtitulos) | Varela Round | 20px - 30px | 400 - 600 | 120% - 140% |
| H5 (titulos tarjeta) | Varela Round | 14px - 20px | 600 | 130% |
| Body (parrafos) | Lato | 16px - 20px | 400 | 140% / 1.65em |
| Body small | Lato | 14px - 15px | 400 | 140% |
| Captions / labels | Lato / Noto Sans | 11px - 13px | 500 | normal |
| Botones | Varela Round | 15px - 16px | 500 - 600 | normal |

### Variantes tipograficas Elementor

```css
/* Tipografia 1c67208 - Texto cuerpo largo */
font-family: "Varela Round"; font-size: 1.1rem;

/* Tipografia 8e7f122 - Texto medio */
font-family: "Lato"; font-size: 22px; font-weight: 400;

/* Tipografia ca6e603 - Texto regular */
font-family: "Lato"; font-size: 18px;

/* Tipografia dcf37df - Subtitulos */
font-family: "Varela Round"; font-size: 20px; font-weight: 600;
```

### Letter spacing

| Uso | Valor |
|-----|-------|
| Texto normal | 0 (default) |
| Enfasis suave | 0.3px |
| Enfasis medio | 0.48px |
| Enfasis fuerte | 0.69px |
| Botones uppercase | 1px |

---

## 4. Botones

### Boton principal (CTA primario)

```css
.elementor-button {
  font-family: "Varela Round", sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-transform: none;   /* salvo excepciones con uppercase */
  color: #FFFFFF;
  background-color: #02A56C;
  border-style: solid;
  border-width: 0;
  border-color: #02a56c;
  border-radius: 35px;     /* valor global Elementor kit */
  padding: 13px 48px;
  text-decoration: none;
  transition: background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s;
}

.elementor-button:hover,
.elementor-button:focus {
  background-color: #62CC62;
  border-color: #62CC62;
  color: #FFFFFF;
}
```

### Variantes de boton

| Variante | Classes | Diferencias |
|----------|---------|-------------|
| **CTA principal** | `elementor-button elementor-button-link elementor-size-sm elementor-animation-grow` | Escala 1.1x al hover |
| **CTA secundario** | `elementor-button elementor-button-link elementor-size-sm elementor-animation-shrink` | Encoge al hover |
| **Boton grande** | `elementor-button elementor-button-link elementor-size-lg` | Mayor padding |
| **Boton plan/precio** | `elementor-button elementor-size-md` | Tamano medio |

### Tamanos de boton

| Size class | Padding aproximado |
|------------|-------------------|
| `elementor-size-xs` | 10px 24px |
| `elementor-size-sm` | 12px 32px |
| `elementor-size-md` | 13px 48px |
| `elementor-size-lg` | 16px 56px |

### Animaciones de boton

| Clase | Efecto |
|-------|--------|
| `elementor-animation-grow` | Escala hacia arriba al hover (efecto "crecimiento") |
| `elementor-animation-shrink` | Escala hacia abajo al hover (efecto "encogimiento") |
| `elementor-animation-float` | Levitacion suave al hover |

### Border-radius por contexto

| Contexto | Valor |
|----------|-------|
| Botones (global) | `35px` (Elementor kit default) |
| Botones (inline override) | `30px` |
| Botones pill | `50px` / `55px` |

---

## 5. Componentes

### Badge AI (`.botonia`)

```css
.botonia {
  height: 29.496px;
  padding: 6.368px 25.139px;
  border-radius: 43.909px;
  background: linear-gradient(90deg, #02A56C 0%, #62CC62 100%);
  color: #FFF;
  font-family: "Noto Sans", sans-serif;
  font-size: 13.478px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5.698px;
}
```

### Tarjetas / Cards

```css
/* Card estandar */
border-radius: 13px;
padding: 40px 42px 35px 40px;
background: #FFFFFF;
box-shadow: 2px 2px 40px 1px rgba(0,0,0,0.09);

/* Card con borde superior verde */
border-top: 4px solid #02A56C;
border-radius: 12px - 20px;

/* Card plan/precio */
border-radius: 30px 30px 30px 30px;
background: #F5F5F5;
border: 0.5px solid #153B44B3;
```

### Iconos / Icon wrappers

- Tamano de icono: 22px - 34px
- Colores: `#02A56C`, `#46C053`, `#0A66C2`
- Fondo: circular con color de marca o transparente
- Alineacion: centrado (`text-align: center`)

---

## 6. Layout y espaciado

### Contenedores

```css
/* Contenedor principal */
--ast-normal-container-width: 1200px;
--ast-narrow-container-width: 750px;

/* Contenedores Elementor usados en home */
--container-max-width: 1140px;  /* mas comun */
--container-max-width: 1024px;  /* alternativo compacto */

/* Padding de contenedor */
--ast-container-default-xlg-padding: 3em;
--ast-container-default-lg-padding: 3em;
--ast-container-default-md-padding: 3em;
--ast-container-default-sm-padding: 3em;
```

### Clases de contenedor Elementor

| Clase | Uso |
|-------|-----|
| `e-con` | Contenedor base |
| `e-con-full` | Ancho completo |
| `e-con-boxed` | Ancho contenido (max-width) |
| `e-flex` | Flexbox |
| `e-parent` | Contenedor padre (seccion) |
| `e-child` | Contenedor hijo |
| `e-con-inner` | Wrapper interior de boxed |

### Espaciado entre secciones

| Tipo | Valor |
|------|-------|
| Padding seccion grande | 80px - 100px vertical |
| Padding seccion medio | 40px - 60px vertical |
| Padding seccion compacto | 20px - 40px vertical |
| Gap entre columnas | 15px - 40px |
| Gap entre elementos en columna | 10px - 20px |
| Spacer grande | 118px - 125px |
| Spacer medio | 50px - 60px |
| Spacer pequeno | 20px - 30px |

### Margenes comunes

```css
margin: 0px 0px 15px 0px;  /* Separacion entre elementos */
margin: 0px 0px 45px 0px;  /* Separacion grande */
margin: 30px 0px 0px 0px;  /* Margen superior */
margin: 11px 0px 0px 0px;  /* Margen superior sutil */
```

---

## 7. Bordes y sombras

### Border-radius

| Valor | Uso |
|-------|-----|
| `0px` | Sin redondeo (secciones full-width) |
| `3px` | Redondeo minimo |
| `11px` - `13px` | Cards sutiles |
| `20px` | Cards prominentes |
| `30px` | Botones, cards redondeadas |
| `35px` | Botones (global Elementor kit) |
| `41px` - `55px` | Elementos muy redondeados |
| `50%` / `50px` | Circulos, pills |

### Box shadows

```css
/* Sombra suave (cards, contenedores) */
box-shadow: 2px 2px 40px 1px rgba(0,0,0,0.09);

/* Sombra media (elementos elevados) */
box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.18);

/* Sombra pronunciada (modales, hover) */
box-shadow: 2px 8px 23px 3px rgba(0,0,0,0.2);

/* Sombra profunda (elementos flotantes) */
box-shadow: 6px 7px 18px -7px rgba(0,0,0,0.5);

/* Sombra dramatica (imagenes hero) */
box-shadow: 11px -8px 41px 4px rgba(0,0,0,0.5);
```

### Bordes

```css
/* Borde oscuro principal */
border: 0.5px solid #153B44B3;

/* Borde fino oscuro */
border: 2px solid #153B44;

/* Borde verde */
border: 2px solid #62CC62;

/* Borde gris suave */
border: 1px solid #e7e7e7;
```

---

## 8. Animaciones y transiciones

### Clases de animacion (Elementor)

| Clase | Efecto | Uso |
|-------|--------|-----|
| `elementor-animation-grow` | Scale up al hover | Botones CTA principales |
| `elementor-animation-shrink` | Scale down al hover | Botones secundarios |
| `elementor-animation-float` | Levitar al hover | Elementos interactivos |
| `slideInUp` | Deslizar desde abajo | Secciones al scroll |
| `slideInLeft` | Deslizar desde izquierda | Columnas izquierdas |
| `slideInRight` | Deslizar desde derecha | Columnas derechas, hero image |
| `fadeIn` | Aparecer suave | Elementos al scroll |

### Configuracion de animacion (data-settings)

```json
{"animation": "slideInUp"}
{"animation": "slideInRight", "animation_delay": 150}
{"animation": "slideInLeft"}
{"animation": "fadeIn"}
```

La clase `elementor-invisible` se aplica inicialmente; la animacion la elimina al entrar en viewport.

### Transiciones CSS

```css
/* Transicion rapida (micro-interacciones) */
transition: all 0.1s ease-in-out;

/* Transicion estandar (botones, links) */
transition: all 0.2s;
transition: all 0.2s linear;

/* Transicion suave (fondos, bordes) */
transition: background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s;

/* Transicion compleja (elementos animados) */
transition: transform 0.6s ease, opacity 0.6s ease;
```

---

## 9. Responsive

### Clases de visibilidad

| Clase | Efecto |
|-------|--------|
| `elementor-hidden-desktop` | Oculto en desktop |
| `elementor-hidden-tablet` | Oculto en tablet |
| `elementor-hidden-mobile` | Oculto en mobile |
| `elementor-invisible` | Invisible (espacio reservado, se anima a visible) |

### Breakpoints (Elementor defaults)

| Breakpoint | Rango |
|------------|-------|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |

### Patrones responsive

```css
/* Flex wrap en mobile */
--flex-wrap-mobile: wrap;

/* Ancho de widgets responsive */
--container-widget-width: 100%;  /* mobile */
--container-widget-width: 60%;   /* desktop parcial */
--container-widget-width: 90%;   /* tablet */

/* Gap responsive */
--gap: 15px;      /* mobile */
--gap: 20px;      /* tablet */
--gap: 40px;      /* desktop */
```

---

## 10. Estructura de pagina

### Orden de secciones (home)

1. **Header** sticky (elementor-22594) - Logo, nav, idiomas, login
2. **Hero** - H1, subtitulo, CTA, imagen, logos clientes, social proof
3. **Features tabs** - Pestanas con caracteristicas (escaneo, gestion, ahorro, soporte)
4. **Solucion empresas** - 3 beneficios numerados
5. **Metricas** - Numeros y datos
6. **Paso a paso** - Flujo visual (crear, gestionar, compartir)
7. **No pierdas contacto** - 3 pasos (foto, personaliza, contacto creado)
8. **Casos de uso** - Carrusel por perfil (ventas, RRHH, marketing, etc.)
9. **Social proof** - Testimonios, clientes
10. **Pricing** - Planes y precios
11. **FAQ** - Acordeon de preguntas
12. **CTA final** - Cierre con boton
13. **Footer** (elementor-13303) - Links, legal, redes, copyright

### Jerarquia de headings

- `<h1>`: Solo uno por pagina (hero)
- `<h2>`: Titulo de cada seccion principal
- `<h3>`: Subtitulo hero / descripcion
- `<h5>`: Titulos dentro de cards / features
- `<p>`: Descripcion de cards, texto cuerpo

---

## 11. Notas de implementacion

### Para nuevas paginas

1. Usar el `<head>` completo de una pagina existente (incluye todos los CSS de Elementor)
2. Copiar header y footer HTML tal cual (son bloques autocontenidos)
3. Copiar los scripts post-footer (jQuery, Elementor JS, analytics)
4. El contenido propio va dentro de `<div id="content" class="site-content">`
5. Si se usa CSS custom, anadir override: `.site-content .ast-container { display: block; }` para evitar que Astra aplique flexbox al contenido

### Fuentes a cargar

```html
<link href="https://fonts.googleapis.com/css2?family=Varela+Round&family=Lato:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

### IDs de Elementor reutilizables

- Header template: `elementor-22594`
- Footer template: `elementor-13303`
- Kit global: `elementor-kit-6185`
