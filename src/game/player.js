class Player {
  constructor(name, id) {
    this.states = {
      player: {
        name: name,
        id: id,
      },
    };
  }

  getPlayer() {
    return this.states.player
  }
}

export { Player };
