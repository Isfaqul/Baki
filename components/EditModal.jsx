import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
} from "react-native";
import React from "react";
import Spacing from "../constants/Spacing";
import Colors from "../constants/Colors";
import FontSize from "../constants/FontSize";
import { AppButtonSmall, AppButtonSmallSecondary } from "./AppButton.jsx";

export default function EditNameModal({
                                          visible,
                                          value,
                                          onChangeText,
                                          onSave,
                                          onCancel,
                                      }) {
    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={styles.modalView}>
                    <Text style={styles.label}>Update Name</Text>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter name"
                            value={value}
                            onChangeText={onChangeText}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <AppButtonSmallSecondary
                            title="Cancel"
                            onPress={onCancel}
                            iconName="arrow-back"
                        />
                        <AppButtonSmall title="Save" onPress={onSave} iconName="save-alt" />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        marginTop: "auto",
        justifyContent: "center",
        backgroundColor: Colors.bgSecondary,
        borderTopRightRadius: Spacing.rRadiusM,
        borderTopLeftRadius: Spacing.rRadiusM,
        padding: Spacing.paddingXL,
        shadowColor: Colors.bgPrimary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    formContainer: {
        width: "100%",
    },
    text: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: FontSize.f22,
        color: Colors.textPrimary,
    },
    cancelButtonText: {
        color: Colors.textPrimary,
    },
    button: {
        flex: 1,
        borderRadius: Spacing.rRadiusS,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        borderWidth: 1,
        borderColor: Colors.inputBorderFocus,
        backgroundColor: Colors.bgSecondary,
    },
    buttonSubmit: {
        backgroundColor: Colors.bgPrimary,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalTitle: {
        fontSize: FontSize.f16,
        color: Colors.textPrimary,
    },
    textInput: {
        backgroundColor: Colors.white,
        padding: 10,
        fontSize: FontSize.f16,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: Colors.inputBorderBlur,
        borderRadius: Spacing.rRadiusM,
        marginBottom: Spacing.marginM,
    },
    textInputFocus: {
        borderColor: Colors.inputBorderFocus,
    },
    label: {
        fontSize: FontSize.f22,
        fontWeight: "500",
        marginBottom: Spacing.marginM,
        color: Colors.textPrimary,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: Spacing.gapM,
    },
});
