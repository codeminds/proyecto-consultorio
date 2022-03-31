export class Panel {
    #toggle;
    #toggleSection;

    constructor(toggle, toggleSection) {
        this.#toggle = toggle;
        this.#toggleSection = toggleSection;

        if(this.#toggle == null || this.#toggleSection == null) {
            throw new Error('Panel does not have toggle or toggleSection elements');
        }

        this.#toggle.addEventListener('click', () => { this.togglePanel() });
    }

    togglePanel() {
        this.#toggle.classList.toggle('open');
        this.#toggleSection.classList.toggle('open');
    }
}