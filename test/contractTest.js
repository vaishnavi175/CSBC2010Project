// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "truffle/Assert.sol";
import "../Voting.sol";

contract TestVoting {
    Voting votingInstance;

    function beforeEach() public beforeEach {
        votingInstance = new Voting();
        votingInstance.registerVoter(address(0x1));
        votingInstance.registerVoter(address(0x2));
    }

    function testRegisterVoter() public {
        uint256 votersCountBefore = votingInstance.getRegisteredVotersCount();
        votingInstance.registerVoter(address(0x3));
        uint256 votersCountAfter = votingInstance.getRegisteredVotersCount();
        Assert.equal(votersCountAfter, votersCountBefore + 1, "Voter registration failed.");
    }

    function testCastVote() public {
        // Test vote casting with valid vote selection
        bool hasVotedBefore = votingInstance.voters(address(0x1)).hasVoted;
        votingInstance.castVote(1, {from: address(0x1)});
        bool hasVotedAfter = votingInstance.voters(address(0x1)).hasVoted;
        Assert.equal(hasVotedAfter, !hasVotedBefore, "Vote casting failed.");
        
        // Test vote casting with invalid vote selection
        string memory expectedErrorMessage = "Invalid vote selection.";
        bool success = true;
        try votingInstance.castVote(3, {from: address(0x2)}) {
            success = false;
        } catch Error(string memory errorMessage) {
            Assert.equal(errorMessage, expectedErrorMessage, "Invalid error message.");
        }
        Assert.isTrue(success, "Vote casting should have failed.");

        // Test vote casting by same voter twice
        expectedErrorMessage = "You have already casted your vote.";
        success = true;
        try votingInstance.castVote(2, {from: address(0x1)}) {
            success = false;
        } catch Error(string memory errorMessage) {
            Assert.equal(errorMessage, expectedErrorMessage, "Invalid error message.");
        }
        Assert.isTrue(success, "Vote casting should have failed.");
    }

    function testGetRegisteredVoters() public {
        address[] memory voters = votingInstance.getRegisteredVoters();
        Assert.equal(voters.length, 2, "Get registered voters failed.");
    }
}
