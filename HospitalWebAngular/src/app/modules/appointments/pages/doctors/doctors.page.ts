import { Component, OnInit } from '@angular/core';
import { Doctor } from '@api/doctor/doctor.model';
import { DoctorApi } from '@api/doctor/doctor.api';
import { Field } from '@api/field/field.model';
import { FieldApi } from '@api/field/field.api';
import { MessageType, QueryParams } from '@services/http/http.types';
import { ButtonType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalPosition, ModalSize } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { firstValueFrom } from 'rxjs';
import { FilterDoctorDTO } from '@api/doctor/doctor.dto';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html'
})
export class DoctorsPage implements OnInit{
  public get modalTitle() {
    return this.doctor?.id ?  'Editar Doctor' : 'Nuevo Doctor';
  }

  public get confirmDelete(): boolean {
    return this.deleteId != null;
  }

  public doctors: Doctor[];
  public fields: Field[];
  public modalOpen: boolean;
  public panelOpen: boolean;
  public doctor: Doctor;
  public loading: boolean;
  public saving: boolean;
  public filter: QueryParams;
  public deleteId: number;
  public messages: string[];

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;
  
  constructor(
    private doctorApi: DoctorApi,
    private fieldApi: FieldApi,
    private store: Store
  ) { 
    this.doctors = [];
    this.fields = [];
    this.modalOpen = false;
    this.panelOpen = false;
    this.doctor = null;
    this.loading = false;
    this.saving = false;
    this.messages = [];
    this.filter = new FilterDoctorDTO();
  }

  public ngOnInit(): void {
    this.loadFields();
    this.list();
  }

  public async loadFields(): Promise<void> {
    const response = await firstValueFrom(this.fieldApi.list());
    if(response.success) {
      this.fields = response.data;
    }
  }

  public async list(): Promise<void> {
    if(!this.loading) {
      this.loading = true;

      const response = await firstValueFrom(this.doctorApi.list(this.filter));
      if(response.success) {
        this.doctors = response.data;
      }

      this.loading = false;
    }
  }

  public insertUpdate(data: unknown = null): void {
    this.doctor = new Doctor(data);
    this.modalOpen = true;
  }

  public async saveDoctor(): Promise<void> {
    if(!this.saving) {
      this.saving = true;
      
      const isNew = this.doctor.id == null
      const response = await firstValueFrom(isNew ? this.doctorApi.post(this.doctor) : this.doctorApi.put(this.doctor));  
      this.messages = [];
      
      if(response.success) {
        if(isNew) {
          this.panelOpen = true;
          this.filter = new FilterDoctorDTO({ documentId: response.data.documentId });
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

  public async deleteDoctor(): Promise<void> {
    if(!this.saving) {
      this.saving = true;

      const response = await firstValueFrom(this.doctorApi.delete(this.deleteId));
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
    this.doctor = null;
    this.messages = [];
  }
}