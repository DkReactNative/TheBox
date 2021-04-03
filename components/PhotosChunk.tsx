import {PhotoIdentifier} from '@react-native-community/cameraroll';
import {View} from 'native-base';
import React from 'react';
import {Animated, Image, Text} from 'react-native';
import {event} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import {reduxState} from '../types/interfaces';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props {
  date: string;
  photos: Array<PhotoIdentifier>;
  opacity: Animated.AnimatedInterpolation;
  numCol: 2 | 3 | 4;
  setWrapperHeight: Function;
}

const renderPhotos = (
  photos: Array<PhotoIdentifier>,
  opacity: Animated.AnimatedInterpolation,
  numCol: 2 | 3 | 4,
  loading: boolean,
) => {
  let result = [];
  let i = 0;
  for (let photo of photos) {
    console.log('photo -------->', photo);
    result.push(
      <Animated.View
        style={{
          height: (windowWidth - numCol * 5 - 5) / numCol,
          // backgroundColor: loading ? 'grey' : 'red',
          margin: 3,
          opacity: opacity,
          width: (windowWidth - numCol * 5 - 5) / numCol,
        }}>
        <Image
          key={++i}
          style={{
            width: '100%',
            height: (windowWidth - numCol * 5 - 5) / numCol,
          }}
          source={{uri: photo.node.image.uri}}
        />
      </Animated.View>,
      <Animated.View
        style={{
          height: (windowWidth - numCol * 5 - 5) / numCol,
          // backgroundColor: loading ? 'grey' : 'red',
          margin: 3,
          opacity: opacity,
          width: (windowWidth - numCol * 5 - 5) / numCol,
        }}>
        <Image
          key={++i}
          style={{
            width: '100%',
            height: (windowWidth - numCol * 5 - 5) / numCol,
          }}
          source={{uri: photo.node.image.uri}}
        />
      </Animated.View>,
    );
  }

  return result;
};

const PhotosChunk: React.FC<Props> = (props) => {
  const loading = useSelector((state: reduxState) => state.loading);

  return (
    <Animated.View
      style={{width: '100%'}}
      onLayout={(event) => {
        let {height} = event.nativeEvent.layout;
        props.setWrapperHeight(height);
      }}>
      <Animated.Text style={{opacity: props.opacity}}>
        {props.date}
      </Animated.Text>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          flexWrap: 'wrap',
          width: '100%',
          flexGrow: 1,
        }}>
        {renderPhotos(props.photos, props.opacity, props.numCol, loading)}
      </View>
    </Animated.View>
  );
};

export default PhotosChunk;
