import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'lib-ng-jamd-input-search-toolbar',
  templateUrl: 'ng-jamd-input-search-toolbar.html',
  styles: [
  ]
})
export class NgJamdInputSearchToolbarComponent implements OnInit, OnChanges {
  constructor(private location: Location) {
    this.form = new UntypedFormGroup({
      input: new UntypedFormControl(''),
      select: new UntypedFormControl(-1),
    });
  }
  private keyUpSubject = new Subject<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filters) {
      console.log('UPDATE FILTER');
    }
    if (this.default) {
      console.log('UPDATE DEFAULT', this.default);
      this.form.get('input')?.setValue(this.default);
    }
  }

  form: UntypedFormGroup;

  ngOnInit(): void {
    this.keyUpSubject
      .pipe(debounceTime(500)) // Establece un tiempo de espera de 500 ms (ajústalo según tus necesidades)
      .subscribe((searchTerm) => {
        // Realiza la llamada a la API con el término de búsqueda
        console.log("RECIBIDO", searchTerm);
        this.searchText(searchTerm);
      });
  }

  /**
   * Salidas de busqueda
   */
  @Output()
  onSearch = new EventEmitter<string>();
  @Output()
  onFilter = new EventEmitter<number>();
  @Output()
  onSearchFilter = new EventEmitter<ResultSearch>();

  @Output()
  onEmptyInput = new EventEmitter<boolean>();

  @Output()
  onClickButtonToolbar = new EventEmitter<Buttons>();

  /**events button list */
  @Output()
  onSelected = new EventEmitter<any>();
  @Output()
  onEdit = new EventEmitter<any>();
  @Output()
  onDelete = new EventEmitter<any>();

  @Output()
  keyUp = new EventEmitter<any>();

  @Input()
  toolbar: Toolbar = {
    edit: true,
    delete: true,
    view: true,
  };

  @Input()
  placeholder: string = 'Escriba aquí';

  @Input()
  default?: string;

  @Input()
  hideFilter: boolean = false;

  @Input()
  toBack: boolean = false;

  @Input()
  hideSearch: boolean = false;

  @Input()
  filters!: Filters[];

  @Input()
  items: any;

  page = 1;
  perpage: number = 0;
  collectionSize = 0;
  totalPage = 0;

  search(q: string) {
    console.log("SEARCH", q);
    this.keyUpSubject.next(q)
  }
  searchText(q: string) {
    if (q.length > 0) {
      this.onSearchFilter.emit({
        q: this.form.get('input')?.value,
        filter: this.form.get('select')?.value,
      });
      this.onSearch.emit(q);
    } else {
      this.onEmptyInput.emit(true);
    }
  }

  checkMulti() {
    return (
      this.form.get('input')?.value.length > 0 &&
      this.form.get('select')?.value > 0
    );
  }

  filterSelect() {
    if (this.form.get('select')?.value) {
      if (this.form.get('select')?.value != -1) {
        if (this.checkMulti()) {
          this.onSearchFilter.emit({
            q: this.form.get('input')?.value,
            filter: this.form.get('select')?.value,
          });
        }
        this.onFilter.emit(this.form.get('select')?.value);
      } else {
        this.onEmptyInput.emit(true);
      }
    }
  }

  selectedDelete(item: any) {
    this.onDelete.emit(item);
  }
  selectedEdit(item: any) {
    this.onEdit.emit(item);
  }
  selectedItem(item: any) {
    this.onSelected.emit(item);
  }
  onKeyUp(value: any) {
    this.keyUp.emit(value);
  }
  onClickBtnTb(buttons: Buttons) {
    this.onClickButtonToolbar.emit(buttons);
  }
  goBack(): void {
    this.location.back();
  }

  onSearchClear(searchInput: HTMLInputElement) {
    if (searchInput.value === '') {
      // El campo de búsqueda ha sido limpiado
      this.clearSearch();
    }
  }

  clearSearch() {
    // Lógica para limpiar la búsqueda
    this.form.get('input')?.setValue('');
    // Recargar datos o realizar cualquier acción necesaria
    this.search('');
  }
}
export interface Toolbar {
  filterLabel?: string;
  edit?: boolean;
  view?: boolean;
  delete?: boolean;
  buttons?: Buttons[];
}
export interface ResultSearch {
  filter: number;
  q: string;
}
export interface Buttons {
  id: number;
  iconFaWSome?: string;
  value: string;
}

export interface Filters{
  id:number | string;
  tag:string;
}