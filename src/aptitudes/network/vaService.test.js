import { network } from '@oliveai/ldk';
import { oneLine } from 'common-tags';
import vaService from './vaService';

jest.mock('@oliveai/ldk');

describe('VA Service Call', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should make properly formatted network request and return veteran_status', async () => {
    const responseStub = {
      statusCode: 200,
      body: { veteran_status: 'confirmed' },
      headers: {},
    };
    const responseBodyStub = { veteran_status: 'confirmed' };
    network.httpRequest = jest.fn().mockResolvedValueOnce(responseStub);
    network.decode = jest.fn().mockResolvedValueOnce(JSON.stringify(responseBodyStub));

    const response = await vaService.fetchVeteransStatus({
      first_name: 'Joye',
    });

    expect(network.httpRequest).toBeCalledWith({
      method: 'POST',
      url: oneLine`https://sandbox-api.va.gov/services/veteran_confirmation/v0/status`,
      headers: {
        apiKey: expect.arrayContaining([expect.any(String)]),
        'Content-Type': expect.arrayContaining([expect.any(String)]),
      },
      body: expect.stringContaining('first_name'),
    });

    expect(network.decode).toBeCalledWith(responseStub.body);
    expect(response).toBe('confirmed');
  });

  it('should make properly formatted network request and return undefined when no status found on response', async () => {
    const responseStub = {
      statusCode: 500,
      headers: {},
    };
    const responseBodyStub = { something_else: 'blah' };
    network.httpRequest = jest.fn().mockResolvedValueOnce(responseStub);
    network.decode = jest.fn().mockResolvedValueOnce(JSON.stringify(responseBodyStub));

    const response = await vaService.fetchVeteransStatus({
      first_name: 'Joye',
    });

    expect(response).toBe(undefined);
  });
});
