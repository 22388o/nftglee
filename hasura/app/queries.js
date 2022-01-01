module.exports = {
  getTransactionUser: `query {
    transactions_by_pk(id: $id) {
      user_id
    }
  }`,
  getCurrentUser: `query {
    currentuser {
      id
      address
      multisig
      last_seen_tx
    }
  }`,
  cancelBid: `mutation ($id: uuid!) {
    update_transactions_by_pk(
      pk_columns: { id: $id },
      _set: {
        type: "cancelled_bid"
      }
    ) {
     id
    }
  }`,
  createTransaction: `mutation create_transaction($transaction: transactions_insert_input!) {
    insert_transactions_one(object: $transaction) {
      id,
      artwork_id
    }
  }`,
  updateViews: `mutation ($id: uuid!) {
    update_artworks_by_pk(pk_columns: { id: $id }, _inc: { views: 1 }) {
      id
      owner {
        address
        multisig
      }
      asset
    }
  }`,
  setHeld: `mutation ($id: uuid!, $held: String!) {
    update_artworks_by_pk(pk_columns: { id: $id }, _set: { held: $held }) {
      id
      owner {
        address
        multisig
      }
      asset
    }
  }`,
  setOwner: `mutation($id: uuid!, $owner_id: uuid!) {
    update_artworks_by_pk(
      pk_columns: { id: $id },
      _set: {
        owner_id: $owner_id,
      }
    ) {
      id
    }
  }`,
  getTransactionArtwork: `query($id: uuid!) {
    artworks(where: { id: { _eq: $id }}) {
      auction_start
      auction_end
      bid_increment
      owner {
        display_name
      }
      title
      slug
      bid {
        amount
        user {
          id
          display_name
        }
      }
    }
  }`,
  setRelease: `mutation($id: uuid!, $psbt: String!) {
    update_artworks_by_pk(
      pk_columns: { id: $id },
      _set: {
        auction_release_tx: $psbt,
      }
    ) {
      id
    }
  }`,
  setPsbt: `mutation update_transaction($id: uuid!, $psbt: String!) {
    update_transactions_by_pk(
      pk_columns: { id: $id },
      _set: {
        psbt: $psbt,
      }
    ) {
      id
    }
  }`,
  acceptBid: `mutation update_artwork(
    $id: uuid!,
    $owner_id: uuid!,
    $amount: Int!,
    $psbt: String!,
    $asset: String!,
    $hash: String!,
    $bid_id: uuid
  ) {
    update_artworks_by_pk(
      pk_columns: { id: $id },
      _set: {
        owner_id: $owner_id,
      }
    ) {
      id
    }
    insert_transactions_one(object: {
      artwork_id: $id,
      asset: $asset,
      type: "accept",
      amount: $amount,
      hash: $hash,
      psbt: $psbt,
      bid_id: $bid_id,
    }) {
      id,
      artwork_id
    }
  }`,
  updateUser: `mutation update_user($user: users_set_input!, $id: uuid!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: $user) {
      id
    }
  }`,
  getAvatars: `query { users { id, avatar_url }}`,
  getActiveBids: `query {
    activebids(where: { type: { _eq: "bid" }}) {
      id
      artwork_id
      psbt
    }
  }`,
  getActiveListings: `query {
    activelistings {
      id
      artwork_id
      psbt
    }
  }`,
  cancelListing: `mutation ($id: uuid!, $artwork_id: uuid!) {
    update_artworks_by_pk(
      pk_columns: { id: $artwork_id }, 
      _set: { 
        list_price: null,
        list_price_tx: null
      }
    ) {
     id
    }
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        type: "cancelled_listing"
      }
    ) {
     id
    }
  }`,
  getUnconfirmed: `query {
    transactions(where: {
      confirmed: {_eq: false},
      type: {_in: ["purchase", "creation", "royalty", "accept", "release", "auction", "cancel"] },
    }) {
      id
      hash
      bid {
        id
      } 
    }
  }`,
  getLastTransaction: `query($artwork_id: uuid!) { 
    transactions(
      where: { artwork_id: { _eq: $artwork_id }},
      order_by: { created_at: desc }, 
      limit: 1
    ) {
      created_at
    }
  }`,
  getContract: `query transactions($asset: String!) {
    transactions(where: {
      _and: [{
          artwork: {
            asset: { _eq: $asset }
          }
        },
        {
          type: {
            _eq: "creation"
          }
        }
      ]
    }) {
      contract
    } 
  }`,
  getChainTxs: `query($id: uuid!) {
    transactions(order_by: {created_at: desc}, where: {
      user_id: {_eq: $id}, 
      type: {_in: ["deposit", "withdrawal"]}
    }) {
      id
      hash
      amount
      created_at
      asset
      type
    }
  }`,
  setTransactionTime: `mutation($id: uuid!, $created_at: timestamptz!) {
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { created_at: $created_at }
    ) {
      id
    }
  }`,
  setConfirmed: `mutation setConfirmed($id: uuid!) {
    update_transactions_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        confirmed: true
      }
    ) {
      id
      user_id
      artwork_id
      hash
      psbt
      type
      asset
      contract
      artwork {
        owner_id
        editions
        asset
      }
      user {
        username
      } 
      bid {
        id
        user_id
      } 
    }
  }`,
};
