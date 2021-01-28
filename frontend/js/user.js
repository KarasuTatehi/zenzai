import React, { useState, useEffect, useRef } from "react";
import Scope from "./scope";

const User = props => {
  const url = new URL(location.href.replace("/#/", "/"));

  const room = props.match.params.userRoom;
  const type = url.searchParams.get("type") || "basis";
  const strokeWidth = parseInt(url.searchParams.get("strokeWidth")) || 0;
  const borderWidth = parseInt(url.searchParams.get("borderWidth")) || 0;
  const color = "#" + (url.searchParams.get("color") || "000000");
  const borderColor = "#" + (url.searchParams.get("borderColor") || "FFFFFF");
  const strokeLinecap = url.searchParams.get("strokeLinecap") || "square";

  return (
    <Scope
      room={room}
      type={type}
      strokeWidth={strokeWidth}
      borderWidth={borderWidth}
      color={color}
      borderColor={borderColor}
      strokeLinecap={strokeLinecap}
      width={800}
      height={600}
    />
  );
};

export default User;
