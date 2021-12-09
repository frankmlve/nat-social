const SocialNetwork = artifacts.require("SocialNetwork");
const TestCoin = artifacts.require("TestCoin");

module.exports = async function (deployer) {
  await deployer.deploy(SocialNetwork);
  await deployer.deploy(TestCoin)
  const coin = await TestCoin.deployed()
  // Mint 1.000.000.000 TestCoin tokens for deployer
  await coin.mint(
    '1000000000000000000000000000'
  )
};
