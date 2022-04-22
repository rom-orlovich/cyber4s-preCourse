export class state {
  state;

  setState(state, newState = false) {
    if (newState) {
      this.state = state;
      return;
    }
    let obj = {};
    for (const key in state) {
      obj = {
        ...this.state,
        [key]: state[key],
      };
    }
    this.state = obj;
  }

  getState() {
    return this.state;
  }

  useState(state) {
    this.state = state;
    return [this.getState.bind(this), this.setState.bind(this)];
  }
}
