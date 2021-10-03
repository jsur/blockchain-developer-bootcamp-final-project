// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Rentals {
  
  address public owner;

  enum State{ Vacant, Rented, NotAvailable }

  struct Property {
    uint propertyId;
    uint currentRentAmount;
    State status;
    address tenant;
    Payment[] tenantPayments;
  }

  struct Payment {
    uint date;
    uint amount;
    address from;
  }

  mapping (uint => Property) private properties;
  mapping (uint => Payment) private payments;

  

}