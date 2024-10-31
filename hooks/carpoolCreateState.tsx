import { useState } from "react";
import { IndexPath } from "@ui-kitten/components";

export interface LatLng {
  lat: number;
  lon: number;
}

export interface Request {
  startingLat: number;
  startingLon: number;
  id: string;
  startAddress: string;
}

export interface Vehicle {
  make: string;
  model: string;
  seats: number;
}

export const useRideState = () => {
  const [endingLatLng, setEndingLatLng] = useState<LatLng>({ lat: 0, lon: 0 });
  const [startingLatLng, setStartingLatLng] = useState<LatLng>({
    lat: 0,
    lon: 0,
  });
  const [startingAddress, setStartingAddress] = useState("");
  const [endingAddress, setEndingAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateAndTime, setDateAndTime] = useState("Select Date & Time");
  const [canSubmit, setCanSubmit] = useState(false);
  const [extraCarseatChecked, setExtraCarseatChecked] = useState(false);
  const [winterTiresChecked, setWinterTiresChecked] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(
    new IndexPath(0)
  );
  const [selectedSeatsIndex, setSelectedSeatsIndex] = useState(
    new IndexPath(0)
  );
  const [activeRoute, setActiveRoute] = useState<{
    coordinates: any[];
    predictedTime?: string;
  }>({
    coordinates: [],
  });
  const [previousRoutes, setPreviousRoutes] = useState<
    { coordinates: any[]; predictedTime?: string }[]
  >([]);

  return {
    endingLatLng,
    setEndingLatLng,
    startingLatLng,
    setStartingLatLng,
    startingAddress,
    setStartingAddress,
    endingAddress,
    setEndingAddress,
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    dateAndTime,
    setDateAndTime,
    canSubmit,
    setCanSubmit,
    extraCarseatChecked,
    setExtraCarseatChecked,
    winterTiresChecked,
    setWinterTiresChecked,
    showTimePicker,
    setShowTimePicker,
    time,
    setTime,
    vehicles,
    setVehicles,
    selectedChildren,
    setSelectedChildren,
    visible,
    setVisible,
    description,
    setDescription,
    selectedVehicleIndex,
    setSelectedVehicleIndex,
    selectedSeatsIndex,
    setSelectedSeatsIndex,
    activeRoute,
    setActiveRoute,
    previousRoutes,
    setPreviousRoutes,
  };
};
