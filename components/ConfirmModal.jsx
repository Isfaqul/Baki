import {
    Modal,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

import {
    AppButtonSmall,
    AppButtonSmallSecondary,
} from "./AppButton.jsx";

import Colors from "../constants/Colors";
import Spacing from "../constants/Spacing";

import FontSize from "../constants/FontSize";

export default function ConfirmModal({ onCancel, onConfirm, visible }) {
    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.iconContainer}>
                        <Feather name="alert-circle" size={46} color={Colors.errorRed} />
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            Are you sure? Deleting this customer will also remove all their
                            transactions!
                        </Text>
                    </View>

                    <View>
                        <View style={styles.buttonContainer}>
                            <AppButtonSmallSecondary
                                title="Cancel"
                                onPress={onCancel}
                                iconName="arrow-back"
                            />
                            <AppButtonSmall
                                title="Confirm"
                                onPress={onConfirm}
                                iconName="delete-outline"
                                style={styles.confirmButton}
                            />
                        </View>
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
    iconContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: Spacing.marginM,
    },
    titleContainer: {
        marginBottom: Spacing.marginM,
    },
    title: {
        fontSize: FontSize.f16,
        fontWeight: "bold",
        color: Colors.textPrimary,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: Spacing.gapM,
    },
    confirmButton: {
        backgroundColor: Colors.errorRed,
        borderColor: Colors.errorRed,
    },
});
