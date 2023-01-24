import React from 'react';
import { ApplicationLink } from 'types/desmos';
import { View } from 'react-native';
import ApplicationLinkItem from 'screens/Profile/components/ApplicationLinkItem';
import { isApplicationSupported } from 'lib/ApplicationLinksUtils';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

export interface ApplicationLinksProps {
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
