import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';

/**
 * Componente de barra de herramientas con funcionalidades de búsqueda y filtrado múltiple
 * 
 * Este componente permite:
 * - Realizar búsquedas con tiempo de espera (debounce)
 * - Aplicar múltiples filtros a través de selectores
 * - Mostrar botones de acción configurables
 * - Visualizar elementos en forma de tabla con opciones de edición, eliminación y vista
 */
@Component({
  selector: 'ng-jamd-input-search-toolbar',
  templateUrl: 'ng-jamd-input-search-toolbar.html',
  styles: []
})
export class NgJamdInputSearchToolbarComponent implements OnInit, OnChanges {
  /**
   * Formulario para controlar los inputs de búsqueda y filtros
   */
  form: UntypedFormGroup;

  /**
   * Subject para implementar debounce en la búsqueda
   */
  private keyUpSubject = new Subject<string>();

  constructor(private location: Location) {
    // Inicializa el formulario con un control para la entrada de búsqueda
    this.form = new UntypedFormGroup({
      input: new UntypedFormControl(''),
      select: new UntypedFormControl(-1), // Mantener para compatibilidad con versiones anteriores
    });
  }

  /**
   * Detecta cambios en las propiedades de entrada y actualiza el componente
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.filters && changes['filters']) {
      this.initializeFilterControls();
    }
    
    // Establecer valor predeterminado para la búsqueda
    if (this.defaultSearchValue && (changes['defaultSearchValue'] || changes['filters'])) {
      this.form.get('input')?.setValue(this.defaultSearchValue);
    } else if (this.default && (changes['default'])) {
      // Para compatibilidad con versiones anteriores
      this.form.get('input')?.setValue(this.default);
    }
    
    // Establecer valores predeterminados para los filtros
    if (this.defaultFilterValues && (changes['defaultFilterValues'] || changes['filters'])) {
      Object.keys(this.defaultFilterValues).forEach(filterId => {
        const controlName = `select_${filterId}`;
        if (this.form.get(controlName)) {
          this.form.get(controlName)?.setValue(this.defaultFilterValues?[filterId]:'');
        }
      });
    }
  }

  /**
   * Inicializa el componente y configura el debounce para la búsqueda
   */
  ngOnInit(): void {
    // Configurar el debounce para la búsqueda
    this.keyUpSubject
      .pipe(debounceTime(800))
      .subscribe((searchTerm) => {
        this.searchText(searchTerm);
      });
    
    // Inicializar los controles de filtro
    this.initializeFilterControls();
  }

  /**
   * Inicializa los controles del formulario para los filtros
   */
  private initializeFilterControls(): void {
    if (!this.filters || this.filters.length === 0) {
      return;
    }

    // Mantener los controles existentes para compatibilidad
    const currentValues: {[key: string]: any} = {};
    if (this.form) {
      Object.keys(this.form.controls).forEach(key => {
        currentValues[key] = this.form.get(key)?.value;
      });
    }
    
    // Crear controles de formulario
    const formControls: {[key: string]: UntypedFormControl} = {
      input: new UntypedFormControl(currentValues['input'] || ''),
      select: new UntypedFormControl(currentValues['select'] || -1)
    };
    
    // Agregar un control para cada filtro
    this.filters.forEach(filter => {
      const controlName = `select_${filter.id}`;
      const defaultValue = filter.defaultValue !== undefined 
        ? filter.defaultValue 
        : (currentValues[controlName] || -1);
      
      formControls[controlName] = new UntypedFormControl(defaultValue);
    });
    
    // Crear el nuevo FormGroup
    this.form = new UntypedFormGroup(formControls);
  }

  /**
   * Evento emitido cuando se realiza una búsqueda
   */
  @Output()
  onSearch = new EventEmitter<string>();

  /**
   * Evento emitido cuando se aplica un filtro (compatibilidad con versiones anteriores)
   */
  @Output()
  onFilter = new EventEmitter<number>();

