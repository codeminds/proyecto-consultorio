export class Modal {
    #modal;
    #onClose;

    constructor(modal, size, onClose) {
        this.#modal = modal;
        this.#onClose = onClose;

        if(this.#modal == null) {
            throw new Error('Modal does not have modal element');
        }

        if(this.#onClose != null && typeof this.#onClose != 'function') {
            throw new Error('onClose parameter must be a callback');
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
        if(this.#onClose != null) {
            this.#onClose();
        }
        this.#modal.classList.remove('open');
    }
}