const MyToken = artifacts.require('MyToken');
const SafeMath = artifacts.require('zeppelin-solidity/contracts/SafeMath.sol');

module.exports = function (deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, MyToken);
  deployer.deploy(MyToken);
};
