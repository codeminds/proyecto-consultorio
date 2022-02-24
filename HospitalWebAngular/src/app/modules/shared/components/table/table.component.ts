import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableHeader } from './table.types';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input()
  public template: TemplateRef<any>;

  @Input()
  public templateMobile: TemplateRef<any>;

  @Input()
  public source: any[];

  @Input()
  public headers?: TableHeader[];

  @Input()
  public noResultsText?: string;

  @Input()
  public loading: boolean;

  @ViewChild('items')
  public items: ElementRef;

  constructor() {
    this.template = null;
    this.templateMobile = null;
    this.source = null;
    this.headers = [];
    this.noResultsText = null;
    this.loading = false;
  }

  public ngOnInit(): void {
    if(this.template == null) {
      throw new Error('Property template is required');
    }

    //Si el template proporcionado no respeta la semántica de la tabla que sólo
    //debe tener hijos td, el component causará un fallo
    if(this.template.createEmbeddedView(null).rootNodes.some((node) => node.tagName != 'TD')) { 
      throw new Error('Template can only have direct children of type td');
    }
  }

  //Al ser la tabla de tipo table-layout fixed, los porcentajes
  //entre todos los headers actúan como calculadores proporcionales
  //en vez de valores absolutos
  public getHeaderWidth(size?: number): string {
    return `width: ${size && size > 0 ? (100 * size) : '100'}%;`;
  }
}
