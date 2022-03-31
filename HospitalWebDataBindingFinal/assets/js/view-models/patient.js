import { Modal } from '../controls/modal.js';
import { Panel } from "../controls/panel.js";
import { OneWayCollectionProp, OneWayProp, TwoWayProp } from '../data-bind.js';
import { DateService } from '../services/date.js';
import { PatientService } from '../services/patient.js';
import { BaseViewModel } from "./base.js";

class ViewModel extends BaseViewModel{
    #panel;
    #modal;
    #results;
    #id;
    #filter;
    #patients;
    #patient;
    #formTitle;
    #formErrors;

    constructor() {
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));
        
        this.#initPatient();
        this.#initPanel();
        this.#initModal();
        this.#initFilter();
    }

    #initPatient() {
        this.#id = null;
        this.#patient = {
            documentId: new TwoWayProp (null, 'string'),
            firstName: new TwoWayProp (null, 'string'),
            lastName: new TwoWayProp (null, 'string'),
            birthDate: new TwoWayProp (null, 'date', {
                formatDateString: (value) => {
                    return DateService.toInputDateString(value);
                }
            }),
            gender: new TwoWayProp (null, 'boolean')
        };

        this.#patient.documentId.subscribe(document.forms.createUpdate.documentId);
        this.#patient.firstName.subscribe(document.forms.createUpdate.firstName);
        this.#patient.lastName.subscribe(document.forms.createUpdate.lastName);
        this.#patient.birthDate.subscribe(document.forms.createUpdate.birthDate);
        this.#patient.gender.subscribe(document.forms.createUpdate.gender);
    }

    #initPanel() {
        this.#panel = new Panel(document.querySelector('[data-toggle]'), document.querySelector('[data-toggle-section]'));
    }

    #initModal() {
        this.#formTitle = new OneWayProp(null, 'string');
        this.#formTitle.subscribe(document.querySelector('[data-form-title]'));

        this.#formErrors = new OneWayCollectionProp([]);
        this.#formErrors.subscribe(document.querySelector('[data-errors]'));

        this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.#id = null;
            this.#patient.documentId.value = null;
            this.#patient.firstName.value = null;
            this.#patient.lastName.value = null;
            this.#patient.birthDate.value = null;
            this.#patient.gender.value = false;
            this.#formTitle.value = null;
            this.#formErrors.value = [];
        });
        
        document.querySelector('[data-new]').addEventListener('click', () => {
            this.#formTitle.value = 'Nuevo Paciente';
            this.#modal.open() 
        });

        document.querySelector('[data-save]').addEventListener('click', () => { this.#save(); });
        document.querySelector('[data-cancel]').addEventListener('click', () => { this.#modal.close() });

        //Results table uses modal so it inits after modal
        this.#initResults();
    }

    #initResults() {
        this.#results = document.querySelector('[data-results]');
        this.#patients = new OneWayCollectionProp([], {
            toLocaleString: (value) => {
                return new Date(value).toLocaleString('es-ES', { hour12: true})
            },
            displayGender: (value) => {
                if(value) {
                    return 'Masculino';
                }else {
                    return 'Femenino';
                }
            }
        });
        this.#patients.subscribe(this.#results);
        this.#results.addEventListener('click', (e) => {
            const element = e.target;

            if(element.matches('[data-click]')) {
                switch(element.getAttribute('data-click')) {
                    case 'edit':
                        const id = element.getAttribute('data-id');
                        PatientService.get(id, (result) => {
                            const patient = result.data;
                            this.#id = patient.id;
                            this.#patient.documentId.value = patient.documentId;
                            this.#patient.firstName.value = patient.firstName;
                            this.#patient.lastName.value = patient.lastName;
                            this.#patient.birthDate.value = patient.birthDate;
                            this.#patient.gender.value = patient.gender;
                            this.#formTitle.value = 'Editar Paciente';
                            this.#modal.open();                          
                        });
                        break;
                    case 'delete':
                        if(confirm('Desea borrar esta entrada?')) {
                            const id = element.getAttribute('data-id');
                            PatientService.delete(id, (result) => {
                                if(result.success) {
                                    this.#searchPatients();
                                } else {
                                    let errors = '';

                                    for(let i = 0; i < result.messages.length; i++) {
                                        errors += result.messages[i] + '\n';
                                    }

                                    if(errors != '') {
                                        alert(errors);
                                    }
                                }
                            });
                        }
                    break;
                }
            }
        });
    } 

    #initFilter() {
        this.#filter = {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            birthDateFrom: new TwoWayProp(null, 'date'),
            birthDateTo: new TwoWayProp(null, 'date'),
            gender: new TwoWayProp(null, 'boolean')
        };

        this.#filter.documentId.subscribe(document.forms.filter.documentId);
        this.#filter.firstName.subscribe(document.forms.filter.firstName);
        this.#filter.lastName.subscribe(document.forms.filter.lastName);
        this.#filter.birthDateFrom.subscribe(document.forms.filter.birthDateFrom);
        this.#filter.birthDateTo.subscribe(document.forms.filter.birthDateTo);
        this.#filter.gender.subscribe(document.forms.filter.gender);

        document.querySelector('[data-search]').addEventListener('click', () => { this.#searchPatients() });
        this.#searchPatients();
    }

    #save(){
        const data = {
            documentId: this.#patient.documentId.value,
            firstName: this.#patient.firstName.value,
            lastName: this.#patient.lastName.value,
            gender: this.#patient.gender.value,
            birthDate: this.#patient.birthDate.value,
        }
        
        if(this.#id == null){
            PatientService.create(data, (result) => {
                if(result.success){
                    this.#modal.close();
                    this.#searchPatients();
                } else {
                    this.#formErrors.value = result.messages;
                }
            })
        } else {
            PatientService.update(this.#id, data, (result) => {
                if(result.success){
                    this.#modal.close();
                    this.#searchPatients();
                } else {
                    this.#formErrors.value = result.messages;
                }
            })
        }
    }

    #searchPatients() {
        const filter = {
            documentId: this.#filter.documentId.value,
            firstName: this.#filter.firstName.value,
            lastName: this.#filter.lastName.value,
            gender: this.#filter.gender.value,
            birthDateFrom: this.#filter.birthDateFrom.value,
            birthDateTo: this.#filter.birthDateTo.value
        };

        PatientService.list(filter, (result) => {
            this.#patients.value = result.data;
        });
    }
}

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});