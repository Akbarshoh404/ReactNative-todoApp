import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Screen for viewing and editing task details
export default function TaskDetailsScreen({ navigation, route }) {
  // Task data and save function from route params
  const { task, saveTasks } = route.params;
  const [title, setTitle] = useState(task.title);
  const [text, setText] = useState(task.text);
  const [type, setType] = useState(task.type);

  // Update task function
  const updateTask = async () => {
    if (title.trim() === "" || text.trim() === "") {
      Alert.alert("Error", "Title and description cannot be empty");
      return;
    }
    const updatedTask = {
      ...task,
      title: title.trim(),
      text: text.trim(),
      type,
    };
    try {
      await saveTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((item) =>
          item.id === task.id ? updatedTask : item
        );
        console.log("Task updated:", updatedTask);
        return updatedTasks;
      });
      Alert.alert("Success", "Task updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task. Please try again.");
    }
  };

  // Delete task function
  const deleteTask = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await saveTasks((prevTasks) => {
              const updatedTasks = prevTasks.filter(
                (item) => item.id !== task.id
              );
              console.log("Task deleted:", task.id);
              return updatedTasks;
            });
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Failed to delete task. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Task title input */}
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor="#666"
          autoFocus={true}
        />
        {/* Task description input */}
        <Text style={styles.label}>Task Description</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Task description"
          placeholderTextColor="#666"
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
        {/* Task creation time */}
        <Text style={styles.meta}>
          Created: {new Date(task.time).toLocaleString()}
        </Text>
        <Text style={styles.meta}>
          Status: {task.completed ? "Completed" : "Pending"}
        </Text>
        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={updateTask}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteTask}>
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
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
  meta: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
