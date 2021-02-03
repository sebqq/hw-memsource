import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput as RNTextInput } from "react-native";
import * as WebBrowser from "expo-web-browser";

import TextInput from "../components/Form/TextInput";
import ContainerLoadingIndicator from "../components/Loading/ContainerLoadingIndicator";
import { useStore } from "../mobx/useStore";
import theme from "../utils/theme";
import Button from "../components/Button";
import ErrorText from "../components/Form/ErrorText";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = () => {
  const { authStore } = useStore();

  const usernameInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);

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
      <ScrollView testID="Login.container" style={styles.innerContainer}>
        <Text style={styles.headingLabel}>
          You will need to{" "}
          <Text style={theme.styles.fontBold}>sign in first</Text> in order to
          see and/or manage your projects.
        </Text>
        <TextInput
          testID="Login.username"
          inputRef={usernameInputRef}
          labelText="Your Username:"
          placeholder="Peter"
          textContentType="nickname"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          testID="Login.password"
          inputRef={passwordInputRef}
          labelText="Your Password:"
          placeholder="*********"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <ErrorText
          testID="Login.Error"
          error={authStore.requestState.state === "error"}
          errorText={authStore.requestState.errorMessage}
        />
        <View style={styles.spacer} />
        <Button
          testID="Login.submit"
          text="Sign in"
          onPress={onLoginPressed}
          disabled={authStore.requestState.state === "pending"}
        />
        <View style={styles.spacer} />
        <Text style={styles.secondaryButtonLabel}>Forgot your password?</Text>
        <Text
          onPress={onResetPasswordPressed}
          style={styles.secondaryButtonLink}
        >
          Reset Password
        </Text>
      </ScrollView>
      {authStore.requestState.state === "pending" && (
        <ContainerLoadingIndicator text="Logging in..." />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    marginHorizontal: 16,
    paddingTop: 16,
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
  secondaryButtonLabel: {
    fontSize: 16,
    marginTop: 6,
    textAlign: "center",
    color: theme.colors.gray[500],
  },
  secondaryButtonLink: {
    marginTop: 4,
    fontSize: 16,
    textAlign: "center",
    color: theme.colors.blue[600],
    textDecorationLine: "underline",
  },
});

export default observer(LoginScreen);
