import React from "react";
import { observer } from "mobx-react-lite";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

import { useStore } from "../mobx/useStore";
import theme from "../utils/theme";
import HeaderLogout from "../components/HeaderLogout";
// import screens
import LoginScreen from "../screens/LoginScreen";
import ProjectListScreen from "../screens/ProjectListScreen";
import ProjectScreen from "../screens/ProjectScreen";

export type RootStackParamList = {
  ProjectListScreen: undefined;
  ProjectScreen: {
    name: string;
    uid: string;
  };
  LoginScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SCREEN_OPTIONS = {
  contentStyle: {
    backgroundColor: theme.colors.gray[100],
  },
};

const RootStack = observer(() => {
  const {
    authStore: { authenticated },
  } = useStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        {authenticated ? (
          <>
            <Stack.Screen
              name="ProjectListScreen"
              options={{
                title: "Your Projects",
                headerRight: () => <HeaderLogout />,
              }}
              component={ProjectListScreen}
            />
            <Stack.Screen
              name="ProjectScreen"
              options={({ route }) => ({
                title: route.params.name,
                headerRight: () => <HeaderLogout />,
              })}
              component={ProjectScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="LoginScreen"
            options={{
              title: "Sign In",
            }}
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default RootStack;
