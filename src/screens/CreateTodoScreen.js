import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {
  Input,
  Item,
  Label,
  Textarea,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-datepicker';
import Ru from 'moment/locale/ru';

const CreateTodoScreen = (props) => {
  const { navigation, route } = props;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState(new Date());

  useEffect(() => {
    const loadTodo = async () => {
      const todo = JSON.parse(await AsyncStorage.getItem(route.params.todoId.toString()));
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setDeadlineDate(todo.deadlineDate || '');
    };

    if (route.params && route.params.todoId) {
      loadTodo();
    }
  }, []);

  const generateID = () => Math.floor(Math.random() * 1000001);

  const createTodo = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const { todoId } = route.params || {};
    let existsTodo;
    if (todoId) {
      existsTodo = JSON.parse(await AsyncStorage.getItem(todoId.toString()));
    }
    const todo = {
      title,
      description,
      createdDate: (existsTodo && existsTodo.createdDate) || new Date(),
      deadlineDate,
    };

    do {
      todo.id = +todoId || generateID();
      if (todoId || !keys.includes(todo.id.toString())) {
        break;
      }
    } while (true);

    await AsyncStorage.setItem(todo.id.toString(), JSON.stringify(todo));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View>
        <Item floatingLabel>
          <Label>Наименование</Label>
          <Input value={title} onChangeText={(text) => setTitle(text)} />
        </Item>
        <View>
          <DatePicker
            date={deadlineDate}
            onDateChange={setDeadlineDate}
            placeholder="Выберите дату"
            minDate={new Date()}
            confirmBtnText="ОК"
            cancelBtnText="Отмена"
            androidMode="calendar"
            mode="date"
            format="DD.MM.YYYY"
            style={styles.datePicker}
            locale={Ru}
            customStyles={{
              btnTextConfirm: 'ОК',
              btnTextCancel: 'Отмена',
              dateInput: {
                borderRadius: 7,
              }
            }}
          />
        </View>
        <Textarea
          style={{ marginTop: 20, borderRadius: 7 }}
          rowSpan={8}
          onChangeText={(text) => setDescription(text)}
          bordered
          placeholder="Описание"
          value={description}
        />
      </View>
      <TouchableOpacity onPress={() => createTodo()} style={styles.button}>
        <Text style={styles.btnText}>
          {(route.params && route.params.todoId && 'Редактировать') || 'Добавить'}
        </Text>
      </TouchableOpacity>
      {/* </Item> */}
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  nameLabel: {
    fontSize: 20,
  },
  nameInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  datePicker: {
    marginTop: 15,
    width: '100%',
  },
  button: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 17,
    color: '#000',
  }
})

export default CreateTodoScreen;