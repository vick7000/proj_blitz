import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ToastAndroid, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import * as ImagePicker from 'expo-image-picker';

export default function Login({navigation}) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [imagem, setImagem] = useState(require('../../assets/app/programmer.png'));

    const [cadastrando, setCadastrando] = useState(false);

    useEffect(async () => {
        if(await AsyncStorage.getItem('userdata') !== null) {
            navigation.navigate('Main');
        }
    }, [])

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
        base64: true,
      });
  

      if (!result.cancelled && result.base64.length < 59500) {
        setImagem({
            uri: 'data:image/jpeg;base64,' + result.base64,
        })
      } else if (!result.cancelled) {
          ToastAndroid.show('Selecione uma imagem menor', ToastAndroid.SHORT);
      }
    
    }
    
    const habilitarCadastro = () => {
        setCadastrando(true);
    }

    const cadastrar = () => {
        let usuario = {
            email: email,
            senha: md5(senha),
            foto: (imagem.uri !== undefined) ? imagem.uri : ''
        }
        fetch('http://10.87.207.17:3000/usuario',{
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(usuario),
        })
        .then(resp => { return resp.json(); })
        .then(async data => {
            if(data.id === undefined) {
                ToastAndroid.show('Falha ao cadastrar', ToastAndroid.SHORT);
                setCadastrando(false);
            } else {
                await AsyncStorage.setItem('userdata', JSON.stringify(data));
                navigation.navigate('Main');
            }
        });

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

            {
                (cadastrando) ?
                    <TouchableOpacity onPress={() => { selecionarImagem() }}>
                        <Image source={require('../../assets/app/camera.png')} style={{width: 32, height: 32}}/>
                    </TouchableOpacity>
                :
                     <TouchableOpacity onPress={() => { habilitarCadastro() }}>
                        <Text>Cadastrar-se</Text>
                    </TouchableOpacity>
            }
            
            <TouchableOpacity onPress={() => { if(!cadastrando) autenticar(); else cadastrar(); }}>
                <Text>{(cadastrando) ? "Cadastrar": "Login"}</Text>
            </TouchableOpacity>
        </View>
    )
}