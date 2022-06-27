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
              <q-input square filled v-model="form.room" dense />
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

            <q-btn
              dense
              label="Get users"
              no-caps
              size="md"
              @click="addNewPlayer()"
            />
          </div>
        </q-form>
      </q-card>
    </div>
    {{ newPlayers }}
  </div>
</template>
<script>
import axios from "axios";
import { Cookies } from "quasar";
export default {
  data() {
    return {
      getInAlreadySession: false,

      form: {
        name: null,
        session: null,
      },

      currentPlayers: [],
      newPlayers: [],
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      connected() {
        console.log("connected");
      },
      rejected() {},
      received(data) {
        console.log('received')
        this.newPlayers = data;
      },
      disconnected() {},
    },
  },

  mounted() {
    this.$cable.subscribe({
      channel: "CartasContraHumanidadeChannel",
    });
  },

  methods: {
    handleRoom() {
      Cookies.set("name", this.form.name);
      Cookies.set("id", Math.random().toString(36).slice(-8));

      if (this.getInAlreadySession) {
        Cookies.set("session", this.form.session);
      } else {
        Cookies.set("session", Math.random().toString(36).slice(-30));
      }

      let session = Cookies.get("session");
      let id = Cookies.get("id");
      let name = Cookies.get("name");

      this.addNewPlayer(session, id, name);
    },

    addNewPlayer(session, id, name) {
      let newPlayer = {
        session: session,
        id: id,
        name: name,
      };

      axios.get("players").then((response) => {
        this.currentPlayers = response.data;

        this.currentPlayers.push(newPlayer);

        let data = {
          currentPlayers: this.currentPlayers,
        };

        axios.post("players", data).then((response) => {
          this.newPlayers = response.data;
        });
      });
    },
  },
};
</script>
