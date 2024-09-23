import { Text, TouchableNativeFeedback, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Colors from "../constants/Colors.js";
import Spacing from "../constants/Spacing.js";
import FontSize from "../constants/FontSize.js";

export default function AppButton({ title, iconName, onPress }) {
    return (
        <View style={styles.ButtonContainer}>
            <TouchableNativeFeedback onPress={onPress}>
                <View style={styles.button}>
                    <MaterialIcons name={iconName} size={20} color={Colors.white} />
                    <Text style={styles.ButtonTitle}>{title}</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

export function AppButtonSecondary({ title, iconName, onPress }) {
    return (
        <View style={styles.ButtonContainer}>
            <TouchableNativeFeedback onPress={onPress}>
                <View style={[styles.button, styles.ButtonSecondary]}>
                    <MaterialIcons name={iconName} size={20} color={Colors.textPrimary} />
                    <Text style={[styles.ButtonTitle, styles.ButtonTitleSecondary]}>
                        {title}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

export function AppButtonSmall({ title, iconName, onPress, style }) {
    return (
        <View style={styles.buttonContainerSmall}>
            <TouchableNativeFeedback onPress={onPress}>
                <View style={[styles.buttonSmall, style]}>
                    <MaterialIcons name={iconName} size={18} color={Colors.white} />
                    <Text style={styles.ButtonTitle}>{title}</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

export function AppButtonSmallSecondary({ title, iconName, onPress }) {
    return (
        <View style={styles.ButtonContainer}>
            <TouchableNativeFeedback onPress={onPress}>
                <View style={[styles.buttonSmall, styles.ButtonSecondarySmall]}>
                    <MaterialIcons name={iconName} size={18} color={Colors.textPrimary} />
                    <Text style={[styles.ButtonTitle, styles.ButtonTitleSecondary]}>
                        {title}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

//
const styles = StyleSheet.create({
    ButtonContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
    buttonContainerSmall: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
    button: {
        flexDirection: "row",
        gap: Spacing.marginS,
        backgroundColor: Colors.bgPrimary,
        padding: Spacing.paddingM,
        borderRadius: Spacing.rRadiusM,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: Colors.inputBorderFocus,
    },
    buttonSmall: {
        flexDirection: "row",
        gap: Spacing.marginS,
        backgroundColor: Colors.bgPrimary,
        padding: Spacing.paddingS,
        borderRadius: Spacing.rRadiusM,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: Colors.inputBorderFocus,
    },
    ButtonTitle: {
        color: Colors.white,
        fontWeight: "600",
        fontSize: FontSize.f16,
    },
    ButtonSecondary: {
        backgroundColor: Colors.bgSecondary,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: Colors.textSecondary,
    },
    ButtonSecondarySmall: {
        backgroundColor: Colors.bgSecondary,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Colors.textSecondary,
    },
    ButtonTitleSecondary: {
        color: Colors.textPrimary,
        fontWeight: "700",
    },
});
