<template>
  <div>
    <div class="container">
      <div class="flex flex-center">
        <div class="column items-center">
          <div class="q-mt-sm">
            <span class="text-bold text-subtitle2" v-if="room">
              Sessão: {{ room.id }}
            </span>
          </div>
          <div class="q-mt-md" v-if="!isGameStared && playerIsHost">
            <q-btn
              label="Começar game"
              color="red-8"
              no-caps
              @click="startGame(room.id)"
            />
          </div>
          <span class="text-h6" v-if="bossRound">
            Patrão da rodada: <b>{{ bossRound.name }}</b>
          </span>
        </div>
      </div>
    </div>

    <div class="container">
      <score />
      <div v-if="isGameStared">
        <board-game :current-player="currentPlayer" :players="players" />
      </div>
    </div>
  </div>
</template>

<script>
import BoardGame from "components/BoardGame.vue";
import Score from "components/Score.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "RoomGame",

  components: {
    BoardGame,
    Score,
  },
  data() {
    return {
      channel: "CartasContraHumanidadeChannel",
      startGameChannel: "CartasContraHumanidadeGameRuleChannel",
      rooms: [],
      players: null,

      isGameStared: false,
    };
  },

  channels: {
    CartasContraHumanidadeGameRuleChannel: {
      connected() {
        console.log("Room Game Connect on:", this.room.id);
        this.setBossRound(this.bossRound);
      },
    },

    CartasContraHumanidadeChannel: {
      received(response) {
        switch (response.action) {
          case "list_rooms":
            this.rooms = response.rooms;
            this.loadPlayersInRoom();
            break;
          case "start_game":
            if (this.room.id == response.session) {
              this.$cable.subscribe({
                channel: this.startGameChannel,
                session: response.session,
              });

              if (response.status == "started") {
                this.loadRooms();
                this.setSessionStatus(response.status);
                this.isGameStared = true;
              }

              var currentPlayer = {
                ...this.currentPlayer,
                pending: true,
              };

              this.setCurrentPlayer(currentPlayer);
              if (this.bossRound && this.currentPlayer) {
                const isBoss = this.bossRound.id == this.currentPlayer.id;
                this.setIsCurrentBoss(isBoss);
              }
            }
            break;
          default:
            break;
        }
      },
    },
  },

  computed: {
    ...mapGetters([
      "session",
      "room",
      "bossRound",
      "currentPlayer",
      "isCurrentBoss",
    ]),

    playerIsHost() {
      if (this.room && this.currentPlayer) {
        return this.room.host == this.currentPlayer.id;
      }
      return null;
    },
  },

  watch: {
    players() {
      if (this.session) {
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

    rooms() {
      if (this.rooms) {
        const room = this.rooms.find((room) => {
          return room.id == this.room.id;
        });
        this.setRoom(room);
        this.loadPlayersInRoom();
      }
    },
  },

  destroyed() {
    this.removePlayerFromRoom();
    this.setRoom(null);
    if (this.players && this.players.length <= 1) this.deleteRoom();
  },

  mounted() {
    this.setBossRound(null);
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
    ...mapActions([
      "setRoom",
      "setBossRound",
      "setSessionStatus",
      "setCardsInTable",
      "setCurrentPlayer",
      "setRoundStatus",
      "setIsCurrentBoss",
    ]),

    startGame(room_id) {
      if (this.room.id == room_id) {
        this.$cable.perform({
          channel: this.channel,
          action: "start_game",
          data: {
            session: room_id,
            status: "started",
          },
        });

        const bossRound =
          this.players[Math.floor(Math.random() * this.players.length)];
        this.setBossRound(bossRound);
      }
    },

    loadPlayersInRoom() {
      if (!this.room) {
        this.$router.push("/rooms");
        this.$q.notify({
          icon: "announcement",
          message: "Você foi removido pois o host saiu da sala.",
          color: "negative",
          classes: "glossy",
        });
        this.setCardsInTable([]);
      } else if (this.room) {
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
      if (this.room) {
        this.$cable.perform({
          channel: this.channel,
          action: "remove_player_from_room",
          data: {
            player: this.currentPlayer,
            room_id: this.room["id"],
          },
        });
      }
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
