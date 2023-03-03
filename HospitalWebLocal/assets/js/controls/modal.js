export class Modal {
   #modal;
   #onClose;

   constructor(modal, size = 'medium', onClose = null) {
      //Se valida si el parámetro es un elemento de HTML
      if(!modal instanceof HTMLElement) {
         throw new Error('modal parameter must be an HTML element');
      }

      //El callback es opcional, pero de ser proporcionado debe ser una función
      if(onClose != null && typeof onClose != 'function') {
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
      if(this.#onClose != null) {
         this.#onClose();
      }

      this.#modal.classList.remove('open');
   }
}