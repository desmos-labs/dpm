import {gql} from '@apollo/client';

const GetDesmosParams = gql`
  query GetDesmosParams @api(name: desmos) {
    posts_params {
      params
    }
    profiles_params {
      params
    }
  }
`;

export default GetDesmosParams;
