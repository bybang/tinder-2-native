import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, callEnabled }) => {
  const tw = useTailwind();

  const navigation = useNavigation();

  return (
    <View style={tw("flex-row p-2 items-center justify-between")}>
      <View style={tw("flex flex-row items-center")}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw("p-2")}>
          <Ionicons name="chevron-back" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw("text-2xl font-bold pl-2")}>{title}</Text>
      </View>

      {callEnabled && (
        <TouchableOpacity style={tw("rounded-full mr-4 p-3 bg-red-200")}>
          <Foundation name="telephone" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
