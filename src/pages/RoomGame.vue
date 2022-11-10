<template>
  <div>

    <div class="container">
      <div class="flex flex-center">
        <div class="column items-center">
          <div class="q-mt-sm">
            <span class="text-bold text-subtitle2" v-if="session_room">
              Sessão: {{ session_room.id }}
            </span>
          </div>
          <div class="q-mt-md" v-if="!isGameStared && playerIsHost">
            <q-btn
              label="Começar game"
              color="red-8"
              no-caps
              @click="startGame(session_room.id)"
            />
          </div>
          <span class="text-h6" v-if="bossRound">
            Patrão da rodada: <b>{{bossRound.name}}</b>
          </span>
        </div>
      </div>

      <div class="row q-ml-sm">
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

        <div class="col" v-if="isGameStared">
          <board-game
            :current-player="currentPlayer"
            :session="session_room.id"
            :players="players"
          />
        </div>

        <div class="row q-mr-sm">
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
  </div>
</template>

<script>
import Card from "components/Card";
import BoardGame from "components/BoardGame.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "RoomGame",

  components: {
    Card,
    BoardGame,
  },
  data() {
    return {
      channel: "CartasContraHumanidadeChannel",
      startGameChannel: "CartasContraHumanidadeGameRuleChannel",
      rooms: [],
      currentPlayer: null,
      players: null,

      isGameStared: false,
    };
  },

  channels: {
    CartasContraHumanidadeGameRuleChannel: {
      connected() {
        console.log("Room Game Connect on:", this.session_room.id);
        this.setBossRound(this.bossRound)
      }
    },

    CartasContraHumanidadeChannel: {
      received(response) {
        switch (response.action) {
          case "list_rooms":
            this.rooms = response.rooms;
            this.loadPlayersInRoom();
            break;
          case "start_game":
            if (this.session_room.id == response.session) {
              this.$cable.subscribe({
                channel: this.startGameChannel,
                session: response.session,
              });
              
              if(response.status == 'started') {
                this.loadRooms()
                this.setSessionStatus(response.status)
                this.isGameStared = true;
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
    ...mapGetters(["session", "room", "bossRound"]),

    session_room() {
      if (this.rooms) {
        return this.rooms.find((room) => {
          return room.id == this.room;
        });
      }
      return null;
    },

    playerIsHost() {
      if (this.session_room && this.currentPlayer) {
        return this.session_room.host == this.currentPlayer.id;
      }
      return null;
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
    if (this.players && this.players.length <= 1) this.deleteRoom();
  },

  mounted() {
    this.setBossRound(null)
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
    ...mapActions(["setRoom", "setBossRound", "setSessionStatus"]),

    startGame(room_id) {
      if (this.session_room.id == room_id) {
        this.$cable.perform({
          channel: this.channel,
          action: "start_game",
          data: {
            session: room_id,
            status: 'started'
          },
        });
        const bossRound = this.players[Math.floor(Math.random() * this.players.length)];
        this.setBossRound(bossRound)
      }
    },

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
