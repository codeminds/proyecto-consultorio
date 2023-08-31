export class Panel {
   static init(toggle, toggleSection) {
      //Se valida si los parámetros son elementos de HTML
      if (!(toggle instanceof HTMLElement) || !(toggleSection instanceof HTMLElement)) {
         throw new Error('toggle and toggleSection parameters must be HTML elements');
      }

      toggle.addEventListener('click', () => {
         toggle.classList.toggle('open');
         toggleSection.classList.toggle('open');
      });
   }
}