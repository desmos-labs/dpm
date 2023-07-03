import { makeStyleWithProps } from 'config/theme';
import { SingleButtonModalParams } from 'modals/SingleButtonModal/index';

const useStyles = makeStyleWithProps((props: SingleButtonModalParams, theme) => ({
  image: {
    alignSelf: 'center',
    width: 200,
    height: 100,
  },
  title: {
    textAlign: 'center',
    marginTop: props.image ? theme.spacing.l : undefined,
  },
  message: {
    textAlign: 'center',
    marginTop: theme.spacing.l,
  },
  button: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyles;
