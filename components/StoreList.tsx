import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { downloadAvatars } from '@/services/firebaseStorageService';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/assets/themes/themes';
import { ThemeItem } from '@/models/ThemeItem';
import { StrategistItem } from '@/models/StrategistItem';


export const createThemeItems = (): ThemeItem[] => {
    return Object.entries(themes).map(([themeName, themeVars]) => {
        return new ThemeItem(
            themeName,
            themeVars,
            'Change the theme of the game',
            0,
            false,
            false
        );
    });
}

export const createStrategistItems = async (): Promise<StrategistItem[]> => {
    try {
        const strategistUrls = await downloadAvatars();
        return strategistUrls.map(([url, name]) => {
            return new StrategistItem(
                name.replace(/\.png$/, ""),
                url,
                'Change your avatar',
                0,
                false,
                false
            );
        });
    } catch (error) {
        console.error('Error creating strategist object:', error);
        return [];
    }
}

const StoreList = () => {
    const { theme, themeStyles, setTheme } = useTheme();
    const [strategistItems, setStrategists] = useState<StrategistItem[]>([]);
    const [themeItems, setThemes] = useState<ThemeItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStoreItems = async () => {
            try {
                const [strategists, themes] = await Promise.all([
                    createStrategistItems(),
                    createThemeItems()
                ]);
                setStrategists(strategists);
                setThemes(themes);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreItems();
    }, []);

    return (
        <ScrollView contentContainerStyle={themeStyles.storeContainer}>
            <View style={themeStyles.avatarsGrid}>
                {!loading && strategistItems.length > 0 ? (
                    strategistItems.map((item, index) => (
                        <View style={themeStyles.avatarCard} key={index}>
                            <Image
                                source={{ uri: item.strategistUrl}}
                                style={themeStyles.avatar}
                            />
                            <Text style={themeStyles.avatarName}>{item.strategistName.replace(/\.png$/, "")}</Text>
                        </View>

                    ))
                ) : !loading && (
                    <Text>No Avatars Available</Text>
                )}
            </View>
            {!loading && (
                <View style={themeStyles.themeGrid}>
                    {themeItems.map((item) => (
                        <TouchableOpacity
                            key={item.themeName}
                            style={[
                                themeStyles.themeCard,
                                theme === item.themeName ? themeStyles.activeTheme : null
                            ]}
                            onPress={() => setTheme(item.themeName as keyof typeof themes)}>
                            <Text style={[themeStyles.themeText, { color: item.themeVars.mainColor }]}>
                                {item.themeName.replace(/_/g, ' ')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};
export default StoreList;
