import React, { ReactNode } from "react";
import { Text } from "react-native";

import theme from "../../utils/theme";
import ProjectStatusBadge from "../ProjectStatusBadge";
import { ProjectModel } from "../../mobx/entities/projects/Project";

export type ProjectInfoRowData = {
  label: string;
  value?: string;
  processor?: () => ReactNode;
};

export type ProjectInfoSectionListData = Array<{
  title: string;
  data: ProjectInfoRowData[];
}>;

export function formatProjectInfoSectionListData(project?: ProjectModel) {
  if (!project) {
    return [];
  }

  const {
    dateDueString,
    dateCreatedString,
    name,
    status,
    targetLangs,
    sourceLang,
  } = project;

  return [
    {
      title: "Base Info",
      data: [
        { label: "Project Name:", value: name },
        { label: "Created:", value: dateCreatedString() },
      ],
    },
    {
      title: "Project State",
      data: [
        {
          label: "Status:",
          processor: () => <ProjectStatusBadge status={status} />,
        },
        { label: "Date Due:", value: dateDueString() },
      ],
    },
    {
      title: "Languages",
      data: [
        { label: "Source:", value: sourceLang },
        {
          label: "Target:",
          processor: () => {
            if (!targetLangs) {
              return <Text>Not set.</Text>;
            }

            return targetLangs.map((lang, index) => {
              const renderDivider = index < targetLangs.length - 1;
              return (
                <Text key={`value-for-${lang}-${index}`}>
                  {lang}
                  {renderDivider && (
                    <Text style={theme.styles.fontNormal}>, </Text>
                  )}
                </Text>
              );
            });
          },
        },
      ],
    },
  ] as ProjectInfoSectionListData;
}
