import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import { Text, Button, View, StyleSheet, TextInput } from "react-native";
import * as WebBrowser from "expo-web-browser";

import FormGroup from "../components/Form/FormGroup";
import ContainerLoadingIndicator from "../components/Loading/ContainerLoadingIndicator";
import { useStore } from "../mobx/useStore";
import theme from "../utils/theme";

const LoginScreen = observer(() => {
  const { authStore } = useStore();

  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onLoginPressed() {
    if (username === "") {
      usernameInputRef.current?.focus();
      return;
    }
    if (password === "") {
      passwordInputRef.current?.focus();
      return;
    }
    await authStore.signIn(username, password);
  }

  function onResetPasswordPressed() {
    WebBrowser.openBrowserAsync(
      "https://cloud.memsource.com/web/passwordRecovery/send"
    );
  }

  return (
    <>
      <View style={styles.innerContainer}>
        <Text style={styles.headingLabel}>
          You will need to{" "}
          <Text style={theme.styles.fontBold}>sign in first</Text> in order to
          see and/or manage your projects.
        </Text>
        <FormGroup
          inputRef={usernameInputRef}
          labelText="Your Username:"
          placeholder="Peter"
          textContentType="nickname"
          value={username}
          onChangeText={setUsername}
        />
        <FormGroup
          inputRef={passwordInputRef}
          labelText="Your Password:"
          placeholder="*********"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {authStore.requestState.state == "error" &&
          authStore.requestState.errorMessage && (
            <Text style={styles.errorText}>
              {authStore.requestState.errorMessage}
            </Text>
          )}
        <View style={styles.spacer} />
        <Button title="Sign in" onPress={onLoginPressed} />
        <View style={styles.spacer} />
        <Button
          title={"Reset Your Password"}
          onPress={onResetPasswordPressed}
        />
      </View>
      {authStore.requestState.state === "pending" && (
        <ContainerLoadingIndicator text="Logging in..." />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  innerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    position: "relative",
  },
  spacer: {
    marginTop: 20,
  },
  headingLabel: {
    fontSize: 22,
    color: theme.colors.gray[700],
    marginBottom: 12,
  },
  errorText: {
    marginTop: 10,
    color: theme.colors.red[400],
    fontWeight: "bold",
  },
});

export default LoginScreen;
