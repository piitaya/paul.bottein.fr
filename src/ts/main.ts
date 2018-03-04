import { AnchorScroll, FixedNavbar, Form } from "./components";

module app {
    export class Main {
        constructor() {
            console.log('Hello World');

            new FixedNavbar(<HTMLElement> document.getElementsByClassName('navbar')[0]);
            new AnchorScroll({
                elements: document.querySelectorAll('.navbar-tabs > a'),
                activeClass: 'is-active'
            });
            new Form(<HTMLFormElement> document.querySelector('form[name="contact"]'));
        }

        public static init() {
            return new Main();
        }
    }
}

app.Main.init();
