import { Component, OnInit } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { Doctor } from '@services/doctor/doctor.model';
import { DoctorService } from '@services/doctor/doctor.service';
import { Field } from '@services/field/field.model';
import { FieldService } from '@services/field/field.service';
import { MessageType } from '@services/http/http.types';
import { ButtonType, InputType, Option } from '@shared/components/form-field/form-field.types';
import { ModalSize } from '@shared/components/modal/modal.types';
import { firstValueFrom, map, Observable, of, startWith, tap } from 'rxjs';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.css']
})
export class DoctorsPage implements OnInit{
  public $doctors: Observable<Doctor[]>;
  public $fields: Observable<Field[]>;

  public modalOpen: boolean;
  public doctor: Doctor;
  public loading: boolean;
  public filter: any;
  public confirmText: string;
  public confirmOpen: boolean;
  public messages: string[];

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ButtonType = ButtonType;

  private confirmFunction: () => void;
  private firstField: Field;
  
  constructor(
    private doctorService: DoctorService,
    private fieldService: FieldService,
    private appService: AppService
  ) { 
    this.$doctors = of([]);
    this.$fields = of([]);
    this.modalOpen = false;
    this.doctor = null;
    this.loading = false;
    this.confirmText = null;
    this.confirmOpen = false;
    this.messages = [];
    this.firstField = null;
    this.confirmFunction = null;
    this.filter = {
      documentId: null,
      firstName: null,
      lastName: null,
      fieldId: null 
    };
  }

  public ngOnInit(): void {
      this.list();
      this.$fields = this.fieldService.list()
        .pipe(
          startWith([])
        );
  }

  public list(): void {
    this.loading = true;
    this.$doctors = this.doctorService.list(this.filter)
      .pipe(
        tap(() => {
          this.loading = false;
        })
      );
  }

  public createUpdate(data: any = null) {
    this.doctor = new Doctor(data);
    this.modalOpen = true;
  }

  public deleteDoctor(id: number) {
    this.confirmOpen = true;
    this.confirmText = 'Está seguro que desea eliminar este récord?';
    this.confirmFunction = async () => {
      this.loading = true;
      const response = await firstValueFrom(this.doctorService.delete(id));
      if(response != null) {
        if(response.success) {
          this.appService.siteMessage = { type: MessageType.Success, text: 'Se eliminó el récord correctamente' };
          this.list();
        }else {
          this.appService.siteMessage = { type: MessageType.Warning, text: response.messages[0] };
        }
      }
      this.loading = false;
    }
  }

  public async save() {
    const isNew = this.doctor.id == null
    const response = await firstValueFrom(isNew ? this.doctorService.post(this.doctor) : this.doctorService.put(this.doctor.id, this.doctor));
    this.messages = [];
    if(response != null) {
      if(response.success) {
        if(isNew) {
          this.filter = {
            documentId: response.data.documentId,
            firstName: null,
            lastName: null,
            fieldId: null 
          }
        }

        this.modalOpen = false;
        this.appService.siteMessage = { type: MessageType.Success, text: 'Se guardó el récord correctamente' };
        this.list();
      }else {
        this.messages = response.messages;
      }
    }
    this.loading = false;
  }

  public confirm(confirmed: boolean) {
    if(confirmed) {
      this.confirmFunction();
    }

    this.confirmOpen = false;

  }

  public onConfirmClose() {
    this.confirmText = null;
    this.confirmFunction = null;
  }

  public onModalClose() {
    this.doctor = null;
    this.messages = [];
  }
}
