import {Dimensions} from 'react-native';

export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const DEFAULT_THREE_HEIGHT = [
  WINDOW_HEIGHT * 0.2,
  WINDOW_HEIGHT * 0.5,
  WINDOW_HEIGHT * 0.8,
];

export const DEFAULT_THREE_TOP = DEFAULT_THREE_HEIGHT.map(
  height => DEFAULT_THREE_HEIGHT[2] - height,
);

export const POPUPVIEW_POSITION = {
  first: 2,
  second: 1,
  third: 0,
};

export const POSITION_HEIGHT_MAP = {
  [POPUPVIEW_POSITION.first]: 0,
  [POPUPVIEW_POSITION.second]: 1,
  [POPUPVIEW_POSITION.third]: 2,
};

export const SLIDE_DISTANCE_MAP = {
  [POPUPVIEW_POSITION.first]: 60,
  [POPUPVIEW_POSITION.second]: 30,
  [POPUPVIEW_POSITION.third]: 20,
};
