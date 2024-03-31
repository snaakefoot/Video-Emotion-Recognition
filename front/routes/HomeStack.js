import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import HomeStudent from "../screens/HomeStudent";

import videoResult from "../screens/videoResult";
const screens ={
    HomeStudent:{
        screen:HomeStudent,
        

    },
    videoResult:{
        screen:videoResult,
        

    }
    
}
const HomeStack= createStackNavigator(screens);

export default  createAppContainer(HomeStack);