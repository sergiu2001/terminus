import { styleCSS } from "@/assets/styles";
import { Contract } from '@/models/Contract';
import { Task } from '@/models/tasks/Task';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

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
                            task.completed === 1 ? styleCSS.taskCompletedText : task.completed === 2 ? styleCSS.taskIncompleteText : styleCSS.taskText,
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