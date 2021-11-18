import { Panel } from "../controls/panel.js";
import { BaseViewModel } from "./base.js";

class ViewModel extends BaseViewModel{
    #panel;

    constructor() {
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));
        
        this.#initPanel();
    }

    #initPanel() {
        this.#panel = new Panel(document.querySelector('[data-toggle]'), document.querySelector('[data-toggle-section]'));
    }
}

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});