import { defineStore } from "pinia";

export const useGeneral = defineStore("general", {
  state: () => ({
    stake: 10,
  }),

  actions: {
    increment() {
      this.stake++;
    },
    decrement() {
      this.stake--;
    },
    setStake(s) {
      this.stake = s;
    },
  },
});
