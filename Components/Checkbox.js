import React, { useEffect, useState } from 'react';

import ReactNative, { Pressable, ScrollView, View } from "react-native";
import useHeartbeat from '../hooks/useHeartbeat';

export default ({checked=false, onValueChange, value}) => {
    const [IsChecked, SetChecked] = useState(checked);

    let Toggle = ()=>{SetChecked(!IsChecked);};

    useEffect(()=> {
        Toggle = ()=>{
            SetChecked(!IsChecked);
        }

        onValueChange(IsChecked);
    }, [IsChecked])

    return (
        <Pressable onPress={Toggle}>
            <View style={styles.container}>
                <View style={styles.container2}> 
                    {IsChecked ? <View style={styles.container3} /> : null}
                </View> 
            </View>
        </Pressable>
    )
}

const styles = {
    container: {
        backgroundColor: '#fff',
        width: 26,
        height: 26,
        borderRadius: 32,
        justifyItems: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
      },
    container2: {
        width: 22,
        height: 22,
        borderRadius: 32,
        backgroundColor: '#292929',
        justifyItems: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    container3: {
        width: 14,
        height: 14,
        borderRadius: 32,
        backgroundColor: '#fff'
    }
}