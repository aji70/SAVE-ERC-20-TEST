import { ethers } from "hardhat";

async function main() {
  const initialOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const aj20 = await ethers.deployContract("Ajidokwu20", [initialOwner]);

  await aj20.waitForDeployment();

  console.log(`deployed to ${aj20.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
