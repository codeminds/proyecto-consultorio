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
   #formTitle;
   #formErrors;
   #results;
   #modal;

   constructor() {
      super();

      this.#id = null;
      this.#formTitle = document.querySelector('[data-form-title]');
      this.#formErrors = document.querySelector('[data-form-errors]');
      this.#results = document.querySelector('[data-results]');
      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         document.forms.insertUpdate.date.value = '';
         document.forms.insertUpdate.doctor.selectedIndex = 0;
         document.forms.insertUpdate.patient.selectedIndex = 0;
         this.#formTitle.textContent = '';
         this.#formErrors.innerHTML = '';
      });
   }

   initFields() {
      FieldService.list((result) => {
         this.#populateFields(document.querySelector('[data-filter="fields"]'), [{ id: '', name: 'Todos' }, ...result.data]);
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
      GenderService.list((result) => {
         this.#populateGenders(document.querySelector('[data-filter="genders"]'), [{ id: '', name: 'Todos' }, ...result.data]);
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
      DoctorService.list(null, (result) => {
         this.#populateDoctors(document.querySelector('[data-form="doctors"]'), result.data);
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
      PatientsService.list(null, (result) => {
         this.#populatePatients(document.querySelector('[data-form="patients"]'), result.data);
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

   initResults() {
      this.#results.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               AppointmentsService.get(id, (result) => {
                  const appointment = result.data;
                  this.#id = appointment.id;
                  document.forms.insertUpdate.date.value = appointment.date;
                  document.forms.insertUpdate.doctor.value = appointment.doctor.id;
                  document.forms.insertUpdate.patient.value = appointment.patient.id;
                  this.#formTitle.textContent = 'Editar Cita';
                  this.#modal.open();
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  AppointmentsService.delete(id, (result) => {
                     if(result.success) {
                        this.searchAppointments();
                     } else {
                        let errors = '';

                        for(const error of result.messages) {
                           errors += `${error}\n`;
                        }

                        if(errors != '') {
                           alert(errors);
                        }
                     }
                  });
               }
               break;
         }
      });
   }

   #save() {
      const data = {
         date: document.forms.insertUpdate.date.value || null,
         doctorId: document.forms.insertUpdate.doctor.value,
         patientId: document.forms.insertUpdate.patient.value
      };

      this.#formErrors.innerHTML = '';
      if(this.#id == null) {
         AppointmentsService.insert(data, this.#onSaved.bind(this));
      } else {
         AppointmentsService.update(this.#id, data, this.#onSaved.bind(this));
      }
   }

   #onSaved(result) {
      if(result.success) {
         const appointment = result.data;
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
         document.forms.filter.dateFrom.value = appointment.date;
         document.forms.filter.dateTo.value = appointment.date;
         this.searchAppointments();
      } else {
         for(const message of result.messages) {
            const li = document.createElement('li');
            li.textContent = message;

            this.#formErrors.appendChild(li);
         }
      }
   }

   searchAppointments() {
      const filter = {
         dateFrom: document.forms.filter.dateFrom.value,
         dateTo: document.forms.filter.dateTo.value,
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
            birthDateFrom: document.forms.patientFilter.birthDateFrom.value,
            birthDateTo: document.forms.patientFilter.birthDateTo.value,
            genderId: document.forms.patientFilter.gender?.value
         }
      };

      AppointmentsService.list(filter, (result) => {
         const appointments = result.data;
         this.#results.innerHTML = '';
         for (const appointment of appointments) {
            const row = document.createElement('tr');

            const birthDate = document.createElement('td');
            birthDate.textContent = DateService.toDisplayLocaleString(new Date(appointment.date), 'es-US');
            row.appendChild(birthDate);

            const name = document.createElement('td');
            name.textContent = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
            row.appendChild(name);

            const patients = document.createElement('td');
            patients.textContent = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
            row.appendChild(patients);

            const field = document.createElement('td');
            field.textContent = appointment.doctor.field.name;
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
            mobileHeading.textContent = DateService.toDisplayLocaleString(new Date(appointment.date), 'es-US');
            mobile.appendChild(mobileHeading);

            const mobileDoctor = document.createElement('p');
            const mobileDoctorLabel = document.createElement('span');
            const mobileDoctorText = document.createElement('span');
            mobileDoctorLabel.classList.add('label');
            mobileDoctorLabel.textContent = 'Doctor:';
            mobileDoctorText.textContent = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
            mobileDoctor.classList.add('data');
            mobileDoctor.appendChild(mobileDoctorLabel);
            mobileDoctor.appendChild(mobileDoctorText);
            mobile.appendChild(mobileDoctor);

            const mobilePatient = document.createElement('p');
            const mobilePatientLabel = document.createElement('span');
            const mobilePatientText = document.createElement('span');
            mobilePatientLabel.classList.add('label');
            mobilePatientLabel.textContent = 'Paciente:';
            mobilePatientText.textContent = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
            mobilePatient.classList.add('data');
            mobilePatient.appendChild(mobilePatientLabel);
            mobilePatient.appendChild(mobilePatientText);
            mobile.appendChild(mobilePatient);

            const mobileField = document.createElement('p');
            const mobileFieldLabel = document.createElement('span');
            const mobileFieldText = document.createElement('span');
            mobileFieldLabel.classList.add('label');
            mobileFieldLabel.textContent = 'Especialidad:';
            mobileFieldText.textContent = appointment.doctor.field.name
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

//Inicialización
viewModel.initFields();
viewModel.initGenders();
viewModel.initDoctors();
viewModel.initPatients();
viewModel.initFilter();
viewModel.initModal();
viewModel.initResults();

//Búsqueda inicial
viewModel.searchAppointments();