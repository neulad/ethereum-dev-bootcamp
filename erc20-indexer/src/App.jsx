import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Spinner,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.error('Install Metamask!');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setConnectedAccount(accounts[0]);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error while connecting: ${err.message}`);
      } else console.error(err);
    }
  };

  const isWalletConnected = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        setConnectedAccount(accounts[0]);
      } else {
        console.error('No accounts found!');
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    isWalletConnected();
  }, []);

  async function getTokenBalance() {
    setLoading(true);

    const config = {
      apiKey: 'PARSE_YOUR_TOKEN_HERE',
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setLoading(false);
    setHasQueried(true);
  }
  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        {connectedAccount ? (
          <Button
            fontSize={16}
            onClick={() => {
              console.log(connectedAccount);
              setUserAddress(connectedAccount);
            }}
            mb={36}
            bgColor="orange"
          >
            Paste your connected address
          </Button>
        ) : (
          <Button
            fontSize={16}
            onClick={() => {
              connectWallet();
            }}
            mb={32}
            bgColor="red"
          >
            Connect to metamask
          </Button>
        )}
        <Input
          onChange={e => {
            setUserAddress(e.target.value);
          }}
          color="black"
          value={userAddress}
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {loading ? (
          <>
            <Spinner value={30} color="orange.400" thickness="12px" />
            <Text>Waiting for response for Alchemy...</Text>
          </>
        ) : hasQueried ? (
          <SimpleGrid columns={4} spacing={12}>
            {results.tokenBalances.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  bg="blue"
                  key={e.id}
                  maxW="min-content"
                  p="2rem"
                  borderRadius="2rem"
                >
                  <Box>
                    <b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
                  </Box>
                  <Box>
                    <b>Balance:</b>&nbsp;
                    {Utils.formatUnits(
                      e.tokenBalance,
                      tokenDataObjects[i].decimals
                    )}
                  </Box>
                  <Center mt="1rem">
                    <Image src={tokenDataObjects[i].logo} boxSize="100px" />
                  </Center>
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          'Please make a query! This may take a few seconds...'
        )}
      </Flex>
    </Box>
  );
}

export default App;
