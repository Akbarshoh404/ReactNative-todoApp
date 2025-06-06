// Import core React Native and navigation dependencies
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import * as SystemUI from 'expo-system-ui';

// Import screen components
import HomeScreen from './Screens/HomeScreen';
import AddTaskScreen from './Screens/AddTaskScreen';
import TaskDetailsScreen from './Screens/TaskDetailsScreen';

// Create navigation stack
const Stack = createStackNavigator();

export default function App() {
  // Set background color for system UI (status bar, etc.) to match minimalistic theme
  SystemUI.setBackgroundColorAsync('#fff');

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: '#000',
          headerTitleStyle: styles.headerTitle,
        }}
      >
        {/* Home screen for task list */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'To-Do List' }} 
        />
        {/* Screen for adding new tasks */}
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen} 
          options={{ title: 'Add New Task' }} 
        />
        {/* Screen for viewing/editing task details */}
        <Stack.Screen 
          name="TaskDetails" 
          component={TaskDetailsScreen} 
          options={{ title: 'Task Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Minimalistic black-and-white styles for navigation header
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
});