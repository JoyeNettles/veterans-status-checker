jest.mock('@oliveai/ldk');

const mockIntroShow = jest.fn();
jest.mock('./veteranStatusContainer', () => {
  return {
    VeteranStatusContainer: jest.fn().mockImplementation(() => {
      return { show: mockIntroShow };
    }),
  };
});

describe('On Startup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start the Veteran Status whisper on startup', () => {
    // eslint-disable-next-line global-require
    require('.');

    expect(mockIntroShow).toBeCalled();
  });
});
