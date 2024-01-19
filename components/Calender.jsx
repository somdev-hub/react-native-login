import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Modal, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

const Calender = ({ visible, hideModal, selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [calendarWeeks, setCalendarWeeks] = useState([]);
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
    // console.log(startOfWeek);
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
  // const calendarWeeks = generateCalendar();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  useEffect(() => {
    setCalendarWeeks(generateCalendar());
  }, [currentMonth]);
  return (
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
                          borderWidth: selectedDate.isSame(day, "day") ? 1 : 0,
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
  );
};

export default Calender;
