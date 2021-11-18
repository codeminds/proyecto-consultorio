export class Modal {
    #modal;

    constructor(modal, size) {
        this.#modal = modal;

        if(this.#modal == null) {
            throw new Error('Modal does not have modal element');
        }

        if(size == null) {
            size = 'medium';
        }

        this.#modal.classList.add(size);
        this.#modal.addEventListener('click', () => { this.close() });
        this.#modal.children[0].addEventListener('click', (e) => { e.stopPropagation() });
    }

    open() {
        this.#modal.classList.add('open');
    }

    close() {
        this.#modal.classList.remove('open');
    }
}