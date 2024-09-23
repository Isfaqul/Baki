import {Stack} from "expo-router";
import StackHeaderStyle from "../constants/StackHeaderStyle.js";
import DatabaseProvider from "../modules/DatabaseProvider.js";

export default function RootLayout() {
    return (
        <>
            <DatabaseProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen
                        name="new-entry"
                        options={{
                            title: "New Entry",
                            ...StackHeaderStyle,
                        }}
                    />
                    <Stack.Screen
                        name="recent"
                        options={{
                            title: "Recent",
                            ...StackHeaderStyle,
                        }}
                    />
                </Stack>
            </DatabaseProvider>
        </>
    );
}
