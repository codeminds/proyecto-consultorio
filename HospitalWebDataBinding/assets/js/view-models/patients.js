import { Modal } from '../bootstrap/modal.js';
import { PatientService } from '../services/patient-service.js';
import { DateService } from '../services/date-service.js';
import { TwoWayProp, OneWayCollectionProp } from '../bootstrap/data-bind.js';

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});

class ViewModel{
    constructor(){
        this.patientResults = new OneWayCollectionProp([], {
            date: (value) => value.toLocaleString()
        });

        this.form = {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            birthDate: new TwoWayProp(null, 'date', {
                dateString: DateService.toInputDateString
            }),
        };

        this.filter = {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            dateFrom: new TwoWayProp(null, 'date', {
                dateString: DateService.toInputDateString
            }),
            dateTo: new TwoWayProp(null, 'date', {
                dateString: DateService.toInputDateString
            })
        };

        this.patientResults.subscribe(document.querySelector('[data-results]'));

        const formFields = document.querySelectorAll('[data-field]');
        for(let i = 0; i < formFields.length; i++){
            this.form[formFields[i].getAttribute('data-field')].subscribe(formFields[i]);
        }

        const filterFields = document.querySelectorAll('[data-filter]');
        for(let i = 0; i < filterFields.length; i++){
            this.filter[filterFields[i].getAttribute('data-filter')].subscribe(filterFields[i]);
        }

        this.newButton = document.querySelector('[data-new]');
        this.saveButton = document.querySelector('[data-save]');
        this.searchButton = document.querySelector('[data-search]');
        this.resultsTable = document.querySelector('[data-results]')
        this.patientId = null;

        this.modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.patientId = null;
            this.form.documentId.set(null);
            this.form.firstName.set('');
            this.form.lastName.set('');
            this.form.birthDate.set('');
        });

        this.newButton.addEventListener('click', () => {
            this.modal.open();
        })

        this.saveButton.addEventListener('click', () => {
            const patient = {
                id: this.patientId,
                documentId: this.form.documentId.get(),
                firstName: this.form.firstName.get(),
                lastName: this.form.lastName.get(),
                birthDate: this.form.birthDate.get(),
            }

            if(patient.id == null){
                PatientService.create(patient);
            }else{
                PatientService.update(patient);
            }

            this.modal.close();
            this.searchPatients();
        });

        this.searchButton.addEventListener('click', () => {
            this.searchPatients();
        });

        this.resultsTable.addEventListener('click', (e) => {
            let element = e.target;
            let id = element.getAttribute('data-id');

            if(element.matches('[data-click]')){
                switch(element.getAttribute('data-click')){
                    case 'edit':
                        let patient = PatientService.get(id);
                    
                        if(patient != null){
                            this.patientId = patient.id;
                            this.form.documentId.set(patient.documentId);
                            this.form.firstName.set(patient.firstName);
                            this.form.lastName.set(patient.lastName);
                            this.form.birthDate.set(patient.birthDate);
                            this.modal.open();
                        }else{
                            alert('Selected patient does not exist');
                        }
                        break;
                    case 'delete':
                        if(confirm('Are you sure you want to delete this record?')){
                            PatientService.delete(id);
                            this.searchPatients();
                        }
                        break;
                }
            }
        });

        this.searchPatients();
    }

    searchPatients(){
        const filter = {
            documentId: this.filter.documentId.get(),
            firstName: this.filter.firstName.get(),
            lastName: this.filter.lastName.get(),
            dateFrom: this.filter.dateFrom.get(),
            dateTo: this.filter.dateTo.get()
        }

        this.patientResults.set(PatientService.list(filter));

    }

}