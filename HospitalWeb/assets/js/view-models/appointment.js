import { Panel } from "../controls/panel.js";
import { BaseViewModel } from "./base.js";

class ViewModel extends BaseViewModel {
    #panels;

    constructor() {
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));
        
        this.#initPanels();
    }

    #initPanels() {
        this.#panels = [];

        for(const panel of document.querySelectorAll('[data-panel]')) {
            this.#panels.push(new Panel(panel.querySelector('[data-toggle]'), panel.querySelector('[data-toggle-section]')));
        }
    }
}

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});