<template>
  <div class="container flex flex-center" style="height: 100vh">
    <div>
      <q-card class="q-pa-lg">
        <div class="column justify-center">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <span class="text-subtitle2 text-bold">Nome: </span>
              <q-input filled v-model="form.name" dense />
            </div>
          </div>
          <span v-if="this.errorMessage" class="text-red">
            {{ this.errorMessage }}
          </span>
          <div class="row q-gutter-md justify-center q-mt-sm">
            <q-btn
              dense
              label="Entrar na sessão"
              color="green-8"
              no-caps
              size="md"
              @click="enterInSession()"
            />
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      getInAlreadyRoom: false,

      form: {
        name: null,
      },
      errorMessage: null,

      channel: "CartasContraHumanidadeChannel",
    };
  },

  computed: {
     ...mapGetters(["session"]),
  },

  methods: {
    enterInSession() {
      if (!this.form.name) {
        this.errorMessage = "É preciso informar um nome.";
        return;
      }

      this.errorMessage = null;

      var player = {
        id: this.session,
        name: this.form.name,
      };

      this.$cable.perform({
        channel: this.channel,
        action: "create_player",
        data: {
          player: player,
        },
      });

      this.$router.push("/rooms");
    },
  },
};
</script>
