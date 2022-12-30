import { Component, OnInit } from '@angular/core';
import { Patient } from '@api/patient/patient.model';
import { PatientApi } from '@api/patient/patient.api';
import { MessageType, QueryParams } from '@services/http/http.types';
import { ButtonType, DateType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalPosition, ModalSize } from '@shared/components/modal/modal.types';
import { firstValueFrom } from 'rxjs';
import { Store } from '@store';
import { FilterPatientDTO } from '@api/patient/patient.dto';
import { Gender } from '@api/gender/gender.model';
import { GenderApi } from '@api/gender/gender.api';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html'
})
export class PatientsPage implements OnInit{
  public get modalTitle() {
    return this.patient?.id ?  'Editar Paciente' : 'Nuevo Paciente';
  }

  public get confirmDelete(): boolean {
    return this.deleteId != null;
  }

  public patients: Patient[];
  public genders: Gender[];
  public modalOpen: boolean;
  public panelOpen: boolean;
  public patient: Patient;
  public loading: boolean;
  public saving: boolean;
  public filter: QueryParams;
  public deleteId: number;
  public messages: string[];

  public InputType = InputType;
  public DateType = DateType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;
  
  constructor(
    private patientService: PatientApi,
    private genderService: GenderApi,
    private store: Store
  ) { 
    this.patients = [];
    this.genders = [];
    this.modalOpen = false;
    this.panelOpen = false;
    this.patient = null;
    this.loading = false;
    this.saving = false;
    this.messages = [];
    this.filter = new FilterPatientDTO();
  }

  public ngOnInit(): void {
    this.loadGenders();
    this.list();
  }

  public async loadGenders(): Promise<void> {
    const response = await firstValueFrom(this.genderService.list());
    if(response.success) {
      this.genders = response.data;
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

  public createUpdate(data: unknown = null): void {
    this.patient = new Patient(data);
    this.modalOpen = true;
  }

  public async savePatient(): Promise<void> {
    if(!this.saving) {
      this.saving = true;
      
      const isNew = this.patient.id == null
      const response = await firstValueFrom(isNew ? this.patientService.post(this.patient) : this.patientService.put(this.patient.id, this.patient));  
      this.messages = [];
      
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

  public async deletePatient(): Promise<void> {
    if(!this.saving) {
      this.saving = true;

      const response = await firstValueFrom(this.patientService.delete(this.deleteId));
      if(response.success) {
        this.store.siteMessage = { type: MessageType.Success, text: response.messages[0] };
        this.list();
      }else if(response.messages.length > 0) {
        this.store.siteMessage = { type: MessageType.Warning, text: response.messages[0] };
      }

      this.saving = false;
      this.deleteId = null;
    }
  }

  public onModalClose(): void {
    this.patient = null;
    this.messages = [];
  }
}
