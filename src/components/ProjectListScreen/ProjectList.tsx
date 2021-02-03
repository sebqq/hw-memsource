import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";

import { useStore } from "../../mobx/useStore";
import ProjectListItem from "./ProjectListItem";
import { RootStackParamList } from "../../navigation/RootStack";
import ProjectListFilters from "./ProjectListFilters";
import { DueInHoursType } from "./useDueFilterReducer";
import ProjectListEmptyItem from "./ProjectListEmptyItem";
import ContainerLoadingIndicator from "../Loading/ContainerLoadingIndicator";
import theme from "../../utils/theme";
import ProjectListSeparator from "./ProjectListSeparator";

type NavProp = NavigationProp<RootStackParamList, "LoginScreen">;
type Props = {
  initDueFilter?: DueInHoursType;
};

const REFRESH_CONTROL_COLORS = [theme.colors.blue[200], theme.colors.blue[300]];

const keyExtractor = (uid: string) => {
  return `ms-project-key-${uid}`;
};

const ProjectList: React.FC<Props> = ({ initDueFilter = "anyDueDate" }) => {
  const navigation = useNavigation<NavProp>();
  const { projectStore } = useStore();

  /**
   * We will use controlled-state for filters in order to quickly react
   * whenever filter is changed in children component.
   */
  const [dueInHoursFilter, setDueFilter] = useState<DueInHoursType>(
    initDueFilter
  );
  const page = projectStore.pageNumber;
  const canMovePage = projectStore.totalPages > projectStore.pageNumber;
  const [refresh, setRefresh] = useState(false);
  const [listData, setListData] = useState<string[]>([]);

  /**
   * Fetch API data through mobx action to build mobx state tree with projects.
   */
  const fetchApiData = useCallback(
    async (page: number = 0) => {
      await projectStore.getAll(page, dueInHoursFilter);
    },
    [dueInHoursFilter]
  );

  /**
   * We are listening for mobx content size here. Whenever we have some new
   * project or some other was deleted, then we should provide list new data.
   *
   * We are providing only uids here, so when data inside of already existing
   * projects are changed, then the change is going to take effect directly
   * iniside relevant ProjectListItem component.
   */
  useEffect(() => {
    const filteredProjects = projectStore.getFilteredProjectsUids(
      dueInHoursFilter
    );
    setListData(filteredProjects);
  }, [dueInHoursFilter, projectStore.content.size]);

  /**
   * When User reaches specified treshold, we want to try to fetch
   * next page from remote API. We're also setting 'refresh' value
   * so it will not trigger "Loading" component, which should be
   * only visible during initial data fetching or filtering.
   */
  const onEndReached = useCallback(async () => {
    if (canMovePage) {
      setRefresh(true);
      await fetchApiData(page + 1);
      setRefresh(false);
    }
  }, [page, canMovePage, fetchApiData]);

  /**
   * When user triggers pull-to-refresh manually, we re-fetch initial
   * data from remote API server. Basically, we will start with fetch for
   * page 0 and as the user continues scrolling down the list all other pages
   * are going to be re-fetched automatically thanks to this approach.
   */
  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchApiData();
    setRefresh(false);
  }, [fetchApiData]);

  useEffect(() => {
    if (dueInHoursFilter !== initDueFilter) {
      setDueFilter(initDueFilter);
    }
  }, [initDueFilter]);

  /**
   * Initial data fetching and/or fetching when filter is changed.
   */
  useEffect(() => {
    (async () => fetchApiData())();
  }, [fetchApiData]);

  const onItemPressed = useCallback((uid: string, name: string) => {
    navigation.navigate("ProjectScreen", { uid, name });
  }, []);

  const renderItem = useCallback(
    ({ item }) => <ProjectListItem uid={item} onPress={onItemPressed} />,
    [onItemPressed]
  );

  const renderHeader = useCallback(
    () => (
      <ProjectListFilters
        dueInHours={dueInHoursFilter}
        setDueFilter={setDueFilter}
      />
    ),
    [dueInHoursFilter]
  );

  const renderEmptyItem = useCallback(
    () => <ProjectListEmptyItem dueInHours={dueInHoursFilter} />,
    [dueInHoursFilter]
  );

  const renderSeparator = useCallback(() => <ProjectListSeparator />, []);

  /**
   * We are not gonna do much of premature optimizations here.
   *
   * If we hit performance problems here we could always use official guide to
   * tweak List properties and/or provide custom getItemLayout function if possible.
   *
   * https://reactnative.dev/docs/optimizing-flatlist-configuration
   */
  return (
    <>
      <FlatList
        data={listData}
        refreshControl={
          <RefreshControl
            colors={REFRESH_CONTROL_COLORS}
            tintColor={REFRESH_CONTROL_COLORS[0]}
            refreshing={refresh}
            onRefresh={onRefresh}
          />
        }
        refreshing={refresh}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyItem}
      />
      {projectStore.requestState.state === "pending" && !refresh && (
        <ContainerLoadingIndicator text="Loading..." />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.styles.flexGrow,
    paddingBottom: 15,
  },
});

export default observer(ProjectList);
