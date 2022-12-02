export class Panel {
   static init(toggle, toggleSection) {
      if (toggle == null || toggleSection == null) {
         throw new Error('Panel does not have toggle or toggleSection elements');
      }

      toggle.addEventListener('click', () => {
         toggle.classList.toggle('open');
         toggleSection.classList.toggle('open');
      });
   }
}