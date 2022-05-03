import { Modal } from '../controls/modal.js';
import { Panel } from "../controls/panel.js";
import { DateService } from '../services/date.js';
import { PatientService } from '../services/patient.js';
import { BaseViewModel } from "./base.js";

class ViewModel extends BaseViewModel{
    #panel;
    #modal;
    #results;
    #id;

    constructor() {
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));

        this.#id = null;
        
        this.#initPanel();
        this.#initModal();
        this.#initFilter();
    }

    #initPanel() {
        this.#panel = new Panel(document.querySelector('[data-toggle]'), document.querySelector('[data-toggle-section]'));
    }

    #initModal() {
        this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.#id = null;
            document.forms.createUpdate.documentId.value = null;
            document.forms.createUpdate.firstName.value = null;
            document.forms.createUpdate.lastName.value = null;
            document.forms.createUpdate.gender.value = 'false';
            document.forms.createUpdate.birthDate.value = null;
            document.querySelector('[data-form-title]').textContent = null;
        });
        document.querySelector('[data-new]').addEventListener('click', () => {
            document.querySelector('[data-form-title]').textContent = 'Nuevo Paciente';
            this.#modal.open() });

        document.querySelector('[data-save]').addEventListener('click', () => { this.#save(); });
        document.querySelector('[data-cancel]').addEventListener('click', () => { this.#modal.close() });

        //Results table uses modal so it inits after modal
        this.#initResults();
    }

    #initResults() {
        this.#results = document.querySelector('[data-results]');
        this.#results.addEventListener('click', (e) => {
            const element = e.target;

            if(element.matches('[data-click]')) {
                switch(element.getAttribute('data-click')) {
                    case 'edit':
                        const id = element.getAttribute('data-id');
                        PatientService.get(id, (result) => {
                            if (result != null){
                                this.#id = result.id;
                                document.forms.createUpdate.documentId.value = result.documentId;
                                document.forms.createUpdate.firstName.value = result.firstName;
                                document.forms.createUpdate.lastName.value = result.lastName;
                                document.forms.createUpdate.gender.value = result.gender;
                                document.forms.createUpdate.birthDate.value = DateService.toInputDateString(result.birthDate);
                                document.querySelector('[data-form-title]').textContent = 'Editar Paciente';
                                this.#modal.open();
                            } else {
                                alert('No se pudo cargar el registro seleccionado')
                            }
                        });
                        break;
                    case 'delete':
                        if(confirm('Desea borrar esta entrada?')) {
                            const id = element.getAttribute('data-id');
                            PatientService.delete(id, (result) => {
                                if(result) {
                                    this.#searchPatients();
                                } else {
                                    alert('No se pudo borrar la entrada');
                                }
                            });
                        }
                        break;
                }
            }
        });
    } 

    #initFilter() {
        document.querySelector('[data-search]').addEventListener('click', () => { this.#searchPatients() });
        this.#searchPatients();
    }

    #save(){
        let gender = null;

        switch(document.forms.createUpdate.gender.value) {
            case 'true':
                gender = true;
                break;
            case 'false':
                gender = false;
                break;
        }

        const birthDate = document.forms.createUpdate.birthDate.value;
        const data = {
            documentId: document.forms.createUpdate.documentId.value,
            firstName: document.forms.createUpdate.firstName.value,
            lastName: document.forms.createUpdate.lastName.value,
            gender: gender,
            birthDate: birthDate ? new Date(birthDate) : null,
        }
        
        if(this.#id == null){
            PatientService.create(data, (result) => {
                if(result != null){
                    this.#modal.close();
                    this.#searchPatients();
                } else {
                    alert('No se pudo crear el nuevo registro');
                }
            })
        } else {
            PatientService.update(this.#id, data, (result) => {
                if(result != null){
                    this.#modal.close();
                    this.#searchPatients();
                } else {
                    alert('No se pudo actualizar el registro');
                }
            })
        }
    }

    #searchPatients() {
        let gender = null;

        switch(document.forms.filter.gender.value) {
            case 'true':
                gender = true;
                break;
            case 'false':
                gender = false;
                break;
        }

        const birthDateFrom = document.forms.filter.birthDateFrom.value;
        const birthDateTo = document.forms.filter.birthDateTo.value;
        const filter = {
            documentId: document.forms.filter.documentId.value,
            firstName: document.forms.filter.firstName.value,
            lastName: document.forms.filter.lastName.value,
            gender: gender,
            birthDateFrom: birthDateFrom ? new Date(birthDateFrom) : null,
            birthDateTo: birthDateTo ? new Date(birthDateTo) : null
        };

        PatientService.list(filter, (result) => {
            this.#results.innerHTML = '';
            for(const patient of result) {
                const row = document.createElement('tr');
                
                const documentId = document.createElement('td');
                documentId.textContent = patient.documentId;
                row.appendChild(documentId);

                const name = document.createElement('td');
                name.textContent = patient.firstName + ' ' + patient.lastName;
                row.appendChild(name);

                const birth = document.createElement ('td');
                birth.textContent = DateService.toDisplayLocaleString(patient.birthDate, 'es-US');
                row.appendChild(birth);

                const gender = document.createElement('td');
                gender.textContent = patient.gender ? 'Masculino' : 'Femenino';
                row.appendChild(gender);

                const buttons = document.createElement('td');
                buttons.classList.add('buttons');

                const editButton = document.createElement('button');
                editButton.classList.add('button');
                editButton.classList.add('success');
                editButton.setAttribute('data-click', 'edit');
                editButton.setAttribute('data-id', patient.id);
                editButton.textContent = 'Editar';
                buttons.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('button');
                deleteButton.classList.add('danger');
                deleteButton.setAttribute('data-click', 'delete');
                deleteButton.setAttribute('data-id', patient.id);
                deleteButton.textContent = 'Borrar';
                buttons.appendChild(deleteButton);

                row.appendChild(buttons);

                const mobile = document.createElement('td');
                mobile.classList.add('mobile');

                const mobileTitle = document.createElement('h3');
                mobileTitle.textContent = patient.documentId;
                mobile.appendChild(mobileTitle);

                const mobileName = document.createElement('p');
                const mobileNameSpan = document.createElement('span');
                mobileNameSpan.classList.add('label');
                mobileNameSpan.textContent = 'Nombre:';
                mobileName.appendChild(mobileNameSpan);
                mobileName.appendChild(document.createTextNode(patient.firstName + ' ' + patient.lastName));
                mobile.appendChild(mobileName);

                const mobilbirth = document.createElement ('p');
                const mobilbirthSpan = document.createElement ('span');
                mobilbirthSpan.classList.add('label');
                mobilbirthSpan.textContent = 'Fecha de Nacimiento:';
                mobilbirth.appendChild(mobilbirthSpan);
                mobilbirth.appendChild(document.createTextNode(DateService.toDisplayLocaleString(patient.birthDate, 'es-US')));
                mobile.appendChild(mobilbirth);

                const mobileGender = document.createElement('p');
                const mobileGenderSpan = document.createElement('span');
                mobileGenderSpan.classList.add('label');
                mobileGenderSpan.textContent = 'Género:';
                mobileGender.appendChild(mobileGenderSpan);
                mobileGender.appendChild(document.createTextNode(patient.gender ? 'Masculino' : 'Femenino'));
                mobile.appendChild(mobileGender);

                const mobileDiv = document.createElement('div');

                const mobileEditButton = document.createElement('button');
                mobileEditButton.classList.add('button');
                mobileEditButton.classList.add('success');
                mobileEditButton.setAttribute('data-click', 'edit');
                mobileEditButton.setAttribute('data-id', patient.id);
                mobileEditButton.textContent = 'Editar';
                mobileDiv.appendChild(mobileEditButton);

                const mobileDeleteButton = document.createElement('button');
                mobileDeleteButton.classList.add('button');
                mobileDeleteButton.classList.add('danger');
                mobileDeleteButton.setAttribute('data-click', 'delete');
                mobileDeleteButton.setAttribute('data-id', patient.id);
                mobileDeleteButton.textContent = 'Borrar';
                mobileDiv.appendChild(mobileDeleteButton);

                mobile.appendChild(mobileDiv);
                row.appendChild(mobile);

                this.#results.appendChild(row);
            }
        });
    }
}

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});