  /**
   * Evento emitido cuando cambia un filtro específico
   */
  @Output()
  onFilterChange = new EventEmitter<{filterId: string | number, value: any}>();

  /**
   * Evento emitido cuando se combinan búsqueda y filtro
   */
  @Output()
  onSearchFilter = new EventEmitter<ResultSearch>();

  /**
   * Evento emitido cuando se limpia el campo de búsqueda
   */
  @Output()
  onEmptyInput = new EventEmitter<boolean>();

  /**
   * Evento emitido cuando se hace clic en un botón de la barra de herramientas
   */
  @Output()
  onClickButtonToolbar = new EventEmitter<Buttons>();

  /**
   * Evento emitido cuando se selecciona un elemento
   */
  @Output()
  onSelected = new EventEmitter<any>();

  /**
   * Evento emitido cuando se edita un elemento
   */
  @Output()
  onEdit = new EventEmitter<any>();

  /**
   * Evento emitido cuando se elimina un elemento
   */
  @Output()
  onDelete = new EventEmitter<any>();

  /**
   * Evento emitido en cada pulsación de tecla
   */
  @Output()
  keyUp = new EventEmitter<any>();

  /**
   * Configuración de la barra de herramientas
   */
  @Input()
  toolbar: Toolbar = {
    edit: true,
    delete: true,
    view: true,
  };

  /**
   * Texto de placeholder para el campo de búsqueda
   */
  @Input()
  placeholder: string = 'Escriba aquí';

  /**
   * Valor predeterminado para el campo de búsqueda (compatibilidad con versiones anteriores)
   * @deprecated Use defaultSearchValue instead
   */
  @Input()
  default?: string;

  /**
   * Valor predeterminado para el campo de búsqueda
   */
  @Input()
  defaultSearchValue?: string;

  /**
   * Valores predeterminados para los filtros
   */
  @Input()
  defaultFilterValues?: {[filterId: string]: number | string};

  /**
   * Opción para ocultar los filtros
   */
  @Input()
  hideFilter: boolean = false;

  /**
   * Opción para mostrar botón de regreso
   */
  @Input()
  toBack: boolean = false;

  /**
   * Opción para ocultar la búsqueda
   */
  @Input()
  hideSearch: boolean = false;

  /**
   * Lista de filtros disponibles
   */
  @Input()
  filters!: Filters[];

  /**
   * Elementos a mostrar en la tabla
   */
  @Input()
  items: any;

  /**
   * Maneja el evento de búsqueda con debounce
   */
  search(q: string) {
    this.keyUpSubject.next(q);
  }

  /**
   * Procesa el texto de búsqueda y emite eventos correspondientes
   */
  searchText(q: string) {
    if (q.length > 0) {
      // Emitir evento con filtros actuales
      const filterValues: {[filterId: string]: any} = {};
      this.filters?.forEach(filter => {
        const controlName = `select_${filter.id}`;
        filterValues[filter.id] = this.form.get(controlName)?.value;
      });

      // Para compatibilidad, usar el filtro select original
      this.onSearchFilter.emit({
        q: q,
        filter: this.form.get('select')?.value,
        filterValues: filterValues
      });
      
      this.onSearch.emit(q);
    } else {
      this.onEmptyInput.emit(true);
    }
  }

  /**
   * Verifica si hay búsqueda y filtro seleccionado
   */
  checkMulti() {
    return (
      this.form.get('input')?.value.length > 0 &&
      this.form.get('select')?.value > 0
    );
  }

  /**
   * Maneja el cambio en el filtro principal (compatibilidad con versiones anteriores)
   */
  filterSelect() {
    const selectValue = this.form.get('select')?.value;
    
    if (selectValue) {
      if (selectValue != -1) {
        if (this.checkMulti()) {
          this.onSearchFilter.emit({
            q: this.form.get('input')?.value,
            filter: selectValue,
          });
        }
        this.onFilter.emit(selectValue);
      } else {
        this.onEmptyInput.emit(true);
      }
    }
  }

