import {whisper} from '@oliveai/ldk';
import {DateTimeType} from '@oliveai/ldk/dist/whisper/types';
import {vaService} from '../aptitudes';

export default class VeteranStatusContainer {
  static CONFIRMED_STATUS = 'confirmed';
  static UNCONFIRMED_STATUS = 'not confirmed';

  constructor() {
    this.whisper = undefined;
    this.label = 'Veteran Status Checker';
    this.props = {
      fName: '',
      mName: '',
      lName: '',
      bday: '',
      ssn: '',
      label: '',
      veteranStatus: '',
      errorMessage: '',
    };
  }

  update(updateFields) {
    this.props = { ...this.props, ...updateFields };
    this.whisper.update({
      label: this.props.label || this.label,
      components: this.createVeteranStatusFormComponents(),
    });
  }

  createErrorComponent() {
    const { errorMessage } = this.props;

    return {
      type: whisper.WhisperComponentType.Message,
      body: errorMessage || 'Sorry! There was an error.',
      style: whisper.Urgency.Error,
    };
  }

  createVeteranStatusComponent() {
    const { veteranStatus } = this.props;

    return {
      type: whisper.WhisperComponentType.Message,
      body: `This patient's veteran status is ${
        veteranStatus === VeteranStatusContainer.UNCONFIRMED_STATUS ? 'unconfirmed' : 'confirmed'
      }.`,
      style:
        veteranStatus && veteranStatus === VeteranStatusContainer.CONFIRMED_STATUS
          ? whisper.Urgency.Success
          : whisper.Urgency.Warning,
    };
  }

  createNameComponents() {
    const fNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'First Name*',
      onChange: (_error, val) => {
        this.update({ fName: val });
      },
    };
    const mNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Middle Name',
      onChange: (_error, val) => {
        this.update({ mName: val });
      },
    };
    const lNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Last Name*',
      onChange: (_error, val) => {
        this.update({ lName: val });
      },
    };
    return {
      type: whisper.WhisperComponentType.Box,
      children: [fNameInput, mNameInput, lNameInput],
      direction: whisper.Direction.Horizontal,
      justifyContent: whisper.JustifyContent.SpaceEvenly,
    };
  }

  createGenderComponent() {
    return {
      type: whisper.WhisperComponentType.Select,
      label: 'Gender',
      options: ['Male', 'Female'],
      selected: this.props.gender ? this.props.gender === 'F' ? 1 : 0 : -1,
      onSelect: (_error, val) => {
        this.update({gender: val === 0 ? 'M' : 'F'});
      },
    };
  }

  createVeteranStatusFormComponents() {
    const requiredInfoHeader = {
      type: whisper.WhisperComponentType.Message,
      header: 'Patient Information',
      body: 'Please complete the fields below to check the veteran status of your patient. Required fields are indicated with an asterik (*).',
    };

    const errorMessage = this.createErrorComponent();

    const veteranStatus = this.createVeteranStatusComponent();

    const nameRow = this.createNameComponents();

    const genderSelect = this.createGenderComponent();

    const birthdayInput = {
      type: whisper.WhisperComponentType.DateTimeInput,
      label: 'Birthday*',
      dateTimeType: DateTimeType.Date,
      onChange: (_error, val) => {
        this.update({ bday: val });
      },
    };

    const ssn = {
      type: whisper.WhisperComponentType.Password,
      label: 'Social Security Number*',
      onChange: (_error, val) => {
        this.update({ ssn: val });
      },
    };

    const submitButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Verify Status',
      onClick: async () => {
        await this.fetchStatus();
      },
    };

    const baseComponents = [
      requiredInfoHeader,
      nameRow,
      genderSelect,
      birthdayInput,
      ssn,
      submitButton,
    ];

    this.dynamicallyInsertComponents(this.props.veteranStatus, baseComponents, veteranStatus);
    this.dynamicallyInsertComponents(this.props.errorMessage, baseComponents, errorMessage);

    return baseComponents;
  }

  dynamicallyInsertComponents(dynamicProperty, baseComponents, componentToInsert) {
    if (dynamicProperty) {
      baseComponents.splice(1, 0, componentToInsert);
    }
  }

  handleFormValidation() {
    const { fName, lName, bday, ssn } = this.props;
    if (fName && lName && bday && ssn) {
      const hasInvalidSSN = ssn.replace(/-/g,"").length !== 9;
      if(hasInvalidSSN){
        const ssnFormatting = `Please enter the patient's SSN in either the XXX-XX-XXXX or XXXXXXXXX format.`;
        this.handleVeteranStatusFetchError(ssnFormatting);
        return false;
      }
      return true;
    } else {
      const completeAllFieldsError = `Please complete all fields to retrieve this patient's veteran status.`;
      this.handleVeteranStatusFetchError(completeAllFieldsError);
      return false;
    }
  }

  async fetchStatus() {
    const { fName, mName, lName, gender, bday, ssn } = this.props;

    const isValidForm = this.handleFormValidation();
    if (isValidForm) {
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
          this.handleSuccessfulVeteranStatusFetch(veteranStatus);
        })
        .catch((e) => {
          console.log('There was an error fetching the patient veteran status.', e);
          this.handleVeteranStatusFetchError();
        });
    }
  }

  handleSuccessfulVeteranStatusFetch(veteranStatus) {
    const hasValidStatus = veteranStatus &&
        (veteranStatus === VeteranStatusContainer.CONFIRMED_STATUS || veteranStatus === VeteranStatusContainer.UNCONFIRMED_STATUS);
    if (hasValidStatus) {
      this.update({ veteranStatus, errorMessage: '' });
    } else {
      this.handleVeteranStatusFetchError(`Sorry. We were unable to find this patient's status. Try again later.`);
    }
  }

  handleVeteranStatusFetchError(
    errorMessage = 'There was an error fetching the patient veteran status'
  ) {
    this.update({
      veteranStatus: '',
      errorMessage,
    });
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
      console.error('There was an error closing VeteranStatus whisper', err);
    }
    console.log('VeteranStatus whisper closed');
  }
}
