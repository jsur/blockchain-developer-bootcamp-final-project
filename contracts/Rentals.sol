// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

/// @title Contract for automated apartment rentals
/// @author Julius Suominen
/// @notice Allows a user to obtain tenantship of a listed apartment
/// @dev Payment tracking will be implemented using a Gelato resolver and contract function checkPayments
contract Rentals {

  /// @notice Emitted when a tenant is added to a property
  /// @param property Property id
  /// @param tenant Tenant address
  event LogTenantAdded(uint indexed property, address indexed tenant);
  
  /// @notice Contract owner address
  address payable public owner = payable(msg.sender);

  /// @dev Tracks given property ids. Current value is the newest property id.
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

  /// @notice List of all property ids.
  /// @dev Used as a helper when iterating available properties in frontend client.
  uint[] public idList;

  /// @notice idList length.
  /// @dev Used as a helper when iterating available properties in frontend client.
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

  /// @notice Adds a tenant to a given property id
  /// @param _propertyId Property to which the sender address is added as a tenant
  /// @dev Check for exact payment sum to avoid having to send ETH back to sender
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

  /// @notice Adds a property listing into contract state
  /// @param rentAmount Listing monthly rent amount in gwei
  /// @param _location Geographical listing location as a string, e.g. Grove Street 10, Los Santos
  /// @param _description Short description of listing
  /// @param _infoUrl Url to additional information about listing, stored off-chain.
  /// @param _imgUrl Url to an image of listing to be displayed in the web app.
  /// @dev HTTP GET to _infoUrl should return an array with information in the following format: { infoId: string, value: string, title: string }[].
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

  /// @notice Checks each rented listing for payments
  /// @dev Called by a Gelato resolver once every 7 days
  function checkPayments() external {
    // TODO: use this external function from gelato to schedule call every day
  }

  function removeTenant() private isOwner {
    // TODO: remove tenant from a Property and set status to NotAvailable
  }

  /// @notice Withdraw contract funds
  /// @dev Only the contract owner can call this
  function withdraw() public isOwner {
    // TODO: withdraw any funds from contract
  }

}