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
          <div v-if="currentPlayer">Sala de: {{ room.host }}</div>
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
import { Cookies } from "quasar";

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
      connected() {
        this.loadPlayers();
        this.loadRooms();
      },

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

  mounted() {
    this.$cable.subscribe({
      channel: this.channel,
    });
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
    createRoom() {
      Cookies.set("room", Math.random().toString(36).slice(-10));
      let roomId = Cookies.get("room");

      var roomInfo = {
        host: this.currentPlayer.name,
        id: roomId,
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
      Cookies.set("room", room.id);

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
  },
};
</script>
