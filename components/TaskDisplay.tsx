import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Contract } from '@/models/Contract';
import { Task } from '@/models/Task';
import { styleCSS } from "@/assets/styles";

interface TaskDisplayProps {
    contract: Contract;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ contract }) => {
    return (
        <ScrollView style={styleCSS.taskContainer}>
            { contract.tasks.slice(0, contract.currentTaskIndex + 1).map((task: Task, index: number) => (
                <View style={styleCSS.taskCard} key={task.id}>
                    <Text
                        style={[
                            task.completed == 1 ? styleCSS.taskCompletedText : task.completed == 2 ? styleCSS.taskIncompleteText : styleCSS.taskText,
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