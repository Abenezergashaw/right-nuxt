<script setup>
definePageMeta({
  layout: "tertiary",
});
const route = useRoute();

const id = route.params.promo;

const promo = [
  {
    title: "First Deposit Bonus",
    description:
      "Deposit now and get a 1000% First Deposit Bonus up to 10000 ETB on your first deposit!",
    image: "/promo/firstdeposit.png",
    moreDescription:
      "Make your first deposit of at least 100 ETB and receive a bonus of 1000% of your deposit amount, up to a maximum of 10000 ETB. For example, if you deposit 100 ETB, you will receive an additional 1000 ETB as a bonus, giving you a total of 1100 ETB to play with!",
    howItWorks: [
      "በቦነስ ነጥብ ተጫውተው ለማሽነፍ የሚመርጧቸው ጨዋታዎች 5 እና ከዚያ በላይ መሆን አለበት።",
      "በቦነስ ነጥብ ተጫውተው ለማሽነፍ የሚመርጧቸው ጨዋታዎች ከ1.50 በላይ መሆን አለበት።",
    ],
  },
  {
    title: "2up market",
    description:
      "2UP MARKET – New Promotion , New On Right Bet! We are excited to introduce 2UP Market in Ethiopia – a brand-new way to win BIG in sports betting!",
    image: "/promo/2up.png",
    howItWorks: [
      "Choose the 2UP Market when placing your football bet. ",
      "If your team scores and takes a Two-goal lead, your bet is settled immediately. ",
      "The final match result doesn’t matter anymore – win, lose, or draw, your payout is secured!",
    ],
    moreDescription:
      "With 2UP Market, you get rewarded earlier if your team takes a Two-goal lead. That means if your team goes ahead with scores like 2-0, 0-2, 3-1, 1-3, 4-2, 2-4, and so on – your bet is already settled as a WIN. – No need to wait until the final whistle!",
    importantNote:
      "Betting on the draw in this market works exactly like in the regular 1X2 market. Your bet will be settled only on the full-time result, and the odds remain the same as usual.",
  },
  {
    title: "1up market",
    description:
      "1UP MARKET – New Promotion , New On Right Bet! We are excited to introduce 2UP Market in Ethiopia – a brand-new way to win BIG in sports betting!",
    image: "/promo/1up.png",
    moreDescription:
      "With 1UP Market, you get rewarded EARLIER if your team takes a one-goal lead. That means if your team goes ahead with scores like 1-0, 0-1, 2-1, 1-2, 3-2, 2-3 and so on, your bet is already settled as a WIN – no need to wait until the final whistle!",
    howItWorks: [
      "Choose the 1UP Market when placing your football bet.",
      "If your team scores and takes a one-goal lead, your bet is settled immediately.",
      "The final match result doesn’t matter anymore – win, lose, or draw, your payout is secured!",
    ],
    importantNote:
      "Betting on the draw in this market works exactly like in the regular 1X2 market. Your bet will be settled only on the full-time result, and the odds remain the same as usual.",
  },
  {
    title: "MultiBonus on Win",
    description: "1001% Multi-Bonus on Win!",
    image: "/promo/1001.png",
    moreDescription:
      "Maximize your winnings with our brand-new 1001% multi-bonus! Simply select multiple matches, place your bets, and enjoy the bonus based on your total winnings. The more selections on your bet slip, the bigger the bonus you earn.",
    howItWorks: [
      "Place bets with a minimum odds of 1.20 per selection. No minimum stake required.",
      "Only cash bets qualify – free bets, bonuses, or point-based bets are excluded.",
      "The bonus increases automatically with the number of events in your ticket.",
      "Rightbet.bet reserves the right to modify or reclaim any bonus awarded in error.",
    ],
    bonusTable: [
      { events: 1, bonus: "1%" },
      { events: 2, bonus: "2%" },
      { events: 3, bonus: "3%" },
      { events: 4, bonus: "4%" },
      { events: 5, bonus: "8%" },
      { events: 6, bonus: "12%" },
      { events: 7, bonus: "20%" },
      { events: 8, bonus: "25%" },
      { events: 9, bonus: "30%" },
      { events: 10, bonus: "40%" },
      { events: 11, bonus: "50%" },
      { events: 12, bonus: "60%" },
      { events: 13, bonus: "75%" },
      { events: 14, bonus: "85%" },
      { events: 15, bonus: "95%" },
      { events: 16, bonus: "105%" },
      { events: 17, bonus: "115%" },
      { events: 18, bonus: "120%" },
      { events: 19, bonus: "130%" },
      { events: 20, bonus: "140%" },
      { events: 21, bonus: "150%" },
      { events: 22, bonus: "160%" },
      { events: 23, bonus: "170%" },
      { events: 24, bonus: "180%" },
      { events: 25, bonus: "190%" },
      { events: 26, bonus: "200%" },
      { events: 27, bonus: "210%" },
      { events: 28, bonus: "220%" },
      { events: 29, bonus: "235%" },
      { events: 30, bonus: "245%" },
      { events: 31, bonus: "255%" },
      { events: 32, bonus: "265%" },
      { events: 33, bonus: "275%" },
      { events: 34, bonus: "285%" },
      { events: 35, bonus: "300%" },
      { events: 36, bonus: "320%" },
      { events: 37, bonus: "340%" },
      { events: 38, bonus: "360%" },
      { events: 39, bonus: "400%" },
      { events: 40, bonus: "450%" },
      { events: 41, bonus: "500%" },
      { events: 42, bonus: "550%" },
      { events: 43, bonus: "600%" },
      { events: 44, bonus: "650%" },
      { events: 45, bonus: "700%" },
      { events: 46, bonus: "750%" },
      { events: 47, bonus: "800%" },
      { events: 48, bonus: "850%" },
      { events: 49, bonus: "900%" },
      { events: 50, bonus: "1001%" },
    ],
    importantNote:
      "General Rightbet.bet terms and conditions apply. Rightbet.bet may modify or withdraw this promotion at any time without prior notice. Review the terms regularly for updates.",
  },
];
</script>

<template>
  <div class="mb-54">
    <PromoDetail :promo="promo[id]" />
  </div>
</template>
