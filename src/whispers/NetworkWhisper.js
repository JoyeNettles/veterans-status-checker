import { whisper } from '@oliveai/ldk';

export default class NetworkWhisper {
  constructor(veteranStatus) {
    this.whisper = undefined;
    this.label = 'Patient Veteran Status';
    this.props = {
      veteranStatus,
    };
  }

  createComponents() {
    const CONFIRMED_STATUS = 'confirmed';
    const UNCONFIRMED_STATUS = 'not confirmed';

    const { veteranStatus } = this.props;

    return [
      {
        type: whisper.WhisperComponentType.Message,
        body: `This patient's veteran status is ${
          veteranStatus === UNCONFIRMED_STATUS ? 'unconfirmed' : 'confirmed'
        }.`,
        style:
          veteranStatus === CONFIRMED_STATUS ? whisper.Urgency.Success : whisper.Urgency.Warning,
      },
    ];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: NetworkWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(NetworkWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Network whisper', err);
    }
    console.log('Network whisper closed');
  }
}
