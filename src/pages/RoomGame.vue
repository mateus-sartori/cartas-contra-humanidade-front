<template>
  <div>
    <div class="container">
      <div class="flex flex-center">
        <span class="text-bold text-subtitle2" v-if="session_room">
          Sessão: {{ session_room.id }}
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

import { mapGetters, mapActions } from "vuex";

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
    ...mapGetters(["session", "room"]),

    session_room() {
      return this.rooms.find((room) => {
        return room.id == this.room;
      });
    },
  },

  watch: {
    players() {
      if (this.session) {
        this.currentPlayer = this.players.find((player) => {
          return player.id === this.session;
        });

        if (this.currentPlayer) return;
        else {
          this.$q.notify({
            icon: "announcement",
            message: "Jogador não encontrado, entre com uma sessão antes.",
            color: "brown",
            classes: "glossy",
          });

          setTimeout(() => {
            this.$router.push("/login");
          }, 300);
        }
      }
    },
  },

  destroyed() {
    this.removePlayerFromRoom();
    this.setRoom(null);
    if (this.players.length <= 1) {
      this.deleteRoom();
    }
  },

  mounted() {
    this.$q.loading.show({
      message: "Entrando na sessão...",
    });

    setTimeout(() => {
      this.loadRooms();
      this.loadPlayers();
      this.$q.loading.hide();
    }, 500);
  },

  methods: {
    ...mapActions(["setRoom"]),

    loadPlayersInRoom() {
      if (!this.session_room) {
        this.$router.push("/rooms");
        this.$q.notify({
          icon: "announcement",
          message: "Você foi removido pois o host saiu da sala.",
          color: "negative",
          classes: "glossy",
        });
      } else if (this.session_room) {
        this.players = this.session_room["players"];
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
      if (this.session_room) {
        this.$cable.perform({
          channel: this.channel,
          action: "remove_player_from_room",
          data: {
            player: this.currentPlayer,
            room_id: this.session_room["id"],
          },
        });
      }
    },

    deleteRoom() {
      this.$cable.perform({
        channel: this.channel,
        action: "delete_room",
        data: {
          room_id: this.session_room["id"],
        },
      });
    },
  },
};
</script>
