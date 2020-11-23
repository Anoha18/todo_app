import React from 'react';
import { StatusBar } from 'react-native';
import { Root } from 'native-base';
import AppContainer from './screens';

const App: () => React$Node = () => {
  return (
    <Root>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <AppContainer />
    </Root>
  );
};

export default App;
