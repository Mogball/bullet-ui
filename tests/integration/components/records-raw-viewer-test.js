/*
 *  Copyright 2017, Yahoo Inc.
 *  Licensed under the terms of the Apache License, Version 2.0.
 *  See the LICENSE file associated with the project for terms.
 */
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('records-raw-viewer', 'Integration | Component | records raw viewer', {
  integration: true
});

function repeat(n, item) {
  return Array(n).fill(item);
}

test('it renders data in a collapsible json format by default', function(assert) {
  let data = repeat(1, { foo: 'bar' });
  this.set('mockData', data);

  this.render(hbs`{{records-raw-viewer data=mockData}}`);
  assert.equal(this.$('.raw-display .pretty-json-container').length, 1);
  assert.equal(this.$('.json-formatter-row').length, 3);
  assert.equal(this.$('.json-formatter-open').length, 2);

  this.render(hbs`
    {{#records-raw-viewer data=mockData}}
      template block text
    {{/records-raw-viewer}}
  `);
  assert.equal(this.$('.raw-display .pretty-json-container').length, 1);
  assert.equal(this.$('.json-formatter-row').length, 3);
  assert.equal(this.$('.json-formatter-open').length, 2);
});

test('it collapses json properly when the rows and the max levels are low enough', function(assert) {
  let data = repeat(2, { foo: { bar: 'baz', test: 'foo' } });
  this.set('mockData', data);
  this.set('mockMaxLevels', 3);

  // Max levels = 2 since we only 2 rows
  this.render(hbs`{{records-raw-viewer data=mockData maxLevels=mockMaxLevels}}`);
  assert.equal(this.$('.raw-display .pretty-json-container').length, 1);
  // One Array[2] row + 2 index rows (0 and 1) with 1 foo each = 1 + 2 + 2 = 5. The contents of foo's are lazily rendered
  assert.equal(this.$('.json-formatter-row').length, 5);
  // But only top and index rows are open
  assert.equal(this.$('.json-formatter-open').length, 3);
});

test('it collapses json properly when the rows and the max levels are greater than the breakpoint', function(assert) {
  let data = repeat(25, { foo: { bar: 'baz', test: 'foo' } });
  this.set('mockData', data);
  this.set('mockMaxLevels', 2);

  // Max levels is now 1 since we have > 20 rows
  this.render(hbs`{{records-raw-viewer data=mockData maxLevels=mockMaxLevels}}`);
  // One Array[2] row + 25 index rows = 1 + 25 = 26. Rest are lazily rendered
  assert.equal(this.$('.json-formatter-row').length, 26);
  // But only top row is open
  assert.equal(this.$('.json-formatter-open').length, 1);
});

test('it collapses json properly when the rows and the max levels are greater than the breakpoint', function(assert) {
  let data = repeat(45, { foo: { bar: 'baz', test: 'foo' } });
  this.set('mockData', data);
  this.set('mockMaxLevels', 3);

  // Max levels is now 1 since we have > 40 rows
  this.render(hbs`{{records-raw-viewer data=mockData maxLevels=mockMaxLevels}}`);
  // One Array[2] row + 45 index rows = 1 + 45 = 46. Rest are lazily rendered
  assert.equal(this.$('.json-formatter-row').length, 46);
  // But only top row is open
  assert.equal(this.$('.json-formatter-open').length, 1);
});

test('it renders raw json in a pre tag', function(assert) {
  assert.expect(5);
  this.set('mockData', null);

  this.render(hbs`{{records-raw-viewer data=mockData}}`);
  assert.equal(this.$('.raw-display .pretty-json-container').length, 1);
  assert.equal(this.$('.raw-display .raw-json-display').length, 0);
  this.$('.mode-toggle .right-view').click();
  return wait().then(() => {
    assert.equal(this.$('.raw-display .pretty-json-container').length, 0);
    assert.equal(this.$('.raw-display .raw-json-display').length, 1);
    assert.equal(this.$('.raw-display .raw-json-display').text().trim(), '');
  });
});

test('it renders raw json in a pre tag with the given spacing', function(assert) {
  assert.expect(5);
  let data = repeat(2, { foo: { bar: 'baz', test: 'foo' } });
  this.set('mockData', data);
  this.set('mockSpacing', 8);

  this.render(hbs`{{records-raw-viewer data=mockData spacing=mockSpacing}}`);
  assert.equal(this.$('.raw-display .pretty-json-container').length, 1);
  assert.equal(this.$('.raw-display .raw-json-display').length, 0);
  this.$('.mode-toggle .right-view').click();
  return wait().then(() => {
    assert.equal(this.$('.raw-display .pretty-json-container').length, 0);
    assert.equal(this.$('.raw-display .raw-json-display').length, 1);
    assert.equal(this.$('.raw-display .raw-json-display').text().trim(), JSON.stringify(data, null, 8));
  });
});
