class Sizes extends EventTarget {
  constructor () {
    super();

    this.listeners = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    window.addEventListener("resize", this.onResize.bind(this));
  }
  sub(listener) {
    this.listeners.push(listener);
  }
  unsub(listener) {
    this.listeners = this.listeners.filter(fn => fn !== listener);
  }
  onResize() {}
}

const sizes = new Sizes();