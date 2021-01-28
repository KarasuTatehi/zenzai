import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Scope from "./scope";
import "../css/style.css";

const serverOrigin = process.env.SERVER_ORIGIN;

const Pane = props => {
  const textRef = useRef(null);

  const {
    name,
    room,
    avatarURL,
    type,
    strokeWidth,
    borderWidth,
    strokeLinecap
  } = props;

  const [color, setColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [url, setUrl] = useState("");

  const copy = () => {
    textRef.current.select();
    document.execCommand("copy");
  };

  useEffect(() => {
    const url =
      props.baseUrl +
      `/#/user/${room}` +
      `?type=${type}` +
      `&strokeWidth=${strokeWidth}` +
      `&borderWidth=${borderWidth}` +
      `&color=${color.replace("#", "")}` +
      `&borderColor=${borderColor.replace("#", "")}` +
      `&strokeLinecap=${strokeLinecap}`;
    setUrl(url);
  }, [type, strokeWidth, borderWidth, color, borderColor, strokeLinecap]);

  return (
    <div className="pane">
      <div className="settings">
        <div className="user-info">
          <img className="avatar-icon" src={avatarURL} />
          {name}
        </div>
        <div className="config">
          <label>色</label>
          <input
            type="text"
            defaultValue={color}
            onChange={e => setColor(e.target.value)}
          />
        </div>
        <div className="config">
          <label>境界の色</label>
          <input
            type="text"
            defaultValue={borderColor}
            onChange={e => setBorderColor(e.target.value)}
          />
        </div>
        <div className="config url">
          <input className="input-text" readOnly ref={textRef} value={url} />
          <button className="input-button" onClick={copy}>
            Copy
          </button>
        </div>
      </div>

      <div className="preview">
        <Scope
          room={room}
          type={type}
          strokeWidth={strokeWidth / 2}
          borderWidth={borderWidth / 2}
          color={color}
          borderColor={borderColor}
          strokeLinecap={strokeLinecap}
          width={400}
          height={300}
          origin={props.origin}
        />
      </div>
    </div>
  );
};

const Guild = props => {
  const [users, setUsers] = useState([]);
  const [type, setType] = useState("basis");
  const [strokeWidth, setStrokeWidth] = useState(20);
  const [borderWidth, setBorderWidth] = useState(10);
  const [strokeLinecap, setStrokeLinecap] = useState("square");

  useEffect(() => {
    const room = props.match.params.guildRoom;
    const socket = io(serverOrigin);

    socket.on("connect", () => {
      socket.emit("join", { room });
    });

    socket.on("data", data => {
      setUsers(data);
    });
  }, []);

  return (
    <div>
      <div className="global-settings">
        <div className="config">
          <label>線の太さ</label>
          <input
            type="number"
            defaultValue={strokeWidth}
            onChange={e => setStrokeWidth(e.target.value)}
          />
        </div>
        <div className="config">
          <label>境界の太さ</label>
          <input
            type="number"
            defaultValue={borderWidth}
            onChange={e => setBorderWidth(e.target.value)}
          />
        </div>
        <div className="config">
          <label>補完方法</label>
          <select defaultValue={type} onChange={e => setType(e.target.value)}>
            <option value="basis">basis</option>
            <option value="step">step</option>
          </select>
        </div>
        <div className="config">
          <label>端の形状</label>
          <select
            defaultValue={strokeLinecap}
            onChange={e => setStrokeLinecap(e.target.value)}
          >
            <option value="square">square</option>
            <option value="round">round</option>
          </select>
        </div>
      </div>
      <div className="pane-container">
        {users.map(({ name, room, avatarURL }) => (
          <Pane
            key={room}
            avatarURL={avatarURL}
            name={name}
            room={room}
            baseUrl={location.origin}
            type={type}
            strokeWidth={strokeWidth}
            borderWidth={borderWidth}
            strokeLinecap={strokeLinecap}
            origin={serverOrigin}
          />
        ))}
      </div>
    </div>
  );
};

export default Guild;
