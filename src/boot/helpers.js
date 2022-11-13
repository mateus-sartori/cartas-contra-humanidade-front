import Vue from "vue";

Vue.mixin({
  methods: {
    broadcastTo(action, channel, session, data=null) {
      this.$cable.perform({
        channel: channel,
        action: action,
        data: {
          ...data,
          session: session,
        },
      });
    },

    randomElement(array) {
      if (array) {
        return array[Math.floor(Math.random() * array.length)];
      }
    },

    randomMultipleElements(array, num) {
      const shuffled = array.sort(() => 0.5 - Math.random());

      return shuffled.slice(0, num);
    },
  },
});
