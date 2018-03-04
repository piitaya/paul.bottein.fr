export class Form {
    form: HTMLFormElement;

    constructor(form: HTMLFormElement) {
        this.form = form;
        form.addEventListener('submit', this.onSubmit);
    }

    private onSubmit = (e: Event) => {
        e.preventDefault();
        let data = Form.serialize(this.form);
        console.log(data);
        fetch(this.form.action, {
            method: "POST",
            body: data
        }).then((res: Response) => { 
            console.log(res.json());
        }).catch((err: any) => {
            console.log(err);
        });
    };

    static serialize(form: HTMLFormElement): string {
        let field: HTMLFormElement;
        let s: string[] = [];
        var len = form.elements.length;
        for (let i=0; i<len; i++) {
            field = <HTMLFormElement> form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (let j=field.options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
        return s.join('&').replace(/%20/g, '+');
    }
}