<template>
  <div class="container">
    <div class="row q-pa-md q-gutter-md">
      <div class="row col-12 justify-between">
        <div>
          <q-btn
            label="Criar sala"
            no-caps
            color="green-6"
            @click="createRoom()"
          />
        </div>
        <div v-if="currentPlayer">Olá, {{ currentPlayer.name }}</div>
        <div>
          <div>Total de jogadores: {{ this.players.length }}</div>
        </div>
      </div>
      <div class="col-12" v-if="rooms.length > 0">
        <q-card
          class="row justify-between q-pa-lg q-my-md"
          v-for="(room, index) in rooms"
          v-bind:key="index"
        >
          <div>Sala de: {{currentPlayer.name}}</div>
          <div>Total de Jogadores: 10/10</div>
        </q-card>
      </div>
      <div class="col-12" v-else>Não há salas disponiveis</div>
    </div>
  </div>
</template>

<script>
import { Cookies } from "quasar";

export default {
  name: "Room",
  data() {
    return {
      channel: "CartasContraHumanidadeChannel",
      rooms: [],
      players: [],
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      connected() {
        this.loadPlayers();
        this.loadRooms();
      },

      received(data) {
        console.log("action", data.action);
        switch (data.action) {
          case "list_players":
            this.players = data.players;
            break;
          case "list_rooms":
            console.log("list rooms?");
            this.rooms = data.rooms;
            break;
          default:
            break;
        }
      },
    },
  },

  computed: {
    currentPlayer() {
      return this.players.find((player) => {
        return player.id === Cookies.get("id");
      });
    },
  },

  mounted() {
    this.$cable.subscribe({
      channel: this.channel,
    });

    this.loadPlayers();
    this.loadRooms();
  },

  methods: {
    createRoom() {
      Cookies.set("room", Math.random().toString(36).slice(-10));
      let roomId = Cookies.get("room");

      var room = {
        id: roomId,
      };

      this.$cable.perform({
        channel: this.channel,
        action: "create_room",
        data: {
          room: room
        },
      });

      this.loadRooms();

      this.putPlayerInRoom(room);

      this.$router.push("/room/" + room.id);
    },

    putPlayerInRoom(room) {
      this.$cable.perform({
        channel: this.channel,
        action: "put_player_in_room",
        data: {
          player_id: this.currentPlayer.id,
          room_id: room,
        },
      });
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
