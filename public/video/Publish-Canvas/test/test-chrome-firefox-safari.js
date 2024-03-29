/* global browser describe it beforeAll $ */

const assert = require('assert');

describe('Publish Canvas Test', () => {
  beforeAll(() => {
    browser.url('Publish-Canvas');
  });

  it('should have the right title', () => {
    const title = browser.getTitle();
    assert.equal(title, 'Publish from a Canvas');
  });

  it('The publisher should load', () => {
    const publisher = $('div.OT_publisher:not(.OT_loading) .OT_video-element');
    publisher.waitForExist(10000);
  });
});
