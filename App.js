import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos";

export default function App() {
  const[working, setWorking] = useState(true);
  const[text, setText] = useState("");
  const[toDos, setToDos] =  useState({});
  useEffect(() => {
    loadToDos();
  }, []
  );
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) =>{
    awaitAsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };
  const loadToDos = async() =>{
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    JSON.parse(s);
  }
  
  const addToDo = async () => {
    if(text === ""){
      return
    }
    const newToDos = {... toDos, 
      [Date.now()]: {text, working},
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  }
  const deleteToDo = async (key) =>{
    Alert.alert("Delete To Do?", "Are you sure?", [
      {text:"Cancel"},
      {text:"Yes I am sure", onPress:async()=>{
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      },
    },
    ]);
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "dodgerblue": "gray"}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working? "gray": "dodgerblue"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done" 
        style={styles.input} placeholder={working ? "Add a To Do": "Where do you want to go"}/>
        <ScrollView>{
          Object.keys(toDos).map((key) => 
          toDos[key].working === working ? 
          (<View style = {styles.toDo} key={key}>
            <Text style = {styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}><Text>❌</Text></TouchableOpacity>
          </View>) : null)
          }</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnText:{
    fontSize: 44,
    fontWeight:"600",
    color:"dodgerblue"
  },
  input:{
    backgroundColor:"white"
  },
  input:{
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginVertical:20,
    fontSize:18
  },
  toDo:{
    backgroundColor: theme.toDoBg,
    marginBottom:20,
    paddingVertical:20,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between"
  },
  toDoText:{
    color:"black",
    fontSize:16,
    fontWeight: "500"
  }
});
