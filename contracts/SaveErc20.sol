// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
// import "./IERC20.sol";

interface IERC20 {
    // function name() external view returns (string memory);
    // function symbol() external view returns (string memory);
    // function decimals() external view returns (uint8);
    // function totalSupply() external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    // function approve(address _spender, uint256 _value) external returns (bool success);
    // function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}



contract SaveERC20  {
    address savingToken;
    address owner;

    mapping(address => uint256) savings;

    event SavingSuccessful(address sender, uint256 amount);
    event WithdrawSuccessful(address receiver, uint256 amount);

    constructor(address _savingToken) {
        savingToken = _savingToken;
        owner = msg.sender;
    }

    function deposit(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't save zero value");
        require(IERC20(savingToken).balanceOf(msg.sender) >= _amount, "not enough token");

        require(IERC20(savingToken).transferFrom(msg.sender, address(this), _amount), "failed to transfer");

        savings[msg.sender] += _amount;

        emit SavingSuccessful(msg.sender, _amount);

    }

    function withdraw(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't withdraw zero value");

        uint256 _userSaving = savings[msg.sender];

        require(_userSaving >= _amount, "insufficient funds");

        savings[msg.sender] -= _amount;

        require(IERC20(savingToken).transfer(msg.sender, _amount), "failed to withdraw");

        emit WithdrawSuccessful(msg.sender, _amount);
    }

    function checkUserBalance(address _user) external view returns (uint256) {
        return savings[_user];
    }

    function checkContractBalance() external view returns(uint256) {
        return IERC20(savingToken).balanceOf(address(this));
    }

    function ownerWithdraw(uint256 _amount) external {
        require(msg.sender == owner, "not owner");

        IERC20(savingToken).transfer(msg.sender, _amount);
    }
}