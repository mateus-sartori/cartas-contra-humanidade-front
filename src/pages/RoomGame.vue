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

  mounted() {
    this.$cable.subscribe({
      channel: this.channel,
    });

    this.loadRooms();
    this.loadPlayers();
  },

  methods: {
    loadPlayersInRoom() {
      this.players = this.room["players"];
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
  },
};
</script>
