import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';

import { AppointmentService } from '../services/appointment.js';
import { DateService } from '../services/date.js';
import { DoctorService } from '../services/doctor.js';
import { FieldService } from '../services/field.js';
import { GenderService } from '../services/gender.js';
import { PatientService } from '../services/patient.js';

class ViewModel extends BaseViewModel {
   #id;
   #modal;
   #table;
   #formTitle;

   constructor() {
      super();

      this.#id = null;
      this.#table = document.querySelector('[data-results]');
      this.#formTitle = document.querySelector('[data-form-title]');
      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         document.forms.insertUpdate.date.value = '';
         document.forms.insertUpdate.doctor.selectedIndex = 0;
         document.forms.insertUpdate.patient.selectedIndex = 0;
         this.#formTitle.textContent = '';
      });
   }

   initFields() {
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

   initGenders() {
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

   initDoctors() {
      DoctorService.list(null, (doctors) => {
         this.#populateDoctors(document.querySelector('[data-form="doctors"]'), doctors);
      });
   }

   #populateDoctors(select, doctors) {
      for (const doctor of doctors) {
         const option = document.createElement('option');
         option.value = doctor.id;
         option.textContent = `(${doctor.field.name}) ${doctor.firstName} ${doctor.lastName}`;
         select.appendChild(option);
      }
   }

   initPatients() {
      PatientService.list(null, (patients) => {
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

   initFilter() {
      document.querySelector('[data-search]').addEventListener('click', () => {
         this.searchAppointments();
      });
   }

   initModal() {
      document.querySelector('[data-new]').addEventListener('click', () => {
         this.#formTitle.textContent = 'Nueva Cita';
         this.#modal.open();
      });

      document.querySelector('[data-save]').addEventListener('click', () => {
         this.#save();
      });

      document.querySelector('[data-cancel]').addEventListener('click', () => {
         this.#modal.close();
      });
   }

   initTable() {
      this.#table.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               AppointmentService.get(id, (appointment) => {
                  if (appointment != null) {
                     this.#id = appointment.id;
                     document.forms.insertUpdate.date.value = DateService.toInputDateString(appointment.date);
                     document.forms.insertUpdate.doctor.value = appointment.doctor.id;
                     document.forms.insertUpdate.patient.value = appointment.patient.id;
                     this.#formTitle.textContent = 'Editar Cita';
                     this.#modal.open();
                  } else {
                     alert('Cita no existe en los registros');
                  }
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta cita?')) {
                  const id = e.target.getAttribute('data-id');
                  AppointmentService.delete(id, (appointment) => {
                     if (appointment) {
                        this.searchAppointments();
                     } else {
                        alert('Cita no existe en los registros');
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
         AppointmentService.insert(data, this.#onsaved.bind(this));
      } else {
         AppointmentService.update(this.#id, data, this.#onsaved.bind(this));
      }
   }

   #onsaved(appointment) {
      this.#modal.close();
      document.forms.doctorFilter.documentId.value = appointment.doctor.documentId;
      document.forms.doctorFilter.firstName.value = '';
      document.forms.doctorFilter.lastName.value = '';
      document.forms.doctorFilter.field.value = '';
      document.forms.patientFilter.documentId.value = appointment.patient.documentId;
      document.forms.patientFilter.firstName.value = '';
      document.forms.patientFilter.lastName.value = '';
      document.forms.patientFilter.birthDateFrom.value = '';
      document.forms.patientFilter.birthDateTo.value = '';
      document.forms.patientFilter.gender.value = '';
      document.forms.filter.dateFrom.value = DateService.toInputDateString(appointment.date);
      document.forms.filter.dateTo.value = DateService.toInputDateString(appointment.date);
      this.searchAppointments();
   }

   searchAppointments() {
      const dateFrom = document.forms.filter.dateFrom.value;
      const dateTo = document.forms.filter.dateTo.value;

      const patientBirthDateFrom = document.forms.patientFilter.birthDateFrom.value;
      const patientBirthDateTo = document.forms.patientFilter.birthDateTo.value;

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
            birthDateFrom: patientBirthDateFrom ? new Date(patientBirthDateFrom) : null,
            birthDateTo: patientBirthDateTo ? new Date(patientBirthDateTo) : null,
            genderId: document.forms.patientFilter.gender.value
         }
      };

      AppointmentService.list(filter, (appointments) => {
         this.#table.innerHTML = '';
         if (appointments.length > 0) {
            for (const appointment of appointments) {
               const row = document.createElement('tr');

               const date = document.createElement('td');
               date.textContent = DateService.toDisplayLocaleString(appointment.date, 'es-US');
               row.appendChild(date);

               const doctorName = document.createElement('td');
               doctorName.textContent = appointment.doctor.firstName + ' ' + appointment.doctor.lastName;
               row.appendChild(doctorName);

               const patientName = document.createElement('td');
               patientName.textContent = appointment.patient.firstName + ' ' + appointment.patient.lastName;
               row.appendChild(patientName);

               const field = document.createElement('td');
               field.textContent = appointment.doctor.field.name;
               row.appendChild(field);

               const buttons = document.createElement('td');
               buttons.classList.add('buttons');

               const editButton = document.createElement('button');
               editButton.classList.add('button', 'success');
               editButton.setAttribute('data-click', 'edit');
               editButton.setAttribute('data-id', appointment.id);
               editButton.textContent = 'Editar';
               buttons.appendChild(editButton);

               const deleteButton = document.createElement('button');
               deleteButton.classList.add('button', 'danger');
               deleteButton.setAttribute('data-click', 'delete');
               deleteButton.setAttribute('data-id', appointment.id);
               deleteButton.textContent = 'Borrar';
               buttons.appendChild(deleteButton);

               row.appendChild(buttons);

               //MOBILE 
               const mobile = document.createElement('td');
               mobile.classList.add('mobile');

               const mobileHeading = document.createElement('h3');
               mobileHeading.classList.add('heading');
               mobileHeading.textContent = DateService.toDisplayLocaleString(appointment.date, 'es-US');
               mobile.appendChild(mobileHeading);

               const mobileDoctorName = document.createElement('p');
               const mobileDoctorNameLabel = document.createElement('label');
               const mobileDoctorNameText = document.createElement('span');
               mobileDoctorNameText.textContent = appointment.doctor.firstName + ' ' + appointment.doctor.lastName;
               mobileDoctorNameLabel.classList.add('label');
               mobileDoctorNameLabel.textContent = 'Doctor:';
               mobileDoctorName.classList.add('data');
               mobileDoctorName.appendChild(mobileDoctorNameLabel);
               mobileDoctorName.appendChild(mobileDoctorNameText);
               mobile.appendChild(mobileDoctorName);

               const mobilePatientName = document.createElement('p');
               const mobilePatientNameLabel = document.createElement('label');
               const mobilePatientNameText = document.createElement('span');
               mobilePatientNameText.textContent = appointment.patient.firstName + ' ' + appointment.patient.lastName;
               mobilePatientNameLabel.classList.add('label');
               mobilePatientNameLabel.textContent = 'Paciente:';
               mobilePatientName.classList.add('data');
               mobilePatientName.appendChild(mobilePatientNameLabel);
               mobilePatientName.appendChild(mobilePatientNameText);
               mobile.appendChild(mobilePatientName);

               const mobileField = document.createElement('p');
               const mobileFieldLabel = document.createElement('label');
               const mobileFieldText = document.createElement('span');
               mobileFieldText.textContent = appointment.doctor.field.name;
               mobileFieldLabel.classList.add('label');
               mobileFieldLabel.textContent = 'Especialidad:';
               mobileField.classList.add('data');
               mobileField.appendChild(mobileFieldLabel);
               mobileField.appendChild(mobileFieldText);
               mobile.appendChild(mobileField);

               const mobileButtons = document.createElement('div');
               mobileButtons.classList.add('buttons');

               const mobileEditButton = document.createElement('button');
               mobileEditButton.classList.add('button', 'success');
               mobileEditButton.setAttribute('data-click', 'edit');
               mobileEditButton.setAttribute('data-id', appointment.id);
               mobileEditButton.textContent = 'Editar';
               mobileButtons.appendChild(mobileEditButton);

               const mobileDeleteButton = document.createElement('button');
               mobileDeleteButton.classList.add('button', 'danger');
               mobileDeleteButton.setAttribute('data-click', 'delete');
               mobileDeleteButton.setAttribute('data-id', appointment.id);
               mobileDeleteButton.textContent = 'Borrar';
               mobileButtons.appendChild(mobileDeleteButton);

               mobile.appendChild(mobileButtons);

               row.appendChild(mobile);
               this.#table.appendChild(row);
            }
         } else {
            const row = document.createElement('tr');

            const noResults = document.createElement('td');
            noResults.style.textAlign = 'center';
            noResults.setAttribute('colspan', '5');
            noResults.textContent = 'No se encontraron resultados';
            row.appendChild(noResults);

            this.#table.appendChild(row);
         }
      });
   }

}

const viewModel = new ViewModel();

viewModel.initFields();
viewModel.initGenders();
viewModel.initDoctors();
viewModel.initPatients();
viewModel.initFilter();
viewModel.initModal();
viewModel.initTable();

viewModel.searchAppointments();