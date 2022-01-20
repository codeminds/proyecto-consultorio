import { OneWayCollectionProp, TwoWayProp } from '../bootstrap/data-bind.js';
import { Modal } from '../bootstrap/modal.js';
import { Panel } from '../bootstrap/panel.js';
import { AppointmentService } from '../services/appointment-service.js';
import { DateService } from '../services/date-service.js';
import { DoctorService } from '../services/doctor-service.js';
import { FieldService } from '../services/field-service.js';
import { PatientService } from '../services/patient-service.js';

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});


class ViewModel{
    constructor(){
        this.appointmentResults = new OneWayCollectionProp([], {
            date: (value) => value.toLocaleString()
        });

        this.doctorList = new OneWayCollectionProp([]);
        this.patientList = new OneWayCollectionProp([]);
        this.fieldList = new OneWayCollectionProp([]);

        this.filter = {
            dateFrom: new TwoWayProp(null, 'date', {
                dateString: DateService.toInputDateString
            }),
            dateTo: new TwoWayProp(null, 'date', {
                dateString: DateService.toInputDateString
            }),
            patient: {
                documentId: new TwoWayProp(null, 'string'),
                firstName: new TwoWayProp(null, 'string'),
                lastName: new TwoWayProp(null, 'string'),
                dateFrom: new TwoWayProp(null, 'date', {
                    dateString: DateService.toInputDateString
                }),
                dateTo: new TwoWayProp(null, 'date', {
                    dateString: DateService.toInputDateString
                })
            },
            doctor: {
                documentId: new TwoWayProp(null, 'number'),
                firstName: new TwoWayProp(null, 'string'),
                lastName: new TwoWayProp(null, 'string'),
                fieldId: new TwoWayProp(null, 'number', {
                    nullToEmpty: (value) => {
                        return value != null ? value : '';
                    }
                })
            }
        };

        this.form = {
            date: new TwoWayProp(null, 'date', {
                dateString: DateService.toInputDateString
            }),
            patientId: new TwoWayProp('', 'string'),
            doctorId: new TwoWayProp('', 'string')
        };

        this.appointmentResults.subscribe(document.querySelector('[data-results]'));

        const filters = document.querySelectorAll('[data-filter]');
        for(let i = 0; i < filters.length; i++){
            this.filter[filters[i].getAttribute('data-filter')].subscribe(filters[i]);
        }

        const patientFilters = document.querySelectorAll('[data-patient-filter]');
        for(let i = 0; i < patientFilters.length; i++){
            this.filter.patient[patientFilters[i].getAttribute('data-patient-filter')].subscribe(patientFilters[i]);
        }

        const doctorFilters = document.querySelectorAll('[data-doctor-filter]');
        for(let i = 0; i < doctorFilters.length; i++){
            this.filter.doctor[doctorFilters[i].getAttribute('data-doctor-filter')].subscribe(doctorFilters[i]);
        }

        const formFields = document.querySelectorAll('[data-field]');
        for(let i = 0; i < formFields.length; i++){
            this.form[formFields[i].getAttribute('data-field')].subscribe(formFields[i]); 
        }

        this.doctorList.subscribe(document.querySelector('[data-list="doctor"]'));
        this.patientList.subscribe(document.querySelector('[data-list="patient"]'));
        this.fieldList.subscribe(document.querySelector('[data-list="field"]'));

        this.newButton = document.querySelector('[data-new]');
        this.saveButton = document.querySelector('[data-save]');
        this.searchButton = document.querySelector('[data-search]');
        this.resultsTable = document.querySelector('[data-results]');
        this.appointmentId = null;

        this.modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.appointmentId = null;
            this.form.date.set(null);
            this.form.patientId.set('');
            this.form.doctorId.set('');
        });
        this.panels = [];

        let panelElements = document.querySelectorAll('[data-panel]');
        for(let i = 0; i < panelElements.length; i++){
            this.panels.push(new Panel(panelElements[i]));
        }

        this.newButton.addEventListener('click', () => {
            this.modal.open();
        });

        this.saveButton.addEventListener('click', () => {
            const appointment = {
                id: this.appointmentId,
                date: this.form.date.get(),
                doctorId: this.form.doctorId.get(),
                patientId: this.form.patientId.get()
            }

            if(appointment.id == null){
                AppointmentService.create(appointment);
            }else{
                AppointmentService.update(appointment);
            }

            this.modal.close();
            this.searchAppointments();
        });

        this.searchButton.addEventListener('click', () => {
            this.searchAppointments();
        });

        this.resultsTable.addEventListener('click', (e) => {
            let element = e.target;
            let id = element.getAttribute('data-id');

            if(element.matches('[data-click]')){
                switch(element.getAttribute('data-click')){
                    case 'edit':
                        let appointment = AppointmentService.get(id);
                    
                        if(appointment != null){
                            this.appointmentId = appointment.id;
                            this.form.date.set(appointment.date);
                            this.form.patientId.set(appointment.patientId);
                            this.form.doctorId.set(appointment.doctorId);
                            this.modal.open();
                        }
                        break;
                    case 'delete':
                        if(confirm('Are you sure you want to delete this record?')){
                            AppointmentService.delete(id);
                            this.searchAppointments();
                        }
                        break;
                }
            }
        });

        this.searchAppointments();
        this.loadDoctorOptions();
        this.loadPatientOptions();
        this.loadFieldOptions();
    }

    loadDoctorOptions(){
        this.doctorList.set(DoctorService.list());
    }

    loadPatientOptions(){
        this.patientList.set(PatientService.list());
    }

    loadFieldOptions(){
        let fields = FieldService.list();

        fields.unshift({
            id: '',
            name: 'All'
        });

        this.fieldList.set(fields);
    }

    searchAppointments(){
        const filter = {
            dateFrom: this.filter.dateFrom.get(),
            dateTo: this.filter.dateTo.get(),
            patient: {
                documentId: this.filter.patient.documentId.get(),
                firstName: this.filter.patient.firstName.get(),
                lastName: this.filter.patient.lastName.get(),
                dateFrom: this.filter.patient.dateFrom.get(),
                dateTo: this.filter.patient.dateTo.get()
            },
            doctor: {
                documentId: this.filter.doctor.documentId.get(),
                firstName: this.filter.doctor.firstName.get(),
                lastName: this.filter.doctor.lastName.get(),
                fieldId: this.filter.doctor.fieldId.get()
            }
        }

        this.appointmentResults.set(AppointmentService.list(filter));
    }
}