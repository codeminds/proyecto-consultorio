import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { GenderService } from '../services/gender.js';
import { PatientsService } from '../services/patient.js';
import { DateService } from '../services/date.js';

class ViewModel extends BaseViewModel {
   #id;
   #modal;
   #results;

   constructor() {
      super();

      this.#id = null;
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
      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         document.forms.insertUpdate.documentId.value = '';
         document.forms.insertUpdate.firstName.value = '';
         document.forms.insertUpdate.lastName.value = '';
         document.forms.insertUpdate.birthDate.value = '';
         document.forms.insertUpdate.gender.value = '1';
         document.querySelector('[data-form-title]').textContent = '';
      });

      document.querySelector('[data-new]').addEventListener('click', () => {
         document.querySelector('[data-form-title]').textContent = 'Nuevo Paciente';
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
      this.#results = document.querySelector('[data-results]');
      this.#results.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               PatientsService.get(id, (patient) => {
                  this.#id = patient.id;
                  document.forms.insertUpdate.documentId.value = patient.documentId;
                  document.forms.insertUpdate.firstName.value = patient.firstName;
                  document.forms.insertUpdate.lastName.value = patient.lastName;
                  document.forms.insertUpdate.birthDate.value = DateService.toInputDateString(patient.birthDate);
                  document.forms.insertUpdate.gender.value = patient.genderId;
                  document.querySelector('[data-form-title]').textContent = 'Editar Paciente';
                  this.#modal.open();
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  PatientsService.delete(id, (patient) => {
                     this.searchPatients();
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

      //Se guarda la referencia al callback a utilizar después de la operación de salvado
      const afterSave = (patient) => {
         this.#modal.close();
         document.forms.filter.documentId.value = patient.documentId;
         document.forms.filter.firstName.value = '';
         document.forms.filter.lastName.value = '';
         document.forms.filter.birthDateFrom.value = '';
         document.forms.filter.birthDateTo.value = '';
         document.forms.filter.gender.value = '';
         this.searchPatients();
      };

      if(this.#id == null) {
         PatientsService.insert(data, afterSave);
      } else {
         PatientsService.update(this.#id, data, afterSave);
      }
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

      PatientsService.list(filter, (patients) => {
         this.#results.innerHTML = '';
         for (const patient of patients) {
            const row = document.createElement('tr');

            const documentId = document.createElement('td');
            documentId.textContent = patient.documentId;
            row.appendChild(documentId);

            const name = document.createElement('td');
            name.textContent = patient.firstName + ' ' + patient.lastName;
            row.appendChild(name);

            const birthDate = document.createElement('td');
            birthDate.textContent = DateService.toDisplayLocaleString(patient.birthDate, 'es-US');
            row.appendChild(birthDate);

            const gender = document.createElement('td');
            gender.textContent = patient.gender;
            row.appendChild(gender);

            const buttons = document.createElement('td');
            buttons.classList.add('buttons');

            const buttonEdit = document.createElement('button');
            buttonEdit.classList.add('button', 'success');
            buttonEdit.setAttribute('data-click', 'edit');
            buttonEdit.setAttribute('data-id', patient.id);
            buttonEdit.textContent = 'Editar';
            buttons.appendChild(buttonEdit);

            const buttonDelete = document.createElement('button');
            buttonDelete.classList.add('button', 'danger');
            buttonDelete.setAttribute('data-click', 'delete');
            buttonDelete.setAttribute('data-id', patient.id);
            buttonDelete.textContent = 'Borrar';
            buttons.appendChild(buttonDelete);

            row.appendChild(buttons);

            const mobile = document.createElement('td');
            mobile.classList.add('mobile');

            const mobileHeading = document.createElement('h3');
            mobileHeading.classList.add('heading');
            mobileHeading.textContent = patient.documentId;
            mobile.appendChild(mobileHeading);

            const mobileName = document.createElement('p');
            const mobileNameLabel = document.createElement('span');
            const mobileNameText = document.createElement('span');
            mobileNameLabel.classList.add('label');
            mobileNameLabel.textContent = 'Nombre:';
            mobileNameText.textContent = patient.firstName + ' ' + patient.lastName;
            mobileName.classList.add('data');
            mobileName.appendChild(mobileNameLabel);
            mobileName.appendChild(mobileNameText);
            mobile.appendChild(mobileName);

            const mobileBirthDate = document.createElement('p');
            const mobileBirthDateLabel = document.createElement('span');
            const mobileBirthDateText = document.createElement('span');
            mobileBirthDateLabel.classList.add('label');
            mobileBirthDateLabel.textContent = 'Nacimiento:';
            mobileBirthDateText.textContent = DateService.toDisplayLocaleString(patient.birthDate, 'es-US');
            mobileBirthDate.classList.add('data');
            mobileBirthDate.appendChild(mobileBirthDateLabel);
            mobileBirthDate.appendChild(mobileBirthDateText);
            mobile.appendChild(mobileBirthDate);

            const mobileGender = document.createElement('p');
            const mobileGenderLabel = document.createElement('span');
            const mobileGenderText = document.createElement('span');
            mobileGenderLabel.classList.add('label');
            mobileGenderLabel.textContent = 'Género:';
            mobileGenderText.textContent = patient.gender;
            mobileGender.classList.add('data');
            mobileGender.appendChild(mobileGenderLabel);
            mobileGender.appendChild(mobileGenderText);
            mobile.appendChild(mobileGender);

            const mobileButtons = document.createElement('div');
            mobileButtons.classList.add('buttons');

            const mobileButtonEdit = document.createElement('button');
            mobileButtonEdit.classList.add('button', 'success');
            mobileButtonEdit.setAttribute('data-click', 'edit');
            mobileButtonEdit.setAttribute('data-id', patient.id);
            mobileButtonEdit.textContent = 'Editar';
            mobileButtons.appendChild(mobileButtonEdit);

            const mobileButtonDelete = document.createElement('button');
            mobileButtonDelete.classList.add('button', 'danger');
            mobileButtonDelete.setAttribute('data-click', 'delete');
            mobileButtonDelete.setAttribute('data-id', patient.id);
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
viewModel.initGenders();
viewModel.initFilter();
viewModel.initModal();
viewModel.initResults();

//Búsqueda inicial
viewModel.searchPatients();