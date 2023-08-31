import { Modal } from '../controls/modal.js';
import { PatientService } from '../services/patient.js';
import { GenderService } from '../services/gender.js';
import { BaseViewModel } from './base.js';
import { DateService } from '../services/date.js';

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
         document.forms.insertUpdate.documentId.value = '';
         document.forms.insertUpdate.firstName.value = '';
         document.forms.insertUpdate.lastName.value = '';
         document.forms.insertUpdate.birthDate.value = '';
         document.forms.insertUpdate.gender.value = 1;
         this.#formTitle.textContent = '';
      });
   }

   initGenders() {
      GenderService.list((genders) => {
         this.#populateGenders(document.querySelector('[data-form="genders"]'), genders);
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

   initFilter() {
      document.querySelector('[data-search]').addEventListener('click', () => {
         this.searchPatients();
      });
   }

   initModal() {
      document.querySelector('[data-new]').addEventListener('click', () => {
         this.#formTitle.textContent = 'Nuevo Paciente';
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
               PatientService.get(id, (patient) => {
                  if (patient != null) {
                     this.#id = patient.id;
                     document.forms.insertUpdate.documentId.value = patient.documentId;
                     document.forms.insertUpdate.firstName.value = patient.firstName;
                     document.forms.insertUpdate.lastName.value = patient.lastName;
                     document.forms.insertUpdate.birthDate.value = DateService.toInputDateString(patient.birthDate);
                     document.forms.insertUpdate.gender.value = patient.gender.id;
                     this.#formTitle.textContent = 'Editar Paciente';
                     this.#modal.open();
                  } else {
                     alert('Paciente no existe en los registros');
                  }
               });
               break;
            case 'delete':
               if (confirm('Desea borrar este paciente?')) {
                  const id = e.target.getAttribute('data-id');
                  PatientService.delete(id, (patient) => {
                     if (patient) {
                        this.searchPatients();
                     } else {
                        alert('Paciente no existe en los registros');
                     }
                  });
               }
               break;
         }
      });
   }

   #save() {
      const data = {
         documentId: document.forms.insertUpdate.documentId.value,
         firstName: document.forms.insertUpdate.firstName.value,
         lastName: document.forms.insertUpdate.lastName.value,
         birthDate: new Date(document.forms.insertUpdate.birthDate.value),
         genderId: document.forms.insertUpdate.gender.value
      };

      if (this.#id == null) {
         PatientService.insert(data, this.#onSaved.bind(this));
      } else {
         PatientService.update(this.#id, data, this.#onSaved.bind(this));
      }
   }

   #onSaved(patient) {
      this.#modal.close();
      document.forms.filter.documentId.value = patient.documentId;
      document.forms.filter.firstName.value = '';
      document.forms.filter.lastName.value = '';
      document.forms.filter.birthDateFrom.value = '';
      document.forms.filter.birthDateTo.value = '';
      document.forms.filter.gender.value = '';
      this.searchPatients();
   }

   searchPatients() {
      const birthDateFrom = document.forms.filter.birthDateFrom.value;
      const birthDateTo = document.forms.filter.birthDateTo.value;

      const filter = {
         documentId: document.forms.filter.documentId.value,
         firstName: document.forms.filter.firstName.value,
         lastName: document.forms.filter.lastName.value,
         birthDateFrom: birthDateFrom ? new Date(birthDateFrom) : null,
         birthDateTo: birthDateTo ? new Date(birthDateTo) : null,
         genderId: document.forms.filter.gender.value
      };

      PatientService.list(filter, (patients) => {
         this.#table.innerHTML = '';
         if (patients.length > 0) {
            for (const patient of patients) {
               const row = document.createElement('tr');

               const documentId = document.createElement('td');
               documentId.textContent = patient.documentId;
               row.appendChild(documentId);

               const name = document.createElement('td');
               name.textContent = patient.firstName + ' ' + patient.lastName;
               row.appendChild(name);

               const birthDate = document.createElement('td');
               birthDate.textContent = DateService.toDisplayLocaleString(patient.birthDate, 'es-US')
               row.appendChild(birthDate);

               const gender = document.createElement('td');
               gender.textContent = patient.gender.name;
               row.appendChild(gender);

               const buttons = document.createElement('td');
               buttons.classList.add('buttons');

               const editButton = document.createElement('button');
               editButton.classList.add('button', 'success');
               editButton.setAttribute('data-click', 'edit');
               editButton.setAttribute('data-id', patient.id);
               editButton.textContent = 'Editar';
               buttons.appendChild(editButton);

               const deleteButton = document.createElement('button');
               deleteButton.classList.add('button', 'danger');
               deleteButton.setAttribute('data-click', 'delete');
               deleteButton.setAttribute('data-id', patient.id);
               deleteButton.textContent = 'Borrar';
               buttons.appendChild(deleteButton);

               row.appendChild(buttons);

               //MOBILE
               const mobile = document.createElement('td');
               mobile.classList.add('mobile');

               const mobileHeading = document.createElement('h3');
               mobileHeading.classList.add('heading');
               mobileHeading.textContent = patient.documentId;
               mobile.appendChild(mobileHeading);

               const mobileName = document.createElement('p');
               const mobileNameLabel = document.createElement('label');
               const mobileNameText = document.createElement('span');
               mobileNameText.textContent = patient.firstName + ' ' + patient.lastName;
               mobileNameLabel.classList.add('label');
               mobileNameLabel.textContent = 'Nombre:';
               mobileName.classList.add('data');
               mobileName.appendChild(mobileNameLabel);
               mobileName.appendChild(mobileNameText);
               mobile.appendChild(mobileName);

               const mobileBirthDate = document.createElement('p');
               const mobileBirthDateLabel = document.createElement('label');
               const mobileBirthDateText = document.createElement('span');
               mobileBirthDateText.textContent = DateService.toDisplayLocaleString(patient.birthDate, 'es-US');
               mobileBirthDateLabel.classList.add('label');
               mobileBirthDateLabel.textContent = 'Nacimiento:';
               mobileBirthDate.classList.add('data');
               mobileBirthDate.appendChild(mobileBirthDateLabel);
               mobileBirthDate.appendChild(mobileBirthDateText);
               mobile.appendChild(mobileBirthDate);

               const mobileGender = document.createElement('p');
               const mobileGenderLabel = document.createElement('label');
               const mobileGenderText = document.createElement('span');
               mobileGenderText.textContent = patient.gender.name;
               mobileGenderLabel.classList.add('label');
               mobileGenderLabel.textContent = 'Genero:';
               mobileGender.classList.add('data');
               mobileGender.appendChild(mobileGenderLabel);
               mobileGender.appendChild(mobileGenderText);
               mobile.appendChild(mobileGender);

               const mobileButtons = document.createElement('div');
               mobileButtons.classList.add('buttons');

               const mobileEditButton = document.createElement('button');
               mobileEditButton.classList.add('button', 'success');
               mobileEditButton.setAttribute('data-click', 'edit');
               mobileEditButton.setAttribute('data-id', patient.id);
               mobileEditButton.textContent = 'Editar';
               mobileButtons.appendChild(mobileEditButton);

               const mobileDeleteButton = document.createElement('button');
               mobileDeleteButton.classList.add('button', 'danger');
               mobileDeleteButton.setAttribute('data-click', 'delete');
               mobileDeleteButton.setAttribute('data-id', patient.id);
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

viewModel.initGenders();
viewModel.initFilter();
viewModel.initModal();
viewModel.initTable();

viewModel.searchPatients();