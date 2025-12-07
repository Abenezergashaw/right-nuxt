import { defineStore } from "pinia";

export const useTicket = defineStore("ticket", {
  state: () => ({
    ticket: [],
  }),

  getters: {
    currentBonus: (state) => {
      const tickets = state.ticket.length;
      if (tickets === 2) return 2;
      if (tickets === 3) return 3;
      if (tickets === 4) return 4;
      if (tickets === 5) return 8;
      if (tickets === 6) return 12;
      if (tickets === 7) return 20;
      if (tickets === 8) return 25;
      if (tickets === 9) return 30;
      if (tickets === 10) return 40;
      if (tickets === 11) return 50;
      if (tickets === 12) return 60;
      if (tickets === 13) return 75;
      if (tickets === 14) return 85;
      if (tickets === 15) return 95;
      if (tickets === 16) return 105;
      if (tickets === 17) return 115;
      if (tickets === 18) return 120;
      if (tickets === 19) return 130;
      if (tickets === 20) return 140;
      if (tickets === 21) return 150;
      if (tickets === 22) return 160;
      if (tickets === 23) return 170;
      if (tickets === 24) return 180;
      if (tickets === 25) return 190;
      if (tickets === 26) return 200;
      if (tickets === 27) return 210;
      if (tickets === 28) return 220;
      if (tickets === 29) return 235;
      if (tickets === 30) return 245;
      if (tickets === 31) return 255;
      if (tickets === 32) return 265;
      if (tickets === 33) return 275;
      if (tickets === 34) return 285;
      if (tickets === 35) return 300;
      if (tickets === 36) return 320;
      if (tickets === 37) return 340;
      if (tickets === 38) return 360;
      if (tickets === 39) return 360;
      if (tickets === 40) return 400;
      if (tickets === 41) return 450;
      if (tickets === 42) return 500;
      if (tickets === 43) return 550;
      if (tickets === 44) return 600;
      if (tickets === 45) return 650;
      if (tickets === 46) return 700;
      if (tickets === 47) return 750;
      if (tickets === 48) return 800;
      if (tickets === 49) return 850;
      if (tickets === 50) return 900;
      if (tickets >= 51) return 1001;
      return 1;
    },
    nextBonus: (state) => {
      const tickets = state.ticket.length + 1;
      if (tickets === 2) return 2;
      if (tickets === 3) return 3;
      if (tickets === 4) return 4;
      if (tickets === 5) return 8;
      if (tickets === 6) return 12;
      if (tickets === 7) return 20;
      if (tickets === 8) return 25;
      if (tickets === 9) return 30;
      if (tickets === 10) return 40;
      if (tickets === 11) return 50;
      if (tickets === 12) return 60;
      if (tickets === 13) return 75;
      if (tickets === 14) return 85;
      if (tickets === 15) return 95;
      if (tickets === 16) return 105;
      if (tickets === 17) return 115;
      if (tickets === 18) return 120;
      if (tickets === 19) return 130;
      if (tickets === 20) return 140;
      if (tickets === 21) return 150;
      if (tickets === 22) return 160;
      if (tickets === 23) return 170;
      if (tickets === 24) return 180;
      if (tickets === 25) return 190;
      if (tickets === 26) return 200;
      if (tickets === 27) return 210;
      if (tickets === 28) return 220;
      if (tickets === 29) return 235;
      if (tickets === 30) return 245;
      if (tickets === 31) return 255;
      if (tickets === 32) return 265;
      if (tickets === 33) return 275;
      if (tickets === 34) return 285;
      if (tickets === 35) return 300;
      if (tickets === 36) return 320;
      if (tickets === 37) return 340;
      if (tickets === 38) return 360;
      if (tickets === 39) return 360;
      if (tickets === 40) return 400;
      if (tickets === 41) return 450;
      if (tickets === 42) return 500;
      if (tickets === 43) return 550;
      if (tickets === 44) return 600;
      if (tickets === 45) return 650;
      if (tickets === 46) return 700;
      if (tickets === 47) return 750;
      if (tickets === 48) return 800;
      if (tickets === 49) return 850;
      if (tickets === 50) return 900;
      if (tickets >= 51) return 1001;
      return 1;
    },
  },
  actions: {
    manageSelectedBet(bet) {
      const ref = bet.reference_id;

      const exactIndex = this.ticket.findIndex((b) => b.reference_id === ref);
      if (exactIndex !== -1) {
        this.ticket.splice(exactIndex, 1);
        return;
      }

      const prefix = ref.split("-")[0];

      const prefixIndex = this.ticket.findIndex((b) =>
        b.reference_id.startsWith(prefix)
      );

      if (prefixIndex !== -1) {
        this.ticket[prefixIndex] = bet;
      } else {
        this.ticket.push(bet);
      }
    },

    clearBets() {
      const general = useGeneral();
      this.ticket = [];
      general.setStake(10);
    },

    removeBet(index) {
      const general = useGeneral();
      this.ticket.splice(index, 1);
      if (this.ticket.length === 0) {
        general.setStake(10);
      }
    },
  },
});
