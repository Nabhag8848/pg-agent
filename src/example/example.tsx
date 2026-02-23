import React, { createElement } from 'react';
import { Text } from 'ink';

const Example = () => {
  return <Text backgroundColor={'green'}>Hello, World!</Text>;
};

export default createElement(Example);
