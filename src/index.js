import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Animated, Easing, View} from 'react-native';

import styles from './index.style';

import SlideTop from './SlideTop';
import {
  POPUPVIEW_POSITION,
  POSITION_HEIGHT_MAP,
  DEFAULT_THREE_HEIGHT,
  DEFAULT_THREE_TOP,
} from './constants';

const isInRange = (num, range) => {
  const min = Math.min(...range);
  const max = Math.max(...range);
  return !(num < min || num > max);
};

class PopupView extends PureComponent {
  // 当前位置, 第一段， 第二段， 第三段见 ./constants.js:POPUPVIEW_POSITION
  currentPosition = 2;

  // 三段距离
  threeTop = [...DEFAULT_THREE_TOP];

  // 三段高度
  threeHeight = [...DEFAULT_THREE_HEIGHT];

  // 距离顶部的距离动画
  topAnimatedValue = this.buildTopAnimatedValue();

  // 是否在动画中
  animating = false;

  // 记录滑动的起始点位置，仅用于Android
  mLastAnimationTop = 0;

  // 记录拖动开始的时间
  beginTime = 0;

  constructor(props) {
    super(props);
    this.state = {};
  }

  // iOS滑动事件处理回调
  onMoveShouldSetPanResponderCapture = () => {
    if (this.animating) {
      // 动画中，不处理
      return false;
    }
    return true;
  };

  onPanGrant = () => {
    const value = this.topAnimatedValue.getValue();
    this.mLastAnimationTop = value;
    this.beginTime = Date.now();
  };

  onPanResponderMove = (_e, gestureState) => {
    const {dy} = gestureState;
    let newTopValue = this.mLastAnimationTop + dy;

    if (this.animating) {
      return;
    }

    if (newTopValue <= this.threeTop[2]) {
      newTopValue = this.threeTop[2];
    }
    if (newTopValue >= this.threeTop[0]) {
      newTopValue = this.threeTop[0];
    }

    this.topAnimatedValue.setValue(newTopValue);
    this.topAnimatedValue.getAnimatedValue().setValue(newTopValue);
  };

  onPanResponderEnd = () => {
    if (this.animating) {
      return;
    }
    const {skipMid} = this.props;
    const top = this.topAnimatedValue.getValue();
    const [firstTop, secondTop, thirdTop] = this.threeTop;

    // 第一段第二段 top 差值一般
    const halfDeltaFS = (firstTop - secondTop) / 2;
    // 第二段第三段 top 差值一般
    const halfDeltaST = (secondTop - thirdTop) / 2;

    const firstRange = [firstTop - halfDeltaFS, firstTop];
    const secondRange = [secondTop - halfDeltaST, secondTop + halfDeltaFS];
    const thirdRange = [thirdTop, thirdTop + halfDeltaST];

    if (isInRange(top, firstRange)) {
      this.currentPosition = POPUPVIEW_POSITION.first;
    } else if (!skipMid && isInRange(top, secondRange)) {
      this.currentPosition = POPUPVIEW_POSITION.second;
    } else if (isInRange(top, thirdRange)) {
      this.currentPosition = POPUPVIEW_POSITION.third;
    }

    this.popToPosition(this.currentPosition);
  };

  /**
   * 点击拖拽icon实现滑动
   */
  onTouchDragIcon() {
    const {skipMid} = this.props;
    let position = POPUPVIEW_POSITION.first;

    if (this.currentPosition === POPUPVIEW_POSITION.first) {
      position = skipMid ? POPUPVIEW_POSITION.third : POPUPVIEW_POSITION.second;
    } else if (!skipMid && this.currentPosition === POPUPVIEW_POSITION.second) {
      position = POPUPVIEW_POSITION.third;
    } else if (this.currentPosition === POPUPVIEW_POSITION.third) {
      position = skipMid ? POPUPVIEW_POSITION.first : POPUPVIEW_POSITION.second;
    }

    this.popToPosition(position);
  }

