import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Spinner,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useState, useEffect } from 'react';

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

  async function getNFTsForOwner() {
    setLoading(true);

    const config = {
      apiKey: 'OYjS-eBj7Zm7T_89rMJjObwlmjY3CuZd',
      network: Network.ETH_GOERLI,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.nft.getNftsForOwner(userAddress);
    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.ownedNfts.length; i++) {
      const tokenData = alchemy.nft.getNftMetadata(
        data.ownedNfts[i].contract.address,
        data.ownedNfts[i].tokenId
      );
      tokenDataPromises.push(tokenData);
    }

    const metadatas = await Promise.all(tokenDataPromises);
    setTokenDataObjects(metadatas);
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
            NFT Indexer 🖼
          </Heading>
          <Text>
            Plug in an address and this website will return all of its NFTs!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
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
          onChange={e => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          value={userAddress}
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Button fontSize={20} onClick={getNFTsForOwner} mt={36} bgColor="blue">
          Fetch NFTs
        </Button>

        <Heading my={36}>Here are your NFTs:</Heading>

        {loading ? (
          <>
            <Spinner value={30} color="orange.400" thickness="12px" />
            <Text>Waiting for response for Alchemy...</Text>
          </>
        ) : hasQueried ? (
          <SimpleGrid w={'90vw'} columns={4} spacing={24}>
            {results.ownedNfts.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  bg="blue"
                  w={'20vw'}
                  key={e.id}
                >
                  <Box>
                    <b>Name:</b> {tokenDataObjects[i].title}&nbsp;
                  </Box>
                  <Image
                    src={
                      tokenDataObjects[i].rawMetadata.image
                        ? tokenDataObjects[i].rawMetadata.image.replace(
                            'ipfs://',
                            'https://ipfs.io/ipfs/'
                          )
                        : ''
                    }
                  />
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          'Please make a query! The query may take a few seconds...'
        )}
      </Flex>
    </Box>
  );
}

export default App;
