import { Component, OnInit } from '@angular/core';
import { Doctor } from '@services/doctor/doctor.model';
import { DoctorService } from '@services/doctor/doctor.service';
import { FieldService } from '@services/field/field.service';
import {  } from '@services/http/http.types';
import { ButtonType, InputType, Option } from '@shared/components/form-field/form-field.types';
import { ModalSize } from '@shared/components/modal/modal.types';
import { endWith, map, Observable, of, startWith, tap } from 'rxjs';

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

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ButtonType = ButtonType;

  constructor(
    private doctorService: DoctorService,
    private fieldService: FieldService
  ) { 
    this.$doctors = of([]);
    this.$fields = of([]);
    this.modalOpen = false;
    this.doctor = null;
    this.loading = false;
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
          map((fields) => fields?.map((item) => ({ label: item.name, value: item.id }))),
          startWith([])
        );
  }

  public click(text: string): void {
    alert(text)
  }

  public list(): void {
    this.loading = true;
    this.$doctors = this.doctorService.list(this.filter)
      .pipe(
        tap(() => {
          this.loading = false;
        }),
        endWith([])
      );
  }

  public createUpdate(doctor?: Doctor) {
    this.doctor = doctor;
    this.modalOpen = true;
  }
}
