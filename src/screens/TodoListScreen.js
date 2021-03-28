import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  FlatList
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import AntdIcon from 'react-native-vector-icons/AntDesign';

const TodoListScreen = (props) => {
  const { navigation } = props;
  const [todoList, setTodoList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getTodoList = async () => {
      const _todoList = await AsyncStorage.multiGet(
        await AsyncStorage.getAllKeys()
      );
      setTodoList(
        _todoList.map(todo => JSON.parse(todo[1]))
          .sort((pre, next) => {
            const preMoment = moment(new Date(pre.createdDate), 'DD.MM.YYYY');
            const nextMoment = moment(new Date(next.createdDate), 'DD.MM.YYYY');
            return nextMoment.diff(preMoment, 'days', true);
          })
      );
    };

    getTodoList();
  }, [isFocused]);

  const deleteTodo = async (id) => {
    const newData = [...todoList];
    const prevIndex = todoList.findIndex(item => item.id === id);
    newData.splice(prevIndex, 1);
    setTodoList(newData);
    await AsyncStorage.removeItem(id.toString());
  };

  const checkedTodo = async (id) => {
    const todo = todoList.find(t => t.id === id);
    const newTodo = { ...todo, completed: true };
    const newData = [...todoList];
    newData.splice(todoList.findIndex(t => t.id === id), 1);
    setTodoList([...newData, newTodo]);
    await AsyncStorage.removeItem(id.toString());
    await AsyncStorage.setItem(todo.id.toString(), JSON.stringify(newTodo));
  };

  const calcDate = (deadlineDate) => {
    const momentDeadlineDate = moment(deadlineDate, 'DD.MM.YYYY');
    const momentNowDate = moment(new Date(), 'DD.MM.YYYY');
    const diff = momentDeadlineDate.diff(momentNowDate, 'days', true);
    if (diff > 0 && diff < 1) {
      return 'Завтра';
    } else if (diff > 1 && diff < 2) {
      return 'Послезавтра';
    } else if (diff < 0 && diff > -1) {
      return 'Сегодня';
    }
    return momentDeadlineDate.format('DD.MM.YYYY');
  };

  const isOverdue = (deadlineDate) => {
    const momentDeadlineDate = moment(deadlineDate, 'DD.MM.YYYY');
    const momentNowDate = moment(new Date(), 'DD.MM.YYYY');
    const diff = momentDeadlineDate.diff(momentNowDate, 'days', true);
    if (diff < -1) return true;

    return false;
  }

  const renderListItem = ({ item, index, isActive }) => (!item.completed && (
    <View
      style={[itemStyles.container]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('todo', {
          todoId: item.id,
          title: item.title,
        })}
        style={{
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              borderRadius: 35/2,
              borderColor: 'black',
              borderWidth: 1,
            }}
            onPress={() => checkedTodo(item.id)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={itemStyles.titleContainer}>
            <Text
              numberOfLines={1}
              style={[itemStyles.title, item.deadlineDate && isOverdue(item.deadlineDate) && { color: 'red' }]}
            >{item.title}</Text>
            <Text style={[itemStyles.date, item.deadlineDate && isOverdue(item.deadlineDate) && { color: 'red' }]}>{moment(item.createdDate).format('DD.MM.YYYY')}</Text>
          </View>
          <Text numberOfLines={1} style={[itemStyles.description, item.deadlineDate && isOverdue(item.deadlineDate) && { color: 'red' }]}>
            {item.description || '-'}
          </Text>
          <Text
            numberOfLines={1}
            style={[itemStyles.deadlineDate, item.deadlineDate && isOverdue(item.deadlineDate) && { color: 'red' }]}
          >
            {(item.deadlineDate && calcDate(item.deadlineDate)) || ''}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )) || (
    <View
      style={[
        itemStyles.container,
        { flexDirection: 'row' },
      ]}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10
        }}
      >
        <AntdIcon name="checkcircle" size={30} color="green" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={itemStyles.titleContainer}>
          <Text
            numberOfLines={1}
            style={[itemStyles.title]}
          >{item.title}</Text>
          <Text style={[itemStyles.date]}>{moment(item.createdDate).format('DD.MM.YYYY')}</Text>
        </View>
        <Text numberOfLines={1} style={[itemStyles.description]}>
          {item.description || '-'}
        </Text>
        <Text
          numberOfLines={1}
          style={[itemStyles.deadlineDate]}
        >
          {(item.deadlineDate && calcDate(item.deadlineDate)) || ''}
        </Text>
      </View>
    </View>
  );

  const renderHiddenItem = ({ item, index }) => (
    <View style={[
      itemStyles.rowBack,
    ]}>
      <TouchableOpacity
        style={itemStyles.backRightBtn}
        onPress={() => Alert.alert('Удалить?', '', [
          {
            text: 'Отмена',
            onPress: () => {}
          },
          {
            text: 'Удалить',
            onPress() { return deleteTodo(item.id) },
            style: 'cancel',
          },
        ])}
      >
        <Text style={{ color: '#fff' }}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );

  const onSwipeValueChange = async ({ key, value }) => {
    if (value < (-Dimensions.get('window').width / 2)) {
      await deleteTodo(key);
    }
  };

  return (
    <View style={styles.container}>
      {!todoList.length
        ? (
          <Text style={styles.emptyText}>Список задач пуст</Text>
        ) : (
          <SwipeListView
            style={styles.list}
            data={[...todoList.filter(t => !t.completed), ...todoList.filter(t => t.completed)]}
            keyExtractor={(item) => item.id}
            renderItem={renderListItem}
            renderHiddenItem={({ item, index }) => renderHiddenItem({ item, index, completed: false })}
            showsVerticalScrollIndicator={false}
            rightOpenValue={-75}
            rightActionValue={500}
            disableRightSwipe
            onSwipeValueChange={onSwipeValueChange}
            useNativeDriver={true}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  emptyText: {
    color: 'gray',
    fontSize: 20,
    marginVertical: 20
  },
  list: {
    width: '100%',
    flexGrow: 1,
    // flex: 1,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 100,
  },
  titleContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  date: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 12,
  },
  description: {
    color: 'gray',
    marginTop: 5,
  },
  deadlineDate: {
    marginTop: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center',
    backgroundColor: 'red',
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
  rowBack: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    height: 100,
  },
});

export default TodoListScreen;