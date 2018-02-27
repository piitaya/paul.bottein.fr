import { ArrayTools, ScrollTools } from '../utils';

export interface AnchorScrollOptions {
    elements: HTMLElement[] | NodeList,
    activeClass?: string;
}

export class Anchor {
    public static MARGIN_ATTRIBUTE = 'data-anchor-margin';
    
    margin: number;
    element: HTMLElement;
    trigger: HTMLLinkElement;
    duration: number = 500;
    
    constructor(element: HTMLElement, trigger: HTMLLinkElement, margin: number = 0) {
        this.element = element;
        this.trigger = trigger;
        this.margin = margin;

        if (this.element.hasAttribute(Anchor.MARGIN_ATTRIBUTE)) {
            this.margin = parseInt(this.element.getAttribute(Anchor.MARGIN_ATTRIBUTE)) || margin;
        }

        this.trigger.addEventListener('click', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            this.scrollTo(this.duration);
        });
    }

    public scrollTo(duration: number = 0) {
        try {
            history.pushState({}, '', this.trigger.getAttribute('href'));
            if (duration > 0) {
                ScrollTools.scrollToAnimate(this.getElementPosition(), duration);
            }
            else {
                ScrollTools.scrollTo(this.getElementPosition());
            }
        } catch(e) {}
    }

    public getElementPosition(): number {
        return this.element.getBoundingClientRect().top + window.pageYOffset - this.margin;
    }    
}

export class AnchorScroll {
    public defaultMargin = 52;
    public activeClass: string = "active";
    public anchors: Anchor[] = [];

    public constructor(options: AnchorScrollOptions) {
        if (options.activeClass) {
            this.activeClass = options.activeClass;
        }
        let triggers: HTMLElement[];
        if (options.elements instanceof NodeList) {
            triggers = ArrayTools.toArray(options.elements);
        }
        else {
            triggers = options.elements || [];
        }

        triggers.forEach((trigger: HTMLElement) => {
            if(trigger.hasAttribute('href')) {
                let href: string = trigger.getAttribute('href');
                if (href[0] == '#') {
                    let id = href.slice(1);
                    let anchor = document.getElementById(id);
                    if (anchor) {
                        this.anchors.push(new Anchor(anchor, <HTMLLinkElement> trigger, this.defaultMargin));
                    }
                }
            }
        });
        this.anchors = this.anchors.sort((a: Anchor, b: Anchor) => {
            return a.getElementPosition() - b.getElementPosition();
        });

        this.addScrollListeners();
    }

    public addScrollListeners() {
        if (this.anchors.length > 0) {
            this.onScroll();
            this.onHashChange();
            document.addEventListener("scroll", this.onScroll);
            window.addEventListener('hashchange', this.onHashChange);
        }
    }

    private onHashChange = () => {
        let selected: Anchor = this.anchors.filter((anchor: Anchor) => {
            return anchor.trigger.getAttribute('href') == location.hash;
        })[0];

        if (selected) {
            window.setTimeout(() => {
                selected.scrollTo();
            }, 1);
        }
    }

    private onScroll = () => {
        let anchors = this.anchors.filter((anchor: Anchor) => {
            return anchor.getElementPosition() - window.pageYOffset <= 0;
        });
        let active: Anchor = anchors.reverse()[0];

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            active = this.anchors[this.anchors.length - 1];
        }

        this.anchors.map((anchor: Anchor) => {
            if (active && anchor.trigger.href == active.trigger.href) {
                anchor.trigger.classList.add(this.activeClass);
            }
            else {
                anchor.trigger.classList.remove(this.activeClass);
            }
        });
    };
}
