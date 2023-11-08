import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';

import { DoctorService } from '../services/doctor.js';
import { FieldService } from '../services/field.js';

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
         document.forms.insertUpdate.code.value = '';
         document.forms.insertUpdate.firstName.value = '';
         document.forms.insertUpdate.lastName.value = '';
         document.forms.insertUpdate.field.selectedIndex = 0;
         this.#formTitle.textContent = '';
      });
   }

   initFields() {
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

   initTable() {
      this.#table.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               DoctorService.get(id, (doctor) => {
                  if (doctor != null) {
                     this.#id = doctor.id;
                     document.forms.insertUpdate.code.value = doctor.code;
                     document.forms.insertUpdate.firstName.value = doctor.firstName;
                     document.forms.insertUpdate.lastName.value = doctor.lastName;
                     document.forms.insertUpdate.field.value = doctor.field.id;
                     this.#formTitle.textContent = 'Editar Doctor';
                     this.#modal.open();
                  } else {
                     alert('Doctor no existe en los registros');
                  }
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  DoctorService.delete(id, (doctor) => {
                     if (doctor != null) {
                        this.searchDoctors();
                     } else {
                        alert('Doctor no existe en los registros');
                     }
                  });
               }
               break;
         }
      });
   }

   #save() {
      const data = {
         code: document.forms.insertUpdate.code.value,
         firstName: document.forms.insertUpdate.firstName.value,
         lastName: document.forms.insertUpdate.lastName.value,
         fieldId: document.forms.insertUpdate.field.value
      };

      if (this.#id == null) {
         DoctorService.insert(data, this.#onSaved.bind(this));
      } else {
         DoctorService.update(this.#id, data, this.#onSaved.bind(this));
      }
   }

   #onSaved(doctor) {
      this.#modal.close();
      document.forms.filter.code.value = doctor.code;
      document.forms.filter.firstName.value = '';
      document.forms.filter.lastName.value = '';
      document.forms.filter.field.value = '';
      this.searchDoctors();
   }

   searchDoctors() {
      const filter = {
         code: document.forms.filter.code.value,
         firstName: document.forms.filter.firstName.value,
         lastName: document.forms.filter.lastName.value,
         fieldId: document.forms.filter.field.value
      };

      DoctorService.list(filter, (doctors) => {
         this.#table.innerHTML = '';
         if (doctors.length > 0) {
            for (const doctor of doctors) {
               const row = document.createElement('tr');

               //Code
               const code = document.createElement('td');
               code.classList.add('heading');
               code.textContent = doctor.code;
               row.appendChild(code);

               //Name
               const name = document.createElement('td');
               name.classList.add('data');

               const nameLabel = document.createElement('label');
               nameLabel.textContent = 'Nombre';
               name.appendChild(nameLabel);

               const nameText = document.createElement('span');
               nameText.textContent = doctor.firstName + ' ' + doctor.lastName;
               name.appendChild(nameText);

               row.appendChild(name);

               //Field
               const field = document.createElement('td');
               field.classList.add('data');

               const fieldLabel = document.createElement('label');
               fieldLabel.textContent = 'Especialidad';
               field.appendChild(fieldLabel);

               const fieldText = document.createElement('span');
               fieldText.textContent = doctor.field.name;
               field.appendChild(fieldText);

               row.appendChild(field);

               //Buttons
               const buttons = document.createElement('td');
               buttons.classList.add('buttons');

               const editButton = document.createElement('button');
               editButton.classList.add('button', 'success');
               editButton.setAttribute('data-click', 'edit');
               editButton.setAttribute('data-id', doctor.id);
               editButton.textContent = 'Editar';
               buttons.appendChild(editButton);

               const deleteButton = document.createElement('button');
               deleteButton.classList.add('button', 'danger');
               deleteButton.setAttribute('data-click', 'delete');
               deleteButton.setAttribute('data-id', doctor.id);
               deleteButton.textContent = 'Borrar';
               buttons.appendChild(deleteButton);

               row.appendChild(buttons);

               this.#table.appendChild(row);
            }
         } else {
            const row = document.createElement('tr');

            const noResults = document.createElement('td');
            noResults.style.textAlign = 'center';
            noResults.setAttribute('colspan', '4');
            noResults.textContent = 'No se encontraron resultados';
            row.appendChild(noResults);

            this.#table.appendChild(row);
         }
      });
   }
}

const viewModel = new ViewModel();

viewModel.initFields();
viewModel.initFilter();
viewModel.initModal();
viewModel.initTable();

viewModel.searchDoctors();

