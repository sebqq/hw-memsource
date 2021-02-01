import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { ProjectStatusResponse } from "../api/models";
import Badge from "./Badge";

type Props = {
  status: ProjectStatusResponse;
  containerStyles?: StyleProp<ViewStyle>;
};

function statusToColorscheme(status: ProjectStatusResponse) {
  if (["ACCEPTED", "EMAILED", "ASSIGNED"].includes(status)) {
    return "teal";
  }
  if (["NEW"].includes(status)) {
    return "blue";
  }
  if (["DECLINED", "REJECTED"].includes(status)) {
    return "red";
  }
  if (["COMPLETED", "DELIVERED"].includes(status)) {
    return "green";
  }
  return "gray";
}

const ProjectStatusBadge = ({ status, containerStyles }: Props) => {
  return (
    <Badge
      colorScheme={statusToColorscheme(status)}
      containerStyles={containerStyles}
    >
      {status}
    </Badge>
  );
};

export default ProjectStatusBadge;
