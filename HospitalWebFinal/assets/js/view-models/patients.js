import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { PatientService } from '../services/patient.js';

class ViewModel extends BaseViewModel {
   #id;
   #modal;
   #table;
   #formTitle;
   #formErrors;

   constructor() {
      super();

      this.#id = null;
      this.#formTitle = document.querySelector('[data-form-title]');
      this.#formErrors = document.querySelector('[data-form-errors]');
      this.#table = document.querySelector('[data-table]');
      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         document.forms.insertUpdate.documentId.value = '';
         document.forms.insertUpdate.firstName.value = '';
         document.forms.insertUpdate.lastName.value = '';
         document.forms.insertUpdate.tel.value = '';
         document.forms.insertUpdate.email.value = '';
         this.#formTitle.textContent = '';
         this.#formErrors.innerHTML = '';
      });
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
               PatientService.get(id, (result) => {
                  if(result.success) {
                     const patient = result.data;
                     this.#id = patient.id;
                     document.forms.insertUpdate.documentId.value = patient.documentId;
                     document.forms.insertUpdate.firstName.value = patient.firstName;
                     document.forms.insertUpdate.lastName.value = patient.lastName;
                     document.forms.insertUpdate.tel.value = patient.tel;
                     document.forms.insertUpdate.email.value = patient.email;
                     this.#formTitle.textContent = 'Editar Paciente';
                     this.#modal.open();
                  }
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  PatientService.delete(id, (result) => {
                     if (result.success) {
                        this.searchPatients();
                     } else {
                        let errorMessage = '';

                        for (const message of result.messages) {
                           errorMessage += `${message}\n`;
                        }

                        if (errorMessage != '') {
                           alert(errorMessage);
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
         tel: document.forms.insertUpdate.tel.value,
         email: document.forms.insertUpdate.email.value
      };

      this.#formErrors.innerHTML = '';
      if(this.#id == null) {
         PatientService.insert(data, this.#onSaved.bind(this));
      } else {
         PatientService.update(this.#id, data, this.#onSaved.bind(this));
      }
   }

   #onSaved(result) {
      if(result.success) {
         const patient = result.data;
         this.#modal.close();
         document.forms.filter.documentId.value = patient.documentId;
         document.forms.filter.firstName.value = '';
         document.forms.filter.lastName.value = '';
         document.forms.filter.tel.value = '';
         document.forms.filter.email.value = '';
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
         tel: document.forms.filter.tel.value,
         email: document.forms.filter.email.value
      };

      PatientService.list(filter, (result) => {
         const patients = result.data;
         this.#table.innerHTML = '';
         if (result.success && patients.length > 0) {
            for (const patient of patients) {
               const row = document.createElement('tr');

               //DocumentId
               const documentId = document.createElement('td');
               documentId.classList.add('heading');
               documentId.textContent = patient.documentId;
               row.appendChild(documentId);

               //Name
               const name = document.createElement('td');
               name.classList.add('data');

               const nameLabel = document.createElement('label');
               nameLabel.textContent = 'Nombre';
               name.appendChild(nameLabel);

               const nameText = document.createElement('span');
               nameText.textContent = patient.firstName + ' ' + patient.lastName;
               name.appendChild(nameText);

               row.appendChild(name);

               //Tel
               const tel = document.createElement('td');
               tel.classList.add('data');

               const telLabel = document.createElement('label');
               telLabel.textContent = 'Tel';
               tel.appendChild(telLabel);

               const telText = document.createElement('span');
               telText.textContent = patient.tel;
               tel.appendChild(telText);

               row.appendChild(tel);

               //Email
               const email = document.createElement('td');
               email.classList.add('data');

               const emailLabel = document.createElement('label');
               emailLabel.textContent = 'Correo';
               email.appendChild(emailLabel);

               const emailText = document.createElement('span');
               emailText.textContent = patient.email;
               email.appendChild(emailText);

               row.appendChild(email);

               //Buttons
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

//Inicialización
viewModel.initFilter();
viewModel.initModal();
viewModel.initTable();

//Búsqueda inicial
viewModel.searchPatients();