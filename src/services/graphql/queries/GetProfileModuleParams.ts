import { gql } from '@apollo/client';

const GetProfileModuleParamsDocument = gql`
  query Params @api(name: desmos) {
    params: profiles_params {
      params
    }
  }
`;

export default GetProfileModuleParamsDocument;
