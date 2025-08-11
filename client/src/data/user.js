// data to test.
export const userData = {
  id: 1,
  name: "some name ",
  email: "something@email",
  phone: "+91 11111111",
  address: {
    street: "crazy street ",
    city: "no home",
    pincode: "232323"
  },
  isLoggedIn: true
};
export const getUserData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userData);
    }, 100);
  });
};