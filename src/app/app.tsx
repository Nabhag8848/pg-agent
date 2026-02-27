import React, { useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { UncontrolledTextInput } from 'ink-text-input';
import { randomUUID } from 'crypto';

interface Message {
  query: string;
  result: string;
}

interface AppProps {
  onSubmit: (query: string) => Promise<string>;
}

const App = ({ onSubmit }: AppProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await onSubmit(query);
      setMessages((prev) => [...prev, { query, result }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flexDirection="column" width={process.stdout.columns}>
      {messages.map((msg, i) => (
        <Box key={i} flexDirection="column">
          <Box>
            <Text color="green">{'> '}</Text>
            <Text>{msg.query}</Text>
          </Box>
          <Box paddingLeft={2} marginBottom={1}>
            <Text color="cyan">{msg.result}</Text>
          </Box>
        </Box>
      ))}
      {isLoading && (
        <Box paddingLeft={2} marginBottom={1} gap={1}>
          <Text color="yellow">
            <Spinner type="dots" />
          </Text>
          <Text color="yellow">Analysing...</Text>
        </Box>
      )}
      {error && (
        <Box paddingLeft={2} marginBottom={1}>
          <Text color="red">{error}</Text>
        </Box>
      )}
      <Box
        borderStyle="single"
        borderColor="green"
        width={process.stdout.columns}
        paddingLeft={1}
        borderLeft={false}
        borderRight={false}
      >
        <Text color="green">{'> '}</Text>
        <UncontrolledTextInput
          key={randomUUID()}
          focus={!isLoading}
          onSubmit={(query) => void handleSubmit(query)}
          placeholder="Analyse your data with natural language"
        />
      </Box>
    </Box>
  );
};

export default App;
