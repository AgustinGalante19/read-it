# Diseño de la aplicación de lectura

## Objetivo y alcance

Rediseñar la aplicación existente tomando como referencia principal las capturas de Google Drive web y Android aportadas por el usuario. Aplicar una interpretación sobria de Material 3: superficies neutras, acento azul, jerarquía clara y composición adaptable.

Este documento define decisiones del proyecto; sus valores no son una reproducción exacta de los tokens internos de Google Drive ni una especificación oficial de Material. Las medidas y comportamientos propuestos pueden ajustarse si la implementación demuestra un problema de legibilidad o accesibilidad.

Decisiones confirmadas: referencia visual Google Drive y sustitución del acento verde por azul. Tema oscuro como base, siguiendo las capturas. Si ya existe un tema claro, conservarlo y adaptar los mismos roles semánticos; no añadir un selector de tema únicamente por este rediseño.

Conservar funcionalidades, datos, rutas y lógica de negocio. Revisar el repositorio antes de implementar; no asumir framework ni biblioteca de componentes. Las nuevas opciones funcionales descritas aquí deben aprovechar capacidades existentes o quedar fuera del primer cambio visual.

Read It es una aplicación de seguimiento personal de lectura. Permite descubrir libros en Google Books, organizarlos en la biblioteca y consultar el progreso, las citas y las estadísticas. La integración con el complemento de KOReader sincroniza actividad y destacados desde los lectores vinculados.

## Dirección visual

- Superficies grises sin dominante verde. El azul identifica acciones, selección, enlaces y progreso.
- Las portadas aportan la mayor variedad de color; la interfaz permanece discreta.
- Separar regiones mediante espacio y diferencias de superficie. Reservar bordes para controles, tablas y límites que realmente lo necesiten.
- Contenedor principal amplio en escritorio, con navegación lateral externa. En móvil, composición a ancho disponible y navegación inferior.
- Tipografía de interfaz sobria. No usar cursiva para todos los metadatos ni negrita en todos los títulos.
- Evitar degradados decorativos, transparencias tipo cristal, sombras intensas, formas ornamentales y animaciones elásticas.
- No copiar controles de Drive ajenos a la lectura, como almacenamiento, Gemini o paneles de servicios de Google.

## Tokens de color — tema oscuro

Centralizar estos valores en el sistema de temas existente. Consumir roles semánticos en los componentes; no distribuir colores literales por las pantallas.

La paleta oscura proviene de Material Theme Builder y usa la semilla `#1791F5`. Los colores se definen en OKLCH en [`src/app/globals.css`](src/app/globals.css) y se exponen a Tailwind. El fondo exterior usa el tono `surfaceContainerLow` del export para distinguir la navegación del panel principal.

| Token | Valor | Uso |
| --- | --- | --- |
| `background` | `#191C20` | Fondo exterior y navegación |
| `surface` | `#111418` | Panel principal de escritorio |
| `surface-container` | `#1D2024` | Grupos, tarjetas y navegación móvil |
| `surface-container-high` | `#272A2F` | Búsqueda, menús y diálogos |
| `on-surface` | `#E1E2E8` | Texto principal |
| `on-surface-variant` | `#C3C6CF` | Texto secundario e iconos |
| `outline` | `#8D9199` | Límites de controles que necesiten contraste |
| `outline-variant` | `#43474E` | Separadores discretos |
| `primary` | `#A2C9FE` | Enlaces, foco, progreso y botón principal |
| `on-primary` | `#00325B` | Texto e iconos sobre primary |
| `primary-container` | `#1D4875` | Selección y acciones tonales |
| `on-primary-container` | `#D3E4FF` | Contenido de selección y acciones tonales |
| `secondary-container` | `#3C4858` | Controles y etiquetas secundarios |
| `on-secondary-container` | `#D7E3F8` | Texto e iconos de controles secundarios |
| `error` | `#FFB4AB` | Errores y acciones destructivas |
| `on-error` | `#690005` | Contenido de botones de error |

Usar cada pareja de fondo y contenido de forma conjunta. No colocar texto oscuro sobre superficies oscuras ni texto blanco sobre azul claro. Verificar contraste en los componentes finales: 4.5:1 para texto normal y 3:1 para texto grande y elementos gráficos esenciales. El estado de lectura debe incluir una etiqueta o icono, además del color.

