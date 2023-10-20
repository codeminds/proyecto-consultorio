import { Component, OnInit } from '@angular/core';
import { FilterAppointmentDTO } from 'src/app/api/appointment/appointment.dto';
import { Appointment } from 'src/app/api/appointment/appointment.model';
import { AppointmentApi } from '@api/appointment/appointment.api';
import { Doctor } from '@api/doctor/doctor.model';
import { DoctorApi } from '@api/doctor/doctor.api';
import { Field } from '@api/field/field.model';
import { FieldApi } from '@api/field/field.api';
import { MessageType, QueryParams } from '@services/http/http.types';
import { Patient } from '@api/patient/patient.model';
import { PatientApi } from '@api/patient/patient.api';
import { InputType, DateType } from '@shared/components/form-field/form-field.types';
import { ModalSize, ModalPosition } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { firstValueFrom } from 'rxjs';
import { Status } from '@api/status/status.model';
import { StatusApi } from '@api/status/status.api';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html'
})
export class AppointmentsPage implements OnInit {
  public get modalTitle(): string {
    return this.appointment?.id ?  'Editar Cita' : 'Nueva Cita';
  }

  public get confirmDelete(): boolean {
    return this.deleteId != null;
  } 

  public appointments: Appointment[];
  public fields: Field[];
  public statusses: Status[];
  public modalOpen: boolean;
  public panelOpen: boolean;
  public appointment: Appointment;
  public loading: boolean;
  public saving: boolean;
  public filter: QueryParams;
  public deleteId: number;
  public messages: string[];

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public DateType = DateType;
  
  constructor(
    private appointmentApi: AppointmentApi,
    private doctorApi: DoctorApi,
    private patientApi: PatientApi,
    private fieldApi: FieldApi,
    private statusApi: StatusApi,
    private store: Store
  ) { 
    this.appointments = [];
    this.fields = [];
    this.statusses = [];
    this.modalOpen = false;
    this.panelOpen = false;
    this.appointment = null;
    this.loading = false;
    this.saving = false;
    this.messages = [];
    this.filter = new FilterAppointmentDTO();
  }

  public ngOnInit(): void {
    this.loadFields();
    this.loadStatusses();
    this.list();
  }

  public async loadFields(): Promise<void> {
    const response = await firstValueFrom(this.fieldApi.list());
    if(response.success) {
      this.fields = response.data;
    }
  }

  public async loadStatusses(): Promise<void> {
    const response = await firstValueFrom(this.statusApi.list());
    if(response.success) {
      this.statusses = response.data;
    }
  }

  public async list(): Promise<void> {
    if(!this.loading) {
      this.loading = true;
      this.appointments = [];

      const response = await firstValueFrom(this.appointmentApi.list(this.filter));
      if(response.success) {
        this.appointments = response.data;
      }

      this.loading = false;
    }
  }

  public insertUpdate(data: unknown = null): void {
    this.appointment = new Appointment(data);
    this.modalOpen = true;
  }

  public async saveAppointment(): Promise<void> {
    if(!this.saving) {
      this.saving = true;
        
      const isNew = this.appointment.id == null
      const response = await firstValueFrom(isNew ? this.appointmentApi.post(this.appointment) : this.appointmentApi.put(this.appointment));  
      this.messages = [];
      
      if(response.success) {
        this.panelOpen = true;
        this.filter = new FilterAppointmentDTO({
          doctor: { code: response.data.doctor.code },
          patient: { documentId: response.data.patient.documentId },
          dateFrom: response.data.date,
          dateTo: response.data.date
        });

        this.modalOpen = false;
        this.store.siteMessage = { type: MessageType.Success, text: response.messages[0] };
        this.list();
      }else if(response.messages.length > 0) {
        this.messages = response.messages;
      }

      this.saving = false;
    }
  }

  public async deleteAppointment(): Promise<void> {
    if(!this.saving) {
      this.saving = true;

      const response = await firstValueFrom(this.appointmentApi.delete(this.deleteId));
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
    this.appointment = null;
    this.messages = [];
  }

  public selectDoctor(data: unknown): void {
    this.appointment.doctor = new Doctor(data);
  }

  public selectPatient(data: unknown): void {
    this.appointment.patient = new Patient(data);
  }

  public getLookupDoctorsFunction(): (search: string) => Promise<Doctor[]> {
    return ((search: string) => firstValueFrom(this.doctorApi.search(search.trim().split(' '))).then((response) => response.data)).bind(this);
  }

  public getLookupPatientsFunction(): (search: string) => Promise<Patient[]> {
    return ((search: string) => firstValueFrom(this.patientApi.search(search.trim().split(' '))).then((response) => response.data)).bind(this);
  }
}
