import React , { useState }from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import { View, Text, StyleSheet, Dimensions, Image,ImageBackground , ActivityIndicator, ScrollView,} from 'react-native';

export default function videoResult({ navigation })  {
  const videoUri = navigation.getParam('videoUri', '');
    console.log(videoUri)
    const [isLoading, setIsLoading] = useState(true);
    const [overallFeeling, setoverallFeeling] = useState('');
    const [transposedMatrix, settransposedMatrix] = useState([[]]);
    state = {
      tableHead: ['Time','Audio Model prediction', 'Image Model Prediction', 'Final Prediction'],
      
    }
    
    const  uploadVideo = async () => {
      try {
        const formData = new FormData();
        formData.append('video', {
          uri: videoUri,
          name: 'video.mp4',
          type: 'video/mp4',
        });
        const response = await fetch('https://749d-197-238-205-235.ngrok-free.app/upload-video', {
          method: 'POST',
          body: formData,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        })
          console.log('Video uploaded successfully');
          const data = await response.json();
          const keys = Object.keys(data.audio);
          const matrix = [];
          
          const numberArray = keys.map(str => `${(Math.floor((parseInt(str)*2) / 60)).toString().padStart(2, '0')}:${((parseInt(str)*2)%60).toString().padStart(2, '0')}` );
          matrix.push([...numberArray]);
          const values = keys.map(key => data.audio[key]);
          matrix.push([...values]);
          const values2 = keys.map(key => data.image[key]);
          matrix.push([...values2]);
          const values3 = keys.map(key => data.both[key]);
          matrix.push([...values3]);
          settransposedMatrix( matrix[0].map((col, i) => matrix.map(row => row[i])));
          console.log(transposedMatrix)
          setoverallFeeling(data.overall)  
          setIsLoading(false);
          
     
      } catch (error) {
        console.log('Error uploading video:', error);
      }
    };
    if (videoUri)
       uploadVideo()
       return (
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require('../assets/video.jpg')} // Replace with the path to your image
          style={styles.container}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={styles.container}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' , marginTop: 100}}>
                <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />
                <Rows data={transposedMatrix} textStyle={styles.text} />
              </Table>
              <Text style={styles.text}>The overall feeling is:</Text>
              <Text style={styles.text2}>{overallFeeling}</Text>
            </View>
          )}
        </ImageBackground>
      </ScrollView>
      )
    
    
  };
  
  const styles = StyleSheet.create({
    container1: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    container: { flex: 1, padding: 16, paddingTop: 175},

    head: { height: 70, backgroundColor: '#f1f8ff',justifyContent: 'center'},
    text: {
      textAlign: 'center',
      fontSize: 16,
      paddingTop:10,
      fontWeight: 'bold',
    },
    text2: {
      textAlign: 'center',
      color: 'red',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });