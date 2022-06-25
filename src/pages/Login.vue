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
export default {
  data() {
    return {
      getInAlreadySession: false,

      form: {
        name: "",
        session: null,
      },
    };
  },


  methods: {
    handleRoom() {
      if (!this.form.session) {
        Cookies.set("session", Math.random().toString(36).slice(-30));
        Cookies.set('host', true)
      }

      Cookies.set("userId", Math.random().toString(36).slice(-8));
      Cookies.set("userName", this.form.name);

      if (this.getInAlreadySession) Cookies.set("session", this.form.session);

      let session = Cookies.get("session");

      if (session) {
        this.$cable.subscribe({
          channel: "CartasContraHumanidadeChannel",
          room: session,
        });

        this.$router.push("/");
      }
    },
  },
};
</script>
