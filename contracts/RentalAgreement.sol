// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Rentals {

  event LogTenantAdded(uint indexed property, address indexed tenant);
  
  address payable public owner;
  uint256 public previousPaymentCheck;

  enum State{ Vacant, Rented, NotAvailable }

  struct Property {
    uint propertyId;
    uint currentRentAmount;
    State status;
    address payable tenant;
    Payment[] tenantPayments;
  }

  struct Payment {
    uint timestamp;
    uint amount;
    address from;
  }

  mapping (uint => Property) private properties;

  // is property vacant
  modifier isVacant(uint id) {
    require(properties[id].status == State.Vacant && properties[id].tenant == address(0), "This property is not vacant.");
    _;
  }

  modifier isExactPayment(uint id) {
    require(properties[id].currentRentAmount == msg.value, "Please pay exact rent amount.");
    _;
  }

  constructor() {
    owner = payable(msg.sender);
  }

  function addAsTenant(uint _propertyId)
    public
    payable
    isVacant(_propertyId)
    isExactPayment(_propertyId) {    

      Property storage _p = properties[_propertyId];
      _p.tenant = payable(msg.sender);
      _p.tenantPayments.push(Payment({ timestamp: block.timestamp, amount: msg.value, from: msg.sender }));
      _p.status = State.Rented;
      (bool success, ) = owner.call{ value: msg.value }("");
      require(success, "Adding tenant to property failed.");
      emit LogTenantAdded(_propertyId, msg.sender);

  }

  function checkPayments() external {
    // TODO: use this external function from gelato to schedule call every day
  }

  function removeTenant() private {
    // TODO: remove tenant from a Property and set status to NotAvailable
  }

}