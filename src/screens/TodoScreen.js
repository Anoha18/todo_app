import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const TodoScreen = (props) => {
  const [todo, setTodo] = useState(null);
  const { route } = props;
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadTodo = async () => {
      setTodo(JSON.parse(await AsyncStorage.getItem(route.params.todoId.toString())));
    };

    loadTodo();
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{(todo && todo.title) || ''}</Text>
      <Text style={styles.deadlineDate}>{(todo && todo.deadlineDate && moment(todo.deadlineDate, 'DD.MM.YYYY').format('DD.MM.YYYY')) || ''}</Text>
      <Text style={styles.description}>{(todo && todo.description) || ''}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  deadlineDate: {
    marginTop: 10,
  },
  description: {
    marginTop: 10,
  }
})

export default TodoScreen;