export class ScrollTools {
    public static scrollToAnimate(to: number, duration: number) {
        let start = window.pageYOffset,
            change = to - start,
            currentTime = 0,
            increment = 10;

        let easeInOutQuad = (t: number, b: number, c: number, d: number) => {
          t /= d/2;
        	if (t < 1) return c/2*t*t + b;
        	t--;
        	return -c/2 * (t*(t-2) - 1) + b;
        };
        var animateScroll = function(){
            currentTime += increment;
            var val = easeInOutQuad(currentTime, start, change, duration);
            window.scrollTo(0, val);
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    public static scrollTo(to: number) {
        window.scrollTo(0, to);
    }
}
