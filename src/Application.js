import React from "react";
import { useTailwind } from "tailwind-rn";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import StackNavigator from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";

function Application() {
  const tw = useTailwind();
  return (
    <NavigationContainer>
      {/* HOC - higher order component */}
      <AuthProvider>
        {/* Passes down auth stuff to children... */}
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default Application;
