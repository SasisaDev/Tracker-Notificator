/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';

import ReactNative, { Pressable, BackHandler, Vibration, Image, TouchableHighlight, TextInput } from "react-native";


import AppButton from "./Components/AppButton"
import NoteContainer from "./Components/NoteContainer"

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import useHeartbeat from './hooks/useHeartbeat';
import Viewbar from './Components/Viewbar';

global.ScreenView = 0;
global.SelectionMode = false;
global.SelectedNotes = [];
//global.Notes = ["lorem ipsum", "ipsum lorem", "dolar sit", "amet", "lorem ipsum", "ipsum lorem", "dolar sit", "amet"];
global.Notes = []

global.StartEditMode = (ID = null) => {
  Vibration.vibrate(75);
  console.log("Edit Mode started");
  global.SelectionMode = true;
  if(ID)
    global.SelectedNotes = [ID];
  ActionQueue.push(global.StopEditMode);
}

global.StopEditMode = () => {
  console.log("Edit Mode aborted"); global.SelectionMode = false; global.SelectedNotes = []; global.Save();

  let index = -1;
  ActionQueue.findIndex((el, idx) => {
    if(el === global.StopEditMode) {index = idx;}
  })

  if(index >= 0) {
    ActionQueue.splice(index, 1);
  }
}

global.ActionQueue = [];

const HelpView = () => {
  return (
    <View style={{...styles.mainContainer, }}> 
      <ScrollView style={HelpViewStyles.scrollView}>
        <Text style={HelpViewStyles.h1}>Application doesn't work?</Text>
        <Text>If your wrist device doesn't get any notifications from Tracknote, you should follow along this simple guide.</Text>

        <Text style={HelpViewStyles.h3}>Allow notifications</Text>
        <Text>You as handheld device user, have rights to enable/disable notifications from specific applications. Make sure Tracknote is not banned from notifying you and all right are set correct.</Text>
        
        <Text style={HelpViewStyles.h3}>Setup your bridge application</Text>
        
      </ScrollView>
    </View>
  )
}

const HelpViewStyles = {
  scrollView: {
    paddingRight: 8
  },
  h1: {
    fontWeight: '400',
    fontSize: 20
  },
  h3: {
    fontWeight: '300',
    fontSize: 18,
    paddingTop: 10
  }
}

const AddView = () => {
  const NoteText = useRef('');
  const [NoteTextState, SetNoteText] = useState('');

  function ReturnToMainView() {
    global.ScreenView = 0;
  }

  function CreateNote() {
    if(NoteText.current.length > 0) {
      global.Notes.push(NoteText.current);
      global.Save();
      global.ScreenView = 0;
    }
  }

  useEffect(()=>{
    global.ActionQueue.push(ReturnToMainView);

    return ()=>{
      global.ActionQueue.splice(global.ActionQueue.length-1);
    }
  }, [])

  return (
    <View style={{...styles.mainContainer, }}> 
      <View style={addViewStyles.flexbox}>
        <Text style={{color: '#ffc14f', fontWeight: '300', fontSize: 22, justifySelf: 'center', alignSelf: 'center', marginBottom: 8, marginTop: 8}}>Create new note</Text>
        <View style={addViewStyles.card}>
          <TextInput multiline style={addViewStyles.input} onChangeText={(value)=>{NoteText.current = value; SetNoteText(value);}} placeholder={"Enter text..."}/>
        </View>
        <View style={addViewStyles.buttons}>
        <TouchableHighlight onPress={CreateNote} style={{...addViewStyles.highlight, backgroundColor: ((NoteTextState.length == 0) ? '#666666' : '#4b9d66')}} disabled={(NoteTextState.length == 0)}>
            <Text style={addViewStyles.text}>Create</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={ReturnToMainView} style={addViewStyles.highlight} activeOpacity={0.6}>
            <Text style={{...addViewStyles.text, color: '#ff5d5d'}}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  )
}

