import { gql } from '@apollo/client';

const GetTokensPrices = gql`
  query GetTokenPrice($denoms: [String!]) @api(name: forbole) {
    tokens: token(where: { token_units: { denom: { _in: $denoms } } }) {
      units: token_units {
        denom
        exponent
        price: token_price {
          price
        }
      }
    }
  }
`;

export default GetTokensPrices;
