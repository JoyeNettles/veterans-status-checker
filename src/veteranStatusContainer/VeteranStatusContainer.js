import { whisper } from '@oliveai/ldk';
import { DateTimeType } from '@oliveai/ldk/dist/whisper/types';

export default class VeteranStatusContainer {
  constructor() {
    this.whisper = undefined;
    this.label = 'Veteran Status Checker';
    this.props = {
      newMessage: '',
      numClones: 1,
      label: '',
    };
  }

  createNameComponents() {
    const fNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'First Name*',
      onChange: (_error, val) => {
        console.log('Updating message text: ', val);
      },
    };
    const mNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Middle Name',
      onChange: (_error, val) => {
        console.log('Updating message text: ', val);
      },
    };
    const lNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Last Name*',
      onChange: (_error, val) => {
        console.log('Updating message text: ', val);
      },
    };
    const nameRow = {
      type: whisper.WhisperComponentType.Box,
      children: [fNameInput, mNameInput, lNameInput],
      direction: whisper.Direction.Horizontal,
      justifyContent: whisper.JustifyContent.SpaceEvenly,
    };
    return nameRow;
  }

  createVeteranStatusFormComponents() {
    const requiredInfoHeader = {
      type: whisper.WhisperComponentType.Message,
      header: 'Patient Information',
      body: 'Please complete the fields below to check the veteran status of your patient. Required fields are indicated with an asterik (*).',
    };
    const nameRow = this.createNameComponents();

    const genderInput = {
      type: whisper.WhisperComponentType.Select,
      label: 'Gender',
      options: ['Prefer Not to Answer', 'Male', 'Female'],
      selected: 0,
      onSelect: (_error, val) => {
        console.log('option selected: ', val);
      },
    };

    const birthdayInput = {
      type: whisper.WhisperComponentType.DateTimeInput,
      label: 'Birthday*',
      dateTimeType: DateTimeType.DateTime,
      onChange: (_error, val) => {
        console.log('Birthday changed: ', val);
      },
    };

    // should make sure we handle formatting issue
    const ssn = {
      type: whisper.WhisperComponentType.Password,
      label: 'Social Security Number*',
      onChange: (_error, val) => {
        console.log('SSN changed: ', val);
      },
    };

    const submitButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Verify Status',
      onClick: () => {
        console.log('Submit Button Clicked');
      },
    };

    return [requiredInfoHeader, nameRow, genderInput, birthdayInput, ssn, submitButton];
  }

  show() {
    whisper
      .create({
        components: this.createVeteranStatusFormComponents(),
        label: this.label,
        onClose: VeteranStatusContainer.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  update(props) {
    this.props = { ...this.props, ...props };
    this.whisper.update({
      label: this.props.label || this.label,
      components: this.createComponents(),
    });
  }

  close() {
    this.whisper.close(VeteranStatusContainer.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Intro whisper', err);
    }
    console.log('Intro whisper closed');
  }
}
