import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { FieldService } from '../services/field.js';
import { GenderService } from '../services/gender.js';
import { AppointmentsService } from '../services/appointment.js';
import { DateService } from '../services/date.js';
import { DoctorService } from '../services/doctor.js';
import { PatientsService } from '../services/patient.js';
import { OneWayCollectionProp, OneWayProp, TwoWayProp } from '../data-bind.js';

class ViewModel extends BaseViewModel {
   #id;
   #appointment;
   #filter;
   #fields;
   #genders;
   #doctors;
   #patients;
   #formTitle;
   #modal;
   #results;

   constructor() {
      super();

      this.#initFields();
      this.#initGenders();
      this.#initDoctors();
      this.#initPatients();
      this.#initFilter();
      this.#initAppointment();
      this.#initModal();
      this.#initResults();

      this.#searchAppointments();

   }

   #initFields() {
      this.#fields = new OneWayCollectionProp([]);

      this.#fields.subscribe(document.forms.doctorFilter.field);

      FieldService.list((fields) => {
         this.#fields.value = [{ id: '', name: 'Todos' }, ...fields];
      });
   }

   #initGenders() {
      this.#genders = new OneWayCollectionProp([]);

      this.#genders.subscribe(document.querySelector('[data-filter="genders"]'));

      GenderService.list((genders) => {
         this.#genders.value = [{ id: '', name: 'Todos' }, ...genders];
      });
   }

   #initDoctors() {
      this.#doctors = new OneWayCollectionProp([], {
         toDisplayDoctor: (value) => {
            return `(${value.field}) ${value.firstName} ${value.lastName}`;
         }
      });

      this.#doctors.subscribe(document.forms.createUpdate.doctor);

      DoctorService.list(null, (doctors) => {
         this.#doctors.value = doctors;
      });
   }

   #initPatients() {
      this.#patients = new OneWayCollectionProp([], {
         toDisplayPatient: (value) => {
            return `(${value.documentId}) ${value.firstName} ${value.lastName}`;
         }
      })

      this.#patients.subscribe(document.forms.createUpdate.patient);

      PatientsService.list(null, (patients) => {
         this.#patients.value = patients;
      });
   }

   #initFilter() {
      this.#filter = {
         dateFrom: new TwoWayProp(null, 'date', {
            toInputString: DateService.toInputDateString
         }),
         dateTo: new TwoWayProp(null, 'date', {
            toInputString: DateService.toInputDateString
         }),
         doctor: {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            fieldId: new TwoWayProp(null, 'number')
         },
         patient: {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            birthDateFrom: new TwoWayProp(null, 'date', {
               toInputString: DateService.toInputDateString
            }),
            birthDateTo: new TwoWayProp(null, 'date', {
               toInputString: DateService.toInputDateString
            }),
            genderId: new TwoWayProp(null, 'number')
         }
      };

      this.#filter.dateFrom.subscribe(document.forms.filter.dateFrom);
      this.#filter.dateTo.subscribe(document.forms.filter.dateTo);
      this.#filter.doctor.documentId.subscribe(document.forms.doctorFilter.documentId);
      this.#filter.doctor.firstName.subscribe(document.forms.doctorFilter.firstName);
      this.#filter.doctor.lastName.subscribe(document.forms.doctorFilter.lastName);
      this.#filter.doctor.fieldId.subscribe(document.forms.doctorFilter.field);
      this.#filter.patient.documentId.subscribe(document.forms.patientFilter.documentId);
      this.#filter.patient.firstName.subscribe(document.forms.patientFilter.firstName);
      this.#filter.patient.lastName.subscribe(document.forms.patientFilter.lastName);
      this.#filter.patient.birthDateFrom.subscribe(document.forms.patientFilter.birthDateFrom);
      this.#filter.patient.birthDateTo.subscribe(document.forms.patientFilter.birthDateTo);
      this.#filter.patient.genderId.subscribe(document.forms.patientFilter.gender);

      document.querySelector('[data-search]').addEventListener('click', () => {
         this.#searchAppointments();
      });
   }

   #initAppointment() {
      this.#id = null;

      this.#appointment = {
         date: new TwoWayProp(null, 'date', {
            toInputString: DateService.toInputDateString
         }),
         doctorId: new TwoWayProp(this.#doctors.value[0].id, 'number'),
         patientId: new TwoWayProp(this.#patients.value[0].id, 'number')
      };

      this.#appointment.date.subscribe(document.forms.createUpdate.date);
      this.#appointment.doctorId.subscribe(document.forms.createUpdate.doctor);
      this.#appointment.patientId.subscribe(document.forms.createUpdate.patient);
   }

   #initModal() {
      this.#formTitle = new OneWayProp(null, 'string');
      this.#formTitle.subscribe(document.querySelector('[data-form-title]'));

      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         this.#appointment.date.value = null;
         this.#appointment.doctorId.value = this.#doctors.value[0].id;
         this.#appointment.patientId.value = this.#patients.value[0].id;
         this.#formTitle.value = null;
      });

      document.querySelector('[data-new]').addEventListener('click', () => {
         this.#formTitle.value = 'Nueva Cita';
         this.#modal.open();
      });

      document.querySelector('[data-save]').addEventListener('click', () => {
         this.#save();
      });

      document.querySelector('[data-cancel]').addEventListener('click', () => {
         this.#modal.close();
      });
   }

   #initResults() {
      const results = document.querySelector('[data-results]');
      results.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               AppointmentsService.get(id, (appointment) => {
                  if (appointment != null) {
                     this.#id = appointment.id;
                     this.#appointment.date.value = appointment.date;
                     this.#appointment.doctorId.value = appointment.doctorId;
                     this.#appointment.patientId.value = appointment.patientId;
                     this.#formTitle.value = 'Editar Cita';
                     this.#modal.open();
                  } else {
                     alert('No se pudo cargar el resgistro seleccionado');
                  }
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  AppointmentsService.delete(id, (deleted) => {
                     if (deleted) {
                        this.#searchAppointments();
                     } else {
                        alert('No se pudo borrar la entrada');
                     }
                  });
               }
               break;
         }
      });

      this.#results = new OneWayCollectionProp([], {
         toDisplayDate: (value) => {
            return DateService.toDisplayLocaleString(value, 'es-US')
         }
      });
      this.#results.subscribe(results);
   }

   #save() {
      const data = {
         date: this.#appointment.date.value,
         doctorId: this.#appointment.doctorId.value,
         patientId: this.#appointment.patientId.value
      };

      if (this.#id == null) {
         AppointmentsService.insert(data, (appointment) => {
            let doctorDocumentId;
            let patientDocumentId;

            DoctorService.get(appointment.doctorId, (doctor) => {
               doctorDocumentId = doctor.documentId;
            })

            PatientsService.get(appointment.patientId, (patient) => {
               patientDocumentId = patient.documentId;
            });

            this.#modal.close();
            this.#filter.doctor.documentId.value = doctorDocumentId;
            this.#filter.doctor.firstName.value = null;
            this.#filter.doctor.lastName.value = null;
            this.#filter.doctor.fieldId.value = null;
            this.#filter.patient.documentId.value = patientDocumentId;
            this.#filter.patient.firstName.value = null;
            this.#filter.patient.lastName.value = null;
            this.#filter.patient.birthDateFrom.value = null;
            this.#filter.patient.birthDateTo.value = null;
            this.#filter.patient.genderId.value = null;
            this.#filter.dateFrom.value = appointment.date;
            this.#filter.dateTo.value = appointment.date;
            this.#searchAppointments();
         });
      } else {
         AppointmentsService.update(this.#id, data, (appointment) => {
            if (appointment != null) {
               let doctorDocumentId;
               let patientDocumentId;

               DoctorService.get(appointment.doctorId, (doctor) => {
                  doctorDocumentId = doctor.documentId;
               })

               PatientsService.get(appointment.patientId, (patient) => {
                  patientDocumentId = patient.documentId;
               });

               this.#modal.close();
               this.#filter.doctor.documentId.value = doctorDocumentId;
               this.#filter.doctor.firstName.value = null;
               this.#filter.doctor.lastName.value = null;
               this.#filter.doctor.fieldId.value = null;
               this.#filter.patient.documentId.value = patientDocumentId;
               this.#filter.patient.firstName.value = null;
               this.#filter.patient.lastName.value = null;
               this.#filter.patient.birthDateFrom.value = null;
               this.#filter.patient.birthDateTo.value = null;
               this.#filter.patient.genderId.value = null;
               this.#filter.dateFrom.value = appointment.date;
               this.#filter.dateTo.value = appointment.date;
               this.#searchAppointments();
            } else {
               alert('No se pudo actualizar el registro');
            }
         });
      }
   }

   #searchAppointments() {
      const filter = {
         dateFrom: this.#filter.dateFrom.value,
         dateTo: this.#filter.dateTo.value,
         doctor: {
            documentId: this.#filter.doctor.documentId.value,
            firstName: this.#filter.doctor.firstName.value,
            lastName: this.#filter.doctor.lastName.value,
            fieldId: this.#filter.doctor.fieldId.value
         },
         patient: {
            documentId: this.#filter.patient.documentId.value,
            firstName: this.#filter.patient.firstName.value,
            lastName: this.#filter.patient.lastName.value,
            birthDateFrom: this.#filter.patient.birthDateFrom.value,
            birthDateTo: this.#filter.patient.birthDateTo.value,
            genderId: this.#filter.patient.genderId.value
         }
      };

      AppointmentsService.list(filter, (appointments) => {
         this.#results.value = appointments;
      });
   }
}

const viewModel = new ViewModel();