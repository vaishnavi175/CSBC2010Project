// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Voting {
    
    struct Voter {
        bool hasVoted;
    }
    
    mapping(address => Voter) public voters;
    
    event VoteCasted(address voterAddress, uint8 vote);
    
    // Off-chain roll call array of all registered voters
    address[] registeredVoters;

    // Register voter by adding them to the mapping
    function registerVoter(address _voterAddress) public {
        voters[_voterAddress] = Voter(false);
        registeredVoters.push(_voterAddress);
    }
    
    // Cast vote function
    function castVote(uint8 _vote) public {
        // Check if voter has already cast their vote
        require(voters[msg.sender].hasVoted == false, "You have already casted your vote.");
        
        // Check if vote is valid
        require(_vote == 1 || _vote == 2, "Invalid vote selection.");
        
        // Mark voter as having casted their vote
        voters[msg.sender].hasVoted = true;
        
        // Emit vote casted event
        emit VoteCasted(msg.sender, _vote);
    }

    // Off-chain function to create a roll call of registered voters
    function getRegisteredVoters() public view returns (address[] memory) {
        return registeredVoters;
    }
    
    // Get number of registered voters
    function getRegisteredVotersCount() public view returns (uint256) {
        return registeredVoters.length;
    }
}
