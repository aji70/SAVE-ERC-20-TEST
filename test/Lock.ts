/// <reference types="ethers" />
import { ethers } from "hardhat";
import { expect } from "chai";
import { Ajidokwu20 } from "../typechain-types";
import { SaveERC20 } from "../typechain-types";

describe("SaveEther Contract", function () {
  let saveEther: SaveERC20;
  let ajidokwu20: Ajidokwu20;

  beforeEach(async () => {
    const initialOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const Ajidokwu20 = await ethers.getContractFactory("Ajidokwu20");
    ajidokwu20 = await Ajidokwu20.deploy(initialOwner);
    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    saveEther = await SaveERC20.deploy(ajidokwu20.target);
    const owner = initialOwner;
  });

  describe("Deposit", function () {
    it("Should not be called by address zero", async () => {
      // Connect to the contract using the signer
      const ZeroAddress = "0x0000000000000000000000000000000000000000";

      const [signer] = await ethers.getSigners();
      expect(signer.address).to.not.equal(ZeroAddress);
    });
    it("Should be reverted if the amount is 0", async () => {
      const amount = 0;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      await expect(connectedSaveErc20.deposit(amount)).to.be.rejectedWith(
        "can't save zero value"
      );
    });
    it("should revert if user does not have enough token", async () => {
      const amount = 100;
      const [signer, addr1] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(addr1);
      const connectedTokenSigner1 = ajidokwu20.connect(signer);
      await connectedTokenSigner1.transfer(addr1.address, 50);
      const connectedTokenSigner = ajidokwu20.connect(addr1);
      await connectedTokenSigner.approve(saveEther.target, amount);

      await expect(connectedSaveErc20.deposit(amount)).to.be.rejectedWith(
        "not enough token"
      );
    });
    it(" it should Deposit properly", async function () {
      const amount = 200;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);
      await connectedSaveErc20.deposit(amount);
      const contractBal = await connectedSaveErc20.checkContractBalance();
      expect(contractBal).to.equal(amount);
    });
    it("Should add to the users Savings", async () => {
      const depositamount = 200;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, depositamount);
      await connectedSaveErc20.deposit(depositamount);
      const userBal = await connectedSaveErc20.checkUserBalance(signer.address);
      expect(userBal).to.equal(depositamount);
    });
  });

  describe("Withdraw", function () {
    it("Should not be called by address zero", async () => {
      // Connect to the contract using the signer
      const ZeroAddress = "0x0000000000000000000000000000000000000000";

      const [signer] = await ethers.getSigners();
      expect(signer.address).to.not.equal(ZeroAddress);
    });
    it("Should be reverted if the amount is 0", async () => {
      const amount = 0;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      await expect(connectedSaveErc20.withdraw(amount)).to.be.rejectedWith(
        "can't withdraw zero value"
      );
    });

    it("Should Revert if user does not have sufficient balance to withdraw ", async () => {
      const amount = 100;
      const withdrawAmount = 600;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);

      await connectedSaveErc20.deposit(amount);

      await expect(
        connectedSaveErc20.withdraw(withdrawAmount)
      ).to.be.revertedWith("insufficient funds");
    });
    it("Should deduct from user savings", async () => {
      const amount = 1000;
      const withdrawAmount = 600;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);
      await connectedSaveErc20.deposit(amount);
      const balb4 = await connectedSaveErc20.checkUserBalance(signer.address);
      await connectedSaveErc20.withdraw(withdrawAmount);
      const balafter = await connectedSaveErc20.checkUserBalance(
        signer.address
      );
      expect(balafter).to.equal(Number(balb4) - withdrawAmount);
    });
    it("Should Withdraw Properly", async function () {
      const amount = 500;

      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);
      const tokenBal = await connectedTokenSigner.balanceOf(signer);
      await connectedSaveErc20.deposit(amount);
      const tokenBalAfterDeposit = await connectedTokenSigner.balanceOf(signer);
      const contractBal = await connectedSaveErc20.checkContractBalance();
      await connectedSaveErc20.withdraw(amount);
      const tokenBalAfterWithdraw = await connectedTokenSigner.balanceOf(
        signer
      );
      const newBal = await connectedSaveErc20.checkUserBalance(signer);
      expect(newBal).to.equals(0);
    });
  });

  describe("Check User Balance", function () {
    it("Should return the users balance", async () => {
      const amount = 500;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);
      await connectedSaveErc20.deposit(amount);
      const tokenBalAfterDeposit = await connectedSaveErc20.checkUserBalance(
        signer.address
      );

      expect(tokenBalAfterDeposit).to.equal(amount);
    });
  });
  describe("Check Contract Balance", function () {
    it("Should return the Contract balance", async () => {
      const amount = 500;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);

      await connectedSaveErc20.deposit(amount);
      const tokenBalAfterDeposit =
        await connectedSaveErc20.checkContractBalance();

      expect(tokenBalAfterDeposit).to.equal(amount);
    });
  });

  describe("Back door function", () => {
    it("should revert if not called by the owner ", async () => {
      const amount = 5000;

      const [signer, addr1, addr2] = await ethers.getSigners();
      const ownerconnectedTokenSigner = ajidokwu20.connect(signer);
      const addr1connectedSaveErc20 = saveEther.connect(addr1);
      const addr1connectedTokenSigner = ajidokwu20.connect(addr1);

      await ownerconnectedTokenSigner.transfer(addr1.address, 10000);
      await ownerconnectedTokenSigner.transfer(addr2.address, 10000);
      await addr1connectedTokenSigner.approve(saveEther.target, 7000);

      await expect(
        addr1connectedSaveErc20.ownerWithdraw(amount)
      ).to.be.revertedWith("not owner");
    });
    it("should allow the owner withdraw", async () => {
      const amount = 5000;

      const [signer, addr1, addr2] = await ethers.getSigners();
      const ownerconnectedSaveErc20 = saveEther.connect(signer);
      const ownerconnectedTokenSigner = ajidokwu20.connect(signer);
      const addr1connectedSaveErc20 = saveEther.connect(addr1);
      const addr1connectedTokenSigner = ajidokwu20.connect(addr1);

      await ownerconnectedTokenSigner.transfer(addr1.address, 10000);
      await ownerconnectedTokenSigner.transfer(addr2.address, 10000);
      await addr1connectedTokenSigner.approve(saveEther.target, 7000);
      await addr1connectedSaveErc20.deposit(7000);

      await expect(
        ownerconnectedSaveErc20.ownerWithdraw(amount)
      ).not.to.be.revertedWith("not owner");
    });
    it("should credit the user and debit the contract", async () => {
      const amount = 5000;

      const [signer, addr1, addr2] = await ethers.getSigners();
      const ownerconnectedSaveErc20 = saveEther.connect(signer);
      const ownerconnectedTokenSigner = ajidokwu20.connect(signer);
      const addr1connectedSaveErc20 = saveEther.connect(addr1);
      const addr1connectedTokenSigner = ajidokwu20.connect(addr1);

      await ownerconnectedTokenSigner.transfer(addr1.address, 10000);
      await ownerconnectedTokenSigner.transfer(addr2.address, 10000);
      await addr1connectedTokenSigner.approve(saveEther.target, 7000);
      await addr1connectedSaveErc20.deposit(7000);
      const contractInitialbal =
        await ownerconnectedSaveErc20.checkContractBalance();
      await ownerconnectedSaveErc20.ownerWithdraw(amount);
      const contractbal = await ownerconnectedSaveErc20.checkContractBalance();
      expect(contractbal).to.equals(Number(contractInitialbal) - amount);
    });
  });

  describe("Events", () => {
    it("Should emit an event on deposit", async function () {
      const amount = 200;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);
      const saving = await connectedSaveErc20.deposit(amount);
      const contractBal = await connectedSaveErc20.checkContractBalance();
      expect(contractBal).to.equal(amount);

      // Deposit Ether

      await expect(saving)
        .to.emit(saveEther, "SavingSuccessful")
        .withArgs(signer.address, amount);
    });
    it("Should emit an event on withdraw", async function () {
      const amount = 500;
      const [signer] = await ethers.getSigners();
      const connectedSaveErc20 = saveEther.connect(signer);
      const connectedTokenSigner = ajidokwu20.connect(signer);
      await connectedTokenSigner.approve(saveEther.target, amount);
      await connectedSaveErc20.deposit(amount);
      const deposit = await connectedSaveErc20.withdraw(amount);
      await expect(deposit)
        .to.emit(saveEther, "WithdrawSuccessful")
        .withArgs(signer.address, amount);
    });
  });
});
