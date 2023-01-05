import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { FieldService } from '../services/field.js';
import { DoctorService } from '../services/doctor.js';

class ViewModel extends BaseViewModel {
   #id;
   #modal;
   #results;

   constructor() {
      super();

      this.#id = null;

      this.#initFields();
      this.#initFilter();
      this.#initModal();
      this.#initResults();

      this.#searchDoctors();
   }

   #initFields() {
      FieldService.list((fields) => {
         this.#populateFields(document.querySelector('[data-form="fields"]'), fields);
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

   #initFilter() {
      document.querySelector('[data-search]').addEventListener('click', () => {
         this.#searchDoctors();
      });
   }

   #initModal() {
      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         document.forms.insertUpdate.documentId.value = '';
         document.forms.insertUpdate.firstName.value = '';
         document.forms.insertUpdate.lastName.value = '';
         document.forms.insertUpdate.field.selectedIndex = 0;
         document.querySelector('[data-form-title]').textContent = '';
      });

      document.querySelector('[data-new]').addEventListener('click', () => {
         document.querySelector('[data-form-title]').textContent = 'Nuevo Doctor';
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
               DoctorService.get(id, (doctor) => {
                  if (doctor != null) {
                     this.#id = doctor.id;
                     document.forms.insertUpdate.documentId.value = doctor.documentId;
                     document.forms.insertUpdate.firstName.value = doctor.firstName;
                     document.forms.insertUpdate.lastName.value = doctor.lastName;
                     document.forms.insertUpdate.field.value = doctor.fieldId;
                     document.querySelector('[data-form-title]').textContent = 'Editar Doctor';
                     this.#modal.open();
                  } else {
                     alert('No se pudo cargar el registro seleccionado');
                  }
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  DoctorService.delete(id, (deleted) => {
                     if (deleted) {
                        this.#searchDoctors();
                     } else {
                        alert('No se pudo borrar la entrada');
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

      if (this.#id == null) {
         DoctorService.insert(data, (doctor) => {
            this.#modal.close();
            document.forms.filter.documentId.value = doctor.documentId;
            document.forms.filter.firstName.value = '';
            document.forms.filter.lastName.value = '';
            document.forms.filter.field.value = '';
            this.#searchDoctors();
         });
      } else {
         DoctorService.update(this.#id, data, (doctor) => {
            if (doctor != null) {
               this.#modal.close();
               document.forms.filter.documentId.value = doctor.documentId;
               document.forms.filter.firstName.value = '';
               document.forms.filter.lastName.value = '';
               document.forms.filter.field.value = '';
               this.#searchDoctors();
            } else {
               alert('No se pudo actualizar el registro');
            }
         });
      }
   }

   #searchDoctors() {
      const filter = {
         documentId: document.forms.filter.documentId.value,
         firstName: document.forms.filter.firstName.value,
         lastName: document.forms.filter.lastName.value,
         fieldId: document.forms.filter.field.value
      };

      DoctorService.list(filter, (doctors) => {
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
            field.textContent = doctor.field;
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
            mobileFieldText.textContent = doctor.field;
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

const viewModel = new ViewModel();