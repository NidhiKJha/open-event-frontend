import Route from '@ember/routing/route';

export default Route.extend({
  titleToken() {
    return this.get('l10n').t('Ticket Fees');
  },
  model() {
    return this.get('store').findAll('ticket-fee');
  },
  actions: {
    willTransition() {
      this.get('controller.model').forEach(ticketFee => {
        ticketFee.rollbackAttributes();
      });
    }
  }
});
