import React, { useEffect, useRef, useState } from 'react';

import ReactNative, { TouchableOpacity, TouchableHighlight , View, PanResponder } from "react-native";
import CheckBox from './Checkbox';
import useHeartbeat from '../hooks/useHeartbeat';

const PushModule = ReactNative.NativeModules.PushModule;

export default ({Text, ID, onApply}) => {
    const panResponder = React.useRef(
        PanResponder.create({
          // Ask to be the responder:
          onStartShouldSetPanResponder: (evt, gestureState) => false,
          onStartShouldSetPanResponderCapture: (evt, gestureState) =>
            false,
          onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 10,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
            false,
    
          onPanResponderGrant: (evt, gestureState) => {
            // The gesture has started. Show visual feedback so the user knows
            // what is happening!
            // gestureState.d{x,y} will be set to zero now
          },
          onPanResponderMove: (evt, gestureState) => {
            // The most recent move distance is gestureState.move{X,Y}
            // The accumulated gesture distance since becoming responder is
            // gestureState.d{x,y}
          },
          onPanResponderTerminationRequest: (evt, gestureState) =>
            false,
          onPanResponderRelease: (evt, gestureState) => {
            // The user has released all touches while this view is the
            // responder. This typically means a gesture has succeeded
          },
          onPanResponderTerminate: (evt, gestureState) => {
          },
          onShouldBlockNativeResponder: (evt, gestureState) => {
            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            return false;
          }
        })
      ).current;

    const [IsSelectionMode, SetSelectionMode] = useState(false);
    const [IsSelected, SetSelected] = useState(false);

    const isSelected = useRef(false);

    useHeartbeat(()=> {
      SetSelectionMode(global.SelectionMode);
      if(global.SelectedNotes.includes(ID)) {
        if(isSelected.current == false) {
          isSelected.current = true;
          SetSelected(true);
        }
      }
      else
      {
        if(isSelected.current == true){
          isSelected.current = false;
          SetSelected(false);
        }
      }
    }, 1000/60);

    function ApplyNote(event) {
      console.log("Sending push: " + Text.current);
      PushModule.createPush(Text.current, ID);
    }

    function ApplyEnablement(isSel) {
      if(isSel) {
        if(!global.SelectedNotes.find((el)=>{return ID == el;}))
          global.SelectedNotes.push(ID);
      } else {
        let index = -1;
        index = global.SelectedNotes.findIndex((el, idx)=>{if(el === ID){return index}});
        if(index >= 0) {
          global.SelectedNotes.splice(index, 1);
        }
      }
    }

    /*{...panResponder.panHandlers}*/
    return (
    <View style={styles.Body}>
        <View style={{display: 'flex', flexDirection: 'row', flexGrow: 1, position: 'relative', width: '100%'}}>
        {(IsSelectionMode == false) ? 
            <TouchableHighlight style={{display: 'flex', flexGrow: 1}} onPress={ApplyNote} onLongPress={()=> {global.StartEditMode(ID); isSelected.current = true;}}>
                <View style={styles.Card}>
                  <ReactNative.Text>{Text.current}</ReactNative.Text>
                </View>
            </TouchableHighlight>
            : 
            <View style={{display: 'flex', flexDirection: 'row', flexGrow: 1}}>
              <ReactNative.TextInput style={{width: '80%', flexGrow: 1, textAlignVertical: 'top', padding: 8, paddingRight: 0, minHeight: 60,}} multiline onChangeText={(newText)=>{Text.current = newText; onApply(Text.current, ID)}}>{Text.current}</ReactNative.TextInput>
              <View style={{minWidth: 50, height: 'auto', justifyItems: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                <CheckBox
                checked={isSelected.current}
                onValueChange={ApplyEnablement}
                style={styles.checkbox}
                disabled={false}
                />
              </View>
            </View>
        }
        </View>
    </View>
    )
}

const styles = {
    Body: {
        display: 'flex',
        backgroundColor: '#292929',
        borderRadius: 18,
        marginTop: 16,
        width: '100%',
        height: 'auto',
        maxHeight: 560,
        overflow: 'hidden'
    },
    Selector: {
        backgroundColor: '#ff4646',
        height: '100%',
        width: 50
    },
    Card: {
        display: 'flex',
        backgroundColor: '#292929',
        //height: '100%',
        //width: '100%',
        //width: '100%',
        minHeight: 60,
        flexGrow: 1,

        padding: 8
    },
    checkbox: {

    }
}