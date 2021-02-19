export class Modal{
    constructor(element, size, onClose){
        this.modal = element;

        if(size == null){
            this.size = 'medium';
        }else{
            this.size = size;
        }

        if(onClose != null){
            this.onClose = onClose;
        }

        this.modal.addEventListener('click', () => this.close());
        this.modal.children[0].addEventListener('click', (e) => {
            e.stopPropagation();
        })
    }

    open(){
        document.body.classList.add('locked');
        this.modal.classList.add('open');
        this.modal.classList.add(this.size);
    }

    close(){
        document.body.classList.remove('locked');
        this.modal.classList.remove('open');
        this.modal.classList.remove(this.size);
        if(this.onClose != null){
            this.onClose();
        }
    }
}