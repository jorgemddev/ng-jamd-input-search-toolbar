<<<<<<< HEAD
# LibrerarysWokspace

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
=======
# NgJamdInputSearchToolbar

**NgJamdInputSearchToolbar** es una librería Angular que proporciona un componente reutilizable para implementar una barra de herramientas completa con búsqueda y filtrado múltiple. Está diseñado para ser altamente configurable y compatible con versiones anteriores.

---

## Características Principales

- **Búsqueda con debounce**: Evita múltiples solicitudes al servidor durante la escritura.
- **Múltiples filtros**: Permite configurar varios selectores de filtrado.
- **Botones personalizables**: Incluye botones predefinidos y configurables.
- **Visualización de datos**: Muestra elementos en formato de tabla con opciones de acción.
- **Configuración flexible**: Múltiples opciones de entrada para personalizar el comportamiento.
- **Compatibilidad con Angular 17+**: Soporte actualizado para las versiones más recientes de Angular.

---

## Instalación

Instala la librería desde npm ejecutando el siguiente comando:

```sh
npm install ng-jamd-input-search-toolbar@latest
```

---

## Uso en Angular

### Paso 1: Importa la librería

En tu archivo `app.module.ts`, importa el módulo:

```typescript
import { NgJamdInputSearchToolbarModule } from 'ng-jamd-input-search-toolbar';

@NgModule({
  imports: [NgJamdInputSearchToolbarModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

### Paso 2: Usar el componente

Añade el selector del componente en tu archivo HTML:

```html
<ng-jamd-input-search-toolbar
  [placeholder]="'Buscar productos...'"
  [filters]="filtrosDisponibles"
  [items]="listaElementos"
  [toolbar]="configuracionToolbar"
  (onSearch)="manejarBusqueda($event)"
  (onFilterChange)="manejarCambioFiltro($event)"
  (onEdit)="editarElemento($event)"
  (onDelete)="eliminarElemento($event)">
</ng-jamd-input-search-toolbar>
```

---

## Propiedades de Entrada (@Input)

| Propiedad             | Tipo                        | Descripción                               | Valor Predeterminado                       |
| --------------------- | --------------------------- | ----------------------------------------- | ------------------------------------------ |
| `toolbar`             | `Toolbar`                   | Configuración de la barra de herramientas | `{ edit: true, delete: true, view: true }` |
| `placeholder`         | `string`                    | Texto para el campo de búsqueda           | `'Escriba aquí'`                           |
| `defaultSearchValue`  | `string`                    | Valor predeterminado para la búsqueda     | `undefined`                                |
| `defaultFilterValues` | `{[filterId: string]: any}` | Valores predeterminados para los filtros  | `undefined`                                |
| `hideFilter`          | `boolean`                   | Oculta los filtros                        | `false`                                    |
| `toBack`              | `boolean`                   | Muestra botón para volver atrás           | `false`                                    |
| `hideSearch`          | `boolean`                   | Oculta el campo de búsqueda               | `false`                                    |
| `filters`             | `Filters[]`                 | Lista de filtros disponibles              | `undefined`                                |
| `items`               | `any`                       | Elementos a mostrar en la tabla           | `undefined`                                |
| `loading`             | `boolean`                   | Muestra un indicador de carga             | `false`                                    |

---

## Eventos de Salida (@Output)

| Evento                 | Tipo                             | Descripción                                    |                                             |
| ---------------------- | -------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `onSearch`             | `EventEmitter<string>`           | Se emite cuando se realiza una búsqueda        |                                             |
| `onFilterChange`       | \`EventEmitter<{filterId: string | number, value: any}>\`                         | Se emite cuando cambia un filtro específico |
| `onSearchFilter`       | `EventEmitter<ResultSearch>`     | Se emite cuando se combinan búsqueda y filtro  |                                             |
| `onEmptyInput`         | `EventEmitter<boolean>`          | Se emite cuando se limpia el campo de búsqueda |                                             |
| `onClickButtonToolbar` | `EventEmitter<Buttons>`          | Se emite al hacer clic en un botón de la barra |                                             |
| `onSelected`           | `EventEmitter<any>`              | Se emite cuando se selecciona un elemento      |                                             |
| `onEdit`               | `EventEmitter<any>`              | Se emite cuando se edita un elemento           |                                             |
| `onDelete`             | `EventEmitter<any>`              | Se emite cuando se elimina un elemento         |                                             |
| `keyUp`                | `EventEmitter<any>`              | Se emite en cada pulsación de tecla            |                                             |

---

## Interfaces

### Toolbar

```typescript
interface Toolbar {
  filterLabel?: string;
  edit?: boolean;
  view?: boolean;
  delete?: boolean;
  buttons?: Buttons[];
}
```

### ResultSearch

```typescript
interface ResultSearch {
  filter: number;
  q: string;
  filterId?: string | number;
  filterValues?: {[filterId: string]: any};
}
```

### Buttons

```typescript
interface Buttons {
  id: number;
  iconFaWSome?: string;
  value: string;
  class?: string;
}
```

### Filters

```typescript
interface Filters {
  id: number | string;
  tag: string;
  options?: FilterOption[];
  defaultValue?: number | string;
}
```

### FilterOption

```typescript
interface FilterOption {
  id: number | string;
  label: string;
}
```

---

## Ejemplos

### Configuración de Múltiples Filtros

```typescript
// En el componente
filtrosDisponibles: Filters[] = [
  {
    id: 'categoria',
    tag: 'Categoría',
    options: [
      { id: 1, label: 'Electrónica' },
      { id: 2, label: 'Hogar' },
      { id: 3, label: 'Ropa' }
    ],
    defaultValue: 1
  },
  {
    id: 'marca',
    tag: 'Marca',
    options: [
      { id: 'samsung', label: 'Samsung' },
      { id: 'apple', label: 'Apple' },
      { id: 'xiaomi', label: 'Xiaomi' }
    ]
  }
];

// Establecer valores predeterminados
valoresPredeterminados = {
  'categoria': 2,
  'marca': 'apple'
};
```

```html
<ng-jamd-input-search-toolbar
  [filters]="filtrosDisponibles"
  [defaultFilterValues]="valoresPredeterminados"
  [defaultSearchValue]="'iPhone'"
  [loading]="true"
  (onFilterChange)="procesarCambioFiltro($event)">
</ng-jamd-input-search-toolbar>
```

---

## Notas Importantes

- El componente requiere **FontAwesome** para los iconos.
- Se necesita **Bootstrap** para los estilos.
- Los formularios reactivos de Angular son necesarios.
- **Ahora compatible con Angular 17+** y mejoras en rendimiento.

---

🚀 **Actualizado a la versión más reciente para mayor flexibilidad y compatibilidad.**

>>>>>>> 0b2844f ((fix) Actualziación y corrección de errores)
