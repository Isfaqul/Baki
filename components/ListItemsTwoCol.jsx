import { useRef } from "react";
import {
    Text,
    StyleSheet,
    View,
    PanResponder,
    TouchableOpacity,
    Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import Spacing from "../constants/Spacing";
import Colors from "../constants/Colors";
import FontSize from "../constants/FontSize";

export default function ListItem({ name, amount, onEdit, onDelete }) {
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx < 0) {
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -100) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                    Animated.spring(translateX, {
                        toValue: -160,
                        useNativeDriver: true,
                        tension: 100,
                    }).start();
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 100,
                    }).start();
                }
            },
        }),
    ).current;

    const handleOnRowPress = () => {};

    return (
        <View style={styles.itemContainer}>
            <Animated.View
                style={{
                    flex: 1,
                    transform: [{ translateX: translateX }],
                }}
            >
                <View style={styles.rowContainer} {...panResponder.panHandlers}>
                    <TableRow name={name} amount={amount} onPress={handleOnRowPress} />
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                        onDelete();
                    }}
                >
                    <Feather name="trash" size={16} color={Colors.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                        onEdit();
                    }}
                >
                    <Feather name="edit" size={16} color={Colors.white} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

function TableRow({ name, amount, onPress }) {
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <View style={[styles.tableRow, styles.tableDataRow]}>
                <View style={[styles.dataColumn, styles.nameColumn]}>
                    <Text style={[styles.tableData]} numberOfLines={1}>
                        {name}
                    </Text>
                </View>
                <View style={[styles.dataColumn, styles.bakiColumn]}>
                    <Text style={[styles.tableData, styles.alignRight, styles.bold]}>
                        ₹ {amount}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    editButton: {
        width: 80,
        height: "100%",
        backgroundColor: Colors.bgPrimary,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: -80,
        borderRadius: Spacing.rRadiusM,
    },
    deleteButton: {
        width: 80,
        height: "100%",
        backgroundColor: Colors.errorRed,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: -160,
        borderRadius: Spacing.rRadiusM,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        gap: Spacing.gapS,
    },
    column: {
        backgroundColor: Colors.bgSecondary,
        padding: Spacing.paddingM,
        borderRadius: Spacing.rRadiusM,
    },
    tableHeader: {
        fontSize: FontSize.f14,
        fontWeight: "bold",
        color: Colors.textPrimary,
    },
    nameColumn: {
        flex: 0.6,
    },
    bakiColumn: {
        flex: 0.4,
    },
    alignRight: {
        textAlign: "right",
    },
    tableDataRow: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.bgSecondary,
    },
    dataColumn: {
        backgroundColor: "transparent",
        paddingHorizontal: Spacing.paddingS,
        paddingVertical: Spacing.paddingL,
        borderRadius: Spacing.rRadiusM,
        justifyContent: "center",
    },
    tableData: {
        color: Colors.textPrimary,
        fontSize: FontSize.f16,
    },
    bold: {
        fontWeight: "bold",
    },
    rowContainer: {
        borderRadius: Spacing.rRadiusM,
        overflow: "hidden",
    },
    marginBottom: {
        marginBottom: Spacing.marginS,
    },
});
