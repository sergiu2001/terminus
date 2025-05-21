import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Contract } from '@/models/Contract';
import { Task } from '@/models/Task';
import { useTheme } from '@/context/ThemeContext';

interface TaskDisplayProps {
    contract: Contract;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ contract }) => {
    const { themeStyles, setTheme } = useTheme();
    return (
        <ScrollView style={themeStyles.taskContainer}>
            { contract.tasks.slice(0, contract.currentTaskIndex + 1).map((task: Task, index: number) => (
                <View style={themeStyles.taskCard} key={task.id}>
                    <Text
                        style={[
                            task.completed == 1 ? themeStyles.taskCompletedText : task.completed == 2 ? themeStyles.taskIncompleteText : themeStyles.taskText,
                        ]}
                    >
                        [{index+1}]. {task.description}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default TaskDisplay;