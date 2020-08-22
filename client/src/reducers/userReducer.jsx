export const initialState = null;

export const reducer = (state = initialState, { type, payload }) => {
  console.log(type, payload);
  switch (type) {
    case "USER":
      return payload;
    case "UPDATE":
      console.log(payload);
      return {
        ...state,
        // payload,
        followers: payload.followers,
        following: payload.following,
      };
    case "UPDATEIMG":
      return {
        ...state,
        url: payload,
      };
    case "CLEAR":
      return null;
    default:
      return state;
  }
};
