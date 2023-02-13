import { Panel } from '../controls/panel.js';

export class BaseViewModel {
   constructor() {
      this.#initMenu();
      this.#initPanels();
   }

   #initMenu() {
      const button = document.querySelector('[data-menu-button]');
      const menu = document.querySelector('[data-menu]');

      if (!button || !menu) {
         throw new Error('Menu elements not present')
      }

      button.addEventListener('click', () => {
         menu.classList.toggle('open');
      });
   }

   #initPanels() {
      const panels = document.querySelectorAll('[data-panel]');

      for (const panel of panels) {
         Panel.init(panel.querySelector('[data-toggle]'), panel.querySelector('[data-toggle-section]'));
      }
   }
}