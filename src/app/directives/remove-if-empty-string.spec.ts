import { RemoveIfEmptyString } from './remove-if-empty-string';

describe('RemoveIfEmptyString', () => {
  it('should create an instance', () => {
    const directive = new RemoveIfEmptyString();
    expect(directive).toBeTruthy();
  });
});
