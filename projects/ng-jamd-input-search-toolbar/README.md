# NgJamdInputSearchToolbar

**NgJamdInputSearchToolbar** es una librería Angular que proporciona un componente reutilizable para implementar una barra de búsqueda con filtros. Es ideal para aplicaciones que requieren herramientas rápidas de búsqueda y navegación con múltiples opciones configurables.

---

## Características

- **Barra de búsqueda interactiva** con entrada de texto y opciones de filtrado.
- **Integración con formularios reactivos de Angular**.
- **Eventos personalizables** para manejar búsquedas, selección de filtros y botones personalizados.
- **Diseño flexible**: Opciones para mostrar/ocultar la barra de búsqueda y los filtros.

---

### Paso 1: Instalación

Instala la librería desde npm ejecutando el siguiente comando:

```sh
npm install ng-jamd-input-search-toolbar
```


### Paso 2: Importa la librería

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


### Paso 3: Usar el componente

Añade el selector del componente en tu archivo HTML:

```html
<lib-ng-jamd-input-search-toolbar
  [toolbar]="{
    edit: true,
    delete: false,
    buttons: [{ id: 1, value: 'Nuevo', iconFaWSome: 'fa-solid fa-plus' }]
  }"
  [filters]="[
    { id: 1, tag: 'Nombre' },
    { id: 2, tag: 'Fecha' }
  ]"
  placeholder="Buscar aquí..."
  [toBack]="true"
  (onSearch)="onSearch($event)"
  (onFilter)="onFilter($event)"
  (onSearchFilter)="onSearchFilter($event)"
></lib-ng-jamd-input-search-toolbar>

```

Configura tu componente de la siguiente forma:

```typescript
export class AppComponent {
  onSearch(term: string) {
    console.log('Texto de búsqueda:', term);
  }

  onFilter(filter: number) {
    console.log('Filtro seleccionado:', filter);
  }

  onSearchFilter(result: { q: string; filter: number }) {
    console.log('Búsqueda con filtro:', result);
  }
}
```
