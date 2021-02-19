export class Panel{
    constructor(element){
        this.panel = element;
        this.toggle = element.querySelector('[data-toggle]');
        this.toggleSection = element.querySelector('[data-toggle-section]');

        if(this.toggle == null || this.toggleSection == null){
            throw new Error('Panel does not have a [data-toggle] or [data-toggle-section] element');
        }

        this.toggle.addEventListener('click', () => this.handleClick());
    }

    handleClick(e){
        this.toggle.classList.toggle('open');
        this.toggleSection.classList.toggle('open');
    }
}