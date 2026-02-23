import React, { createElement } from 'react';
import { Text } from 'ink';

const HelloWorld = () => {
  return <Text backgroundColor={'green'}>Hello, World!</Text>;
};

export default createElement(HelloWorld);
