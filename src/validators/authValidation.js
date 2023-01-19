export default class AuthValidation {

    signinValidation(details) {
    let signinBody = {
      email: details.body.email,
      password: details.body.password,
    };
    let err = [];
    if (!signinBody.email) {
      err.push("email: Email is required");
    }
    if (!signinBody.password) {
      err.push("password:Password is required");
    }

    return err;
  }
}
