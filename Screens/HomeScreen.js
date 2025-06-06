import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

// Home screen component to display task list
export default function HomeScreen({ navigation }) {
  // State for tasks
  const [tasks, setTasks] = useState([]);
  const STORAGE_KEY = "@tasks";

  // Load tasks from AsyncStorage on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Reload tasks when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      console.log("Loaded tasks:", parsedTasks);
      setTasks(parsedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  // Memoized function to save tasks to AsyncStorage and update state
  const saveTasks = useCallback(
    async (updatedTasksOrCallback) => {
      try {
        let tasksToSave;
        if (typeof updatedTasksOrCallback === "function") {
          tasksToSave = updatedTasksOrCallback(tasks);
        } else {
          tasksToSave = Array.isArray(updatedTasksOrCallback)
            ? updatedTasksOrCallback
            : [];
        }
        console.log("Saving tasks:", tasksToSave);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
        setTasks(tasksToSave); // Update state to trigger re-render
        console.log("Tasks saved and state updated:", tasksToSave);
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    },
    [tasks]
  );

  // Toggle task completion status
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((item) => item.id !== id);
    saveTasks(updatedTasks);
  };

  // Render individual task item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() =>
        navigation.navigate("TaskDetails", { task: item, saveTasks })
      }
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkbox" : "square-outline"}
          size={24}
          color={item.completed ? "#000" : "#666"}
        />
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text
          style={[styles.taskText, item.completed && styles.taskTextCompleted]}
        >
          {item.title}
        </Text>
        <Text style={styles.taskDescription}>{item.text}</Text>
        <Text style={styles.taskMeta}>
          {item.type} • {new Date(item.time).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTask", { saveTasks })}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Minimalistic black-and-white styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  checkbox: {
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  taskDescription: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  taskMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#000",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
