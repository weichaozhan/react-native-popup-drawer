import {StyleSheet} from 'react-native';

const popZIndex = 9;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: popZIndex,
  },
  dragIconWrapper: {
    backgroundColor: 'transparent',
  },
  dragIconTouchArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: -1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  dragIcon: {
    width: 40,
    height: 32,
  },
  dragIconActive: {
    opacity: 0.5,
  },
  headerTools: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    zIndex: popZIndex,
  },
});

export default styles;
