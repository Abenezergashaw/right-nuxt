export default defineNuxtPlugin(() => {
  const ticket = useTicket();

  ticket.loadFromStorage();

  ticket.$subscribe(() => {
    ticket.saveToStorage();
  });
});
