import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

export const useRequestState = () => {
  const [startingAddress, setStartingAddress] = useState("");
  const [endingAddress, setEndingAddress] = useState("");
  const [startingLatLon, setStartingLatLon] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [endingLatLon, setEndingLatLon] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textColor = useThemeColor({}, "placeholder");
  const [range, setRange] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState("");

  return {
    startingAddress,
    setStartingAddress,
    endingAddress,
    setEndingAddress,
    startingLatLon,
    setStartingLatLon,
    endingLatLon,
    setEndingLatLon,
    selectedIndex,
    setSelectedIndex,
    textColor,
    range,
    setRange,
    showTimePicker,
    setShowTimePicker,
    time,
    setTime,
    visible,
    setVisible,
    description,
    setDescription,
  };
};
