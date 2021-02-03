import MockDate from "mockdate";

import { Project } from "../Project";

const TEMPLATE_PROJECT = {
  _apiRequestErrorMessage: null,
  _apiRequestState: "stale" as const,
  dateCreated: "2021-01-30T08:11:00+0000",
  dateDue: "2021-02-02T10:00:00+0000",
  id: "21157460",
  internalId: 4,
  name: "Fourth Project",
  sourceLang: "pl",
  status: "NEW" as const,
  targetLangs: ["sk_sk"],
  uid: "p1",
};
const FAKE_PROJECTS = {
  p1: TEMPLATE_PROJECT,
  p2: {
    ...TEMPLATE_PROJECT,
    dateDue: "2021-02-21T15:00:00+0000",
  },
  p3: {
    ...TEMPLATE_PROJECT,
    dateDue: "2021-02-20T12:01:00+0000",
  },
  p4: {
    ...TEMPLATE_PROJECT,
    dateDue: "2021-02-05T11:59:00+0000",
  },
  p5: {
    ...TEMPLATE_PROJECT,
    dateDue: "2021-02-05T13:01:00+0000",
  },
};

describe("ProjectStore Model tests", () => {
  it("Test isBeforeDue() view", () => {
    MockDate.set("2021-02-02T12:00:00+0000");

    let project = Project.create(FAKE_PROJECTS.p1);
    // test due before current date
    expect(project.isBeforeDue(4)).toBeFalsy();
    // is true for anyDueDate
    expect(project.isBeforeDue("anyDueDate")).toBeTruthy();

    // test due long after dueDate filter
    project = Project.create(FAKE_PROJECTS.p2);
    expect(project.isBeforeDue(4)).toBeFalsy();
    project = Project.create(FAKE_PROJECTS.p3);
    expect(project.isBeforeDue(4)).toBeFalsy();

    // test due very close to due filter from left
    project = Project.create(FAKE_PROJECTS.p4);
    expect(project.isBeforeDue(72)).toBeTruthy();

    // test due very close to due filter from right
    project = Project.create(FAKE_PROJECTS.p5);
    expect(project.isBeforeDue(72)).toBeFalsy();

    MockDate.reset();
  });
});
