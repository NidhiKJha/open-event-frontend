import Service, { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Service.extend({

  store       : service(),
  session     : service(),
  authManager : service(),

  _lastPromise: Promise.resolve(),

  /**
   * Reload settings when the authentication state changes.
   */
  _authenticationObserver: observer('session.isAuthenticated', function() {
    this.get('_lastPromise')
      .then(() => this.set('_lastPromise', this._loadSettings()))
      .catch(() => this.set('_lastPromise', this._loadSettings()));
  }),

  /**
   * Load the settings from the API and set the attributes as properties on the service
   *
   * @return {Promise<void>}
   * @private
   */
  async _loadSettings() {
    const settingsModel = await this.get('store').queryRecord('setting', {});
    this.get('store').modelFor('setting').eachAttribute(attributeName => {
      this.set(attributeName, settingsModel.get(attributeName));
    });
  },

  /**
   * Initialize the settings service
   * @return {*|Promise<void>}
   */
  initialize() {
    const promise = this._loadSettings();
    this.set('_lastPromise', promise);
    return promise;
  }
});
