import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Image, PanResponder, View} from 'react-native';

import styles from './index.style';

import {POPUPVIEW_POSITION} from './constants';
import flatupStr from './assets/images/flatup.png';
import flatdownStr from './assets/images/flatdown.png';
import middleStr from './assets/images/middle.png';

const DRAG_ICON_MAP = {
  [POPUPVIEW_POSITION.first]: flatupStr,
  [POPUPVIEW_POSITION.second]: middleStr,
  [POPUPVIEW_POSITION.third]: flatdownStr,
};

class SlideTop extends Component {
  // 点击开始时间
  timeBegin;

  // y 偏移量
  deltaY;

  constructor(props) {
    super(props);

    this.state = {
      isPressStart: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponderCapture:
        this.onMoveShouldSetPanResponderCapture.bind(this),
      onPanResponderGrant: this.onPanResponderGrant.bind(this),
      onPanResponderMove: this.onPanResponderMove.bind(this),
      onPanResponderEnd: this.onPanResponderEnd.bind(this),
    });
  }

  onMoveShouldSetPanResponder(...rest) {
    const {onMoveShouldSetPanResponder} = this.props;
    if (onMoveShouldSetPanResponder) {
      return onMoveShouldSetPanResponder(...rest);
    }

    return true;
  }

  onMoveShouldSetPanResponderCapture(...rest) {
    const {onMoveShouldSetPanResponderCapture} = this.props;

    if (onMoveShouldSetPanResponderCapture) {
      return onMoveShouldSetPanResponderCapture(...rest);
    }

    return true;
  }

  onPanResponderGrant(...rest) {
    const {onPanResponderGrant} = this.props;

    this.beginTime = Date.now();

    this.setState({
      isPressStart: true,
    });
    onPanResponderGrant(...rest);
  }

  onPanResponderMove(...rest) {
    const {onPanResponderMove} = this.props;

    this.deltaY = rest[1]?.dy;
    onPanResponderMove(...rest);
  }

  onPanResponderEnd(...rest) {
    const {onPanResponderEnd, onTouchDragIcon} = this.props;

    this.setState({
      isPressStart: false,
    });

    if (
      Date.now() - this.beginTime <= 500 &&
      // 滑动 & 点击
      (Math.abs(this.deltaY) < 200 || !this.deltaY)
    ) {
      onTouchDragIcon(this.deltaY);
    } else {
      onPanResponderEnd(...rest);
    }

    this.deltaY = undefined;
  }

  render() {
    const {currentPosiotion} = this.props;
    const {isPressStart} = this.state;

    const icon = DRAG_ICON_MAP[currentPosiotion];
    const panHanlders = this.panResponder.panHandlers;

    return (
      <View style={styles.dragIconWrapper}>
        <View style={styles.dragIconTouchArea} {...panHanlders}>
          <Image
            resizeMode="stretch"
            style={[styles.dragIcon, isPressStart ? styles.dragIconActive : {}]}
            source={icon}
          />
        </View>
      </View>
    );
  }
}

SlideTop.propTypes = {
  currentPosiotion: PropTypes.number.isRequired,
  onTouchDragIcon: PropTypes.func.isRequired,
  onMoveShouldSetPanResponder: PropTypes.func.isRequired,
  onMoveShouldSetPanResponderCapture: PropTypes.func.isRequired,
  onPanResponderGrant: PropTypes.func.isRequired,
  onPanResponderMove: PropTypes.func.isRequired,
  onPanResponderEnd: PropTypes.func.isRequired,
};

export default SlideTop;
