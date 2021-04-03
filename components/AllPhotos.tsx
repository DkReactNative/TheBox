import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Animated, Dimensions, SafeAreaView, View, Image} from 'react-native';
import {reduxState, sortCondition} from '../types/interfaces';
import RenderPhotos from './RenderPhotos';
import {PhotoIdentifier} from '@react-native-community/cameraroll';
import {opacityTransition, sortPhotos, test} from '../utils/functions';
import {useDispatch, useSelector} from 'react-redux';
import {getPhotos} from '../store/actions';
import {Button, Text} from 'native-base';
import CameraRoll from '@react-native-community/cameraroll';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

interface Props {
  photos: Array<PhotoIdentifier>;
  distance: Animated.Value;
  pinchOrZoom: 'pinch' | 'zoom' | undefined;
  sortCondition: sortCondition;
  numColumns: 2 | 3 | 4;
}

const AllPhotos: React.FC<Props> = (props) => {
  const photos = useSelector((state: reduxState) => state.photos);
  const loading = useSelector((state: reduxState) => state.loading);
  const [images, setImage] = useState([] as any);
  const [wrapperHeight, setWrapperHeight] = useState<number>();

  const dispatch = useDispatch();
  const getMorePhotos = () => {
    console.log('getting more photos');
    dispatch(getPhotos());
  };

  useEffect(() => {
    getMorePhotos();
    CameraRoll.getPhotos({
      first: 30,
      groupTypes: 'All',
      assetType: 'Photos',
    })
      .then((r) => {
        // console.log('r ------------->', JSON.stringify(r));
        // let photoArr = r.edges.map((ele) => {
        //   let obj: any = {};
        //   obj.date = moment(new Date(ele.node.timestamp)).format('dd-mm-yyyy');
        //   obj.name = ele.node.image.filename;
        //   obj.group_name = ele.node.group_name;
        //   obj.type = ele.node.type;
        //   obj.uri = ele.node.image.uri;
        //   return obj;
        // });
        setImage(r.edges);
      })
      .catch((err) => {
        console.log('err ---------->', err);
        //Error Loading Images
      });
  }, []);

  console.log('wrapperHeight', wrapperHeight);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{
        width: SCREEN_WIDTH,
        height: wrapperHeight ? wrapperHeight + 200 : SCREEN_HEIGHT,
        // flexWrap: "wrap",
        // alignSelf: "baseline"
        // height: "auto",
        // flexGrow: 1,
      }}>
      <RenderPhotos
        setWrapperHeight={setWrapperHeight}
        wrpperHeight={wrapperHeight}
        photos={test(sortPhotos(images, 'day'))}
        loading={loading}
        getMorePhotosFunction={getMorePhotos}
        margin={props.distance.interpolate({
          inputRange: [0, SCREEN_WIDTH * 0.8],
          outputRange: [1, 5],
        })}
        maxWidth={SCREEN_WIDTH / 2}
        minWidth={SCREEN_WIDTH / 3}
        numColumns={2}
        opacity={props.distance.interpolate({
          inputRange: [0, SCREEN_WIDTH * 0.8],
          outputRange: opacityTransition(
            props.sortCondition,
            props.numColumns,
            props.pinchOrZoom,
          ).day.col[2],
        })}
        // opacity={opacityTransition(sortCondition, numColumns, 'day', 2)}
        date={new Date()}
        separator="day"
      />
      <RenderPhotos
        setWrapperHeight={setWrapperHeight}
        wrpperHeight={wrapperHeight}
        photos={test(sortPhotos(images, 'day'))}
        loading={loading}
        getMorePhotosFunction={getMorePhotos}
        margin={props.distance.interpolate({
          inputRange: [0, SCREEN_WIDTH * 0.8],
          outputRange: [1, 5],
        })}
        maxWidth={SCREEN_WIDTH / 2}
        minWidth={SCREEN_WIDTH / 4}
        numColumns={3}
        opacity={props.distance.interpolate({
          inputRange: [0, SCREEN_WIDTH * 0.8],
          outputRange: opacityTransition(
            props.sortCondition,
            props.numColumns,
            props.pinchOrZoom,
          ).day.col[3],
        })}
        // opacity={opacityTransition(sortCondition, numColumns, 'day', 3)}
        date={new Date()}
        separator="day"
      />
      <RenderPhotos
        photos={test(sortPhotos(images, 'month'))}
        wrpperHeight={wrapperHeight}
        setWrapperHeight={setWrapperHeight}
        loading={loading}
        getMorePhotosFunction={getMorePhotos}
        margin={props.distance.interpolate({
          inputRange: [0, SCREEN_WIDTH * 0.8],
          outputRange: [1, 5],
        })}
        maxWidth={SCREEN_WIDTH / 3}
        minWidth={SCREEN_WIDTH / 5}
        numColumns={4}
        opacity={props.distance.interpolate({
          inputRange: [0, SCREEN_WIDTH * 0.8],
          outputRange: opacityTransition(
            props.sortCondition,
            props.numColumns,
            props.pinchOrZoom,
          ).month.col[4],
        })}
        // opacity={opacityTransition(sortCondition, numColumns, 'month', 4)}
        date={new Date()}
        separator="month"
      />
      {/* <View>
        <ScrollView>
          {images.map((p: any, i: any) => {
            return (
              <Image
                key={i}
                style={{
                  width: 300,
                  height: 100,
                }}
                source={{uri: p.node.image.uri}}
              />
            );
          })}
        </ScrollView>
      </View> */}
    </ScrollView>
  );
};

export default AllPhotos;