## Tipografía, espacio y forma

- Fuente propuesta: Roboto, con `Arial, sans-serif` como fallback. Reutilizar el mecanismo de fuentes existente; no depender de Google Sans para reproducir la referencia. La app carga ABeeZee mediante `next/font` en [`src/app/layout.tsx`](src/app/layout.tsx).
- Título de página: 28/36 px, peso 400; móvil 24/32 px.
- Título de sección: 20/28 px, peso 500.
- Título de libro: 16/24 px, peso 500.
- Texto general: 14/20 px; texto de citas: 16/26 px.
- Metadatos y etiquetas pequeñas: 12/16 px. Información importante nunca exclusivamente en texto pequeño.
- Controles: 14/20 px, peso 500. Campos móviles: 16 px para facilitar lectura y evitar zoom de enfoque.
- Escala de espaciado: 4, 8, 12, 16, 24, 32 y 48 px. Padding habitual de grupos: 16–24 px.
- Radios: 4 px en portadas; 12 px en tarjetas; 16 px en menús; 24 px en panel principal y diálogos; píldora en búsqueda, botones y selección de navegación.
- Iconos: una única familia consistente, preferentemente Material Symbols Outlined si es viable con el proyecto. Tamaño habitual 20–24 px. No mezclar estilos de trazo. La familia actual es Lucide.

## Composición adaptable

La estructura actual usa una barra inferior fija en todos los anchos y un contenedor centrado de ancho limitado. El punto de partida para adaptar esa estructura es el [layout principal](src/app/%28home%29/layout.tsx).

Los puntos de corte siguientes son decisiones del proyecto, expresados en píxeles CSS.

| Ancho | Navegación | Contenido |
| --- | --- | --- |
| Menos de 600 px | Barra inferior con los cinco destinos actuales | Una columna, márgenes de 16 px; biblioteca en dos columnas cuando las portadas y títulos lo permitan |
| 600–1023 px | Rail lateral de 80 px con iconos y etiquetas | Panel flexible, padding de 24 px, cuadrículas adaptables |
| Desde 1024 px | Sidebar de 240 px | Cabecera de 72 px, panel con radio de 24 px y padding de 24–32 px |

- Destinos: Inicio, Buscar, Biblioteca, Destacados y Estadísticas. Mantener las rutas y etiquetas actuales de `Home` (`/`), `Search` (`/search`), `Library` (`/library`), `Highlights` (`/highlights`) y `Stats` (`/stats`). No cambiar el idioma de la aplicación como efecto del rediseño.
- Cabecera de escritorio: identidad de la app, búsqueda y cuenta. El saludo personal puede aparecer en Inicio; no debe dominar todas las pantallas. Conservar `Devices` (`/devices`) y `Sign Out` en el menú de cuenta. Desde `Devices` se gestionan los lectores y sus códigos de vinculación con KOReader.
- En móvil, priorizar el título de pantalla y la cuenta; en Buscar, mostrar el campo de búsqueda como control principal. No duplicar dos campos de búsqueda en la misma vista.
- El panel ocupa el espacio disponible; no conservar un contenedor de teléfono estrecho centrado en escritorio. Limitar el ancho de los textos largos dentro del panel, no el de toda la aplicación.
- Mantener un único desplazamiento vertical principal por pantalla, salvo diálogos. Las regiones fijas deben reservar espacio para no cubrir contenido.
- Barra inferior móvil: altura base de 64 px más el área segura; reservar ese espacio al final del contenido. Etiquetas siempre visibles y selección en píldora.
- Probar desde 320 px y con zoom de 200%. No permitir desbordamiento horizontal de página; reducir columnas y reorganizar herramientas cuando sea necesario.

## Componentes

Los componentes compartidos están en [`src/components/ui`](src/components/ui) y usan primitivas de Radix y patrones de shadcn. Aplicar allí las variantes comunes de controles y reutilizar `BookCard` en las superficies que ya lo comparten.

### Búsqueda y filtros

Campo de búsqueda de 48–56 px de alto con superficie elevada, icono inicial y etiqueta accesible. En escritorio, ancho flexible hasta aproximadamente 720 px. Los filtros aparecen debajo del título, separados de la búsqueda. Permitir que se distribuyan en varias líneas; no recortar opciones imprescindibles.

