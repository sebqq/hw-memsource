import React, { useEffect, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

import theme from "../../utils/theme";
import PickerSelect from "../PickerSelect/PickerSelect";
import useDueFilterReducer, { DueInHoursType } from "./useDueFilterReducer";

type PickerValues = 0 | 1 | 2 | 3 | 4;
type Props = {
  dueInHours: DueInHoursType;
  setDueFilter: (filter: DueInHoursType) => void;
};

const STEP_TO_DUE: { [key in PickerValues]: DueInHoursType } = {
  0: "anyDueDate",
  1: 4,
  2: 8,
  3: 24,
  4: 72,
};
const DUE_TO_STEP: { [key in DueInHoursType]: PickerValues } = {
  anyDueDate: 0,
  4: 1,
  8: 2,
  24: 3,
  72: 4,
};
const SLIDER_MINIMUM_VALUE = 0;
const SLIDER_MAXIMUM_VALUE = 4;
const SLIDER_STEP = 1;
const PICKER_DATA: Array<{ label: string; value: DueInHoursType }> = [
  { label: "Any due date", value: "anyDueDate" },
  { label: "In 4 hours", value: 4 },
  { label: "In 8 hours", value: 8 },
  { label: "In 24 hours", value: 24 },
  { label: "In 72 hours", value: 72 },
];

const ProjectListFilters = ({ dueInHours, setDueFilter }: Props) => {
  const isSliding = useRef(false);
  const sliderValue = DUE_TO_STEP[dueInHours];
  const [filterState, filterDispatch] = useDueFilterReducer(dueInHours);

  useEffect(() => {
    if (filterState.status === "ready") {
      setDueFilter(filterState.value);
    }
  }, [filterState.status, filterState.value]);

  function onSliderValueChanged(value: number) {
    const newDueFilter = STEP_TO_DUE[value as PickerValues] ?? "anyDueDate";
    filterDispatch({ type: "incomplete", payload: newDueFilter });
  }

  function onPickerChanged(value: DueInHoursType, isComplete: boolean) {
    /**
     * We want to update List's filter only when Slider's sliding gesture is not active.
     */
    if (isSliding.current || !isComplete) {
      filterDispatch({ type: "incomplete", payload: value });
    } else {
      filterDispatch({ type: "ready", payload: value });
    }
  }

  function onSliderChangeComplete(value: number) {
    /**
     * When sliding gesture ends, it is the right time to update List filters in
     * order to prevent unnecessary re-renders while user is only "picking" the right
     * value from Slider
     */
    isSliding.current = false;
    const newDueFilter = STEP_TO_DUE[value as PickerValues] ?? "anyDueDate";
    setDueFilter(newDueFilter);
  }

  function onSlidingStart() {
    // memoize sliding current animation state
    isSliding.current = true;
  }

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerText}>Filter by Due:</Text>
        <PickerSelect
          data={PICKER_DATA}
          value={filterState.value}
          setValue={onPickerChanged}
        />
      </View>
      <Slider
        style={styles.slider}
        value={sliderValue}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSliderChangeComplete}
        onValueChange={onSliderValueChanged}
        step={SLIDER_STEP}
        minimumValue={SLIDER_MINIMUM_VALUE}
        maximumValue={SLIDER_MAXIMUM_VALUE}
        minimumTrackTintColor={theme.colors.blue[400]}
        maximumTrackTintColor={theme.colors.gray[400]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  slider: { marginTop: 10 },
});

export default ProjectListFilters;
