import { PixelRatio } from "react-native";

const fontScale = PixelRatio.getFontScale();

export default {
    f22: 22 * fontScale,
    f18: 18 * fontScale,
    f16: 16 * fontScale,
    f14: 14 * fontScale,
    f12: 12 * fontScale,
};
