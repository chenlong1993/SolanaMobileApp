import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, Keypair, Transaction, SystemProgram } from '@solana/web3.js';

const App = () => {
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  // 连接到 Solana 的本地测试网
  const connection = new Connection('http://127.0.0.1:8899');

  // 检查余额
  const handleCheckBalance = async () => {
    try {
      const pubKey = new PublicKey(publicKey);
      const balance = await connection.getBalance(pubKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      Alert.alert('Error', 'Invalid public key');
    }
  };

  // 发送交易
  const handleSendTransaction = async () => {
    try {
      // 使用你的私钥生成 Keypair
      const fromKeypair = Keypair.fromSecretKey(new Uint8Array([/* your secret key array here */]));
      const toPubkey = new PublicKey(recipient);
      const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPubkey,
            lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
          })
      );

      const signature = await connection.sendTransaction(transaction, [fromKeypair]);
      await connection.confirmTransaction(signature);
      Alert.alert('Success', `Transaction successful with signature: ${signature}`);
    } catch (error) {
      Alert.alert('Error', 'Transaction failed');
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Solana Mobile App</Text>

        <TextInput
            style={styles.input}
            placeholder="Enter Public Key"
            value={publicKey}
            onChangeText={setPublicKey}
        />
        <Button title="Check Balance" onPress={handleCheckBalance} />
        {balance !== null && <Text>Balance: {balance} SOL</Text>}
        <TextInput
            style={styles.input}
            placeholder="Recipient Public Key"
            value={recipient}
            onChangeText={setRecipient}
        />
        <TextInput
            style={styles.input}
            placeholder="Amount (SOL)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
        />
        <Button title="Send Transaction" onPress={handleSendTransaction} />
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    width: '100%',
  },
});

export default App;