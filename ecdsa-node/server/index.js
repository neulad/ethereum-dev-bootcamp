const express = require('express');
const app = express();
const cors = require('cors');
const secp = require('ethereum-cryptography/secp256k1');
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '04df26517e201135eb256c40ab53c153bf2311dddaf36eb4d257845eb91a905dec35e39591d35ba9a3f49352830a00a77e09e1bce4a751033a9614e26a45aef007': 100,
  '047c64046b6d2d82a013933d7128a4dd64894ff995b96f4068d5d84e8ae4011750dddc6408000e2bd3318129624ce196b49414eee0fffa513060806020f77c7181': 50,
  '04852fe8b0f127d0e114eeb1009df9568ff201eba6fa75d7c9f8a2cbbe9ae62e85915dbe60495d07b1a76008d2ce0e39b2b1844d85efc2b6e29db30f6905c50c40': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { message, sig } = req.body;
  const sender = toHex(
    secp.recoverPublicKey(utf8ToBytes(message), sig[0], sig[1])
  );
  let recipient = '';
  let amount = '';
  try {
    recipient = JSON.parse(message).recipient;
    amount = JSON.parse(message).amount;
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ err: true, msg: 'Wrong message format!' });
  }

  const isSender = secp.verify(sig[0], utf8ToBytes(message), sender);
  if (!isSender) {
    return res.json({ err: true, msg: 'Signature test failed' });
  }
  setInitialBalance(sender);
  setInitialBalance(amount);

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= 10;
    balances[recipient] += amount;
    console.log(sender, recipient);
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
