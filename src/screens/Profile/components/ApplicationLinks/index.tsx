import React from 'react';
import { ApplicationLink } from 'types/desmos';
import { View } from 'react-native';
import ApplicationLinkItem from 'screens/Profile/components/ApplicationLinkItem';
import { isApplicationSupported } from 'lib/ApplicationLinksUtils';
import Spacer from 'components/Spacer';
import { Circle } from 'react-content-loader/native';
import ThemedContentLoader from 'components/ThemedContentLoader';
import useStyles from './useStyles';

interface ApplicationLinksProps {
  readonly applicationLinks: ApplicationLink[];
  readonly canEdit: boolean;

  readonly loading?: boolean;
}

const ApplicationLinks = (props: ApplicationLinksProps) => {
  const styles = useStyles();
  const { applicationLinks, loading } = props;

  // Filter the application links to only show the supported ones (forward compatibility)
  const supportedApplicationLinks = applicationLinks.filter(isApplicationSupported);
  const hasApplicationLinks = supportedApplicationLinks.length !== 0;

  if (loading) {
    return (
      <ThemedContentLoader width="100" height="30">
        <Circle r="14" x="16" y="16" />
        <Circle r="14" x="46" y="16" />
        <Circle r="14" x="78" y="16" />
      </ThemedContentLoader>
    );
  }

  // Return a default empty view if there are no application links
  if (!hasApplicationLinks) {
    return <View />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.applicationLinksContainer}>
        {supportedApplicationLinks.map((link, index) => (
          <View style={styles.applicationLinkContainer} key={link.application + link.username}>
            <ApplicationLinkItem link={link} key={link.application + link.username} />
            {index < supportedApplicationLinks.length - 1 && <Spacer paddingHorizontal={4} />}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ApplicationLinks;
