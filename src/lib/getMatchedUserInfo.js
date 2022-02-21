const getMatchedUserInfo = (users, userLoggedIn) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];

  // flatten or make the object to not nested object
  const [id, user] = Object.entries(newUsers).flat();

  // returns one object(one user info from matched users)
  return { id, ...user };
};

export default getMatchedUserInfo;
