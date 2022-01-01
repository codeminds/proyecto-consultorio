import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TableHeader } from './table.types';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChild('items')
  public items: ElementRef;

  @Input()
  public headers: TableHeader[];

  @Input('template')
  public template: TemplateRef<any>;

  @Input('template-mobile')
  public templateMobile: TemplateRef<any>;

  @Input()
  public source: Observable<any[]>;

  constructor() {
    this.headers = [];
    this.template = null;
    this.templateMobile = null;
    this.source = of([]);
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