  setThreeHeight(firstHeight, secondHeight, thirdHeight) {
    const threeHeight = [firstHeight, secondHeight, thirdHeight];
    this.threeHeight = threeHeight;
    this.threeTop = threeHeight.map(h => threeHeight[2] - h);
    this.topAnimatedValue = this.buildTopAnimatedValue();

    this.popToPosition(this.currentPosition);
  }

  scrollTo = (topValue, duration = 300, callback = () => {}) => {
    this.animating = true;

    Animated.timing(this.topAnimatedValue.getAnimatedValue(), {
      duration,
      toValue: topValue,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      this.animating = false;
      callback?.();
    });
  };

  popToPosition(position) {
    const top = this.threeTop[POSITION_HEIGHT_MAP[position]];

    this.currentPosition = position;
    this.scrollTo(top, 80, () => {
      const {onDidScrollToPosition} = this.props;
      this.topAnimatedValue.setValue(top);
      this.forceUpdate(() => {
        onDidScrollToPosition({
          position: this.currentPosition,
        });
      });
    });
  }

  buildTopAnimatedValue() {
    let value = this.threeTop[POSITION_HEIGHT_MAP[this.currentPosition]];
    const valueAnimated = new Animated.Value(value);
    return {
      getValue: () => value,
      getAnimatedValue: () => valueAnimated,
      setValue: valueChange => {
        value = valueChange;
      },
    };
  }

  /**
   * 滑动手势到某一段
   */
  slideToPotion(dy) {
    const dir = dy < 0 ? -1 : 1;
    const {skipMid} = this.props;
    let position = this.currentPosition + dir;

    if (skipMid) {
      if (
        // 两段情况下，在第三段继续上滑，中断
        (dir === -1 && this.currentPosition === POPUPVIEW_POSITION.third) ||
        // 两段情况下，在第一段继续下滑，中断
        (dir === 1 && this.currentPosition === POPUPVIEW_POSITION.first)
      ) {
        return;
      }
      position =
        this.currentPosition === POPUPVIEW_POSITION.first
          ? POPUPVIEW_POSITION.third
          : POPUPVIEW_POSITION.first;
    }
    if (
      !(
        position < POPUPVIEW_POSITION.third ||
        position > POPUPVIEW_POSITION.first
      )
    ) {
      this.currentPosition = position;
      this.popToPosition(this.currentPosition);
    }
  }

  render() {
    const {children, style, headTools} = this.props;

    return (
      <>
        <Animated.View
          style={[
            styles.headerTools,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              bottom: this.threeHeight[2],
              left: 0,
            },
            {
              transform: [
                {
                  translateY: this.topAnimatedValue.getAnimatedValue(),
                },
              ],
            },
          ]}
          pointerEvents="box-none">
          {headTools}
        </Animated.View>
        <Animated.View
          style={[
            styles.container,
            {
              height: Math.max(...this.threeHeight),
            },
            ...(Object.prototype.toString.call(style) === '[object Array]'
              ? style
              : [style]),
            {
              transform: [
                {
                  translateY: this.topAnimatedValue.getAnimatedValue(),
                },
              ],
            },
          ]}>
          <SlideTop
            currentPosiotion={this.currentPosition}
            onTouchDragIcon={dy => {
              if (dy) {
                this.slideToPotion(dy);
              } else {
                this.onTouchDragIcon();
              }
            }}
            onMoveShouldSetPanResponder={
              this.onMoveShouldSetPanResponderCapture
            }
            onMoveShouldSetPanResponderCapture={
              this.onMoveShouldSetPanResponderCapture
            }
            onPanResponderGrant={this.onPanGrant}
            onPanResponderMove={this.onPanResponderMove}
            onPanResponderEnd={this.onPanResponderEnd}
          />
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
            }}>
            {children}
          </View>
        </Animated.View>
      </>
    );
  }
}

PopupView.propTypes = {
  // 是否跳过中间段（即两段跳转）
  skipMid: PropTypes.bool,
  // 顶部的自定义工具
  headTools: PropTypes.bool,
  children: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  // 每段切换回调
  onDidScrollToPosition: PropTypes.func,
};
PopupView.defaultProps = {
  skipMid: false,
  children: undefined,
  headTools: undefined,
  onDidScrollToPosition: () => {},
  style: {},
};

export default PopupView;
