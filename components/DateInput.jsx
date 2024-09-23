import React, { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native";

import Colors from "../constants/Colors.js";
import Spacing from "../constants/Spacing.js";
import FontSize from "../constants/FontSize.js";

export default function App({date, onChange}) {
    const [isFocused, setIsFocused] = useState(false);

    const showDatepicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: "date",
            display: "spinner",
        });
    };

    return (
        <TouchableWithoutFeedback
            onPress={showDatepicker}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        >
            <View style={[styles.textInput, isFocused && styles.textInputFocus]}>
                <Text style={styles.text}>{date.toDateString()}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

// Styles

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: Colors.white,
        padding: Spacing.paddingS,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: Colors.inputBorderBlur,
        borderRadius: Spacing.rRadiusM,
    },
    textInputFocus: {
        borderColor: Colors.inputBorderFocus,
    },
    text: {
        fontSize: FontSize.f16,
        padding: Spacing.paddingXS,
    },
});
