import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { FieldService } from '../services/field.js';
import { DoctorService } from '../services/doctor.js';

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
         document.forms.insertUpdate.field.selectedIndex = 0;
         this.#formTitle.textContent = '';
         this.#formErrors.innerHTML = '';
      });
   }

   //Funciones para poblar la lista de especialidades dinámicamente
   initFields() {
      FieldService.list((result) => {
         this.#populateFields(document.querySelector('[data-form="fields"]'), result.data);
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

   initFilter() {
      document.querySelector('[data-search]').addEventListener('click', () => {
         this.searchDoctors();
      });
   }

   initModal() {
      document.querySelector('[data-new]').addEventListener('click', () => {
         this.#formTitle.textContent = 'Nuevo Doctor';
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
               DoctorService.get(id, (result) => {
                  const doctor = result.data;
                  this.#id = doctor.id;
                  document.forms.insertUpdate.documentId.value = doctor.documentId;
                  document.forms.insertUpdate.firstName.value = doctor.firstName;
                  document.forms.insertUpdate.lastName.value = doctor.lastName;
                  document.forms.insertUpdate.field.value = doctor.field.id;
                  this.#formTitle.textContent = 'Editar Doctor';
                  this.#modal.open();
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  DoctorService.delete(id, (result) => {
                     if(result.success) {
                        this.searchDoctors();
                     } else {
                        let errors = '';

                        for(const error of result.messages) {
                           errors += `${error}\n`;
                        }

                        if(errors != '') {
                           alert(errors);
                        }
                     }
                  })
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
         fieldId: document.forms.insertUpdate.field.value
      };

      this.#formErrors.innerHTML = '';
      if(this.#id == null) {
         DoctorService.insert(data, this.#onSaved.bind(this));
      }else {
         DoctorService.update(this.#id, data, this.#onSaved.bind(this));
      }
   }

   #onSaved(result) {
      if(result.success){
         const doctor = result.data;
         this.#modal.close();
         document.forms.filter.documentId.value = doctor.documentId;
         document.forms.filter.firstName.value = '';
         document.forms.filter.lastName.value = '';
         document.forms.filter.field.value = '';
         this.searchDoctors();
      } else {
         for(const message of result.messages) {
            const li = document.createElement('li');
            li.textContent = message;

            this.#formErrors.appendChild(li);
         }
      }
   }

   searchDoctors() {
      const filter = {
         documentId: document.forms.filter.documentId.value,
         firstName: document.forms.filter.firstName.value,
         lastName: document.forms.filter.lastName.value,
         fieldId: document.forms.filter.field.value
      };

      DoctorService.list(filter, (result) => {
         const doctors = result.data;
         this.#results.innerHTML = '';
         for (const doctor of doctors) {
            const row = document.createElement('tr');

            const documentId = document.createElement('td');
            documentId.textContent = doctor.documentId;
            row.appendChild(documentId);

            const name = document.createElement('td');
            name.textContent = doctor.firstName + ' ' + doctor.lastName;
            row.appendChild(name);

            const field = document.createElement('td');
            field.textContent = doctor.field.name;
            row.appendChild(field);

            const buttons = document.createElement('td');
            buttons.classList.add('buttons');

            const buttonEdit = document.createElement('button');
            buttonEdit.classList.add('button', 'success');
            buttonEdit.setAttribute('data-click', 'edit');
            buttonEdit.setAttribute('data-id', doctor.id);
            buttonEdit.textContent = 'Editar';
            buttons.appendChild(buttonEdit);

            const buttonDelete = document.createElement('button');
            buttonDelete.classList.add('button', 'danger');
            buttonDelete.setAttribute('data-click', 'delete');
            buttonDelete.setAttribute('data-id', doctor.id);
            buttonDelete.textContent = 'Borrar';
            buttons.appendChild(buttonDelete);

            row.appendChild(buttons);

            const mobile = document.createElement('td');
            mobile.classList.add('mobile');

            const mobileHeading = document.createElement('h3');
            mobileHeading.classList.add('heading');
            mobileHeading.textContent = doctor.documentId;
            mobile.appendChild(mobileHeading);

            const mobileName = document.createElement('p');
            const mobileNameLabel = document.createElement('span');
            const mobileNameText = document.createElement('span');
            mobileNameLabel.classList.add('label');
            mobileNameLabel.textContent = 'Nombre:';
            mobileNameText.textContent = doctor.firstName + ' ' + doctor.lastName;
            mobileName.classList.add('data');
            mobileName.appendChild(mobileNameLabel);
            mobileName.appendChild(mobileNameText);
            mobile.appendChild(mobileName);

            const mobileField = document.createElement('p');
            const mobileFieldLabel = document.createElement('span');
            const mobileFieldText = document.createElement('span');
            mobileFieldLabel.classList.add('label');
            mobileFieldLabel.textContent = 'Especialidad:';
            mobileFieldText.textContent = doctor.field.name;
            mobileField.classList.add('data');
            mobileField.appendChild(mobileFieldLabel);
            mobileField.appendChild(mobileFieldText);
            mobile.appendChild(mobileField);

            const mobileButtons = document.createElement('div');
            mobileButtons.classList.add('buttons');

            const mobileButtonEdit = document.createElement('button');
            mobileButtonEdit.classList.add('button', 'success');
            mobileButtonEdit.setAttribute('data-click', 'edit');
            mobileButtonEdit.setAttribute('data-id', doctor.id);
            mobileButtonEdit.textContent = 'Editar';
            mobileButtons.appendChild(mobileButtonEdit);

            const mobileButtonDelete = document.createElement('button');
            mobileButtonDelete.classList.add('button', 'danger');
            mobileButtonDelete.setAttribute('data-click', 'delete');
            mobileButtonDelete.setAttribute('data-id', doctor.id);
            mobileButtonDelete.textContent = 'Borrar';
            mobileButtons.appendChild(mobileButtonDelete);

            mobile.appendChild(mobileButtons);
            row.appendChild(mobile);

            this.#results.appendChild(row);
         }
      });
   }
}

//Inicialización
const viewModel = new ViewModel();
viewModel.initFields();
viewModel.initFilter();
viewModel.initModal();
viewModel.initResults();

//Búsqueda inicial
viewModel.searchDoctors();