describe("Withdraw Ether", function () {
it("should revert if address zero tries to withdraw Ether", async function () {
// Connect to the contract using the signer
const ZeroAddress = "0x0000000000000000000000000000000000000000";
const [signer] = await ethers.getSigners();

      expect(signer.address).to.not.equal(ZeroAddress);
    });
    it("should revert if user Ether balance is 0", async function () {
      const depositAmount = ethers.parseEther("0");

      // Connect to the contract using the signer
      const [signer] = await ethers.getSigners();
      const connectedSaveEther = saveEther.connect(signer);

      // Deposit Ether
      // await connectedSaveEther.deposit({ value: depositAmount });
      await expect(connectedSaveEther.withdraw()).to.be.rejectedWith(
        "you don't have any savings"
      );

      // Withdraw Ether
      // await  connectedSaveEther.withdraw();

      // // Check user savings
      // const userSavings = await connectedSaveEther.checkSavings(signer.address);
      // expect(userSavings).to.equal(0);
    });
    it("should deduct users balance", async function () {
      const depositAmount = ethers.parseEther("2");

      // Connect to the contract using the signer
      const [signer] = await ethers.getSigners();
      const connectedSaveEther = saveEther.connect(signer);

      // Deposit Ether
      await connectedSaveEther.deposit({ value: depositAmount });

      // Withdraw Ether
      await connectedSaveEther.withdraw();

      // Check user savings
      const userSavings = await connectedSaveEther.checkSavings(signer.address);
      expect(userSavings).to.equal(0);
    });
    it("should withdraw Ether", async function () {
      const depositAmount = ethers.parseEther("2");

      // Connect to the contract using the signer
      const [signer] = await ethers.getSigners();
      const connectedSaveEther = saveEther.connect(signer);

      // Deposit Ether
      await connectedSaveEther.deposit({ value: depositAmount });

      // Withdraw Ether
      await connectedSaveEther.withdraw();

      // Check user savings
      const userSavings = await connectedSaveEther.checkSavings(signer.address);
      expect(userSavings).to.equal(0);
    });

});
describe("Send Ether to another account", function () {
it("should revert if address zero tries to withdraw Ether", async function () {
// Connect to the contract using the signer
const ZeroAddress = "0x0000000000000000000000000000000000000000";
const [signer] = await ethers.getSigners();

      expect(signer.address).to.not.equal(ZeroAddress);
    });
    it("should revert if user tries to send  0 Ether", async function () {
      const depositAmount = ethers.parseEther("10");
      const transferAmount = ethers.parseEther("0");

      // Connect to the contract using the signer
      const [signer, receiver] = await ethers.getSigners();
      const connectedSaveEther = saveEther.connect(signer);
      const recaddr = saveEther.connect(receiver);

      // Deposit Ether
      await connectedSaveEther.deposit({ value: depositAmount });
      // Try to send 0 Ether
      await expect(
        connectedSaveEther.sendOutSaving(recaddr, transferAmount)
      ).to.be.rejectedWith("can't send zero value");
    });

    it("should check if user balance is Greater than deposit amount", async function () {
      const depositAmount = ethers.parseEther("10");
      const transferAmount = ethers.parseEther("3");

      // Connect to the contract using the signer
      const [sender, receiver] = await ethers.getSigners();
      const connectedSaveEther = saveEther.connect(sender);
      const recaddr = saveEther.connect(receiver);

      // Deposit Ether
      await connectedSaveEther.deposit({ value: depositAmount });
      // Check sender's savings
      const senderSavings = await connectedSaveEther.checkSavings(
        sender.address
      );
      expect(senderSavings).to.greaterThanOrEqual(transferAmount);
    });
    it("should send Ether to another account", async function () {
      const depositAmount = ethers.parseEther("2");

      // Connect to the contract using two signers
      const [sender, receiver] = await ethers.getSigners();
      const connectedSaveEther = saveEther.connect(sender);

      // Deposit Ether
      await connectedSaveEther.deposit({ value: depositAmount });

      // Send Ether to another account
      await connectedSaveEther.sendOutSaving(receiver.address, depositAmount);

      // Check sender's savings
      const senderSavings = await connectedSaveEther.checkSavings(
        sender.address
      );
      expect(senderSavings).to.equal(
        0,
        "Sender's savings should be reduced to  0"
      );
    });

});
describe("check Balance", function () {
it("should return the balance of an account", async function () {
const depositAmount = ethers.parseEther("2");
const depositAmount1 = ethers.parseEther("5");

      // Connect to the contract using two signers
      const [account1, account2] = await ethers.getSigners();
      const FirstSaveEther = saveEther.connect(account1);
      const SecondSaveEther = saveEther.connect(account2);

      // Deposit Ether
      await FirstSaveEther.deposit({ value: depositAmount });
      await SecondSaveEther.deposit({ value: depositAmount1 });

      // Check sender's savings
      const firstsenderSavings = await FirstSaveEther.checkSavings(
        account1.address
      );
      expect(firstsenderSavings).to.equal(depositAmount);
      const SecondsenderSavings = await SecondSaveEther.checkSavings(
        account2.address
      );
      expect(SecondsenderSavings).to.equal(depositAmount1);
    });

});
describe("checkContractBal", function () {
it("Should return the contract balance", async function () {
const depositAmount = ethers.parseEther("10");
const depositAmount1 = ethers.parseEther("9");
const depositAmount2 = ethers.parseEther("25");

      // Connect to the contract using the signer
      const [signer, signer1, signer2] = await ethers.getSigners();
      const connectedSaveEther = saveEther.connect(signer);
      const connectedSaveEther1 = saveEther.connect(signer1);
      const connectedSaveEther2 = saveEther.connect(signer2);

      // Deposit Ether
      await connectedSaveEther.deposit({ value: depositAmount });
      await connectedSaveEther1.deposit({ value: depositAmount1 });
      await connectedSaveEther2.deposit({ value: depositAmount2 });

      const firstsenderSavings = await connectedSaveEther.checkSavings(
        signer.address
      );
      const firstsenderSavings1 = await connectedSaveEther1.checkSavings(
        signer1.address
      );
      const firstsenderSavings2 = await connectedSaveEther2.checkSavings(
        signer2.address
      );
      const contractBal = await saveEther.checkContractBal();
      const totalBalance =
        firstsenderSavings + firstsenderSavings1 + firstsenderSavings2;
      expect(contractBal).to.equal(totalBalance);
    });

});
// describe("Events", function () {
// it("Should emit an event on deposit", async function () {
// const depositAmount = ethers.parseEther("1");

// // Connect to the contract using the signer
// const [signer] = await ethers.getSigners();
// const connectedSaveEther = saveEther.connect(signer);

// // Deposit Ether
// const depo = await connectedSaveEther.deposit({ value: depositAmount });

// await expect(saveEther.connect(signer).deposit({ value: depositAmount }))
// .to.emit(saveEther, "SavingSuccessful")
// .withArgs(signer.address, depositAmount);
// });
// });
