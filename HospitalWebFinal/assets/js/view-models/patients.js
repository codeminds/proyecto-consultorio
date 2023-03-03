import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { GenderService } from '../services/gender.js';
import { PatientsService } from '../services/patient.js';
import { DateService } from '../services/date.js';

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
         document.forms.insertUpdate.documentId.value = '';
         document.forms.insertUpdate.firstName.value = '';
         document.forms.insertUpdate.lastName.value = '';
         document.forms.insertUpdate.birthDate.value = '';
         document.forms.insertUpdate.gender.value = '1';
         this.#formTitle.textContent = '';
         this.#formErrors.innerHTML = '';
      });
   }


   initGenders() {
      GenderService.list((result) => {
         this.#populateGenders(document.querySelector('[data-form="genders"]'), result.data);
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

   initResults() {
      this.#results = document.querySelector('[data-results]');
      this.#results.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               PatientsService.get(id, (result) => {
                  const patient = result.data;
                  this.#id = patient.id;
                  document.forms.insertUpdate.documentId.value = patient.documentId;
                  document.forms.insertUpdate.firstName.value = patient.firstName;
                  document.forms.insertUpdate.lastName.value = patient.lastName;
                  document.forms.insertUpdate.birthDate.value = patient.birthDate;
                  document.forms.insertUpdate.gender.value = patient.gender.id;
                  this.#formTitle.textContent = 'Editar Paciente';
                  this.#modal.open();
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  PatientsService.delete(id, (result) => {
                     if (result.success) {
                        this.searchPatients();
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
         documentId: document.forms.insertUpdate.documentId.value,
         firstName: document.forms.insertUpdate.firstName.value,
         lastName: document.forms.insertUpdate.lastName.value,
         birthDate: document.forms.insertUpdate.birthDate.value || null,
         genderId: document.forms.insertUpdate.gender.value
      };

      this.#formErrors.innerHTML = '';
      if(this.#id == null) {
         PatientsService.insert(data, this.#onSaved.bind(this));
      } else {
         PatientsService.update(this.#id, data, this.#onSaved.bind(this));
      }
   }

   #onSaved(result) {
      if(result.success) {
         const patient = result.data;
         this.#modal.close();
         document.forms.filter.documentId.value = patient.documentId;
         document.forms.filter.firstName.value = '';
         document.forms.filter.lastName.value = '';
         document.forms.filter.birthDateFrom.value = '';
         document.forms.filter.birthDateTo.value = '';
         document.forms.filter.gender.value = '';
         this.searchPatients();
      } else {
         for(const message of result.messages) {
            const li = document.createElement('li');
            li.textContent = message;

            this.#formErrors.appendChild(li);
         }
      }
   }

   searchPatients() {
      const filter = {
         documentId: document.forms.filter.documentId.value,
         firstName: document.forms.filter.firstName.value,
         lastName: document.forms.filter.lastName.value,
         birthDateFrom: document.forms.filter.birthDateFrom.value,
         birthDateTo: document.forms.filter.birthDateTo.value,
         genderId: document.forms.filter.gender?.value
      };

      PatientsService.list(filter, (result) => {
         const patients = result.data;
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
            birthDate.textContent = DateService.toDisplayLocaleString(new Date(patient.birthDate), 'es-US');
            row.appendChild(birthDate);

            const gender = document.createElement('td');
            gender.textContent = patient.gender.name;
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
            mobileBirthDateText.textContent = DateService.toDisplayLocaleString(new Date(patient.birthDate), 'es-US');
            mobileBirthDate.classList.add('data');
            mobileBirthDate.appendChild(mobileBirthDateLabel);
            mobileBirthDate.appendChild(mobileBirthDateText);
            mobile.appendChild(mobileBirthDate);

            const mobileGender = document.createElement('p');
            const mobileGenderLabel = document.createElement('span');
            const mobileGenderText = document.createElement('span');
            mobileGenderLabel.classList.add('label');
            mobileGenderLabel.textContent = 'Género:';
            mobileGenderText.textContent = patient.gender.name;
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