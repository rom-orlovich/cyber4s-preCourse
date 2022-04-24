export class state {
  state;
  /**
   *
   * @param {Object} state Get the new state we want to update
   * @param {Boolean} initState Get initState we want to init the state of the program
   * @returns undefined if initState is not defined
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
   * @returns {Array} Array that contains the getState function and the setState function
   */

  useState(state) {
    this.state = state;
    return [this.getState.bind(this), this.setState.bind(this)];
  }
}
//the function are bind to 'this' because each time the functions are execute the
//'this' keyword can change to the enviromant which they execute
