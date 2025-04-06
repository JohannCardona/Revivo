import axios from "axios";
import { handleUserRegister } from "./account_api";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("signup function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should trigger signup_alert and call Swal.fire with the correct title if user is empty", () => {
    const newUser = "";
    handleUserRegister(newUser);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Username must not be empty",
      })
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("should call axios.post with user data and call Swal.fire on 201 status", async () => {
    const newUser = "testuser";
    const response = { status: 201 };
    axios.post.mockResolvedValue(response);

    handleUserRegister(newUser);

    await Promise.resolve();

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/register", {
      newUser: newUser,
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "That was easy. Let's head to the login.",
      })
    );
  });

  it("should call Swal.fire with short username error", async () => {
    const errorResponse = {
      response: {
        data: { result: "Username must be at least three characters long" },
      },
    };
    axios.post.mockRejectedValue(errorResponse);

    await handleUserRegister("ab");

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Username must be at least three characters long",
      })
    );
  });

  it("should call Swal.fire with taken username error", async () => {
    const errorResponse = {
      response: {
        data: { result: "Username taken" },
      },
    };
    axios.post.mockRejectedValue(errorResponse);

    await handleUserRegister("johann"); 

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Username taken",
      })
    );
  });
});
