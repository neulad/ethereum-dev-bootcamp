function Transaction({ hash, index, gasPrice, gasLimit }) {
  <div>
    <div>Hash: {hash}</div>
    <div>Index: {index}</div>
    <div>GasPrice: {gasPrice}</div>
    <div>GasLimit: {gasLimit}</div>
  </div>;
}

export default Transaction;
