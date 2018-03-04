export class Form {
    form: HTMLFormElement;

    constructor(form: HTMLFormElement) {
        this.form = form;
        form.addEventListener('submit', this.onSubmit);
    }

    private onSubmit = (e: Event) => {
        e.preventDefault();
        let formData = new FormData(this.form);
        fetch(this.form.action, {
            method: "POST",
            body: formData
        }).then((res: Response) => { 
            console.log(res.json());
        }).catch((err: any) => {
            console.log(err);
        });
    };
}