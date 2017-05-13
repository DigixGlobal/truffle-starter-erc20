pragma solidity ^0.4.8;

import 'zeppelin-solidity/contracts/SafeMath.sol';
import 'zeppelin-solidity/contracts/token/SimpleToken.sol';
/// @title Extended ERC20 Contract
/// @author Digix Global

contract MyToken is SimpleToken {

  string public name = "My Test Token";
  string public symbol = "TEST";
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 1337;

  /// @notice Some description!
  /// @return { "_three": "The result of 2 + 1" }
  function whatIsThree() constant returns (uint _three) {
    uint three = SafeMath.add(2, 1);
    return three;
  }
}
