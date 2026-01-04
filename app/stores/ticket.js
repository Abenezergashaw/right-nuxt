import { defineStore } from "pinia";
import { onMounted } from "vue";

export const useTicket = defineStore("ticket", {
  state: () => ({
    ticket: [],
    isLoaded: false,
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
  // actions: {
  //   manageSelectedBet(bet) {
  //     const ref = bet.reference_id;

  //     const exactIndex = this.ticket.findIndex((b) => b.reference_id === ref);
  //     if (exactIndex !== -1) {
  //       this.ticket.splice(exactIndex, 1);
  //       return;
  //     }

  //     const prefix = ref.split("-")[0];

  //     const prefixIndex = this.ticket.findIndex((b) =>
  //       b.reference_id.startsWith(prefix)
  //     );

  //     if (prefixIndex !== -1) {
  //       this.ticket[prefixIndex] = bet;
  //     } else {
  //       this.ticket.push(bet);
  //     }
  //   },

  //   clearBets() {
  //     const general = useGeneral();
  //     this.ticket = [];
  //     general.setStake(10);
  //   },

  //   removeBet(index) {
  //     const general = useGeneral();
  //     this.ticket.splice(index, 1);
  //     if (this.ticket.length === 0) {
  //       general.setStake(10);
  //     }
  //   },
  // },
  actions: {
    loadFromStorage() {
      if (process.client) {
        const saved = localStorage.getItem("ticket");
        if (saved) {
          this.ticket = JSON.parse(saved);
        }
        this.isLoaded = true;
      }
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem("ticket", JSON.stringify(this.ticket));
      }
    },

    manageSelectedBet(bet) {
      const ref = bet.reference_id;

      const exactIndex = this.ticket.findIndex((b) => b.reference_id === ref);
      if (exactIndex !== -1) {
        this.ticket.splice(exactIndex, 1);
        this.saveToStorage();
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
      // console.log(this.ticket);
      this.ticket.map((t) =>
        console.log(
          "Name: ",
          t.market_name,
          "price hcap: ",
          t.price_hcap,
          "price name: ",
          t.price_name
        )
      );

      this.saveToStorage();
    },

    clearBets() {
      const general = useGeneral();
      this.ticket = [];
      this.saveToStorage();
      general.setStake(10);
    },

    removeBet(index) {
      const general = useGeneral();
      this.ticket.splice(index, 1);
      this.saveToStorage();

      if (this.ticket.length === 0) {
        general.setStake(10);
      }
    },
    formatToYYYYMMDDHHMMSS(d, timezone = "UTC") {
      const dateObj = new Date(d);
      let year, month, day, hours, minutes, seconds;

      if (timezone === "UTC") {
        year = dateObj.getUTCFullYear();
        month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
        day = dateObj.getUTCDate().toString().padStart(2, "0");
        hours = dateObj.getUTCHours().toString().padStart(2, "0");
        minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
        seconds = dateObj.getUTCSeconds().toString().padStart(2, "0");
      }
      return `${year}/${month}/${day} ${hours}:${minutes}`;
    },

    printBetTicket(bets, stake, ticketNumber, betAt, user) {
      const totalOdds = bets
        .reduce((acc, bet) => acc * bet.price_rate, 1)
        .toFixed(2);

      const potentialWin = (totalOdds * stake).toFixed(2);

      const rows = bets
        .map(
          (bet, index) => `
      <div class="bet">
        <div class="event">${bet.event_name}</div>
        
        <div class="row" style="font-size: 8px; ">
          <div class="">Football / ${bet.country} - ${bet.competition}</div>

          <div>${this.formatToYYYYMMDDHHMMSS(bet.startTime)}</div>
        </div>

        <div class="row bets">
          <div >${bet.market_name}</div>
          <div>${bet.price_name}${
            bet.price_hcap === 0 ? "" : bet.price_hcap
          }</div>
          <div>${bet.price_rate.toFixed(2)}</div>
        </div>

       

      </div>
    `
        )
        .join("");

      const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Right Bet</title>
      <style>
      @page {
        size: 80mm auto;
        margin: 0;
      }

      html, body {
        width: 80mm;
        margin: 0;
        padding: 0;  
        font-family: Arial, Helvetica, sans-serif;
        padding: 10px;
        text-transform: uppercase;
        font-size: 10px;
        }

      .ticket {
        width: 76mm; /* real printable area */
        margin: 0 auto;
        margin-bottom:20px;
        padding: 2mm;
        box-sizing: border-box;
      }

       
        .header {
          text-align: center;
          border: 1px solid #000;
          margin-bottom: 8px;
          padding: 6px;
        }
          .bets{
          font-weight: bold;}
        .bet {
          font-size: 10px;
          border-bottom: 1px solid #ccc;
          padding: 2px 0;
        }
        .bet:last-child {
          border-bottom: none;
        }
        .event {
          font-weight: bold;
        }
        .market {
          color: #000;
          margin-bottom: 4px;
        }
        .row {
          display: flex;
          justify-content: space-between;
        }
        .summary {
          border: 3px solid #000;
          margin-top: 5px;
          padding: 4px;
          font-size: 10px;
        }
        .summary .total {
          font-weight: bold;
        }
          .eventCount{
          margin-top: 5px;
          padding: 4px;
          border: 1px solid #000;
          font-weight: bold;

          }
          .info{
          margin-top: 5px;
          padding: 4px;
          border: 1px solid #000;
          font-weight: bold;
          }
          .feed {
  height: mm;
}

      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <h3>Right Bet</h3>
        </div>

        <div class="info">
          <div class="row total">
            <div>Date</div>
            <div>${betAt}</div>
         </div> 
         <div class="row total">
            <div>Ticket</div>
            <div>${ticketNumber}</div>
         </div>
         <div class="row total">
            <div>Username</div>
            <div>${user}</div>
         </div>  
        </div>



        ${rows}

        <div class="row total eventCount">
        <div>Nr events: ${bets.length}</div>
        <div>odds total: ${totalOdds}</div>
        </div> 

        <div class="summary">
          <div class="row total">
            <span>bet amount</span>
            <span>${stake.toFixed(2)} ETB</span>
          </div>
          <div class="row total">
            <span>possible Win</span>
            <span>${potentialWin} ETB</span>
          </div>
          <div class="row total">
            <span>win tax</span>
            <span>${
              Number(potentialWin) > 1000
                ? (Number(potentialWin) * 0.15).toFixed(2)
                : (0).toFixed(2)
            } ETB</span>
          </div>

          <div class="row total">
            <span>Winning</span>
            <span>${
              Number(potentialWin) > 1000
                ? (Number(potentialWin) * 0.85).toFixed(2)
                : potentialWin
            } ETB</span>
          </div>
        </div>
          <div style="
                height: 8mm;
                background: #000;
                opacity: 0.01;
              "></div>
        <div style="
          margin-top: 10px;
          text-align: center;
          font-size: 9px;
        ">
          ------
        </div>

       



      </div>

      <script>
        window.onload = function () {
          window.print();
          window.onafterprint = () => window.close();
        };
      </script>
    </body>
    </html>
  `;

      const printWindow = window.open("", "_blank", "width=500,height=600");
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    },
  },
});
