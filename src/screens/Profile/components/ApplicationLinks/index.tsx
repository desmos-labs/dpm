import React from 'react';
import { ApplicationLink } from 'types/desmos';
import { View } from 'react-native';
import ApplicationLinkItem from 'screens/Profile/components/ApplicationLinkItem';
import { isApplicationSupported } from 'lib/ApplicationLinksUtils';
import useStyles from './useStyles';

export interface ApplicationLinksProps {
  readonly loading: boolean;
  readonly applicationLinks: ApplicationLink[];
  readonly canEdit: boolean;
}

const ApplicationLinks = (props: ApplicationLinksProps) => {
  const styles = useStyles();
  const { applicationLinks } = props;

  // Filter the application links to only show the supported ones (forward compatibility)
  const supportedApplicationLinks = applicationLinks.filter(isApplicationSupported);
  const hasApplicationLinks = supportedApplicationLinks.length !== 0;

  // Return a default empty view if there are no application links
  if (!hasApplicationLinks) {
    return <View />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.applicationLinksContainer}>
        {supportedApplicationLinks.map((link) => (
          <ApplicationLinkItem link={link} key={link.application + link.username} />
        ))}
      </View>
    </View>
  );
};

export default ApplicationLinks;
