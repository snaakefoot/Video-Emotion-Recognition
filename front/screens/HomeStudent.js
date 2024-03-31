
import React from 'react'

import {Image,ImageBackground,SafeAreaView,StyleSheet,View,Text,TouchableOpacity,RefreshControl,ScrollView  } from 'react-native';
import { useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import Video from 'react-native-video';

export default function HomeStudent({ navigation }){
  const videoRef = useRef(null);
  const [videoUri, setVideoUri] = useState(null);
  const [processedVideoUri, setProcessedVideoUri] = useState(null);
  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      });
      if (result.type === "success") {
        setVideoUri(result.uri);
        console.log(videoUri);
        navigation.navigate('videoResult',{videoUri:videoUri});
        
      } else {
        console.log("User canceled the video picker");
      }
    } catch (err) {
      console.log("Error picking video:", err);
    }
  };
 



{/*_______________________ Markdown  ___________________________*/}

return (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={require('../assets/Logo.jpg')}
    />
    
    <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Upload a video</Text>
      </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({

image: {
  flex: 1,
  resizeMode: 'cover',
  width: '100%',
  height: '100%',
},
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
button: {
  backgroundColor: 'orange',
  padding: 16,
  borderRadius: 8,
  position: 'absolute',
  bottom: 65,
  width: '80%',
  alignItems: 'center',
  borderRadius: 80,
},
buttonText: {
  color: '#fff',
  fontSize: 25,
},
});
