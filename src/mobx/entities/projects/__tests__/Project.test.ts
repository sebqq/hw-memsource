import MockDate from "mockdate";

import { Project } from "../Project";

const FAKE_PROJECTS = {
  p1: {
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
  },
  p2: {
    _apiRequestErrorMessage: null,
    _apiRequestState: "stale" as const,
    dateCreated: "2021-01-31T15:47:39+0000",
    dateDue: "2021-02-21T15:00:00+0000",
    id: "21158755",
    internalId: 13,
    name: "Eleventh project name",
    sourceLang: "hr",
    status: "NEW" as const,
    targetLangs: ["cs_cz"],
    uid: "p2",
  },
  p3: {
    _apiRequestErrorMessage: null,
    _apiRequestState: "stale" as const,
    dateCreated: "2021-01-30T08:10:17+0000",
    dateDue: "2021-02-20T12:01:00+0000",
    id: "21157458",
    internalId: 3,
    name: "Third Project",
    sourceLang: "cs",
    status: "NEW" as const,
    targetLangs: ["fr_fr"],
    uid: "p3",
  },
  p4: {
    _apiRequestErrorMessage: null,
    _apiRequestState: "stale" as const,
    dateCreated: "2021-01-30T08:10:17+0000",
    dateDue: "2021-02-05T11:59:00+0000",
    id: "21157458",
    internalId: 3,
    name: "Third Project",
    sourceLang: "cs",
    status: "NEW" as const,
    targetLangs: ["fr_fr"],
    uid: "p4",
  },
  p5: {
    _apiRequestErrorMessage: null,
    _apiRequestState: "stale" as const,
    dateCreated: "2021-01-30T08:10:17+0000",
    dateDue: "2021-02-05T13:01:00+0000",
    id: "21157458",
    internalId: 3,
    name: "Third Project",
    sourceLang: "cs",
    status: "NEW" as const,
    targetLangs: ["fr_fr"],
    uid: "p4",
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
