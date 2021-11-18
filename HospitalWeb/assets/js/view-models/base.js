export class BaseViewModel {
    #menu;
    #menuButton;

    constructor(menu, menuButton) {
        this.#initMenu(menu, menuButton);
    }

    openMenu() {
        this.#menu.classList.toggle('open');
    }

    #initMenu(menu, menuButton) {
        this.#menu = menu;
        this.#menuButton = menuButton;

        if(this.#menu == null || this.#menuButton == null) {
            throw new Error('View Model does not have menu or menuButton elements');
        }

        this.#menuButton.addEventListener('click', () => { this.openMenu() });
    }
}