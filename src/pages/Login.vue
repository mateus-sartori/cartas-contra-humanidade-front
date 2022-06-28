<template>
  <div class="container flex flex-center" style="height: 100vh">
    <div>
      <q-card class="q-pa-lg">
        <q-form
          greedy
          @submit.prevent.stop="handleRoom()"
          class="column justify-center"
        >
          <div class="row q-col-gutter-md">
            <div>
              <span class="text-subtitle2 text-bold">Nome: </span>
              <q-input filled v-model="form.name" dense />
            </div>
            <div v-if="getInAlreadySession">
              <span class="text-subtitle2 text-bold"> Sessão Id </span>
              <q-input square filled v-model="form.session" dense />
            </div>
          </div>
          <div class="row items-center">
            <q-checkbox v-model="getInAlreadySession" />
            <span>Entrar em sessão existente</span>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-btn
              dense
              :label="getInAlreadySession ? 'Entrar em sessão' : 'Criar sala'"
              :color="getInAlreadySession ? 'primary' : 'positive'"
              no-caps
              size="md"
              type="submit"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </div>
</template>
<script>
import { Cookies } from "quasar";
import { Game } from "../game/game";

export default {
  data() {
    return {
      getInAlreadySession: false,

      form: {
        name: null,
        session: null,
      },
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      connected() {
        console.log("connected");
      },
    },
  },

  mounted() {
    this.$cable.subscribe({
      channel: "CartasContraHumanidadeChannel",
    });
  },

  methods: {
    handleRoom() {
      const game = new Game();

      Cookies.set("id", Math.random().toString(36).slice(-8));

      if (this.getInAlreadySession) {
        Cookies.set('session', this.form.session)
        game.setSession(this.form.session);
      } else {
        Cookies.set("session", Math.random().toString(36).slice(-30));
        let session = Cookies.get("session");
        game.setSession(session);
      }

      let id = Cookies.get("id");

      const newPlayer = {
        name: this.form.name,
        id: id,
        session: game.getSession(),
      };

      game.getAllPlayers().then(() => {
        game.addPlayer(newPlayer);
        this.$router.push("/");
      });
    },
  },
};
</script>
