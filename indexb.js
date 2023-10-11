const express = require('express');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;

class Block {
    constructor(index, data, previousHash = '') {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return CryptoJS.SHA256(this.index + this.timestamp + this.data + this.previousHash).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

const myBlockchain = new Blockchain();
myBlockchain.addBlock(new Block(1, 'Data 1'));
myBlockchain.addBlock(new Block(2, 'Data 2'));

app.get('/', (req, res) => {
    let blockchainHTML = "<h1>Tiny Blockchain</h1><ul>";
    myBlockchain.chain.forEach(block => {
        blockchainHTML += `
            <li>
                <strong>Block #${block.index}</strong><br>
                <strong>Timestamp:</strong> ${block.timestamp}<br>
                <strong>Data:</strong> ${block.data}<br>
                <strong>Previous Hash:</strong> ${block.previousHash}<br>
                <strong>Hash:</strong> ${block.hash}
            </li>
            <br>
        `;
    });
    blockchainHTML += '</ul>';
    
    res.send(blockchainHTML);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
