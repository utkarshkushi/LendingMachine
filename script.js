var web3 = new Web3(Web3.givenProvider);
    var contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; // Replace with your smart contract address
    var abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_interestRate",
				"type": "uint256"
			}
		],
		"name": "lend",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "lender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			}
		],
		"name": "LoanLended",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			}
		],
		"name": "LoanPaidBack",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_loanId",
				"type": "uint256"
			}
		],
		"name": "payBackLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_loanId",
				"type": "uint256"
			}
		],
		"name": "getLoan",
		"outputs": [
			{
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "lender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isPaidBack",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLoanCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "loanCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "loans",
		"outputs": [
			{
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "lender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestRate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isPaidBack",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Replace with your smart contract ABI
    
    var cryptoLendingContract = new web3.eth.Contract(abi, contractAddress);
    
    function lend() {
      var borrower = document.getElementById("borrower").value;
      var amount = document.getElementById("amount").value;
      var interestRate = document.getElementById("interestRate").value;
      var options = {
        value: web3.utils.toWei(amount, 'ether')
      };
      cryptoLendingContract.methods.lend(borrower, interestRate).send(options)
        .on('transactionHash', function(hash){
          console.log('Transaction hash: ' + hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log('Transaction confirmed with ' + confirmationNumber + ' confirmations.');
          window.location.reload();
        })
        .on('error', function(error){
          console.log('Error: ' + error.message);
        });
    }
    
    function payBackLoan(loanId) {
      cryptoLendingContract.methods.payBackLoan(loanId).send()
        .on('transactionHash', function(hash){
          console.log('Transaction hash: ' + hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log('Transaction confirmed with ' + confirmationNumber + ' confirmations.');
          window.location.reload();
        })
        .on('error', function(error){
          console.log('Error: ' + error.message);
        });
    }
    
    function getLoan(loanId) {
      cryptoLendingContract.methods.getLoan(loanId).call()
        .then(function(result){
          var borrower = result[0];
          var lender = result[1];
          var amount = web3.utils.fromWei(result[2], 'ether');
          var interestRate = result[3];
          var isPaidBack = result[4];
          
          var loanTable = document.getElementById("loanTable");
          var row = loanTable.insertRow();
          var borrowerCell = row.insertCell();
          var lenderCell = row.insertCell();
          var amountCell = row.insertCell();
          var interestRateCell = row.insertCell();
          var statusCell = row.insertCell();
          var payBackCell = row.insertCell();
          
          borrowerCell.innerHTML = borrower;
          lenderCell.innerHTML = lender;
          amountCell.innerHTML = amount;
          interestRateCell.innerHTML = interestRate;
          statusCell.innerHTML = isPaidBack ? 'Paid back' : 'Not paid back';
          
          if (!isPaidBack) {
            var payBackButton = document.createElement('button');
            payBackButton.innerHTML = 'Pay back';
            payBackButton.onclick = function() {
              payBackLoan(loanId);
            };
            payBackCell.appendChild(payBackButton);
          }
        })
        .catch(function(error){
          console.log('Error: ' + error.message);
        });
    }
    
    function getLoanCount() {
      cryptoLendingContract.methods.getLoanCount().call()
        .then(function(result){
          var loanCount = result;
          var loanCountLabel = document.getElementById("loanCountLabel");
          loanCountLabel.innerHTML = 'Loan count: '+ loanCount;
          for (var i = 0; i < loanCount; i++) {
        getLoan(i);
      }
    })
    .catch(function(error){
      console.log('Error: ' + error.message);
    });
}

window.addEventListener('load', function() {
  getLoanCount();
});