import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useTailwind } from "tailwind-rn";

const LoginScreen = () => {
  const tw = useTailwind();

  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  // useEffect but triggers on the UI aspect
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tw("flex-1")}
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          style={[
            tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tw("font-semibold text-center")}>
            Sign in & Get Swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

{
  /* <Text>{loading ? "Loading..." : "Login to the App!!"}</Text> */
}
{
  /* <Button title="login" onPress={signInWithGoogle} /> */
}

export default LoginScreen;
