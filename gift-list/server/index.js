const express = require('express');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const verifyProof = require('../utils/verifyProof');

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const tree = new MerkleTree(niceList);
const root = tree.getRoot();

app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const body = req.body;

  // TODO: prove that a name is in the list
  if (!body.name)
    return res
      .status(400)
      .json({ err: true, msg: 'No name found in the body!' });

  const index = niceList.findIndex(name => name === body.name);
  if (index == -1)
    return res
      .status(404)
      .json({ err: true, msg: 'User with this name is not found!' });

  const proof = tree.getProof(index);
  res.json({ err: true, msg: 'You got yourself a present!', proof, root });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
