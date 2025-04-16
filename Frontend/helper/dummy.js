const routes = {
  register: {
    api: "register",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Enter your name",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter email",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter password",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm password",
      },
    ],
  },
  login: {
    api: "login",
    fields: [
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter email",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter password",
      },
    ],
  },
};

export default routes;
