let instance = null;
class UniRaf {
  constructor () {
    if (instance) return instance;
    this.callbacks = [];
    this.now = 0;
    requestAnimationFrame(this.update.bind(this));
    instance = this;
  }
  add(cb) {
    const id = this.callbacks.push(cb) - 1;
    return () => this.remove(id);
  }
  remove(id) {
    this.callbacks.splice(id, 1);
  }
  update(now = 0) {
    const delta = now - this.now; // 0 on first render
    this.now = now;
    this.callbacks.forEach(cb => cb(delta, now)); // pass seconds not milliseconds
    requestAnimationFrame(this.update.bind(this));
  }
}

const uniraf = new UniRaf();
export { uniraf };