import { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";
import mergeActivityData from "../utils/HeatMapUtils";
import { defaultActivityData } from "../utils/HeatMapUtils";

// Function to generate random activity (dummy data)
// const generateActivityData = (startDate, endDate) => {
//   const data = [];
//   let currentDate = new Date(startDate);
//   const finishDate = new Date(endDate); // endDate

//   while (currentDate <= finishDate) {
//     const count = Math.floor(Math.random() * 10);
//     data.push({
//       date: currentDate.toISOString().split("T")[0].replaceAll("-", "/"),
//       count: count,
//     });
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return data;
// };

// const getPanelColors = (maxCount) => {
//   const colors = {};
//   for (let i = 0; i < maxCount; i++) {
//     const greenValue = Math.floor((i / maxCount) * 255);
//     colors[i] = `rgb(0, ${greenValue}, 0)`;
//   }

//   return colors;
// };

const HeatMapProfile = ({ userId }) => {
  const [activityData, setActivityData] = useState(defaultActivityData);
  const [panelColors, setPanelColors] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await mergeActivityData(defaultActivityData, userId);
      setActivityData(data);
    };

    load();
  }, [userId]);

  return (
    <div>
      <h4 className="text-2xl mb-5">Recent Contributions</h4>
      <HeatMap
        width={800} // new
        rectSize={12} // optional tweak
        space={3} // optional tweak
        value={activityData}
        startDate={new Date("2025/01/01")}
        rectProps={{ rx: 2.5 }}
        panelColors={{
          0: "#000000", // background colour for zero-count cells
          1: "#010101",
          4: "#216e39",
          8: "#30a14e",
          12: "#40c463",
        }}
      />
    </div>
  );
};

export default HeatMapProfile;
