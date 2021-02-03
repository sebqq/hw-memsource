import * as React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import theme from "../../utils/theme";
import useDisclosure from "../../utils/useDisclosure";

type Props = {
  inputRef?: React.RefObject<TextInput>;
  labelText: string;
  labelStyles?: StyleProp<TextStyle>;
  containerStyles?: StyleProp<ViewStyle>;
} & TextInputProps;

const CustomTextInput: React.FC<Props> = ({
  inputRef,
  labelStyles,
  labelText,
  containerStyles,
  ...textInputProps
}) => {
  const { isOpen: isFocused, open: onFocus, close: onBlur } = useDisclosure();

  return (
    <View style={[styles.inputContainer, containerStyles]}>
      <Text style={[styles.inputLabel, labelStyles]}>{labelText}</Text>
      <TextInput
        testID="components-form-textinput"
        ref={inputRef}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={
          textInputProps.placeholderTextColor ?? theme.colors.gray[400]
        }
        style={[
          styles.input,
          textInputProps.style,
          isFocused ? styles.inputFocused : undefined,
        ]}
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    marginBottom: 10,
    color: theme.colors.gray[600],
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "white",
    height: 57,
    fontSize: 16,
    paddingHorizontal: 10,
    borderRadius: 7,
    color: theme.colors.gray[700],
    borderWidth: 2,
    borderColor: "white",
  },
  inputFocused: {
    borderColor: theme.colors.blue[300],
  },
});

export default CustomTextInput;
