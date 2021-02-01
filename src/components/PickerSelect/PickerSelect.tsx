import React from "react";
import { Platform, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Feather } from "@expo/vector-icons";

import theme from "../../utils/theme";

type Props<T> = {
  data: Array<{
    label: string;
    value: T;
  }>;
  value: T;
  setValue: (filter: T, isComplete: boolean) => void;
};

// we are not rendering placeholde item so we will provide an empty object
const PICKER_PLACEHOLDER = {};

/**
 * We need a little bit different data handling technique on iOS. On android,
 * it is possible to tell, that whenever value is changed, we can safely update
 * filter right away.
 *
 * On the other hand on iOS we would need to wait until user confirms select dialog
 * using "Done" button. It means that we are waiting until user is satisfied with
 * his selection and then we are going to provide "ready-to-use" value.
 */
const PickerSelect = <T extends any>({ data, value, setValue }: Props<T>) => {
  /**
   * Android is selection is done in this method so we will return 'isComplete' as true.
   *
   * Users on iOS doesn't have to be decided right here so we are going to wait with
   * confirmation until they use "Done" button.
   */
  function onPickerChanged(newValue: T) {
    setValue(newValue, Platform.OS !== "ios");
  }

  /**
   * iOS ONLY - User pressed "Done" button so he is already OK with his selection.
   */
  function onPickerDonePressed() {
    setValue(value, true);
  }

  function renderPickerIcon() {
    return (
      <Feather size={18} color={theme.colors.gray[500]} name="chevron-down" />
    );
  }

  return (
    <RNPickerSelect
      items={data}
      placeholder={PICKER_PLACEHOLDER}
      style={styles}
      value={value}
      onValueChange={onPickerChanged}
      onDonePress={onPickerDonePressed}
      Icon={renderPickerIcon}
      useNativeAndroidPickerStyle={false}
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    top: 15,
    right: 10,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 8,
    color: theme.colors.gray[900],
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputIOSContainer: {
    marginLeft: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.gray[400],
    borderRadius: 8,
    color: theme.colors.gray[900],
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default PickerSelect;
