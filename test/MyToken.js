const MyToken = artifacts.require('MyToken');

contract('MyToken', function (accounts) {
  let token;
  beforeEach(async function () {
    token = await MyToken.new({ from: accounts[0] });
  });
  describe('whatIsThree', function () {
    it('tells you what three is', async function () {
      assert.equal(await token.whatIsThree.call(), 3, 'it is not three');
    });
  });
});
