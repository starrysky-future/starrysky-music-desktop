class EventEmitter {
  cache;
  constructor() {
    this.cache = {};
  }
  only(name, fn) {
    // 注册全局唯一事件
    if (this.cache[name]) return;
    this.cache[name] = [fn];
  }
  on(name, fn) {
    if (this.cache[name]) {
      const tasks = this.cache[name];
      const index = tasks.findIndex((f) => f === fn || f.callback === fn);
      // 防止同一事件多次注册
      if (index < 0) {
        this.cache[name].push(fn);
      }
    } else {
      this.cache[name] = [fn];
    }
  }
  off(name, fn) {
    const tasks = this.cache[name];
    if (tasks) {
      const index = tasks.findIndex((f) => f === fn || f.callback === fn);
      if (index >= 0) {
        tasks.splice(index, 1);
      }
    }
  }
  emit(name, ...args) {
    if (this.cache[name]) {
      // 创建副本，如果函数内继续注册相同事件，会造成死循环
      const tasks = this.cache[name].slice();
      for (const fn of tasks) {
        fn(...args);
      }
    }
  }
  once(name, fn) {
    const one = (...args) => {
      fn(...args);
      this.off(name, one);
    };
    // 手动移除fn时，防止找不到
    one.callback = fn;
    this.on(name, one);
  }
}

const eventBus = new EventEmitter();

export default eventBus;
