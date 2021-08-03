import React, {useEffect,useState} from 'react';
import { StyleSheet, Text, View, Button, Image, Alert,TextInput } from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';



import { Card } from 'react-native-paper';

const App = ()  => {
  const [nombre,setName] = useState(null);
  const [password,setPassword] = useState(null);
  const [image,setImage] = useState(null);
  const [photoStatus,setPhotoStatus] = useState('No has seleccionado ninguna imagen');
  const [imageserver,setImageserver] = useState('https://comandorider.000webhostapp.com/appRequest/data/files/3f135efa-d15a-489e-bfe7-d6293fffa0e9.jpg');

  //Permiso a la camara
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setPhotoStatus('Foto cargada localmente exitosamente');
      setImage(result.uri);
    }
  };

const uploadImage = async() =>
{
    let localUri = image;
    if (image == null || image == '') {
      Alert.alert('Debe seleccionar una imágen')
    }
    else {
      let filename = localUri.split('/').pop();
      let extension = filename.split('.');
      let nombrelocal = nombre+'.'+extension[1]
      console.log(nombrelocal);
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      let formData = new FormData();
      formData.append('photo', { uri: localUri, name: nombrelocal, type,});
      formData.append('name',nombre);
      formData.append('password','secret')
      
      
      let response =  await fetch('https://comandorider.000webhostapp.com/appRequest/data/scriptform.php', {
        method: 'POST',
        body: formData,
        //body:  formData,
        header: {
          'Accept': 'application/json',
          'content-type': 'multipart/form-data'
        }
        /*header: {
          'Accept': 'application/json',
          'content-type': 'multipart/form-data',
        },*/
      });

      let result = await response.text();
      alert(result);
      setImageserver(result);
    }
}
  
  
return (
    <View style={styles.container}>
    <TextInput
      placeholder='Name'
      style={{ width: 150, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={(text) => setName(text) }
      value={nombre}
    />
    <Text>{`Subir la imágen al server de ${nombre}`}</Text>
     <Button
      title='Seleccionar Imagen'
      onPress={pickImage}
     />
     <Text style={{ fontSize: 12, marginBottom: 20, color: "#888888" }}>{photoStatus}</Text>
     {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
     
     
     <Button
      title='Subir Imágen'
      onPress={uploadImage}
     />
     {imageserver && <Image source={{ uri: imageserver }} style={{ width: 300, height: 200, margin:50 }} />}
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
