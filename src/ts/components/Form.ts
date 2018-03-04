export class Form {
    form: HTMLFormElement;

    constructor(form: HTMLFormElement) {
        this.form = form;
        form.addEventListener('submit', this.onSubmit);
    }

    private onSubmit = (e: Event) => {
        e.preventDefault();

        let body: any = Form.serialize(this.form);

        fetch(this.form.action, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: Form.encode(body)
        }).then((res: Response) => { 
            console.log(res.json());
        }).catch((err: any) => {
            console.log(err);
        });
    };

    static serialize(form: HTMLFormElement): any {
        let field: HTMLFormElement;
        let body: any = {};
        var len = form.elements.length;
        for (let i=0; i<len; i++) {
            field = <HTMLFormElement> form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (let j=field.options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            body[field.name] = field.options[j].value;
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    body[field.name] = field.value;
                }
            }
        }
        return body;
    }

    static encode(data: any): string {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    }
}