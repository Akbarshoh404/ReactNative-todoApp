import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

// Screen for adding new tasks
export default function AddTaskScreen({ navigation, route }) {
  // State for task input fields
  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");
  const [type, setType] = useState("Personal");
  const { saveTasks } = route.params;

  // Add task function with error handling
  const addTask = async () => {
    if (title.trim() === "" || task.trim() === "") {
      Alert.alert("Error", "Title and description cannot be empty");
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      text: task.trim(),
      type,
      time: new Date().toISOString(),
      completed: false,
    };
    try {
      await saveTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        console.log("Adding task:", newTask);
        return updatedTasks;
      });
      Alert.alert("Success", "Task added successfully");
      setTitle("");
      setTask("");
      setTimeout(() => navigation.goBack(), 500); // Delay navigation to ensure save completes
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", "Failed to add task. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Task title input */}
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title..."
          placeholderTextColor="#666"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          autoFocus={true}
        />
        {/* Task description input */}
        <Text style={styles.label}>Task Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task description..."
          placeholderTextColor="#666"
          value={task}
          onChangeText={setTask}
          returnKeyType="done"
        />
        {/* Task type selector */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Task Type</Text>
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Urgent" value="Urgent" />
          </Picker>
        </View>
        {/* Save button */}
        <TouchableOpacity style={styles.saveButton} onPress={addTask}>
          <Text style={styles.saveButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Minimalistic black-and-white styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    color: "#000",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pickerItem: {
    color: "#000",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
