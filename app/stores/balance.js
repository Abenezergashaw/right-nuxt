import { defineStore } from "pinia";

export const useBalance = defineStore("balance", {
  state: () => ({
    balance: 100,
  }),
});
