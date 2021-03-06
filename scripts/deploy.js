const fs = require('fs');

const saveFiles = async (fileName, data) => {
  const fs = require("fs");
  const contractsDir = "./build/";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + fileName,
    data
  );
  console.log("export file", fileName);
}

const saveAbis = async () => {
  const ERC20ABI = artifacts.readArtifactSync("ERC20").abi;
  const NFTABI = artifacts.readArtifactSync("NFT").abi;
  const MarketplaceABI = artifacts.readArtifactSync("Marketplace").abi;
  await saveFiles("abis.json", JSON.stringify({
    ERC20: ERC20ABI,
    NFT: NFTABI,
    Marketplace: MarketplaceABI
  }, undefined, 4));
}

async function main() {
  saveAbis();
  // ERC20
  const ERC20Token_ = await hre.ethers.getContractFactory("ERC20Token");
  const ERC20Token = await ERC20Token_.deploy("test token", "test", 18, 1e9);
  //NFT
  const NFT_ = await hre.ethers.getContractFactory("NFT");
  const NFT = await NFT_.deploy("test NFT", "tNFT");
  await NFT.deployed();
  //marketplace
  const Marketplace_ = await hre.ethers.getContractFactory("Marketplace");
  const Marketplace = await Marketplace_.deploy(ERC20Token.address);
  await Marketplace.deployed();

  const addresses = {
    ERC20: ERC20Token.address,
    NFT: NFT.address,
    Marketplace: Marketplace.address
  }
  await saveFiles("addresses.json", JSON.stringify(addresses, undefined, 4));
}


main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
