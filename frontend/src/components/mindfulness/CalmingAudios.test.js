import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AudioPlayer from "./CalmingAudios";

describe("Calming Audios Component", () => {
  test("renders each of the Listen Now buttons in Audios component", () => {
    render(<AudioPlayer />);
    const listenNowToggleButtons = screen.getAllByText("Listen Now");
    expect(listenNowToggleButtons).toHaveLength(12);
  });

  test("toggles audio controls visibility", () => {
    render(<AudioPlayer />);
    const toggleButton = screen.getAllByText("Listen Now")[0];
    fireEvent.click(toggleButton);
  });

  test("closes audio controls section", () => {
    render(<AudioPlayer />);
    const toggleListenNowButton = screen.getAllByText("Listen Now")[0];
    fireEvent.click(toggleListenNowButton);

    const pauseButton = screen.getByTestId("CloseIcon");
    fireEvent.click(pauseButton);
  });
});
