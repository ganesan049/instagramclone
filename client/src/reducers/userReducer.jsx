export const initialState = null;

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "UPDATE":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "UPDATEIMG":
      return {
        ...state,
        url: action.payload,
      };
    case "CLEAR":
      return null;
    default:
      return state;
  }
};