### Botones y acciones

Una acción visualmente dominante por región. Botón principal con `primary/on-primary`; secundarios tonales, delineados o de texto según importancia. Altura visual de 40 px en escritorio y 48 px en móvil; objetivo táctil mínimo de 48 × 48 px. Menús de tres puntos para operaciones secundarias, con etiquetas accesibles específicas del elemento.

No añadir un botón flotante si la misma acción ya está presentada de forma prominente. Usarlo en móvil solo cuando haya una acción de creación existente y habitual.

### Libros

Cuadrícula predeterminada para explorar portadas. Columnas fluidas, aproximadamente 144–180 px por libro en escritorio, y dos columnas en móvil cuando quepan. Portadas con espacio de proporción 2:3 y `object-fit: contain` para evitar recortar títulos o ilustraciones. Mostrar la portada y el texto directamente sobre el panel, con un fondo neutro para las portadas ausentes.

Título de hasta dos líneas, autor de una o dos líneas según espacio y estado/progreso legible. El título completo debe estar disponible en el detalle; no depender de un tooltip en móvil. Evitar añadir fecha de publicación y número de páginas a todas las tarjetas si no ayudan a explorar.

La vista de lista, si está disponible o se incorpora dentro del alcance, muestra miniatura, título, autor, estado y progreso. En escritorio puede usar columnas; en móvil se transforma en filas de dos o tres líneas. No trasladar una tabla ancha a móvil.

La ficha `/book/[slug]` es el destino común desde las portadas, los resultados y las citas. Allí se consulta la información del libro y, cuando está en la biblioteca, se gestionan su estado, fechas de lectura y formato físico o electrónico. Mantener el acceso al resumen de lectura y a las citas del libro cuando estén disponibles.

### Menús, diálogos y estados

Menús sobre `surface-container-high`, con sombra discreta, agrupación de acciones y separadores mínimos. Diálogos de hasta 560 px cuando el contenido lo permita; en móvil respetar márgenes y altura visible del teclado.

Hover: capa clara sutil del 8%; pressed: 12%. La selección persistente utiliza tokens azules, no solo hover. Foco de teclado visible con contorno de 2 px y separación de 2 px. Disabled debe ser reconocible y no interactivo.

Cambios visuales breves de 120–200 ms. Respetar `prefers-reduced-motion`; no animar el reordenamiento o la entrada de cada libro por defecto.

## Pantallas

### Inicio

Dar prioridad a la lectura actual con portada, título, autor, páginas y progreso. Presentar la acción habitual existente de seguimiento; terminar un libro debe seguir disponible, pero no inventar sesiones o acciones que el producto no soporte. Colocar pendientes y lecturas recientes debajo. En escritorio utilizar cuadrículas; reservar carruseles para exploración secundaria y ofrecer acceso al conjunto completo.

`Currently Reading` ya muestra páginas leídas, porcentaje y tiempo de lectura, y ofrece `Mark as finished`. Mantener `My Readlist`, `Read` y sus enlaces `Show All` a Biblioteca con el filtro de estado correspondiente.

### Buscar

Búsqueda claramente enfocada, historial reciente y resultados con portada, título y autor. Diferenciar consulta vacía, carga, ausencia de resultados y error. No tratar la apariencia accidental de la barra en las capturas iniciales como un defecto confirmado de implementación.

`Search` consulta el catálogo de Google Books. Con el campo vacío, `Recent Searches` muestra los libros abiertos desde resultados. Al seleccionar un resultado se abre la ficha, desde donde se puede agregar el libro a la biblioteca.

### Biblioteca

Título, recuento del filtro activo, filtros de estado y búsqueda local por título, seguidos de la cuadrícula de libros. Conservar el orden automático de los resultados y las opciones `Read`, `Saved Books` (todos los libros guardados), `Reading` y `Want to Read`. Mantener los enlaces con `?status=` y el acceso `Calendar` (`/calendar`), que muestra la actividad diaria y los libros terminados por mes.

La alternancia lista/cuadrícula queda como mejora funcional opcional. Si se incorpora, presentarla como control segmentado accesible.

### Destacados

