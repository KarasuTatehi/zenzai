import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { LineChart, Line, YAxis } from "recharts";

const serverOrigin = process.env.SERVER_ORIGIN;

const buffSize = 24;
const buffToData = buff => Array.from(buff).map(v => ({ v: v || 0 }));

const Scope = props => {
  const [data, setData] = useState(buffToData(new Float32Array(buffSize)));
  const {
    room,
    type,
    strokeWidth,
    borderWidth,
    color,
    borderColor,
    strokeLinecap,
    width,
    height
  } = props;

  useEffect(() => {
    const socket = io(serverOrigin)

    socket.on("connect", () => {
      socket.emit("join", { room });
    });

    socket.on("data", data => {
      let buff;
      if (data == 0) {
        buff = new Float32Array(buffSize);
      } else {
        buff = Float32Array.from(new Int16Array(data))
          .map(v => v / ((1 << 15) - 1))
          .map(v => v * (0.5 + 0.5 * (1 - Math.log(Math.abs(v))) || 0));
      }
      const d = buffToData(buff);
      setData(d);
    });
  }, []);

  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{
        top: 5,
        right: borderWidth * 3,
        left: borderWidth * 3,
        bottom: 5
      }}
    >
      <YAxis domain={[-1, 1]} hide={true} />
      <Line
        type={type}
        dataKey="v"
        stroke={borderColor}
        strokeWidth={strokeWidth + borderWidth * 2}
        animationDuration={100}
        strokeLinecap={strokeLinecap}
        dot={false}
      />
      <Line
        type={type}
        dataKey="v"
        stroke={color}
        strokeWidth={strokeWidth}
        animationDuration={100}
        strokeLinecap={strokeLinecap}
        dot={false}
      />
    </LineChart>
  );
};

export default Scope;
