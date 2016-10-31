import {
  Controller,
  Service
} from 'ember-runtime';
import Ember from 'ember';
import { run } from 'ember-metal';
import { jQuery } from 'ember-views';
import { QueryParamTestCase, moduleFor } from 'internal-test-helpers';

class SharedStateQPTestCase extends QueryParamTestCase {
  boot() {
    this.setupApplication();
    return this.visitApplication();
  }
}

moduleFor('Query Params - shared service state', class extends SharedStateQPTestCase {
  setupApplication() {
    this.router.map(function() {
      this.route('home', { path: '/' });
      this.route('dashboard');
    });

    this.application.register('service:filters', Service.extend({
      shared: true
    }));

    this.registerController('home', Controller.extend({
      filters: Ember.inject.service(),
      queryParams: [
        { 'filters.shared': 'shared' }
      ]
    }));

    this.registerController('dashboard', Controller.extend({
      filters: Ember.inject.service(),
      queryParams: [
        { 'filters.shared': 'shared' }
      ]
    }));

    this.registerTemplate('application', `{{link-to 'Home' 'home' }} <div> {{outlet}} </div>`);
    this.registerTemplate('home', `{{link-to 'Dashboard' 'dashboard' }}{{input type="checkbox" id='filters-checkbox' checked=(mut filters.shared) }}`);
    this.registerTemplate('dashboard', `{{link-to 'Home' 'home' }}`);
  }
  visitApplication() {
    return this.visit('/');
  }

  ['@test should not fail if shared state is modified from default before transition']() {
    let assert = this.assert;
    let done = assert.async();

    assert.expect(1);

    return this.boot().then(() => {
      this.$input = jQuery('#filters-checkbox');

      // click the checkbox once to set filters.shared to false
      run(this.$input, 'click');

      return this.visit('/dashboard').then(() => {
        assert.ok(true, 'expecting navigating to dashboard to succeed');
        done();
      });
    });
  }

  ['@test should not fail if shared state is equal to the default value before transition']() {
    let assert = this.assert;
    let done = assert.async();

    assert.expect(1);

    return this.boot().then(() => {
      this.$input = jQuery('#filters-checkbox');

      // click the checkbox twice to set filters.shared to false and back to true
      run(this.$input, 'click');
      run(this.$input, 'click');

      return this.visit('/dashboard').then(() => {
        assert.ok(true, 'expecting navigating to dashboard to succeed');
        done();
      });
    });
  }
});
