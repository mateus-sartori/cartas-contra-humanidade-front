<template>
  <div>
    <div class="container">
      <div class="flex flex-center">
        <span class="text-bold text-subtitle2" v-if="room">
          Sessão: {{ room.id }}
        </span>
      </div>
      <div class="row q-py-md">
        <div class="column" v-if="players">
          <div
            v-for="(player, index) in players.slice(0, 3)"
            v-bind:key="index"
          >
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :player="player"
              :currentPlayer="currentPlayer"
            />
          </div>
        </div>
        <div class="column" v-if="players">
          <div
            v-for="(player, index) in players.slice(3, 6)"
            v-bind:key="index"
          >
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :player="player"
              :currentPlayer="currentPlayer"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "components/Card";
import { Cookies } from "quasar";

export default {
  name: "RoomGame",

  components: {
    Card,
  },
  data() {
    return {
      channel: "CartasContraHumanidadeChannel",
      rooms: [],
      currentPlayer: null,
      players: null,
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      connected() {
        this.loadRooms();
      },

      received(data) {
        switch (data.action) {
          case "list_rooms":
            this.rooms = data.rooms;
            this.loadPlayersInRoom();
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

  watch: {
    players() {
      this.currentPlayer = this.players.find((player) => {
        return player.id === Cookies.get("id");
      });

      if (this.currentPlayer) return;
      else {
        this.$q.notify({
          icon: "announcement",
          message: "Jogador não encontrado, entre com uma sessão antes.",
          color: "brown",
          classes: "glossy",
        });

        Cookies.remove("id");
        Cookies.remove("room");

        setTimeout(() => {
          this.$router.push("/login");
        }, 300);
      }
    },
  },

  destroyed() {
    this.removePlayerFromRoom();
    if (this.players.length <= 1) {
      this.deleteRoom();
    }
  },

  mounted() {
    this.loadRooms();
    this.loadPlayers();
  },

  methods: {
    loadPlayersInRoom() {
      if (this.room) {
        this.players = this.room["players"];
      }
    },

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

    removePlayerFromRoom() {
      this.$cable.perform({
        channel: this.channel,
        action: "remove_player_from_room",
        data: {
          player: this.currentPlayer,
          room_id: this.room["id"],
        },
      });
    },

    deleteRoom() {
      this.$cable.perform({
        channel: this.channel,
        action: "delete_room",
        data: {
          room_id: this.room["id"],
        },
      });
    },
  },
};
</script>
