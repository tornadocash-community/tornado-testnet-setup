//SPDX-License-Identifier: MIT

import "@nomiclabs/hardhat-waffle";
import { expect } from "chai";
import { ethers } from "hardhat";
import GovernanceAbi from "../contracts/external/governance";
import TornAbi from "../contracts/external/torn";
import { advanceTime, getSignerFromAddress } from "./utils";

describe("Enable transfer proposal", () => {
  // Proposer address (delegate)
  const tornDelegate = "0xA43Ce8Cc89Eff3AA5593c742fC56A30Ef2427CB0";
  // 1k Delegator address
  const tornDelegator = "0x03Ebd0748Aa4D1457cF479cce56309641e0a98F5";
  // TORN whale to vote with 25k votes
  const tornWhale = "0x03Ebd0748Aa4D1457cF479cce56309641e0a98F5";
  // Live TORN contract
  const tornToken = "0x77777FeDdddFfC19Ff86DB637967013e6C6A116C";
  // Live governance contract
  const governanceAddress = "0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce";

  const torn5k = ethers.utils.parseEther("5000");
  const torn25k = ethers.utils.parseEther("25000");

  it("Should execute proposal and have lowered the vote quorum", async () => {
    // This test is forking the mainnet state

    // Proposal contract
    const Proposal = await ethers.getContractFactory("ProposalTestnetSetup");

    // Get Tornado governance contract
    let governance = await ethers.getContractAt(
      GovernanceAbi,
      governanceAddress
    );

    await expect(await governance.proposalCount()).equal(2);

    // Get TORN token contract
    let torn = await ethers.getContractAt(TornAbi, tornToken);

    // Set the current date as the date TORN transfers can be enabled (01.02.2021)
    // await ethers.provider.send("evm_setNextBlockTimestamp", [1612274437]);

    //await expect(await governance.QUORUM_VOTES()).equal(torn25k);

    // == Propose ==
    // Impersonate a TORN address with more than 1k token delegated
    const tornDelegateSigner = await getSignerFromAddress(tornDelegate);
    torn = torn.connect(tornDelegateSigner);
    governance = governance.connect(tornDelegateSigner);

    // Deploy and send the proposal
    const proposal = await Proposal.deploy();
    await governance.proposeByDelegate(
      tornDelegator,
      proposal.address,
      "Change the vote quorum form 25k to 15k TORN.",
      {
        gasPrice: 0,
      }
    );

    await expect(await governance.proposalCount()).equal(3);

    // == Vote ==

    // Impersonate a TORN whale to vote with 25k tokens
    // We use one of the team vesting contract with 800k+ TORN that
    // we will use like if it was an EOA.
    const tornWhaleSigner = await getSignerFromAddress(tornWhale);
    torn = torn.connect(tornWhaleSigner);
    governance = governance.connect(tornWhaleSigner);

    // Lock 25k TORN in governance
    await torn.approve(governance.address, torn25k, { gasPrice: 0 });
    await governance.lockWithApproval(torn25k, { gasPrice: 0 });

    // Wait the voting delay and vote for the proposal
    console.log(await governance.VOTING_DELAY());
    await advanceTime((await governance.VOTING_DELAY()).toNumber() + 1);
    console.log(await governance.state(3));
    await governance.castVote(3, true, { gasPrice: 0 });

    // == Execute ==

    // Wait voting period + execution delay
    await advanceTime(
      (await governance.VOTING_PERIOD()).toNumber() +
        (await governance.EXECUTION_DELAY()).toNumber()
    );

    // Execute the proposal
    await governance.execute(3, { gasPrice: 0 });

    // Check the new vote quorum
    // await expect(await governance.QUORUM_VOTES()).equal(torn5k);
  });
});
