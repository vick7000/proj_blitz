import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ToastAndroid, Image, Modal, TouchableOpacity, AsyncStorage } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

export default function Home() {
    const tipos = [
        require('../../assets/app/1.png'), 
        require('../../assets/app/2.png'), 
        require('../../assets/app/3.png'), 
        require('../../assets/app/4.png'), 
        require('../../assets/app/5.png'), 
        require('../../assets/app/6.png')
    ]

    const [alertas, setAlertas] = useState([]);
    const [coordAlerta, setCoordAlerta] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [valuePicker, setValuePicker] = useState();
    const [marcadores, setMarcadores] = useState([]);
    const [coord, setCoord] = useState({
        latitude: 37.78825,
        longitude: -122.4324
    })

    useEffect(async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
            
        if (status !== 'granted') {
            ToastAndroid.show('Localização negada', ToastAndroid.SHORT);
        } else {
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation});

            console.log(location);
            setCoord({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            let posi = {
                coordenadas: location.coords.latitude + ',' + location.coords.longitude,
                alertum: {
                    tipo: "marker",
                    descricao: "Minha Localização"
                },
                image: require(`../../assets/app/destination.png`)
            }
            let arr = [];

            arr.push(posi);

            setMarcadores(arr);

            carregarAlertas();

            listarAlertas();
        }

    }, []);

    const listarAlertas = () => {
        fetch('http://10.87.207.17:3000/alerta')
        .then(resp => { return resp.json() })
        .then(data => {
            setAlertas(data);
        })
    }

    const carregarAlertas = () => {
        fetch('http://10.87.207.17:3000/localizacao')
        .then(resp => { return resp.json() })
        .then(data => {
            let tempArr = marcadores;
            data.forEach(item => {
                item.image = tipos[item.alertum.id -1];
                tempArr.push(item);
            })
            setMarcadores(tempArr);
        })
    }

    const cadastrarAlerta = async () => {
        let iduser = JSON.parse(await AsyncStorage.getItem('userdata')).id;
        let data = {
            coordenadas: coordAlerta,
            id_user: idUser,
            id_alerta: valuePicker,
            ativo: true
        }
        fetch('http://10.87.207.17:3000/localizacao', {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data),
        })
        .then(resp => { return resp.json() })
        .then(data => {
            setShowModal(false);
        })
    }

    const sebastiao = (e) => {
        console.log(e.nativeEvent.coordinate.latitude);
        console.log(e.nativeEvent.coordinate.longitude);

        let coord = e.nativeEvent.coordinate.latitude +e.nativeEvent.coordinate.longitude;

        setCoordAlerta(coord);

        setShowModal(true);
    }

    return(
        <View style={styles.container}>
            <MapView style={styles.map} 
            region={
                region= {
                    ...coord,
                    latitudeDelta: 0.0065,
                    longitudeDelta: 0.00065
            }}
            onPress={sebastiao}    
        >
                {
                marcadores.map((marcador, index) => {
                    let loki = marcador.coordenadas.split(',');
                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: Number(loki[0]),
                                longitude: Number(loki [1])         
                            }}
                            title={marcador.alertum.tipo}
                            description={"Texto qualquer"}
                        >
                            <Image source={marcador.image} style={styles.marcador}/>
                        </Marker>
                        )
                    })
                }
                
            </MapView>
            <Modal visible={showModal}>
                <Picker
                selectedValue={valuePicker}
                    onValueChange={(itemValue, itemIndex) => 
                        setValuePicker(itemValue)
                    }
                >
                    {
                        alertas.map((alerta, index) => {
                            return(
                                <Picker.Item label={alerta.tipo} value={alerta.id} key={index}/>
                            )
                        })
                    }
                    
                </Picker>

                <TouchableOpacity onPress={() => cadastrarAlerta()}>
                    <Text>Cadastrar Alerta</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    marcador: {
        width: 32,
        height: 32
    }
});