import { Component, OnInit } from '@angular/core';
import { Patient } from '@services/patient/patient.model';
import { PatientService } from '@services/patient/patient.service';
import { MessageType, QueryParams } from '@services/http/http.types';
import { ButtonType, DateType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalPosition, ModalSize } from '@shared/components/modal/modal.types';
import { firstValueFrom } from 'rxjs';
import { Store } from '@store';
import { FilterPatientDTO } from '@services/patient/patient.dto';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html'
})
export class PatientsPage implements OnInit{
  public get modalTitle() {
    return this.patient?.id ?  'Editar Paciente' : 'Nuevo Paciente';
  }

  public patients: Patient[];
  public modalOpen: boolean;
  public panelOpen: boolean;
  public patient: Patient;
  public loading: boolean;
  public saving: boolean;
  public filter: QueryParams;
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
    private store: Store
  ) { 
    this.patients = [];
    this.modalOpen = false;
    this.panelOpen = false;
    this.patient = null;
    this.loading = false;
    this.saving = false;
    this.confirmText = null;
    this.confirmOpen = false;
    this.messages = [];
    this.confirmFunction = null;
    this.filter = new FilterPatientDTO();
  }

  public ngOnInit(): void {
    this.list();
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

  public createUpdate(data: unknown = null): void {
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
          this.store.siteMessage = { type: MessageType.Success, text: response.messages[0] };
          this.list();
        }else if(response.messages.length > 0) {
          this.store.siteMessage = { type: MessageType.Warning, text: response.messages[0] };
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
          this.filter = new FilterPatientDTO({ documentId: response.data.documentId });
        }

        this.modalOpen = false;
        this.store.siteMessage = { type: MessageType.Success, text: response.messages[0] };
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
