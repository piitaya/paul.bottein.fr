export class FixedNavbar {
    navbar: HTMLElement;

    constructor(navbar: HTMLElement) {
        this.navbar = navbar;
        window.addEventListener('scroll', this.onScroll);
    }

    private onScroll = (e: Event) => {
        let height = this.navbar.previousElementSibling.clientHeight + this.navbar.previousElementSibling.clientTop;
        if (height > window.scrollY) {
            document.body.classList.remove('has-fixed-navbar');
            this.navbar.classList.remove('is-fixed-top')
        }
        else {
            document.body.classList.add('has-fixed-navbar');
            this.navbar.classList.add('is-fixed-top')
        }
    };
}