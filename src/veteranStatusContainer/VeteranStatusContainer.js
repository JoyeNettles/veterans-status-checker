import { whisper } from '@oliveai/ldk';
import { DateTimeType } from '@oliveai/ldk/dist/whisper/types';
import { vaService } from '../aptitudes';

export default class VeteranStatusContainer {
  constructor() {
    this.whisper = undefined;
    this.label = 'Veteran Status Checker';
    this.props = {
      fName: '',
      mName: '',
      lName: '',
      gender: '',
      bday: '',
      ssn: '',
    };
  }

  update(props) {
    this.props = { ...this.props, ...props };
    this.whisper.update({
      components: this.createVeteranStatusFormComponents(),
    });
  }

  createNameComponents() {
    const fNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'First Name*',
      onChange: (_error, val) => {
        console.log('Updating message text: ', val);
        this.update({ fName: val });
      },
    };
    const mNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Middle Name',
      onChange: (_error, val) => {
        console.log('Updating message text: ', val);
        this.update({ mName: val });
      },
    };
    const lNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Last Name*',
      onChange: (_error, val) => {
        console.log('Updating message text: ', val);
        this.update({ lName: val });
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

    const genderOptions = ['Prefer Not to Answer', 'Male', 'Female'];
    const genderInput = {
      type: whisper.WhisperComponentType.Select,
      label: 'Gender',
      options: genderOptions,
      selected: 0,
      onSelect: (_error, val) => {
        console.log('option selected: ', val);
        if (val > 0) {
          this.update({ gender: val === 1 ? 'M' : 'F' });
        }
      },
    };

    const birthdayInput = {
      type: whisper.WhisperComponentType.DateTimeInput,
      label: 'Birthday*',
      dateTimeType: DateTimeType.DateTime,
      onChange: (_error, val) => {
        console.log('Birthday changed: ', val);
        this.update({ bday: val });
      },
    };

    // should make sure we handle formatting issue
    const ssn = {
      type: whisper.WhisperComponentType.Password,
      label: 'Social Security Number*',
      onChange: (_error, val) => {
        console.log('SSN changed: ', val);
        this.update({ ssn: val });
      },
    };

    const submitButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Verify Status',
      onClick: async () => {
        console.log('Submit Button Clicked');
        await this.fetchStatus();
      },
    };

    return [requiredInfoHeader, nameRow, genderInput, birthdayInput, ssn, submitButton];
  }

  async fetchStatus() {
    const { fName, mName, lName, gender, bday, ssn } = this.props;
    console.log('PROPS', fName);

    await vaService
      .fetchVeteransStatus({
        ssn,
        gender,
        last_name: lName,
        birth_date: bday,
        first_name: fName,
        middle_name: mName,
      })
      .then((veteranStatus) => {
        console.log('***SUCCESS***', veteranStatus);
        // this.props.newMessage = veteranStatus;
      })
      .catch((e) => console.log('******ERROR******', e));
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
