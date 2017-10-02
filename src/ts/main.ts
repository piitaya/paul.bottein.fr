module app {
    export class Main {
        constructor() {
            console.log('Hello World');
        }

        public static init() {
            return new Main();
        }
    }
}

app.Main.init();
