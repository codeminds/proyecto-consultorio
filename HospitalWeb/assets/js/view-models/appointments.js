import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { FieldService } from '../services/field.js';
import { GenderService } from '../services/gender.js';
import { AppointmentsService } from '../services/appointment.js';
import { DateService } from '../services/date.js';
import { DoctorService } from '../services/doctor.js';
import { PatientsService } from '../services/patient.js';

class ViewModel extends BaseViewModel {
   #id;
   #modal;
   #results;

   constructor() {
      super();

      this.#id = null;

      this.#initFields();
      this.#initGenders();
      this.#initDoctors();
      this.#initPatients();
      this.#initFilter();
      this.#initModal();
      this.#initResults();

      this.#searchAppointments();

   }

   #initFields() {
      FieldService.list((fields) => {
         this.#populateFields(document.querySelector('[data-filter="fields"]'), [{ id: '', name: 'Todos' }, ...fields]);
      });
   }

   #populateFields(select, fields) {
      for (const field of fields) {
         const option = document.createElement('option');
         option.value = field.id;
         option.textContent = field.name;

         select.appendChild(option);
      }
   }

   #initGenders() {
      GenderService.list((genders) => {
         this.#populateGenders(document.querySelector('[data-filter="genders"]'), [{ id: '', name: 'Todos' }, ...genders]);
      });
   }

   #populateGenders(checks, genders) {
      for (const gender of genders) {
         const check = document.createElement('label');
         check.classList.add('check', 'inline');

         const input = document.createElement('input');
         input.setAttribute('type', 'radio');
         input.setAttribute('name', 'gender');
         input.value = gender.id;
         check.appendChild(input);

         check.appendChild(document.createElement('i'));

         const span = document.createElement('span');
         span.textContent = gender.name;
         check.appendChild(span);

         checks.appendChild(check);
      }

      checks.querySelector('label.check:first-child input').checked = true;
   }

   #initDoctors() {
      DoctorService.list(null, (doctors) => {
         this.#populateDoctors(document.querySelector('[data-form="doctors"]'), doctors);
      });
   }

   #populateDoctors(select, doctors) {
      for (const doctor of doctors) {
         const option = document.createElement('option');

         option.value = doctor.id;
         option.textContent = `(${doctor.field}) ${doctor.firstName} ${doctor.lastName}`;

         select.appendChild(option);
      }
   }

   #initPatients() {
      PatientsService.list(null, (patients) => {
         this.#populatePatients(document.querySelector('[data-form="patients"]'), patients);
      });
   }

   #populatePatients(select, patients) {
      for (const patient of patients) {
         const option = document.createElement('option');

         option.value = patient.id;
         option.textContent = `(${patient.documentId}) ${patient.firstName} ${patient.lastName}`;

         select.appendChild(option);
      }
   }

   #initFilter() {
      document.querySelector('[data-search]').addEventListener('click', () => {
         this.#searchAppointments();
      });
   }

   #initModal() {
      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         document.forms.insertUpdate.date.value = '';
         document.forms.insertUpdate.doctor.selectedIndex = 0;
         document.forms.insertUpdate.patient.selectedIndex = 0;
         document.querySelector('[data-form-title]').textContent = '';
      });

      document.querySelector('[data-new]').addEventListener('click', () => {
         document.querySelector('[data-form-title]').textContent = 'Nueva Cita';
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
      this.#results = document.querySelector('[data-results]');
      this.#results.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               AppointmentsService.get(id, (appointment) => {
                  if (appointment != null) {
                     this.#id = appointment.id;
                     document.forms.insertUpdate.date.value = DateService.toInputDateString(appointment.date);
                     document.forms.insertUpdate.doctor.value = appointment.doctorId;
                     document.forms.insertUpdate.patient.value = appointment.patientId;
                     document.querySelector('[data-form-title]').textContent = 'Editar Cita';
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
   }

   #save() {
      const data = {
         date: new Date(document.forms.insertUpdate.date.value),
         doctorId: document.forms.insertUpdate.doctor.value,
         patientId: document.forms.insertUpdate.patient.value
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
            document.forms.doctorFilter.documentId.value = doctorDocumentId;
            document.forms.doctorFilter.firstName.value = '';
            document.forms.doctorFilter.lastName.value = '';
            document.forms.doctorFilter.field.value = '';
            document.forms.patientFilter.documentId.value = patientDocumentId;
            document.forms.patientFilter.firstName.value = '';
            document.forms.patientFilter.lastName.value = '';
            document.forms.patientFilter.birthDateFrom.value = '';
            document.forms.patientFilter.birthDateTo.value = '';
            document.forms.patientFilter.gender.value = '';
            document.forms.filter.dateFrom.value = DateService.toInputDateString(appointment.date);
            document.forms.filter.dateTo.value = DateService.toInputDateString(appointment.date);
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
               document.forms.doctorFilter.documentId.value = doctorDocumentId;
               document.forms.doctorFilter.firstName.value = '';
               document.forms.doctorFilter.lastName.value = '';
               document.forms.doctorFilter.field.value = '';
               document.forms.patientFilter.documentId.value = patientDocumentId;
               document.forms.patientFilter.firstName.value = '';
               document.forms.patientFilter.lastName.value = '';
               document.forms.patientFilter.birthDateFrom.value = '';
               document.forms.patientFilter.birthDateTo.value = '';
               document.forms.patientFilter.gender.value = '';
               document.forms.filter.dateFrom.value = DateService.toInputDateString(appointment.date);
               document.forms.filter.dateTo.value = DateService.toInputDateString(appointment.date);
               this.#searchAppointments();
            } else {
               alert('No se pudo actualizar el registro');
            }
         });
      }
   }

   #searchAppointments() {
      const dateFrom = document.forms.filter.dateFrom.value;
      const dateTo = document.forms.filter.dateTo.value;
      const birthDateFrom = document.forms.patientFilter.birthDateFrom.value;
      const birthDateTo = document.forms.patientFilter.birthDateTo.value;

      const filter = {
         dateFrom: dateFrom ? new Date(dateFrom) : null,
         dateTo: dateTo ? new Date(dateTo) : null,
         doctor: {
            documentId: document.forms.doctorFilter.documentId.value,
            firstName: document.forms.doctorFilter.firstName.value,
            lastName: document.forms.doctorFilter.lastName.value,
            fieldId: document.forms.doctorFilter.field.value
         },
         patient: {
            documentId: document.forms.patientFilter.documentId.value,
            firstName: document.forms.patientFilter.firstName.value,
            lastName: document.forms.patientFilter.lastName.value,
            birthDateFrom: birthDateFrom ? new Date(birthDateFrom) : null,
            birthDateTo: birthDateTo ? new Date(birthDateTo) : null,
            genderId: document.forms.patientFilter.gender.value
         }
      };

      AppointmentsService.list(filter, (appointments) => {
         this.#results.innerHTML = '';
         for (const appointment of appointments) {
            const row = document.createElement('tr');

            const birthDate = document.createElement('td');
            birthDate.textContent = DateService.toDisplayLocaleString(appointment.date, 'es-US');
            row.appendChild(birthDate);

            const name = document.createElement('td');
            name.textContent = appointment.doctorName;
            row.appendChild(name);

            const patients = document.createElement('td');
            patients.textContent = appointment.patientName;
            row.appendChild(patients);

            const field = document.createElement('td');
            field.textContent = appointment.doctorField;
            row.appendChild(field);

            const buttons = document.createElement('td');
            buttons.classList.add('buttons');

            const buttonEdit = document.createElement('button');
            buttonEdit.classList.add('button', 'success');
            buttonEdit.setAttribute('data-click', 'edit');
            buttonEdit.setAttribute('data-id', appointment.id);
            buttonEdit.textContent = 'Editar';
            buttons.appendChild(buttonEdit);

            const buttonDelete = document.createElement('button');
            buttonDelete.classList.add('button', 'danger');
            buttonDelete.setAttribute('data-click', 'delete');
            buttonDelete.setAttribute('data-id', appointment.id);
            buttonDelete.textContent = 'Borrar';
            buttons.appendChild(buttonDelete);

            row.appendChild(buttons);

            const mobile = document.createElement('td');
            mobile.classList.add('mobile');

            const mobileHeading = document.createElement('h3');
            mobileHeading.classList.add('heading');
            mobileHeading.textContent = DateService.toDisplayLocaleString(appointment.date, 'es-US');
            mobile.appendChild(mobileHeading);

            const mobileDoctor = document.createElement('p');
            const mobileDoctorLabel = document.createElement('span');
            const mobileDoctorText = document.createElement('span');
            mobileDoctorLabel.classList.add('label');
            mobileDoctorLabel.textContent = 'Doctor:';
            mobileDoctorText.textContent = appointment.doctorName;
            mobileDoctor.classList.add('data');
            mobileDoctor.appendChild(mobileDoctorLabel);
            mobileDoctor.appendChild(mobileDoctorText);
            mobile.appendChild(mobileDoctor);

            const mobilePatient = document.createElement('p');
            const mobilePatientLabel = document.createElement('span');
            const mobilePatientText = document.createElement('span');
            mobilePatientLabel.classList.add('label');
            mobilePatientLabel.textContent = 'Paciente:';
            mobilePatientText.textContent = appointment.patientName;
            mobilePatient.classList.add('data');
            mobilePatient.appendChild(mobilePatientLabel);
            mobilePatient.appendChild(mobilePatientText);
            mobile.appendChild(mobilePatient);

            const mobileField = document.createElement('p');
            const mobileFieldLabel = document.createElement('span');
            const mobileFieldText = document.createElement('span');
            mobileFieldLabel.classList.add('label');
            mobileFieldLabel.textContent = 'Especialidad:';
            mobileFieldText.textContent = appointment.doctorField;
            mobileField.classList.add('data');
            mobileField.appendChild(mobileFieldLabel);
            mobileField.appendChild(mobileFieldText);
            mobile.appendChild(mobileField);

            const mobileButtons = document.createElement('div');
            mobileButtons.classList.add('buttons');

            const mobileButtonEdit = document.createElement('button');
            mobileButtonEdit.classList.add('button', 'success');
            mobileButtonEdit.setAttribute('data-click', 'edit');
            mobileButtonEdit.setAttribute('data-id', appointment.id);
            mobileButtonEdit.textContent = 'Editar';
            mobileButtons.appendChild(mobileButtonEdit);

            const mobileButtonDelete = document.createElement('button');
            mobileButtonDelete.classList.add('button', 'danger');
            mobileButtonDelete.setAttribute('data-click', 'delete');
            mobileButtonDelete.setAttribute('data-id', appointment.id);
            mobileButtonDelete.textContent = 'Borrar';
            mobileButtons.appendChild(mobileButtonDelete);

            mobile.appendChild(mobileButtons);
            row.appendChild(mobile);

            this.#results.appendChild(row);
         }
      });
   }
}

const viewModel = new ViewModel();