export const omit = (obj, props) => {
  const keys = Object.keys(obj);
  const newObj = {};

  keys.forEach((key) => {
    if (key !== props) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};
