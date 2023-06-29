import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Heading, Text, ChakraProvider } from '@chakra-ui/react';
import { ResponsiveBar } from '@nivo/bar';
import 'tailwindcss/tailwind.css';


function App() {
  const [speeds, setSpeeds] = useState([]);
  const [count, setCount] = useState(0);

  const checkSpeed = useCallback(() => {
    // Se o count for maior ou igual a 10, a função retorna prematuramente.
    if (count >= 5) {
      return;
    }

    axios
      .get('http://localhost:3001/speedtest')
      .then((res) => {
        setSpeeds((prevSpeeds) => [...prevSpeeds, { Test: `Test ${count + 1}`, Speed: res.data.speed }]);
        setCount((prevCount) => prevCount + 1);
      })
      .catch((err) => console.error(err));
  }, [count]);

  useEffect(() => {
    const intervalId = setInterval(checkSpeed, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [checkSpeed]);

  const averageSpeed =
    speeds.length > 0 ? (speeds.reduce((a, b) => a.Speed + b.Speed, 0) / speeds.length).toFixed(2) : null;

  return (
    <ChakraProvider>
    <Box className="flex flex-col items-center justify-center h-screen bg-white">
      <Heading as="h1" size="2xl" mb="4">
        Teste de Velocidade de Internet
      </Heading>
      {count < 5 ? (
        <Box textAlign="center">
          <Text mb="2">Teste {count} de 5</Text>
          <Text mb="4">Velocidade atual: {speeds[count - 1]?.Speed} Mbps</Text>
          <CircularProgress isIndeterminate color="green.300" />
        </Box>
      ) : (
        <Box width="70%" height="500px">
          <ResponsiveBar
            data={speeds}
            keys={['Speed']}
            indexBy="Test"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#2c998f',
                size: 4,
                padding: 1,
                stagger: true,
              },
            ]}
            fill={[
              {
                match: {
                  id: 'Speed',
                },
                id: 'dots',
              },
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
          <Text textAlign="center" mt="4">
            Testes concluídos. Velocidade média: {averageSpeed} Mbps
          </Text>
        </Box>
      )}
    </Box>
    </ChakraProvider>
  );
}

export default App;
