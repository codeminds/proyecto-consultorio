import { Component, OnInit } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { Doctor } from '@services/doctor/doctor.model';
import { DoctorService } from '@services/doctor/doctor.service';
import { FieldService } from '@services/field/field.service';
import { MessageType } from '@services/http/http.types';
import { ButtonType, InputType, Option } from '@shared/components/form-field/form-field.types';
import { ModalSize } from '@shared/components/modal/modal.types';
import { firstValueFrom, map, Observable, of, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.css']
})
export class DoctorsPage implements OnInit{
  public $doctors: Observable<Doctor[]>;
  public $fields: Observable<Option[]>;

  public modalOpen: boolean;
  public doctor: Doctor;
  public loading: boolean;
  public filter: any;
  public confirmText: string;
  public confirmOpen: boolean;

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ButtonType = ButtonType;

  private confirmFunction: () => void;
  
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
          startWith([]),
          map((fields) => fields?.map((item) => ({ label: item.name, value: item.id })))
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

  public createUpdate(data: Doctor = null) {
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
          this.list();
        }else {
          this.appService.siteMessage = { type: MessageType.Warning, text: response.messages[0] };
        }
      }
      this.loading = false;
    }
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
}
