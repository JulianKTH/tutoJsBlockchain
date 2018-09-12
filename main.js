const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock(){
		return new Block(0, new Date(), 'Genesis Block', "0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid(){
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if(currentBlock.hash !== currentBlock.calculateHash()){
				console.error('Error: hash mismatch between currentBlock.hash and currentBlock.calculateHash()');
				return false;
			}

			if(currentBlock.previousHash !== previousBlock.hash){
				console.error('Error: hash mismatch between currentBlock.previousHash and previousBlock.hash');
				return false;
			}
		}

		return true;
	}
}

let myCoin =  new Blockchain();
myCoin.addBlock(new Block(1, new Date(), {"amount": 4}));
myCoin.addBlock(new Block(2, new Date(), {"amount": 10}));

console.log('myCoin=', myCoin);

console.log('myCoin.isChainValid() = ', myCoin.isChainValid());

myCoin.chain[1].data = {"amount": 100};
console.log('myCoin.isChainValid() = ', myCoin.isChainValid());

myCoin.chain[1].hash = myCoin.chain[1].calculateHash();
console.log('myCoin.isChainValid() = ', myCoin.isChainValid());



