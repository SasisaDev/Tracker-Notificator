import React, { useState } from 'react';

import ReactNative, { Pressable, TouchableOpacity, View } from "react-native";

export default ({color="#414141", style={}, onClick=()=>{}, children}) => {
    //const PressedColor = (parseInt(color.replace('#', ''), 16) + 100).toString(16);

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={onClick} >
        <View style={{...styles.button, backgroundColor: color, ...style}}>
          {children}
        </View>
      </TouchableOpacity>
    )
}

const styles = {
    button: {
        height: 42,
        paddingLeft: 16,
        paddingRight: 16,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
      }
}