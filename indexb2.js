const express = require('express');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

    res.send(`
        ${blockchainHTML}
        <form action="/addBlock" method="post">
            <label for="blockData">Data for New Block:</label>
            <input type="text" id="blockData" name="blockData" required>
            <button type="submit">Add Block</button>
        </form>
    `);
});

app.post('/addBlock', (req, res) => {
    const blockData = req.body.blockData;
    const newBlock = new Block(myBlockchain.chain.length, blockData);
    myBlockchain.addBlock(newBlock);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