Cada cita debe identificar libro, autor, página y fecha cuando esos datos existan. Cita en texto normal, interlineado generoso y sin cursiva obligatoria. Ancho de lectura aproximado de 55–75 caracteres. Una columna en móvil; hasta dos en pantallas amplias si mantienen un orden de lectura y teclado predecible. No usar masonry que altere ese orden.

`My Highlights` reúne las citas sincronizadas desde KOReader y las agregadas manualmente. Mantener `Add Highlight` para guardar una cita y su página en un libro en lectura, así como el enlace desde cada cita a la ficha y la acción de eliminarla.

### Estadísticas

Indicadores principales al inicio. Rejilla de dos columnas en escritorio para gráficos; una en móvil. Mantener métricas y cálculos existentes. Usar azul como serie principal, etiquetas legibles y líneas de referencia discretas. Para múltiples series, complementar el color con etiquetas, patrones o marcadores.

`Stats` reúne recuentos de libros, páginas y etiquetas, actividad de 7 y 30 días, gráficos de actividad diaria y por hora, lecturas de los últimos seis meses y un radar por etiquetas. Mantener los gráficos en Recharts e indicar cuándo la actividad depende de datos sincronizados desde KOReader.

Los gráficos deben adaptarse al contenedor y ofrecer resumen textual o datos accesibles. Diferenciar cero real, falta de datos y fallo de carga. No interpretar los gráficos vacíos de las capturas como ausencia confirmada de datos.

## Accesibilidad y estados de datos

- Utilizar elementos semánticos, encabezados ordenados, etiquetas de formulario y nombres accesibles en controles de icono.
- Navegación completa por teclado. Menús y diálogos gestionan foco, cierre con Escape y retorno al control de origen.
- Skeletons con dimensiones similares al contenido final para evitar saltos. Estado vacío con explicación y acción pertinente existente.
- Error localizado con opción de reintentar; conservar el contenido disponible.
- Las portadas ausentes tienen un placeholder estable con identificación del libro. No dejar huecos de altura indefinida.
- En acciones destructivas conservar los mecanismos existentes de confirmación o deshacer.

## Instrucciones para el agente implementador

1. Inspeccionar estructura, sistema de estilos, componentes, rutas y capacidades actuales. No cambiar de biblioteca de UI únicamente para obtener esta apariencia.
2. Crear o adaptar tokens y componentes compartidos antes de modificar pantallas individuales.
3. Implementar la estructura adaptable y navegación; después Biblioteca y tarjetas de libros; luego Inicio, Buscar, Destacados y Estadísticas.
4. Mantener los datos reales, traducciones y funcionalidades existentes. No introducir métricas, sesiones o contenido ficticio en producción.
5. Registrar por separado las mejoras funcionales opcionales. El objetivo inicial es el rediseño visual y adaptable.
6. Validar con capturas reales de la implementación, navegación por teclado y comprobación de contraste. Ejecutar los checks del proyecto que correspondan al cambio.

## Criterios de aceptación

- [ ] El verde deja de ser el acento global; azul y grises neutros dominan la interfaz.
- [ ] Se reconoce la referencia de Drive en superficies, selección, navegación y densidad.
- [ ] Escritorio aprovecha el ancho con sidebar y panel amplio; móvil conserva controles cómodos y navegación inferior.
- [ ] No hay controles fijos que tapen libros, citas o gráficos.
- [ ] Portadas sin deformaciones; títulos largos y datos ausentes tienen tratamiento consistente.
- [ ] Biblioteca, búsqueda y seguimiento conservan sus funcionalidades y datos. Se mantienen los accesos a la ficha del libro, al calendario y a dispositivos.
- [ ] Carga, error, vacío, hover, foco y selección están definidos y visibles.
- [ ] Revisión a 360, 768, 1280 y 1920 px; comprobación adicional a 320 px y zoom de 200%.
- [ ] El resultado se valida sobre la app real, sin atribuir a la implementación los artefactos de las capturas originales.

## Referencias

- Capturas aportadas por el usuario: Drive web oscuro (estructura lateral, panel, lista y menú contextual) y Drive Android oscuro (búsqueda, filas agrupadas y navegación inferior).
- Capturas de la aplicación existente: Inicio, Buscar, Biblioteca, Destacados y Estadísticas.
- Documentación de referencia: https://m3.material.io/ . Ante una diferencia de apariencia, priorizar las decisiones explícitas de este documento y la referencia de Drive elegida por el usuario.
