import React, { useState } from "react";
import { View } from "react-native";
import ChildImage from "./childImage";
import { useQuery } from "@apollo/client";
import { GET_CHILDREN_FOR_USER } from "@/graphql/queries";
import { Spinner } from "@ui-kitten/components";
import { Image } from "react-native";
import { Child } from "@/graphql/generated";

const ChildSelector = () => {
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  const { data: childrenData, loading: childrenLoading } = useQuery(
    GET_CHILDREN_FOR_USER,
    {
      onCompleted: (data) => {
        setSelectedChildren(
          data.getChildrenForUser.map((child: Child) => child.id)
        );
      },
    }
  );

  if (childrenLoading)
    return (
      <View>
        <Spinner />
      </View>
    );

  const toggleSelection = (childId: string) => {
    setSelectedChildren((prevSelected) =>
      prevSelected.includes(childId)
        ? prevSelected.filter((id) => id !== childId)
        : [...prevSelected, childId]
    );
  };

  return (
    <View
      style={{ flexDirection: "row", justifyContent: "flex-start", gap: 10 }}
    >
      {childrenData?.getChildrenForUser.slice(0, 2).map(
        // change this line back later
        (child: Child) => (
          <ChildImage
            key={child.id}
            imageUrl={child.imageUrl || ""}
            isSelected={selectedChildren.includes(child.id)}
            onPress={() => toggleSelection(child.id)}
          />
        )
      )}
      <View
        style={{
          width: 90,
          height: 90,
          backgroundColor: "#F7F9FC",
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          borderColor: "#8F9BB3",
          borderWidth: 1,
        }}
      >
        <Image
          style={{
            resizeMode: "contain",
          }}
          source={require("../../assets/images/add-member-icon.png")}
        />
      </View>
    </View>
  );
};

export default ChildSelector;
