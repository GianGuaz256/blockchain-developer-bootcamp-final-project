# SECURITY DECISIONS AND CONSIDERATIONS AGAINST COMMON ATTACKS

## Safety Checklist
- Automated unit tests were written to ensure that contract logic behaves expectedly.
- User inputs were validated at frontend and verified in modifiers before function execution.
- Recursive calls were avoided to prevent re-entrancy attacks.
- State ``variables`` and ``functions`` visibility was optimized so that malicious access is restricted.
- Modifiers were used with ``reverts`` to control and restrict malicious access.

## Access Control Design Pattern
Access controll design pattern has been used in order to make the contract ownable by the deployer and in order to use it in case of different needs of the platform (like to centralized controll over the addition of dynamic data with the modifier)

## Optimized Gas Usage
Gas usage is optimized by avoiding loops in the Smart Contract and instead giving the frontend the all collection of tokens or users in order to loop directly in the client of the Dapp

## Integer Overflow and Underflow (SWC-101)
Variable types were carefully chosen and the library ``SafeMath.sol`` was used to handle integer overflow and underflow exceptions and errors. For the token and users id counter the library ``Counters.sol`` was used in order to have a build in controll over ids and follow the design of the ``ERC721.sol`` contract.

## Using Specific Compiler Pragma 
Compiler pragma for this project was set to ``pragma 0.8.2`` in order to prevent attack.