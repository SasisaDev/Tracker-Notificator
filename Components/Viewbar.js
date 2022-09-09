import React, { useState } from 'react';

import ReactNative, { Pressable, Image, View, Text } from "react-native";
import useHeartbeat from '../hooks/useHeartbeat';

const ViewbarButton = ({id, image, imageActive}) => {
    const [CurrentView, SetCurrentView] = useState(0);

    useHeartbeat(()=>{
        SetCurrentView(global.ScreenView);
    }, 1000/60);

    function onPress() {
        const old = global.ScreenView;
        global.ActionQueue.push(()=>{global.ScreenView = old;});
        global.ScreenView = id;
    }

    return (
        <Pressable onPress={onPress}>
            <Image style={{width: 28, height: 28, margin: 24}} source={((CurrentView == id) ? imageActive : image)}></Image>
        </Pressable>
    )
}

export default () => {
    //const PressedColor = (parseInt(color.replace('#', ''), 16) + 100).toString(16);
    const [IsEditMode, SetEditMode] = useState(false);
    useHeartbeat(()=> {
      SetEditMode(global.SelectionMode);
    });

    return (
        <View style={{...styles.bar}}>
          {IsEditMode == false ? <ViewbarButton id={0} image={require('../icons/Notes.png')} imageActive={require('../icons/Notes_Active.png')}/> : null}
          {IsEditMode == false ? <ViewbarButton id={1} image={require('../icons/Help.png')} imageActive={require('../icons/Help_Active.png')}/>   : null}
          {IsEditMode ? <Text style={{color: '#ffc14f', fontWeight: '300', fontSize: 22}}>Editing</Text> : null}
        </View>
    )
}

const styles = {
    bar: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#000',

        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        justifyItems: 'center',

        height: 46
      }
}