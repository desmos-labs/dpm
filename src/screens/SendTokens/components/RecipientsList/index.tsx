import React, { forwardRef, useImperativeHandle } from 'react';
import { Dimensions, View } from 'react-native';
import { useProfilesFromNickNameOrDtag } from 'screens/SendTokens/components/RecipientsList/hooks';
import { FlashList } from '@shopify/flash-list';
import StyledRefreshControl from 'components/StyledRefreshControl';
import { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';
import { DesmosProfile } from 'types/desmos';
import ProfileListItem from 'components/ProfileListItem';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import Divider from 'components/Divider';
import useStyles from './useStyles';

export interface RecipientsListProps {
  /**
   * Ref to the view where this component will attach to.
   */
  readonly attachTo: React.RefObject<View>;
  /**
   * The value that will be used to perform the search.
   */
  readonly searchValue: string;
  /**
   * Callback called when the user pres on one of the item displayed.
   */
  readonly onSelect?: (profile: DesmosProfile) => any;
}

/**
 * Interface that represents the type of this component reference.
 */
export interface RecipientsListRef {
  readonly hide: () => void;
}

/**
 * Interface that represents the information
 * on how to render the component.
 */
interface ComponentDimensions {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Components that displays a list of profiles that have the
 * nickname or DTag that contains the provided `searchValue`.
 */
const RecipientsList = forwardRef<RecipientsListRef, RecipientsListProps>(
  ({ attachTo, searchValue, onSelect }, ref) => {
    const styles = useStyles();

    // -------- STATES --------

    const [location, setLocation] = React.useState<ComponentDimensions>();
    const [hidden, setHidden] = React.useState(false);

    // -------- VARIABLES --------

    const searchValueIsAddress = React.useMemo(
      () => searchValue.indexOf('desmos1') === 0,
      [searchValue],
    );

    // -------- HOOKS --------

    useImperativeHandle(ref, () => ({
      hide: () => setHidden(true),
    }));

    const { data, loading, refresh, refreshing, fetchMore, updateFilter } =
      useProfilesFromNickNameOrDtag();

    // -------- CALLBACKS --------

    const onProfileItemPressed = React.useCallback(
      (profile: DesmosProfile) => {
        // Hide this component when the user press on an item.
        setHidden(true);
        if (onSelect) {
          onSelect(profile);
        }
      },
      [onSelect],
    );

    const renderProfile = React.useCallback<ListRenderItem<DesmosProfile>>(
      ({ item }) => <ProfileListItem profile={item} onPress={onProfileItemPressed} />,
      [onProfileItemPressed],
    );

    // -------- EFFECTS --------

    React.useEffect(() => {
      attachTo.current?.measure((x, y, width, height) => {
        // Don't update the location if one of those values is undefined.
        if (x === undefined || y === undefined || width === undefined || height === undefined) {
          return;
        }

        setLocation({
          x,
          y: y + height + 48,
          width: width + 16,
          height: Dimensions.get('window').height * 0.4,
        });
      });

      // Safe to ignore, we want to exec this effect each time the
      // value of attachTo reference changes to have the location of the
      // attachTo ref.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attachTo?.current]);

    React.useEffect(() => {
      updateFilter(searchValue);
      // If the value has changed after the user have selected an
      // item re-display this component.
      setHidden(false);
    }, [searchValue, updateFilter]);

    // Prevent component rendering if:
    // - We don't have the component location.
    // - The search value is an address.
    if (data.length === 0 || hidden || location === undefined || searchValueIsAddress) {
      return null;
    }

    return location ? (
      <View
        style={[
          styles.root,
          {
            top: location.y,
            left: location.x,
            width: location.width,
            height: location.height,
          },
        ]}
      >
        <FlashList
          data={data}
          renderItem={renderProfile}
          refreshControl={<StyledRefreshControl refreshing={refreshing} onRefresh={refresh} />}
          onEndReached={fetchMore}
          ItemSeparatorComponent={Divider}
          ListFooterComponent={loading ? <StyledActivityIndicator /> : null}
          estimatedItemSize={77}
        />
      </View>
    ) : null;
  },
);

export default RecipientsList;
