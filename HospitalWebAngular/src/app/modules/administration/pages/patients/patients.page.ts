import { Component, OnInit } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { Patient } from '@services/patient/patient.model';
import { PatientService } from '@services/patient/patient.service';
import { Field } from '@services/field/field.model';
import { FieldService } from '@services/field/field.service';
import { MessageType } from '@services/http/http.types';
import { ButtonType, DateType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalPosition, ModalSize } from '@shared/components/modal/modal.types';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.css']
})
export class PatientsPage implements OnInit{
  public patients: Patient[];
  public fields: Field[];
  public modalOpen: boolean;
  public patient: Patient;
  public loading: boolean;
  public saving: boolean;
  public filter: any;
  public confirmText: string;
  public confirmOpen: boolean;
  public messages: string[];

  public InputType = InputType;
  public DateType = DateType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;

  private confirmFunction: () => void;
  
  constructor(
    private patientService: PatientService,
    private fieldService: FieldService,
    private appService: AppService
  ) { 
    this.patients = [];
    this.fields = [];
    this.modalOpen = false;
    this.patient = null;
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
      birthDateFrom: null,
      birthDateTo: null,
      gender: null
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
      this.patients = await firstValueFrom(this.patientService.list(this.filter)) || [];
      this.loading = false;
    }
  }

  public createUpdate(data: any = null) {
    this.patient = new Patient(data);
    this.modalOpen = true;
  }

  public deletePatient(id: number) {
    this.confirmOpen = true;
    this.confirmText = 'Está seguro que desea eliminar este récord?';
    this.confirmFunction = async () => {
      if(!this.saving) {
        this.saving = true;
        const response = await firstValueFrom(this.patientService.delete(id));
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
      
      const isNew = this.patient.id == null
      const response = await firstValueFrom(isNew ? this.patientService.post(this.patient) : this.patientService.put(this.patient.id, this.patient));  
      if(response != null) {
        if(response.success) {
          if(isNew) {
            this.filter = {
              documentId: response.data.documentId,
              firstName: null,
              lastName: null,
              fieldId: null,
              birthDateFrom: undefined,
              birtDateTo: undefined,
              gender: null 
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
    this.patient = null;
    this.messages = [];
  }
}
