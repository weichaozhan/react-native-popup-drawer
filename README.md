# react-native-popup-drawer

&middot; Pullable drawers up and down for react native.Support three paragraphs.

## Installation

```bash
npm i -S react-native-popup-drawer
```

## Usage

```js
import React from 'react';
import {View} from 'react-native';
import PopupView from 'react-native-popup-drawer';

const Test = () => {
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
```

## API

### props

|name|type|default| description|
|-----|---|--------|----|
|skipMid | bool | false | Whether to skip the middle segment (ie two-segment jump). |
|headTools | ReactNodes | - | Custom tools at the top. |
|style | ViewPropTypes.style | - | Drawer styles. |
|onDidScrollToPosition | (swithState) => {} | 'post' | Each segment switch callback (swithState: 0 -> top, 1 -> middlw, 2 -> bottom). |

### methods

|name|type| description|
|-----|--------|----|
|setThreeHeight | (firstHeight: number, secondHeight: number, thirdHeight: number) => {}| Set the three heights of the drawer. |
|popToPosition | (position: 0 &#124; 1 &#124; 2) => any | Manually set the position of the drawer (0 -> top, 1 -> middle, 2-> bottom). |
