export class Modal {
   #modal;
   #onClose;

   constructor(modal, size = 'medium', onClose = null) {
      if (modal == null) {
         throw new Error('Modal does not have a valid element');
      }

      if (onClose != null && typeof onClose != 'function') {
         throw new Error('onClose parameter must be a function');
      }

      this.#modal = modal;
      this.#onClose = onClose;
      this.#modal.classList.add(size);
      this.#modal.addEventListener('click', () => { this.close() });
      this.#modal.children[0].addEventListener('click', (e) => {
         e.stopPropagation();
      });
   }

   open() {
      this.#modal.classList.add('open');
   }

   close() {
      if (this.#onClose != null) {
         this.#onClose();
      }

      this.#modal.classList.remove('open');
   }
}