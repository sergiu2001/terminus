import { styleCSS } from "@/assets/styles";
import { Dimensions,SafeAreaView, ScrollView } from "react-native";

const ScreenContainer = ({ children }: { children: React.ReactNode }) => {

    return (
        <SafeAreaView style={styleCSS.safeAreaContainer}>
                <ScrollView style={{ flex: 1 }}
                    horizontal={true}
                    pagingEnabled={true}
                    keyboardDismissMode={'on-drag'}
                    showsHorizontalScrollIndicator={false}
                    contentOffset={{ x: Dimensions.get('window').width, y: 0 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
        </SafeAreaView>
    );
}

export default ScreenContainer;