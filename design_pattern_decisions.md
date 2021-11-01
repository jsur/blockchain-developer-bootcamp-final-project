# Design patterns used

## Access Control Design Patterns

- `Ownable` design pattern used in three functions: `removeTenant()`, `withdraw()` and `addProperty()`. These functions do not need to be used by anyone else apart from the contract creator, i.e. the party that is responsible for managing the rental operations.

## Inheritance and Interfaces

- `Rentals` contract inherits the OpenZeppelin `Ownable` contract to enable ownership for one managing user/party.
