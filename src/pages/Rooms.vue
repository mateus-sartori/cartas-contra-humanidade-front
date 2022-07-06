<template>
  <div class="container">
    <div class="row q-pa-md q-gutter-md">
      <div class="row col-12 items-center justify-between">
        <div>
          <q-btn
            label="Criar sala"
            no-caps
            glossy
            color="green-7"
            @click="createRoom()"
          />
        </div>
        <div v-if="currentPlayer">Olá, {{ currentPlayer.name }}</div>
        <div v-if="this.players">
          <div>Total de jogadores: {{ this.players.length }}</div>
        </div>
      </div>
      <div class="col-12" v-if="rooms.length > 0">
        <q-card
          class="row items-center justify-between q-pa-lg q-my-md"
          v-for="(room, index) in rooms"
          v-bind:key="index"
        >
          <div v-if="currentPlayer">Sala de: {{ room.host_name }}</div>
          <div v-if="room.players">
            Total de Jogadores: {{ room.players.length }}/6
          </div>
          <div>
            <q-btn
              label="Entrar na sala"
              no-caps
              glossy
              @click="putPlayerInRoom(room)"
              color="green-7"
            />
          </div>
        </q-card>
      </div>
      <div class="col-12" v-else>Não há salas disponiveis</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Room",
  data() {
    return {
      channel: "CartasContraHumanidadeChannel",
      rooms: [],
      players: [],
      currentPlayer: null,
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      received(data) {
        switch (data.action) {
          case "list_players":
            this.players = data.players;
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
    ...mapGetters(["session", "room"]),
  },

  watch: {
    players() {
      this.currentPlayer = this.players.find((player) => {
        return player.id === this.session;
      });
      if (this.currentPlayer) return;
      else {
        this.removePlayer();
        setTimeout(() => {
          this.$router.push("/login");
        }, 200);
      }
    },
  },

  mounted() {
    this.$q.loading.show({
      message: "Carregando salas",
    });

    setTimeout(() => {
      this.loadPlayers();
      this.loadRooms();
      this.$q.loading.hide();
    }, 500);
  },

  methods: {
    ...mapActions(["setRoom"]),

    createRoom() {
      const room = Math.random().toString(36).slice(-10);

      this.setRoom(room);

      var roomInfo = {
        host: this.currentPlayer.id,
        hostName: this.currentPlayer.name,
        id: this.room,
      };

      this.$cable.perform({
        channel: this.channel,
        action: "create_room",
        data: roomInfo,
      });

      this.$q.loading.show({
        message: "Criando a sessão: " + roomInfo.id,
      });

      setTimeout(() => {
        this.putPlayerInRoom(roomInfo);
      }, 600);
    },

    putPlayerInRoom(room) {
      this.setRoom(room.id);

      this.$cable.perform({
        channel: this.channel,
        action: "put_player_in_room",
        data: {
          player: this.currentPlayer,
          room_id: room.id,
          players: room["players"],
        },
      });

      this.$q.loading.hide();

      this.$router.push("/room/" + room.id);
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

    removePlayer() {
      this.$cable.perform({
        channel: this.channel,
        action: "remove_player_from_session",
        data: {
          player: this.currentPlayer,
        },
      });
    },
  },
};
</script>
