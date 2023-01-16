import { useState } from 'react';
import * as secp from 'ethereum-cryptography/secp256k1';
import { utf8ToBytes, toHex } from 'ethereum-cryptography/utils';
import server from './server';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = setter => evt => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = JSON.stringify({
        recipient,
        amount: parseInt(sendAmount),
      });
      const sig = await secp.sign(utf8ToBytes(message), privateKey, {
        recovered: true,
      });

      const {
        data: { balance },
      } = await server.post(`send`, {
        message: message,
        sig: [toHex(sig[0]), sig[1]],
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
