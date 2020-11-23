import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

import TodoListScreen from './TodoListScreen';
import CreateTodoScreen from './CreateTodoScreen';
import TodoScreen from './TodoScreen';

const MainStack = createStackNavigator();

const Main = () => (
  <MainStack.Navigator
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
    initialRouteName="todo_list"
  >
    <MainStack.Screen
      name="todo_list"
      component={TodoListScreen}
      options={({ navigation }) => ({
        headerTitle: 'Задачи',
        headerShown: true,
        headerTitleStyle: {
          alignSelf: 'center',
        },
        headerRight: () => <AntdIcon name="plus" size={25} onPress={() => navigation.navigate('create_todo')} />,
        headerLeft: () => <></>,
        headerRightContainerStyle: {
          paddingRight: 15,
        }
      })}
    />
    <MainStack.Screen
      name="create_todo"
      component={CreateTodoScreen}
      options={({ route }) => ({
        headerTitle: (route.params && route.params.todoId && 'Редактирование') || 'Новая задача',
        headerShown: true,
        headerTitleStyle: {
          alignSelf: 'center',
        },
        headerRight: () => <></>
      })}
    />
    <MainStack.Screen
      name="todo"
      component={TodoScreen}
      options={({ navigation, route }) => ({
        headerTitle: route.params.title || 'Задача',
        headerShown: true,
        headerTitleStyle: {
          alignSelf: 'center',
        },
        headerRight: () => <MaterialIcon name="edit" size={25} onPress={() => navigation.navigate('create_todo', { todoId: route.params.todoId})} />,
        headerRightContainerStyle: {
          paddingRight: 15,
        }
      })}
    />
  </MainStack.Navigator>
);

const AppNavigation = (props) => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  )
};

export default AppNavigation;
