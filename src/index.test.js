jest.mock('@oliveai/ldk');

const mockIntroShow = jest.fn();
jest.mock('./whispers', () => {
  return {
    IntroWhisper: jest.fn().mockImplementation(() => {
      return { show: mockIntroShow };
    }),
  };
});

describe('Project Startup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start the Intro whisper on startup', () => {
    // eslint-disable-next-line global-require
    require('.');

    expect(mockIntroShow).toBeCalled();
  });
});
