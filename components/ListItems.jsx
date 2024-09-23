import {useRef} from "react";
import {
    Text,
    StyleSheet,
    View,
    PanResponder,
    TouchableOpacity,
    Animated,
} from "react-native";
import {Feather} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import Spacing from "../constants/Spacing";
import Colors from "../constants/Colors";
import FontSize from "../constants/FontSize";

export default function ListItem({name, item, amount, date, onDelete, note}) {
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx < 0) {
                translateX.setValue(gestureState.dx);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx < -50) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                Animated.spring(translateX, {
                    toValue: -80,
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
    })).current;

    const runHapticsSuccess = async () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    return (
        <View style={styles.itemContainer}>
            <Animated.View
                style={{
                    flex: 1,
                    transform: [{translateX: translateX}],
                }}
            >
                <View style={styles.rowContainer} {...panResponder.panHandlers}>
                    <TableRow
                        name={name}
                        item={item}
                        amount={amount}
                        date={date}
                        note={note}
                    />
                </View>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        runHapticsSuccess();
                        onDelete();
                    }}
                >
                    <Feather name="check" size={20} color={Colors.white}/>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

function TableRow({name, item, amount, date, note}) {
    return (
        <TouchableOpacity activeOpacity={0.7}>
            <View style={!note && styles.rowContainerMain}>
                <View style={[styles.tableRow, styles.tableDataRow]}>
                    <View style={[styles.dataColumn, styles.nameColumn]}>
                        <Text style={[styles.tableData]} numberOfLines={1}>
                            {name}
                        </Text>
                    </View>
                    <View style={[styles.dataColumn, styles.itemColumn]}>
                        <Text style={styles.tableData} numberOfLines={1}>
                            {item}
                        </Text>
                    </View>
                    <View style={[styles.dataColumn, styles.bakiColumn]}>
                        <Text style={[styles.tableData, styles.alignRight, styles.bold]}>
                            ₹ {amount}
                        </Text>
                    </View>
                    <View style={[styles.dataColumn, styles.dateColumn]}>
                        <Text style={[styles.tableData]}>{date}</Text>
                    </View>
                </View>
            </View>
            {note && (
                <View style={styles.noteContainer}>
                    <Text style={styles.noteText}>Note:</Text>
                    <Text style={styles.noteText} numberOfLines={1}>
                        {note}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#eee",
        flex: 1,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    rowContainerMain: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.bgSecondary,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteButton: {
        width: 80,
        height: "100%",
        backgroundColor: Colors.bgPrimary,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: -80,
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
        flex: 0.3,
    },
    bakiColumn: {
        flex: 0.2,
    },
    itemColumn: {
        flex: 0.3,
    },
    dateColumn: {
        flex: 0.3,
    },
    alignRight: {
        textAlign: "right",
    },
    tableDataRow: {
        // borderBottomWidth: 1,
        // borderBottomColor: Colors.bgSecondary,
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
        fontSize: FontSize.f14,
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
    noteContainer: {
        paddingHorizontal: Spacing.paddingS,
        borderTopWidth: 1,
        borderTopColor: Colors.bgSecondary,
        flexDirection: "row",
        gap: Spacing.gapS,
        overflow: "scroll",
        borderBottomWidth: 1,
        borderBottomColor: Colors.bgSecondary,
    },
    noteText: {
        paddingVertical: Spacing.paddingS,
        color: Colors.textSecondary,
        fontSize: FontSize.f12,
    },
});
