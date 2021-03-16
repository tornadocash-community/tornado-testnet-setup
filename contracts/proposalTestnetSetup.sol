//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;


interface ITornadoProxy {
    enum InstanceState { Disabled, Enabled, Mineable }

    function updateInstance(address _instance, InstanceState _state) external;
}

interface IMiner {
    struct Rate {
        bytes32 instance;
        uint256 value;
    }

    function setRates(Rate[] calldata _rates) external;
}

contract ProposalTestnetSetup {
    function executeProposal() public {
        ITornadoProxy tornadoProxy = ITornadoProxy(0x720fFb58b4965D2C0BD2b827FA8316C2002A98aa);
        IMiner miner = IMiner(0x746Aebc06D2aE31B71ac51429A19D54E797878E9);
        address[2] memory instances = [
            address(0xD5d6f8D9e784d0e26222ad3834500801a68D027D), // 10000 of DAI
            address(0x833481186f16Cece3f1Eeea1a694c42034c3a0dB) //  5000 of cDAI
        ];
        for(uint256 i = 0; i < instances.length; i++) {
            tornadoProxy.updateInstance(instances[i], ITornadoProxy.InstanceState.Mineable);
        }
        IMiner.Rate[] memory rates = new IMiner.Rate[](2);
        rates[0] = IMiner.Rate({instance: bytes32(0xc9395879ffcee571b0dfd062153b27d62a6617e0f272515f2eb6259fe829c3df), value: 100}); // cdai
        rates[1] = IMiner.Rate({instance: bytes32(0x3de4b55be5058f538617d5a6a72bff5b5850a239424b34cc5271021cfcc4ccc8), value: 120}); // dai
        miner.setRates(rates);
    }   
}