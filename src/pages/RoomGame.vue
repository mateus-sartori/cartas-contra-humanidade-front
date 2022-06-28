<template>
  <div>
    <div v-if="room">Está é a sala {{ room.id }}</div>
    <div v-if="playersInRoom">{{ playersInRoom }}</div>
  </div>
</template>

<script>
import { Cookies } from "quasar";

export default {
  name: "RoomGame",
  data() {
    return {
      channel: "CartasContraHumanidadeChannel",
      rooms: [],
      players: [],
      playersInRoom: [],
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      connected() {
        this.loadRooms();
      },

      received(data) {
        switch (data.action) {
          case "list_players":
            this.filterPlayersInRoom();
            this.players = data.players;
            this.filterPlayersInRoom();
            break;
          case "list_rooms":
            this.rooms = data.rooms;
            break;
          default:
            break;
        }
      },
    },
  },

  computed: {
    room() {
      return this.rooms.find((room) => {
        return room.id == Cookies.get("room");
      });
    },
  },

  mounted() {
    this.$cable.subscribe({
      channel: this.channel,
    });

    this.loadRooms();
    this.loadPlayers();
  },

  methods: {
    loadPlayers() {
      this.$cable.perform({
        channel: this.channel,
        action: "list_players",
      });
    },

    loadRooms() {
      this.$cable.perform({
        channel: this.channel,
        action: "list_rooms",
      });
    },

    filterPlayersInRoom() {
      this.playersInRoom = this.players.filter((players) => {
        return players.room_id === Cookies.get("room");
      });
    },
  },
};
</script>
