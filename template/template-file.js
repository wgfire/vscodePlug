
module.exports = (fileName) =>{
 return `
 import React ,{ FC } from "react"; 
 import { View, Text } from "@tarojs/components";
 import Taro  from "@tarojs/taro";
 
 const ${fileName}:FC = (porps) =>{
     return <View></View>
 }
 
 `
}


