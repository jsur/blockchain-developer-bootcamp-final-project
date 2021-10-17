// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

contract Rentals {

  event LogTenantAdded(uint indexed property, address indexed tenant);
  
  address payable public owner = payable(msg.sender);
  uint256 public previousPaymentCheck;
  uint private propertyIdCounter = 0;

  enum State{ Vacant, Rented, NotAvailable }

  struct Property {
    uint propertyId;
    uint currentRentAmount;
    State status;
    address payable tenant;
    string location;
    string description;
    string infoUrl;
    string imgUrl;
    // TODO: add this back once array init works
    // Payment[] tenantPayments;
  }

  struct Payment {
    uint timestamp;
    uint amount;
    address from;
  }

  uint[] public idList;
  uint public idListLength;

  mapping (uint => Property) public properties;

  modifier isVacant(uint id) {
    require(properties[id].status == State.Vacant && properties[id].tenant == address(0), "This property is not vacant.");
    _;
  }

  modifier isExactPayment(uint id) {
    require(properties[id].currentRentAmount == msg.value, "Please pay exact rent amount.");
    _;
  }

  modifier isOwner() {
    require(msg.sender == owner, "Only the contract owner is allowed to call this function.");
    _;
  }

  constructor() {}

  function addAsTenant(uint _propertyId)
    public
    payable
    isVacant(_propertyId)
    isExactPayment(_propertyId) {
      Property storage _p = properties[_propertyId];
      _p.tenant = payable(msg.sender);
      // TODO: add this again
      // _p.tenantPayments.push(Payment({ timestamp: block.timestamp, amount: msg.value, from: msg.sender }));
      _p.status = State.Rented;
      (bool success, ) = owner.call{ value: msg.value }("");
      require(success, "Adding tenant to property failed.");
      emit LogTenantAdded(_propertyId, msg.sender);
    }

  function addProperty(uint rentAmount, string memory _location, string memory _description, string memory _infoUrl, string memory _imgUrl) public isOwner {
    uint newPropertyId = propertyIdCounter + 1;
    Property memory newProperty = Property({
      propertyId: newPropertyId,
      currentRentAmount: rentAmount,
      status: State.Vacant,
      tenant: payable(address(0)),
      location: _location,
      description: _description,
      infoUrl: _infoUrl,
      imgUrl: _imgUrl
      // TODO: figure out a way to initialize this as an empty array
      // tenantPayments: [Payment({ timestamp: 0, amount: 0, from: address(0) })]
    });
    propertyIdCounter = newPropertyId;
    idList.push(newPropertyId);
    idListLength = idList.length;
    properties[newProperty.propertyId] = newProperty;
  }

  function checkPayments() external {
    // TODO: use this external function from gelato to schedule call every day
  }

  function removeTenant() private isOwner {
    // TODO: remove tenant from a Property and set status to NotAvailable
  }

  function withdraw() public isOwner {
    // TODO: withdraw any funds from contract
  }

}