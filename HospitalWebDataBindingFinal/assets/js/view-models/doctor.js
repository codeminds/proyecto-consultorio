import { TwoWayProp, OneWayCollectionProp } from '../bootstrap/data-bind.js';
import { Modal } from '../bootstrap/modal.js';
import { DoctorService } from '../services/doctor-service.js';
import { FieldService } from '../services/field-service.js';

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});

class ViewModel{
    constructor(){
        this.doctorsResults = new OneWayCollectionProp([]);
        this.fieldList = new OneWayCollectionProp([]);
        this.filterList = new OneWayCollectionProp([]);
        this.formErrors = new OneWayCollectionProp([]);

        this.form = {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            fieldId: new TwoWayProp(1, 'number')
        };

        this.filter = {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            fieldId: new TwoWayProp(null, 'number', {
                nullToEmpty: (value) => {
                    return value != null ? value : '';
                }
            })
        };

        this.doctorsResults.subscribe(document.querySelector('[data-results]'));
        this.filterList.subscribe(document.querySelector('[data-list="filter"]'));
        this.fieldList.subscribe(document.querySelector('[data-list="field"]'));
        this.formErrors.subscribe(document.querySelector('[data-errors]'));

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
        this.resultsTable = document.querySelector('[data-results]');
        this.doctorId = null;

        this.modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.doctorId = null;
            this.form.documentId.set(null);
            this.form.firstName.set('');
            this.form.lastName.set('');
            this.form.fieldId.set(1);
            this.formErrors.set([]);
        });

        this.newButton.addEventListener('click', () => {
            this.modal.open();
        });

        this.saveButton.addEventListener('click', () => {
            const doctor = {
                identification: this.form.documentId.get(),
                firstName: this.form.firstName.get(),
                lastName: this.form.lastName.get(),
                fieldId: this.form.fieldId.get(),
            }

            if(this.doctorId == null){
                DoctorService.create(doctor, (response) => {
                    if(response.success){
                        this.modal.close();
                        this.searchDoctors();
                    }else{
                        this.formErrors.set(response.messages);
                    }
                });
            }else{
                DoctorService.update(this.doctorId, doctor, (response) => {
                    if(response.success){
                        this.modal.close();
                        this.searchDoctors();
                    }else{
                        this.formErrors.set(response.messages);
                    }
                });
            }
        });

        this.searchButton.addEventListener('click', () => {
            this.searchDoctors();
        });

        this.resultsTable.addEventListener('click', (e) => {
            let element = e.target;
            let id = element.getAttribute('data-id');

            if(element.matches('[data-click]')){
                switch(element.getAttribute('data-click')){
                    case 'edit':
                        DoctorService.get(id, (response) => {
                            if(response.success){
                                const doctor = response.data;
                                this.doctorId = doctor.id;
                                this.form.documentId.set(doctor.identification);
                                this.form.firstName.set(doctor.firstName);
                                this.form.lastName.set(doctor.lastName);
                                this.form.fieldId.set(doctor.field.id);
                                this.modal.open();
                            }
                        });
                        break;
                    case 'delete':
                        if(confirm('Are you sure you want to delete this record?')){
                            DoctorService.delete(id, (response) => {
                                if(response.success){
                                    this.searchDoctors();
                                }else{
                                    let errors = '';

                                    for(let i = 0; i < response.messages.length; i++){
                                        errors += response.messages[i] + '\n';
                                    }

                                    if(errors){
                                        alert(errors);
                                    }
                                }
                            });
                        }
                        break;
                }
            }
        });

        this.loadFieldOptions();
        this.searchDoctors();
    }

    loadFieldOptions(){
        FieldService.list((response) => {
            if(response.success){
                const fields = response.data;
                this.fieldList.set(fields);

                fields.unshift({
                    id: '',
                    name: 'All'
                });

                this.filterList.set(fields);
            }
        });
    }

    searchDoctors(){
        const filter = {
            identification: this.filter.documentId.get(),
            firstName: this.filter.firstName.get(),
            lastName: this.filter.lastName.get(),
            fieldId: this.filter.fieldId.get()
        }

        DoctorService.list(filter, (response) => {
            if(response.success){
                this.doctorsResults.set(response.data);
            }
        });
    }
}