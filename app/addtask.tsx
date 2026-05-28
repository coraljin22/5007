import { View, TextInput, Button } from "react-native";
import { useState } from "react";

export default function AddTask() {
  const [task, setTask] = useState("");

  const handleAddTask = () => {
    console.log(task);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
        }}
      />

      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
}