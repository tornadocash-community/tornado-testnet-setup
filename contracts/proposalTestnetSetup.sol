//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface ITorn {
    function changeTransferability(bool) external;
}

interface IGov {
    function setQuorumVotes(uint256) external;
    function setProposalThreshold(uint256) external;
    function setExecutionDelay(uint256) external;
    function setExecutionExpiration(uint256) external;
    function setVotingPeriod(uint256) external;
    function setClosingPeriod(uint256) external;
    function setVoteExtendTime(uint256) external;
}

contract ProposalTestnetSetup {
    function executeProposal() public {
        ITorn torn = ITorn(0x77777FeDdddFfC19Ff86DB637967013e6C6A116C);
        torn.changeTransferability(true);
        
        IGov gov = IGov(0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce);
        gov.setProposalThreshold(2000e18);
        gov.setQuorumVotes(5000e18);

        gov.setExecutionDelay(20 minutes);
        gov.setExecutionExpiration(2 hours);
        gov.setVotingPeriod(1 hours);
        gov.setClosingPeriod(5 minutes);
        gov.setVoteExtendTime(10 minutes);
    }
}