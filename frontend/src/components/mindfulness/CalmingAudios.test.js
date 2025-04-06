import { handleAudioDurationFormat } from "./AudioDurationFormatter";

describe("handleAudioDurationFormat", () => {
  it("should format 0 seconds as '0:00'", () => {
    expect(handleAudioDurationFormat(0)).toBe("0:00");
  });

  it("should format 90 seconds as '1:30'", () => {
    expect(handleAudioDurationFormat(90)).toBe("1:30");
  });

  it("should format 330 seconds as '5:30'", () => {
    expect(handleAudioDurationFormat(330)).toBe("5:30");
  });

  it("should format 841 seconds as '14:01'", () => {
    expect(handleAudioDurationFormat(841)).toBe("14:01");
  });

  it("should format 3599 seconds as '59:59'", () => {
    expect(handleAudioDurationFormat(3599)).toBe("59:59");
  });
});
