export class state {
  state;
  /**
   *
   * @param {Object} state Get the new state we want to update
   * @param {Boolean} initState  if initState is true the state of the app restore with the
   * state we pass as paramter
   */

  setState(state, initState = false) {
    if (initState) {
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

  /**
   *
   * @param {Object} state Get new state to manage in the app
   * @returns {Array} Array that contains the getState  and the setState functions
   */

  useState(state) {
    this.state = state;
    return [this.getState.bind(this), this.setState.bind(this)];
  }
}
//the function are bind to 'this' because each time the functions are execute the
//'this' keyword can change to the enviromant which they execute
