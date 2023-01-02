import {gql} from '@apollo/client';

const GetAccountBalance = gql`
  query Balance($address: String!, $tokenName: String!) @api(name: forbole) {
    action_account_balance(address: $address) {
      coins
    }
    token_price(where: {unit_name: {_ilike: $tokenName}}) {
      price
    }
  }
`;

export default GetAccountBalance;
