import React, { useState, useEffect } from "react";
import { Touchable, TouchableOpacity, View } from "react-native";
import ChildImage from "./childImage";
import { useQuery } from "@apollo/client";
import { GET_CHILDREN_FOR_USER } from "@/graphql/user/queries";
import { Spinner } from "@ui-kitten/components";
import { Image } from "react-native";
import { Child } from "@/graphql/generated";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

const ChildSelector = ({
  onSelectedChildrenChange,
}: {
  onSelectedChildrenChange: (childrenIds: string[]) => void;
}) => {
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [childrenWithImages, setChildrenWithImages] = useState<Child[]>([]);
  const { currentColors } = useTheme();
  const { data: childrenData, loading: childrenLoading } = useQuery(
    GET_CHILDREN_FOR_USER,
    {
      onCompleted: (data) => {
        const filteredChildren = data.getChildrenForUser.filter(
          (child: Child) => child.imageUrl !== null
        );
        setChildrenWithImages(filteredChildren);
        const initialSelected = filteredChildren.map(
          (child: Child) => child.id
        );
        setSelectedChildren(initialSelected);
      },
    }
  );

  useEffect(() => {
    if (selectedChildren.length > 0) {
      onSelectedChildrenChange(selectedChildren);
    }
  }, [selectedChildren, onSelectedChildrenChange]);

  if (childrenLoading)
    return (
      <View>
        <Spinner />
      </View>
    );

  const toggleSelection = (childId: string) => {
    setSelectedChildren((prevSelected) => {
      const updatedSelection = prevSelected.includes(childId)
        ? prevSelected.filter((id) => id !== childId)
        : [...prevSelected, childId];

      return updatedSelection;
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 10,
      }}
    >
      {childrenWithImages.map((child: Child) => (
        <ChildImage
          key={child.id}
          imageUrl={child.imageUrl || ""}
          isSelected={selectedChildren.includes(child.id)}
          onPress={() => toggleSelection(child.id)}
        />
      ))}
      {/* <TouchableOpacity
        onPress={() => router.push("/(tabs)/Carpool/selectPassenger")}
      >
        <View
          style={{
            width: 90,
            height: 90,
            backgroundColor: currentColors.placeholder,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            borderColor: currentColors.tint,
            borderWidth: 1,
          }}
        >
          <Image
            style={{
              resizeMode: "contain",
              tintColor: currentColors.tint,
            }}
            source={require("../../assets/images/add-member-icon.png")}
          />
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

export default ChildSelector;