const addViewStyles = {
  flexbox: {
    display: 'flex',
    flexDirection: 'column'
  },
  card: {
    display: 'flex',
    backgroundColor: '#292929',
    borderRadius: 18,
    marginTop: 16,
    width: '100%',
    height: 'auto',
    overflow: 'hidden'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    paddingTop: 16,
    marginLeft: 16
  },
  input: {
    minHeight: 150,
    maxHeight: 300,
    flexGrow: 1, 
    textAlignVertical: 'top', 
    padding: 8, 
    paddingRight: 0, 
  },
  text: {
    padding: 8,
    paddingRight: 16,
    paddingLeft: 16
  },
  highlight: {
    borderRadius: 16
  }
}

const MainView = () => {
  const [IsEditMode, SetEditMode] = useState(false);
  const [IsAnythingSelected, SetIsAnythingSelected] = useState(false);
  useHeartbeat(()=> {
    SetEditMode(global.SelectionMode);
    SetIsAnythingSelected(global.SelectedNotes.length > 0);
  });

  function OpenNewNoteView() {
    console.log("Creating new note");

    global.ScreenView = 2;

    //global.Notes.push("");
    //global.StartEditMode();
  }

  function RemoveSelectedNotes() {
    if(global.SelectedNotes.length > 0) {
      Vibration.vibrate(75);
      global.SelectedNotes.forEach(note => {
        console.log("Deleting: " + note);
        let spliced = global.Notes.splice(note, 1);
        spliced.forEach((el, idx) => {
          if(idx > 0) {
            console.log("Preserving: " + el);
            global.Notes.push(el);
          }
        })
      });

      StopEditMode();
    }
  }

  return (
  <View  style={styles.mainContainer}>
    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '100%'}}>
      <NoteContainer />
      {IsEditMode ? 
        <Pressable onPress={RemoveSelectedNotes}>
        <View style={{...styles.addButton, backgroundColor: ((IsAnythingSelected) ? '#c74e4e' : '#4e4e4e'),}}>
          <Pressable onPress={RemoveSelectedNotes}>
            <Image style={{width: 32, height: 32}} source={require("./icons/trash_can.png")}></Image>
          </Pressable>
        </View>
      </Pressable>
      : 
      <Pressable onPress={OpenNewNoteView}>
        <View style={styles.addButton}>
          <Pressable onPress={OpenNewNoteView}>
            <Text style={{fontSize: 42, fontWeight: '200', alignSelf: 'center', justifySelf: 'center'}}>+</Text>
          </Pressable>
        </View>
      </Pressable>}
    </View>
  </View>
  );
}

const PushModule = ReactNative.NativeModules.PushModule;

global.Save = ()=>{
  global.Notes.forEach((el, idx) => {
      if(el == '') {
      let rem = global.Notes.splice(idx, 1);
      rem.forEach((el, idx) => {
        if(idx > 0 && el != '')
          global.Notes.push(el);
      });
      return;
    }
  });

  PushModule.Save(JSON.stringify(global.Notes));
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [Screen, SetScreen] = useState("");
  const Heartbeat = useHeartbeat(()=>{SetScreen(global.ScreenView);}, 1000/60);

  useEffect(()=> {
    console.log(PushModule.Load())
    try {
      global.Notes = JSON.parse(PushModule.Load()); 
    } catch(e) {
      console.log(e);
    }

    const backAction = () => {
      if(global.ActionQueue.length != 0) {
        (global.ActionQueue[global.ActionQueue.length - 1])();
        global.ActionQueue.splice(global.ActionQueue.length - 1, 1); 
        return true;
      }
      return false;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return ()=> backHandler.remove();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#000" : "#fff",
  };

  function SendPush() {
    ()=>{console.log("Creating new Push: " + NotificationText); PushModule.createPush(NotificationText)}
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={'light-content'} />
      {(Screen < 2) ? <Viewbar /> : null}
      {
        (Screen == 0) ? <MainView /> : null
      }
      {
        (Screen == 1) ? <HelpView /> : null
      }
      {
        (Screen == 2) ? <AddView /> : null
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  mainContainer: {
    backgroundColor: '#000',
    padding: 20,
    paddingBottom: 100,
    paddingTop: 0,
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: "absolute",

    bottom: 25,
    right: 25,

    backgroundColor: '#ffaa2a',
    width: 64,
    height: 64,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    justifyItems: 'center',
    borderRadius: 100,
    padding: 0
  }
});

export default App;
