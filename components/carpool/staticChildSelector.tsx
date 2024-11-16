import React, { useState } from "react";
import { View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_CHILDREN_FOR_USER } from "@/graphql/user/queries";
import { Spinner } from "@ui-kitten/components";
import { Child } from "@/graphql/generated";
import ChildImage from "./childImage";

interface StaticChildSelectorProps {
  selectedChildren: string[];
}

const StaticChildSelector = ({
  selectedChildren,
}: StaticChildSelectorProps) => {
  const [childrenWithImages, setChildrenWithImages] = useState<Child[]>([]);

  const { data: childrenData, loading: childrenLoading } = useQuery(
    GET_CHILDREN_FOR_USER,
    {
      onCompleted: (data) => {
        const filteredChildren = data.getChildrenForUser.filter(
          (child: Child) => child.imageUrl !== null
        );
        setChildrenWithImages(filteredChildren);
      },
    }
  );

  if (childrenLoading)
    return (
      <View>
        <Spinner />
      </View>
    );

  return (
    <View
      style={{ flexDirection: "row", justifyContent: "flex-start", gap: 10 }}
    >
      {childrenWithImages.map((child: Child) => (
        <ChildImage
          key={child.id}
          imageUrl={child.imageUrl || ""}
          isSelected={selectedChildren.includes(child.id)}
          onPress={() => {}}
        />
      ))}
    </View>
  );
};

export default StaticChildSelector;
