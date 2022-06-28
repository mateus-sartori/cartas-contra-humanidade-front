import axios from "axios";

class Game {
  constructor() {
    this.state = {
      players: [],
    };
  }

  setSession(session) {
    this.session = session;
  }

  getSession() {
    return this.session;
  }

  setPlayers(players) {
    this.state.players = players;
  }

  pushPlayers(player) {
    this.state.players.push(player);
  }

  getPlayers() {
    return this.state.players;
  }

  getAllPlayers() {
    return new Promise((resolve, reject) => {
      return axios
        .get("players")
        .then((response) => {
          this.setPlayers(response.data);
          resolve(this.getPlayers());
        })
        .catch(() => {
          reject();
        });
    });
  }

  addPlayer(player) {
    this.pushPlayers(player);

    var data = {
      players: this.getPlayers(),
    };

    axios.post("players", data)
  }

  createRoom() {}
}

export { Game };
