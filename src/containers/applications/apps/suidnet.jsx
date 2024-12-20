import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import "./assets/fileexpo.scss";
import { DashBoard } from "../../../components/apps/suidnet/dashboard";

export const MovementDNet = () => {
  const wnapp = useSelector((state) => state.apps.suidnet);

  return (
    <div
      className="relative flex floatTab dpShad bg-sidebar overflow-hidden"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name={wnapp.name}
        classNameParent={"absolute w-full top-0 left-0 right-0 z-20"}
        hide_title
      />
      <DashBoard />
    </div>
  );
};