  /**
   * Maneja el cambio en un filtro específico
   */
  filterChanged(filterId: string | number, event: any) {
    const controlName = `select_${filterId}`;
    const value = this.form.get(controlName)?.value;
    
    // Emitir evento con el ID del filtro y su valor
    this.onFilterChange.emit({
      filterId: filterId,
      value: value
    });
    
    // Si hay texto de búsqueda, emitir evento combinado
    const searchText = this.form.get('input')?.value;
    if (searchText && searchText.length > 0) {
      // Recopilar todos los valores de filtro
      const filterValues: {[filterId: string]: any} = {};
      this.filters?.forEach(filter => {
        const ctrlName = `select_${filter.id}`;
        filterValues[filter.id] = this.form.get(ctrlName)?.value;
      });

      this.onSearchFilter.emit({
        q: searchText,
        filter: value,
        filterId: filterId,
        filterValues: filterValues
      });
    }
  }

  /**
   * Emite evento de eliminación para un elemento
   */
  selectedDelete(item: any) {
    this.onDelete.emit(item);
  }

  /**
   * Emite evento de edición para un elemento
   */
  selectedEdit(item: any) {
    this.onEdit.emit(item);
  }

  /**
   * Emite evento de selección para un elemento
   */
  selectedItem(item: any) {
    this.onSelected.emit(item);
  }

  /**
   * Emite evento keyUp
   */
  onKeyUp(value: any) {
    this.keyUp.emit(value);
  }

  /**
   * Emite evento para botón de la barra de herramientas
   */
  onClickBtnTb(buttons: Buttons) {
    this.onClickButtonToolbar.emit(buttons);
  }

  /**
   * Navega hacia atrás en el historial
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Maneja el evento de limpieza del campo de búsqueda
   */
  onSearchClear(searchInput: HTMLInputElement) {
    if (searchInput.value === '') {
      this.clearSearch();
    }
  }

  /**
   * Limpia el campo de búsqueda y emite eventos correspondientes
   */
  clearSearch() {
    this.form.get('input')?.setValue('');
    this.search('');
  }
}

/**
 * Interfaz para la configuración de la barra de herramientas
 */
export interface Toolbar {
  /**
   * Etiqueta para el filtro
   */
  filterLabel?: string;
  
  /**
   * Mostrar botón de edición
   */
  edit?: boolean;
  
  /**
   * Mostrar botón de vista
   */
  view?: boolean;
  
  /**
   * Mostrar botón de eliminación
   */
  delete?: boolean;
  
  /**
   * Botones personalizados
   */
  buttons?: Buttons[];
}

/**
 * Interfaz para el resultado de búsqueda
 */
export interface ResultSearch {
  /**
   * Valor del filtro seleccionado
   */
  filter: number;
  
  /**
   * Texto de búsqueda
   */
  q: string;
  
  /**
   * ID del filtro que cambió (para múltiples filtros)
   */
  filterId?: string | number;
  
  /**
   * Valores de todos los filtros
   */
  filterValues?: {[filterId: string]: any};
}

/**
 * Interfaz para los botones personalizados
 */
export interface Buttons {
  /**
   * ID del botón
   */
  id: number;
  
  /**
   * Icono de FontAwesome
   */
  iconFaWSome?: string;
  
  /**
   * Texto del botón
   */
  value: string;
  
  /**
   * Clase CSS para el botón
   */
  class?: string;
}

/**
 * Interfaz para los filtros
 */
export interface Filters {
  /**
   * ID del filtro
   */
  id: number | string;
  
  /**
   * Etiqueta del filtro
   */
  tag: string;
  
  /**
   * Opciones para este filtro
   */
  options?: FilterOption[];
  
  /**
   * Valor predeterminado para el filtro
   */
  defaultValue?: number | string;
}

/**
 * Interfaz para las opciones de los filtros
 */
export interface FilterOption {
  /**
   * ID de la opción
   */
  id: number | string;
  
  /**
   * Etiqueta de la opción
   */
  label: string;
}