export const userInfos = (user) => {
  const formatedUser = {
    id: user._id,
    userName: user.userName,
    role: user.role,
    firstConnection: user.firstConnection,
    domain: user.domain,
    groupe: user.groupe,
    theme: user.theme,
    todosAssigned: user.todosAssigned,
  };
  return formatedUser;
};
