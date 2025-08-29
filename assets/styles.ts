import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

export const styleCSS = StyleSheet.create({
    // Typography & Text
    specialText: {
        color: '#FFB000',
        fontSize: 17,
        textShadowColor: '#FFFFFF',
        textShadowRadius: 4,
        letterSpacing: 1.1,
    },
    logText: {
        fontSize: 17,
        color: '#00FF00',
        textShadowColor: '#FFFFFF',
        textShadowRadius: 4,
        letterSpacing: 1.1,
    },
    profileDataHeader: {
        fontSize: 17,
        backgroundColor: '#FFB000',
        color: '#000000',
        textShadowColor: '#000000',
        textShadowRadius: 4,
        letterSpacing: 1.1,
        paddingHorizontal: 5,
        paddingBottom: 3,
    },
    profileData: {
        fontSize: 17,
        color: '#00FF00',
        textShadowColor: '#FFFFFF',
        textShadowRadius: 4,
        letterSpacing: 1.1,
    },
    avatarName: {
        color: '#00FF00',
        fontSize: 19,
    },
    taskText: {
        color: '#FFFFFF',
        fontSize: 21,
        textAlign: 'justify',
    },
    taskCompletedText: {
        color: '#00FF00',
        fontSize: 21,
        textDecorationLine: 'line-through',
        textAlign: 'justify',
    },
    taskIncompleteText: {
        color: '#7A100F',
        fontSize: 21,
        textAlign: 'justify',
    },

    // Layout & Containers
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    viewContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    bezel: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 5,
    },
    crt: {
        flex: 1,
        backgroundColor: '#111',
        overflow: 'hidden',
        position: 'relative',
    },
    scanline: {
        height: 20,
        width: '100%',
        zIndex: 3,
    },
    scanlineContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    screenLineV: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    screenLineH: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    flickerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0010003F',
        zIndex: 3,
        pointerEvents: 'none',
    },
    logContainer: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },

    // Inputs
    floatingInputBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    input: {
        height: 50,
        borderColor: '#00B00099',
        borderWidth: 1,
        color: '#00B00099',
        paddingHorizontal: 10,
        backgroundColor: '#000000',
        borderRadius: 3,
        fontSize: 17,
        zIndex: 3
    },

    gameInputButton: {
        marginLeft: 5,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#282828',
        borderRadius: 3,
        borderColor: '#4E4E4E',
        borderWidth: 1,
        zIndex: 3,
    },

    // Profiles & Avatars
    profileContainer: {
        flexDirection: 'column',
        padding: 5,
    },
    profileDataContainer: {
        flexDirection: 'column',
        rowGap: 5,
        padding: 5,
        alignSelf: 'flex-start',
    },
    profileDataRow: {
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'flex-start',
        padding: 5
    },
    avatar: {
        width: 140,
        height: 170,
        overflow: 'hidden',
        alignSelf: 'flex-start'
    },

    // Game screens & tasks
    gameContainer: {
        flex: 1,
        zIndex: 1,
    },
    gameTerminal: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    gameConsole: {
        flex: 1,
        backgroundColor: '#c1c0be',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        width: Dimensions.get('window').width,
    },
    gameTasksContainer: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 5,
        width: Dimensions.get('window').width,
    },
    taskContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    taskCard: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },


    // Store
    storeContainer: {
        padding: 20,
    },
    // Avatars List
    avatarsGrid: {
        flexDirection: 'column',
        flexWrap: 'wrap',

    },
    avatarCard: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    avatarImage: {
        width: 110,
        height: 130,
        marginBottom: 10,
        borderColor: '#FFB000AA',
        borderWidth: 3,
        tintColor: '#00FF00',
    },

});
