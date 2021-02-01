import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";

import { useStore } from "../mobx/useStore";
import theme from "../utils/theme";

const HeaderLogout = observer(() => {
  const { authStore } = useStore();

  async function onLogoutPressed() {
    await authStore.signOut();
  }

  return (
    <TouchableOpacity onPress={onLogoutPressed}>
      <MaterialIcons name="logout" size={22} color={theme.colors.gray[800]} />
    </TouchableOpacity>
  );
});

export default HeaderLogout;
