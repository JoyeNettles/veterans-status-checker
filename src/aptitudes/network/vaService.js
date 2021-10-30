import { network } from '@oliveai/ldk';
import { oneLine } from 'common-tags';
import { NetworkWhisper } from '../../whispers';

const fetchVeteransStatus = async (body) => {

  const request = {
    method: 'POST',
    url: oneLine`https://sandbox-api.va.gov/services/veteran_confirmation/v0/status`,
    headers: {
      apiKey: ['WTL49eehXWUdgqGmDOgs2kErBNcm8c3f'],
      'Content-Type': ['application/json'],
    },
    body: JSON.stringify(body),
  };

  const response = await network.httpRequest(request);
  const decodedBody = await network.decode(response.body);
  const parsedObject = JSON.parse(decodedBody);

  const whisper = new NetworkWhisper(parsedObject.veteran_status); // don't like that this is a popup!! how do you pass info
  whisper.show();
};

export default { fetchVeteransStatus };
