import {ethers} from "ethers"

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
export const truncateEthAddress = (address: `0x${string}` | undefined) => {
  if(!address) return;

  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

interface sentTokenProps {
  ethers_provider: ethers.providers.Provider,
  contract_address?: string,
  send_token_amount: string,
  to_address: string,
  send_abi?: any,
  send_account?: any,
  private_key: any,
  gas_limit?: string
}

export const send_token = async (
  {
    ethers_provider,
    contract_address,
    send_token_amount,
    to_address,
    send_abi,
    send_account,
    private_key,
    gas_limit = "6500000000",
  }: sentTokenProps,
) => {
  const wallet = new ethers.Wallet(private_key);
  const walletSigner = wallet.connect(ethers_provider);
  const currentGasPrice = await ethers_provider.getGasPrice();
  const gas_price = ethers.utils.hexlify(parseInt(currentGasPrice.toString()));
  console.log(`gas_price: ${gas_price}`)

  if (contract_address) {
    // general token send
    const contract = new ethers.Contract(
      contract_address,
      send_abi,
      walletSigner,
    );

    // How many tokens?
    const numberOfTokens = send_token_amount; // ethers.utils.parseUnits(send_token_amount, 18);
    console.log(`numberOfTokens: ${numberOfTokens}`)

    // Send tokens by allowance approval.
    contract.transferFrom(send_account, to_address, numberOfTokens).then((transferResult: any) => {
      console.dir(transferResult)
      alert("sent token")
    })
  } else {
    // ether send
    send_account = await walletSigner.getAddress()
    console.log(`Sending ether:`, {send_account, to_address, send_token_amount, walletSigner})
    const tx = {
      from: send_account,
      to: to_address,
      value: ethers.utils.parseEther(send_token_amount),
      nonce: ethers_provider.getTransactionCount(
        send_account,
        "latest",
      ),
      // gasLimit: ethers.utils.hexlify(gas_limit), // 100000
      // gasPrice: gas_price,
    }
    console.dir(tx)
    try {
      walletSigner.sendTransaction(tx).then((transaction) => {
        console.dir(transaction)
        alert("Send finished!")
      })
    } catch (error) {
      alert("failed to send!!")
    }
  }

}
