/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View} from 'react-native';

import PopupView from './src';

const App = () => {
  const backgroundStyle = {
    height: '100%',
    width: '100%',
    backgroundColor: 'skyblue',
  };

  return (
    <View style={backgroundStyle}>
      <PopupView />
    </View>
  );
};

export default App;
