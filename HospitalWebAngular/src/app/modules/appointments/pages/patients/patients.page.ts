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
  templateUrl: './patients.page.html'
})
export class PatientsPage implements OnInit{
  public patients: Patient[];
  public fields: Field[];
  public modalOpen: boolean;
  public panelOpen: boolean;
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
    this.panelOpen = false;
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
    const response = await firstValueFrom(this.fieldService.list());
    if(response.success) {
      this.fields = response.data;
    }
  }

  public async list(): Promise<void> {
    if(!this.loading) {
      this.loading = true;

      const response = await firstValueFrom(this.patientService.list(this.filter));
      if(response.success) {
        this.patients = response.data;
      }

      this.loading = false;
    }
  }

  public createUpdate(data: any = null): void {
    this.patient = new Patient(data);
    this.modalOpen = true;
  }

  public deletePatient(id: number): void {
    this.confirmOpen = true;
    this.confirmText = 'Está seguro que desea eliminar este récord?';
    this.confirmFunction = async () => {
      if(!this.saving) {
        this.saving = true;
        const response = await firstValueFrom(this.patientService.delete(id));
        if(response.success) {
          this.appService.siteMessage = { type: MessageType.Success, text: response.messages[0] };
          this.list();
        }else {
          this.appService.siteMessage = { type: MessageType.Warning, text: response.messages[0] };
        }

        this.saving = false;
        this.confirmOpen = false;
      }
    }
  }

  public async save(): Promise<void> {
    if(!this.saving) {
      this.saving = true;
      this.messages = [];
      
      const isNew = this.patient.id == null
      const response = await firstValueFrom(isNew ? this.patientService.post(this.patient) : this.patientService.put(this.patient.id, this.patient));  
      if(response.success) {
        if(isNew) {
          this.panelOpen = true;
          this.filter = {
            documentId: response.data.documentId
          }
        }

        this.modalOpen = false;
        this.appService.siteMessage = { type: MessageType.Success, text: response.messages[0] };
        this.list();
      }else {
        this.messages = response.messages;
      }
      
      this.saving = false;
    }
  }

  public confirm(confirmed: boolean): void {
    if(confirmed) {
      this.confirmFunction();
    }else {
      this.confirmOpen = false;
    }
  }

  public onConfirmClose(): void {
    this.confirmText = null;
    this.confirmFunction = null;
  }

  public onModalClose(): void {
    this.patient = null;
    this.messages = [];
  }
}
