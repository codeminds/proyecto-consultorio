import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { Doctor } from '@services/doctor/doctor.model';
import { ButtonType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalSize } from '@shared/components/modal/modal.types';
import { TableHeader } from '@shared/components/table/table.types';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.css']
})
export class DoctorsPage {
  public name: string;
  public check: boolean;
  public gender: boolean;
  public open: boolean;
  public modal1Open: boolean;
  public modal2Open: boolean;
  public headers: TableHeader[];
  public doctors: Observable<Doctor[]>;

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ButtonType = ButtonType;

  constructor() { 
    this.name = null;
    this.check = false;
    this.gender = false;
    this.open = true;
    this.modal1Open = false;
    this.modal2Open = false;
    this.doctors = of([]);

    setTimeout(() => {
      this.doctors = of([
        new Doctor({documentId: '123', firstName: 'Hugo', lastName: 'Doctor', field: { name: 'Doctor General '}}),
        new Doctor({documentId: '123', firstName: 'Hugo', lastName: 'Doctor', field: { name: 'Doctor General '}}),
        new Doctor({documentId: '123', firstName: 'Hugo', lastName: 'Doctor', field: { name: 'Doctor General '}}),
        new Doctor({documentId: '123', firstName: 'Hugo', lastName: 'Doctor', field: { name: 'Doctor General '}}),
        new Doctor({documentId: '123', firstName: 'Hugo', lastName: 'Doctor', field: { name: 'Doctor General '}}),
        new Doctor({documentId: '123', firstName: 'Hugo', lastName: 'Doctor', field: { name: 'Doctor General '}}),
      ])
    }, 1000)

  }

  public click(text: string): void {
    alert(text)
  }
}
