import { Component, OnInit } from '@angular/core';
import { FilterAppointmentDTO } from '@services/appointment/appointment.dto';
import { Appointment } from '@services/appointment/appointment.model';
import { AppointmentService } from '@services/appointment/appointment.service';
import { Doctor } from '@services/doctor/doctor.model';
import { DoctorService } from '@services/doctor/doctor.service';
import { Field } from '@services/field/field.model';
import { FieldService } from '@services/field/field.service';
import { MessageType, QueryParams } from '@services/http/http.types';
import { Patient } from '@services/patient/patient.model';
import { PatientService } from '@services/patient/patient.service';
import { User } from '@services/user/user.model';
import { InputType, ButtonType, DateType } from '@shared/components/form-field/form-field.types';
import { ModalSize, ModalPosition } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { UserRole } from '@utils/enums';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html'
})
export class AppointmentsPage implements OnInit {
  public appointments: Appointment[];
  public fields: Field[];
  public modalOpen: boolean;
  public panelOpen: boolean;
  public appointment: Appointment;
  public loading: boolean;
  public saving: boolean;
  public filter: QueryParams;
  public confirmText: string;
  public confirmOpen: boolean;
  public messages: string[];
  public $user: Observable<User>;

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;
  public DateType = DateType;

  private confirmFunction: () => void;
  
  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private fieldService: FieldService,
    private store: Store
  ) { 
    this.appointments = [];
    this.fields = [];
    this.modalOpen = false;
    this.panelOpen = false;
    this.appointment = null;
    this.loading = false;
    this.saving = false;
    this.confirmText = null;
    this.confirmOpen = false;
    this.messages = [];
    this.confirmFunction = null;
    this.filter = new FilterAppointmentDTO();
  }

  public ngOnInit(): void {
    this.$user = this.store.$user;
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

      const response = await firstValueFrom(this.appointmentService.list(this.filter));
      if(response.success) {
        this.appointments = response.data;
      }

      this.loading = false;
    }
  }

  public createUpdate(data: unknown = null): void {
    this.appointment = new Appointment(data);
    this.modalOpen = true;
  }

  public deleteAppointment(id: number): void {
    this.confirmOpen = true;
    this.confirmText = 'Está seguro que desea eliminar este récord?';
    this.confirmFunction = async () => {
      if(!this.saving) {
        this.saving = true;

        const response = await firstValueFrom(this.appointmentService.delete(id));
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
      
      const isNew = this.appointment.id == null
      const response = await firstValueFrom(isNew ? this.appointmentService.post(this.appointment) : this.appointmentService.put(this.appointment.id, this.appointment));  
      if(response.success) {
        if(isNew) {
          this.panelOpen = true;
          this.filter = new FilterAppointmentDTO({
            doctor: { documentId: response.data.doctor.documentId },
            patient: { documentId: response.data.patient.documentId },
            dateFrom: response.data.date,
            dateTo: response.data.date
          });
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
    return ((search: string) => firstValueFrom(this.doctorService.search(search.trim().split(' '))).then((response) => response.data)).bind(this);
  }

  public getLookupPatientsFunction(): (search: string) => Promise<Patient[]> {
    return ((search: string) => firstValueFrom(this.patientService.search(search.trim().split(' '))).then((response) => response.data)).bind(this);
  }

  public canEdit(user: User): boolean {
    return user.isSuperAdmin || user.hasRoles([UserRole.Administrator, UserRole.Editor]);
  }
}
