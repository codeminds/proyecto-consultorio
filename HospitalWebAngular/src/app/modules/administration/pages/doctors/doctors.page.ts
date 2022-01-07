import { Component, OnInit } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { Doctor } from '@services/doctor/doctor.model';
import { DoctorService } from '@services/doctor/doctor.service';
import { Field } from '@services/field/field.model';
import { FieldService } from '@services/field/field.service';
import { MessageType } from '@services/http/http.types';
import { ButtonType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalPosition, ModalSize } from '@shared/components/modal/modal.types';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.css']
})
export class DoctorsPage implements OnInit{
  public doctors: Doctor[];
  public fields: Field[];
  public modalOpen: boolean;
  public doctor: Doctor;
  public loading: boolean;
  public saving: boolean;
  public filter: any;
  public confirmText: string;
  public confirmOpen: boolean;
  public messages: string[];

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;

  private confirmFunction: () => void;
  
  constructor(
    private doctorService: DoctorService,
    private fieldService: FieldService,
    private appService: AppService
  ) { 
    this.doctors = [];
    this.fields = [];
    this.modalOpen = false;
    this.doctor = null;
    this.loading = false;
    this.saving = false;
    this.confirmText = null;
    this.confirmOpen = false;
    this.messages = [];
    this.confirmFunction = null;
    this.filter = {
      documentId: null,
      firstName: null,
      lastName: null,
      fieldId: null 
    };
  }

  public ngOnInit(): void {
    this.loadFields();
    this.list();
  }

  public async loadFields(): Promise<void> {
    this.fields = await firstValueFrom(this.fieldService.list()) || [];
  }

  public async list(): Promise<void> {
    if(!this.loading) {
      this.loading = true;
      this.doctors = await firstValueFrom(this.doctorService.list(this.filter)) || [];
      this.loading = false;
    }
  }

  public createUpdate(data: any = null) {
    this.doctor = new Doctor(data);
    this.modalOpen = true;
  }

  public deleteDoctor(id: number) {
    this.confirmOpen = true;
    this.confirmText = 'Está seguro que desea eliminar este récord?';
    this.confirmFunction = async () => {
      if(!this.saving) {
        this.saving = true;
        const response = await firstValueFrom(this.doctorService.delete(id));
        if(response != null) {
          if(response.success) {
            this.appService.siteMessage = { type: MessageType.Success, text: 'Se eliminó el récord correctamente' };
            this.list();
          }else {
            this.appService.siteMessage = { type: MessageType.Warning, text: response.messages[0] };
          }
        }
        this.saving = false;
        this.confirmOpen = false;
      }
    }
  }

  public async save() {
    if(!this.saving) {
      this.saving = true;
      this.messages = [];
      
      const isNew = this.doctor.id == null
      const response = await firstValueFrom(isNew ? this.doctorService.post(this.doctor) : this.doctorService.put(this.doctor.id, this.doctor));  
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
      this.saving = false;
    }
  }

  public confirm(confirmed: boolean) {
    if(confirmed) {
      this.confirmFunction();
    }else {
      this.confirmOpen = false;
    }
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
