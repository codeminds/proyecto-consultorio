import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';

import { AppointmentService } from '../services/appointment.js';
import { DateService } from '../services/date.js';
import { DoctorService } from '../services/doctor.js';
import { FieldService } from '../services/field.js';
import { StatusService } from '../services/status.js';
import { PatientService } from '../services/patient.js';

class ViewModel extends BaseViewModel {
   #id;
   #modal;
   #table;
   #formTitle;

   constructor() {
      super();

      this.#id = null;
      this.#table = document.querySelector('[data-table]');
      this.#formTitle = document.querySelector('[data-form-title]');
      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         document.forms.insertUpdate.date.value = '';
         document.forms.insertUpdate.doctor.selectedIndex = 0;
         document.forms.insertUpdate.patient.selectedIndex = 0;
         document.forms.insertUpdate.status.value = 1;
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

   initStatusses() {
      StatusService.list((statusses) => {
         this.#populateStatusses(document.querySelector('[data-form="statusses"]'), statusses, false);
         this.#populateStatusses(document.querySelector('[data-filter="statusses"]'), [{ id: '', name: 'Todos' }, ...statusses], true);
      });
   }

   #populateStatusses(checks, statusses, inline) {
      for (const status of statusses) {
         const check = document.createElement('label');
         check.classList.add('check');
         if(inline) {
            check.classList.add('inline');
         }

         const input = document.createElement('input');
         input.setAttribute('type', 'radio');
         input.setAttribute('name', 'status');
         input.value = status.id;
         check.appendChild(input);

         check.appendChild(document.createElement('i'));

         const span = document.createElement('span');
         span.textContent = status.name;
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
                     document.forms.insertUpdate.status.value = appointment.status.id;
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
         patientId: document.forms.insertUpdate.patient.value,
         statusId: document.forms.insertUpdate.status.value
      };

      if (this.#id == null) {
         AppointmentService.insert(data, this.#onsaved.bind(this));
      } else {
         AppointmentService.update(this.#id, data, this.#onsaved.bind(this));
      }
   }

   #onsaved(appointment) {
      this.#modal.close();
      document.forms.doctorFilter.code.value = appointment.doctor.code;
      document.forms.doctorFilter.firstName.value = '';
      document.forms.doctorFilter.lastName.value = '';
      document.forms.doctorFilter.field.value = '';
      document.forms.patientFilter.documentId.value = appointment.patient.documentId;
      document.forms.patientFilter.firstName.value = '';
      document.forms.patientFilter.lastName.value = '';
      document.forms.patientFilter.tel.value = '';
      document.forms.patientFilter.email.value = '';
      document.forms.filter.dateFrom.value = DateService.toInputDateString(appointment.date);
      document.forms.filter.dateTo.value = DateService.toInputDateString(appointment.date);
      document.forms.filter.status.value = '';
      this.searchAppointments();
   }

   searchAppointments() {
      const dateFrom = document.forms.filter.dateFrom.value;
      const dateTo = document.forms.filter.dateTo.value;

      const filter = {
         dateFrom: dateFrom ? new Date(dateFrom) : null,
         dateTo: dateTo ? new Date(dateTo) : null,
         statusId: document.forms.filter.status.value,
         doctor: {
            code: document.forms.doctorFilter.code.value,
            firstName: document.forms.doctorFilter.firstName.value,
            lastName: document.forms.doctorFilter.lastName.value,
            fieldId: document.forms.doctorFilter.field.value
         },
         patient: {
            documentId: document.forms.patientFilter.documentId.value,
            firstName: document.forms.patientFilter.firstName.value,
            lastName: document.forms.patientFilter.lastName.value,
            tel: document.forms.patientFilter.tel.value,
            email: document.forms.patientFilter.email.value,
         }
      };

      AppointmentService.list(filter, (appointments) => {
         this.#table.innerHTML = '';
         if (appointments.length > 0) {
            for (const appointment of appointments) {
               const row = document.createElement('tr');

               const date = document.createElement('td');
               date.classList.add('heading');
               date.textContent = DateService.toDisplayLocaleString(appointment.date, 'es-US');
               row.appendChild(date);

               //Doctor
               const doctor = document.createElement('td');
               doctor.classList.add('data');

               const doctorLabel = document.createElement('label');
               doctorLabel.textContent = 'Nombre';
               doctor.appendChild(doctorLabel);

               const doctorText = document.createElement('span');
               doctorText.textContent = appointment.doctor.firstName + ' ' + appointment.doctor.lastName;
               doctor.appendChild(doctorText);

               row.appendChild(doctor);

               //Patient
               const patient = document.createElement('td');
               patient.classList.add('data');

               const patientLabel = document.createElement('label');
               patientLabel.textContent = 'Nombre';
               patient.appendChild(patientLabel);

               const patientText = document.createElement('span');
               patientText.textContent = appointment.patient.firstName + ' ' + appointment.patient.lastName;
               patient.appendChild(patientText);

               row.appendChild(patient);

               //Status
               const status = document.createElement('td');
               status.classList.add('data');

               const statusLabel = document.createElement('label');
               statusLabel.textContent = 'Nombre';
               status.appendChild(statusLabel);

               const statusText = document.createElement('span');
               statusText.textContent = appointment.status.name;
               status.appendChild(statusText);

               row.appendChild(status);

               //Buttons
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
viewModel.initStatusses();
viewModel.initDoctors();
viewModel.initPatients();
viewModel.initFilter();
viewModel.initModal();
viewModel.initTable();

viewModel.searchAppointments();