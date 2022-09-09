import React, { useState } from 'react';

import ReactNative, { ScrollView } from "react-native";
//import AsyncStorage from '@react-native-async-storage/async-storage';
import useHeartbeat from '../hooks/useHeartbeat';

import Note from "./Note"

export default () => {
    const [Notes, SetNotes] = useState([]);

    const DoesHeartbeat = useHeartbeat(()=>{
        SetNotes(global.Notes);
        //console.log(global.Notes);
    }, 1000);

    async function ApplyChanges(text, id) {
        global.Notes[id] = text;

        /*try {
            await AsyncStorage.setItem(
                '@Tracknote:notes',
                JSON.stringify(global.Notes)
              );
        } catch (exc) {

        }*/
    }

    return (
        <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.notesContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        >
            {Notes.length > 0 ? 
                Notes.map((value, index) => (
                    <Note Text={{current: value}} ID={index} key={index} onApply={ApplyChanges}/>
                ))
            :
                <ReactNative.Text style={{alignSelf: 'center', marginTop: 100}}>No notes yet.</ReactNative.Text>
            }
            
        </ScrollView>
    )
}

const styles = {
    notesContainer: {
        backgroundColor: '#000',
      },
}