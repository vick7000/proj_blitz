import React, { useState } from 'react';
import { View, Text, TextInput, ToastAndroid, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import * as ImagePicker from 'expo-image-picker';

export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [imagem, setImagem] = useState(require('../../assets/app/programmer.png'));

    const autenticar = () => {
        let usuario = {
            email: email,
            senha: md5(senha),
        }

        fetch('http://10.87.207.17:3000/login', {
            "method":"POST",
            "headers": {
                "Content-Type":"application/json"
            },
            "body":JSON.stringify(usuario),
        })
        .then(resp => { return resp.json() })
        .then(async data => {
            if(data.length > 0) {
                await AsyncStorage.setItem('userdata', JSON.stringify(data[0]));
                navigation.navigate('Main');
            } else {
                ToastAndroid.show('Email ou Senha invalidos', ToastAndroid.SHORT);
            }
        })
    }

    const selecionarImagem = async () => {
        // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImagem({
            uri:result.uri,
        })
      }
    
    }

    return(
        <View>
            <Image source={imagem} style={{width: 100, height: 100}}/>
            <TextInput 

            value={email}
            onChangeText={setEmail}
            
            />
                
            

            <TextInput 

            value={senha}
            onChangeText={setSenha}
            
            />
            <TouchableOpacity onPress={() => { selecionarImagem() }}>
            <Image source={require('../../assets/app/camera.png')} style={{width: 32, height: 32}}/>
            </TouchableOpacity>
            

            <TouchableOpacity onPress={() => autenticar()}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    )
}