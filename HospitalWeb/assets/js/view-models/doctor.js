import { Modal } from '../controls/modal.js';
import { Panel } from '../controls/panel.js';
import { FieldService } from '../services/field.js';
import { BaseViewModel } from './base.js';

class ViewModel extends BaseViewModel{
    #panel;
    #modal;
    #results;

    constructor() {
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));
        
        this.#initPanel();
        this.#initModal();
        this.#initFields();
    }

    #initPanel() {
        this.#panel = new Panel(document.querySelector('[data-toggle]'), document.querySelector('[data-toggle-section]'));
    }

    #initModal() {
        this.#modal = new Modal(document.querySelector('[data-modal]'));
        document.querySelector('[data-new]').addEventListener('click', () => { this.#modal.open() });
        document.querySelector('[data-save]').addEventListener('click', () => { this.#modal.close() });
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
                        this.#modal.open();
                        break;
                    case 'delete':
                        alert('Borrar');
                        break;
                }
            }
        });
    }

    #initFields() {
        FieldService.list((fields) => {
            this.#populateFields(document.querySelector('[data-filter="fields"]'), fields, true);
            this.#populateFields(document.querySelector('[data-form="fields"]'), fields, false);
        });
    }

    #populateFields(select, fields, useAll) {
        if(useAll) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'All';
            select.appendChild(option);
        }

        for(let i = 0; i < fields.length; i++) {
            const option = document.createElement('option');
            option.value = fields[i].id;
            option.textContent = fields[i].name;

            select.appendChild(option);
        }
    }
}

let viewModel;
window.addEventListener('load', () => {
   viewModel = new ViewModel();
});
