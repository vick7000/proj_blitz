import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import Home from '../home/home.js';
import User from '../usuario/usuario.js';

export default function Main() {
    return(
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Usuario" component={User}/>
        </Tab.Navigator>
    )
}