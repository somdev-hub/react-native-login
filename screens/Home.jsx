import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  Pressable
} from "react-native";
import React, { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { Modal, Portal } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigator = useNavigation();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [timeVisible, setTimeVisible] = useState(false);
  const [time, setTime] = useState(moment());
  const [hours, setHours] = useState(time.format("HH"));
  const [minutes, setMinutes] = useState(time.format("mm"));
  const [selected, setSelected] = useState({
    date: false,
    time: false
  });

  const handleMonthChange = (month) => {
    setCurrentMonth((current) => {
      const newMonth = current.clone();
      if (month === "prev") {
        newMonth.subtract(1, "month");
      } else {
        newMonth.add(1, "month");
      }
      return newMonth;
    });
  };

  const generateCalendar = () => {
    const startOfWeek = currentMonth.clone().startOf("month").startOf("week");
    const endOfWeek = currentMonth.clone().endOf("month").endOf("week");

    let date = startOfWeek.clone().subtract(1, "day");
    const calendarWeeks = [];

    while (date.isBefore(endOfWeek, "day")) {
      calendarWeeks.push(
        Array(7)
          .fill(0)
          .map(() => date.add(1, "day").clone())
      );
    }

    return calendarWeeks;
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  useEffect(() => {
    setCalendarWeeks(generateCalendar());
  }, [currentMonth]);

  return (
    <View>
      <View
        style={{
          marginTop: 30,
          marginHorizontal: 20,
          flexDirection: "row",
          gap: 10
        }}
      >
        <TouchableOpacity
          onPress={showModal}
          style={{
            flexDirection: "row",
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: "grey",
            paddingBottom: 10,
            alignItems: "center",
            flex: 1
          }}
        >
          <Fontisto name="date" size={24} color="black" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "gray"
            }}
          >
            {selected.date ? selectedDate.format("DD MMM YYYY") : "Select Date"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTimeVisible(true)}
          style={{
            flexDirection: "row",
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: "grey",
            paddingBottom: 10,
            alignItems: "center",
            flex: 1
          }}
        >
          <AntDesign name="clockcircleo" size={24} color="black" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "gray"
            }}
          >
            {selected.time
              ? `${hours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}`
              : "Select Time"}
          </Text>
        </TouchableOpacity>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 20
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
                alignItems: "center"
              }}
            >
              <TouchableOpacity onPress={() => handleMonthChange("prev")}>
                <AntDesign name="caretleft" size={16} color="black" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  textAlign: "center"
                }}
              >
                {currentMonth.format("MMMM YYYY")}
              </Text>
              <TouchableOpacity onPress={() => handleMonthChange("next")}>
                <AntDesign name="caretright" size={16} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 15
              }}
            >
              {days.map((day, index) => (
                <Text
                  key={index}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "500"
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>

            {calendarWeeks.map((week, index) => {
              return (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10
                    }}
                  >
                    {week.map((day) => {
                      const isToday = moment().isSame(day, "day");
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedDate(day);
                            setSelected({ ...selected, date: true });
                            hideModal();
                          }}
                          key={day.format("DD-MM-YYYY")}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: isToday ? "blue" : "lightgrey",
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: selectedDate.isSame(day, "day")
                              ? 1
                              : 0,
                            borderColor: "blue"
                          }}
                        >
                          <Text style={{ color: isToday ? "white" : "black" }}>
                            {day.format("D")}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={timeVisible}
          onDismiss={() => setTimeVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 20
          }}
        >
          <ScrollView>
            {Array.from({ length: 24 * 4 }, (_, i) => i).map((interval) => {
              const hour = Math.floor(interval / 4);
              const minute = (interval % 4) * 15;
              const time = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;

              return (
                <TouchableOpacity
                  key={interval}
                  onPress={() => {
                    setHours(hour);
                    setMinutes(minute);
                    setSelected({ ...selected, time: true });
                    setTimeVisible(false);
                  }}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey"
                  }}
                >
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Modal>
      </Portal>

      <Pressable
        onPress={async () => {
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("user");
          navigator.navigate("Login");
        }}
        style={{
          backgroundColor: "blue",
          padding: 10,
          margin: 10,
          borderRadius: 10,
          marginTop: 30,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Home;
