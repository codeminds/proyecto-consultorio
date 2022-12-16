import { Component, OnInit } from '@angular/core';
import { Doctor } from '@api/doctor/doctor.model';
import { DoctorApi } from '@api/doctor/doctor.api';
import { Field } from '@api/field/field.model';
import { FieldApi } from '@api/field/field.api';
import { MessageType, QueryParams } from '@services/http/http.types';
import { ButtonType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalPosition, ModalSize } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '@api/user/user.model';
import { UserRole } from '@utils/enums';
import { FilterDoctorDTO } from '@api/doctor/doctor.dto';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html'
})
export class DoctorsPage implements OnInit{
  public get modalTitle() {
    return this.doctor?.id ?  'Editar Doctor' : 'Nuevo Doctor';
  }

  public doctors: Doctor[];
  public fields: Field[];
  public modalOpen: boolean;
  public panelOpen: boolean;
  public doctor: Doctor;
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

  private confirmFunction: () => void;
  
  constructor(
    private doctorService: DoctorApi,
    private fieldService: FieldApi,
    private store: Store
  ) { 
    this.doctors = [];
    this.fields = [];
    this.modalOpen = false;
    this.panelOpen = false;
    this.doctor = null;
    this.loading = false;
    this.saving = false;
    this.confirmText = null;
    this.confirmOpen = false;
    this.messages = [];
    this.confirmFunction = null;
    this.filter = new FilterDoctorDTO();
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

      const response = await firstValueFrom(this.doctorService.list(this.filter));
      if(response.success) {
        this.doctors = response.data;
      }

      this.loading = false;
    }
  }

  public createUpdate(data: unknown = null): void {
    this.doctor = new Doctor(data);
    this.modalOpen = true;
  }

  public deleteDoctor(id: number): void {
    this.confirmOpen = true;
    this.confirmText = 'Está seguro que desea eliminar este récord?';
    this.confirmFunction = async () => {
      if(!this.saving) {
        this.saving = true;
        
        const response = await firstValueFrom(this.doctorService.delete(id));
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
      
      const isNew = this.doctor.id == null
      const response = await firstValueFrom(isNew ? this.doctorService.post(this.doctor) : this.doctorService.put(this.doctor.id, this.doctor));  
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
    this.doctor = null;
    this.messages = [];
  }

  public canEdit(user: User): boolean {
    return user.isSuperAdmin || user.hasRoles([UserRole.Administrator, UserRole.Editor]);
  }
}
