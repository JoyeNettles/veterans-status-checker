import { whisper } from '@oliveai/ldk';
import { stripIndent } from 'common-tags';

export default class IntroWhisper {
  constructor() {
    this.whisper = undefined;
    this.label = 'Intro Whisper';
    this.props = {
      newMessage: '',
      numClones: 1,
      label: '',
    };
  }

  createComponents() {
    const divider = {
      type: whisper.WhisperComponentType.Divider,
    };

    // Intro message.
    const introMessage = {
      type: whisper.WhisperComponentType.Message,
      body: 'These are some components you can use in whispers.',
      style: whisper.Urgency.Success,
    };

    // Collapse box.
    const collapsibleContent = {
      type: whisper.WhisperComponentType.Markdown,
      body: stripIndent`
      # Collapsible Section
      Content you put here can be expanded/collapsed.
      `,
    };
    const collapseBox = {
      type: whisper.WhisperComponentType.CollapseBox,
      children: [collapsibleContent],
      open: true,
    };

    // Box example.
    const boxHeader = {
      type: whisper.WhisperComponentType.Markdown,
      body: '# Box with Child Components',
    };
    const firstButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Button 1',
      onClick: () => {
        console.log('Button 1 clicked.');
      },
    };
    const secondButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Button 2',
      onClick: () => {
        console.log('Button 2 clicked.');
      },
    };
    const box = {
      type: whisper.WhisperComponentType.Box,
      children: [firstButton, secondButton],
      direction: whisper.Direction.Horizontal,
      justifyContent: whisper.JustifyContent.SpaceEvenly,
    };

    // Various example components.
    const exampleComponentsHeading = {
      type: whisper.WhisperComponentType.Markdown,
      body: '# Example Components',
    };
    const textInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Text Input',
      onChange: (_error, val) => {
        console.log('Text changed: ', val);
      },
    };
    const email = {
      type: whisper.WhisperComponentType.Email,
      label: 'Email',
      onChange: (_error, val) => {
        console.log('Email changed: ', val);
      },
    };
    const password = {
      type: whisper.WhisperComponentType.Password,
      label: 'Password',
      onChange: (_error, val) => {
        console.log('Password changed: ', val);
      },
    };
    const telephone = {
      type: whisper.WhisperComponentType.Telephone,
      label: 'Telephone Number',
      onChange: (_error, val) => {
        console.log('Telephone number changed: ', val);
      },
    };
    const button = {
      type: whisper.WhisperComponentType.Button,
      label: 'Button',
      onClick: () => {
        console.log('Button clicked.');
      },
    };
    const link = {
      type: whisper.WhisperComponentType.Link,
      text: 'Example of a link',
      onClick: () => {
        console.log('Link clicked.');
      },
    };
    const checkbox = {
      type: whisper.WhisperComponentType.Checkbox,
      label: 'Checkbox',
      tooltip: "Here's a tooltip.",
      value: false,
      onChange: (_error, val) => {
        console.log('Checkbox clicked: ', val);
      },
    };
    const pair = {
      type: whisper.WhisperComponentType.ListPair,
      copyable: true,
      label: 'List pair example:',
      value: 'This value is copyable.',
      style: whisper.Urgency.None,
    };
    const numberInput = {
      type: whisper.WhisperComponentType.Number,
      value: 6,
      max: 10,
      min: 1,
      step: 2,
      tooltip: 'Number Input',
      label: 'Number Input',
      onChange: (_error, val) => {
        console.log('Number changed: ', val);
      },
    };
    const select = {
      type: whisper.WhisperComponentType.Select,
      label: 'Select Box',
      options: ['One', 'Two', 'Three'],
      selected: 0,
      onSelect: (_error, val) => {
        console.log('Selected: ', val);
      },
    };
    const radioBtn = {
      type: whisper.WhisperComponentType.RadioGroup,
      options: ['Option 1', 'Option 2', 'Option 3'],
      onSelect: (_error, val) => {
        console.log('Radio button option selected: ', val);
      },
    };

    // Showing how to use whisper.update
    const updatableComponentsHeading = {
      type: whisper.WhisperComponentType.Markdown,
      body: '# Updatable Whisper Components',
    };
    const updatableMessage = {
      type: whisper.WhisperComponentType.Message,
      header: 'This is a component hooked up to Updatable Whisper logic',
      body: this.props.newMessage || 'Type in the field below to update this line of text',
      style: whisper.Urgency.Success,
    };
    const updatableMessageInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'New Text Input',
      onChange: (_error, val) => {
        console.log('Updating message text: ', val);
        this.update({ newMessage: val });
      },
    };
    const updatableLabelInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Change Whisper Label',
      onChange: (_error, val) => {
        console.log('Updating whisper label: ', val);
        this.update({ label: val });
      },
    };
    const resetButton = {
      type: whisper.WhisperComponentType.Button,
      label: 'Reset Clones',
      size: whisper.ButtonSize.Large,
      buttonStyle: whisper.ButtonStyle.Secondary,
      onClick: () => {
        const numClones = 1;
        console.log('Resetting number of clones: ', numClones);
        this.update({ numClones });
      },
    };
    const clonedComponents = [];
    for (let i = this.props.numClones; i > 0; i -= 1) {
      const clone = {
        type: whisper.WhisperComponentType.Button,
        label: 'Clone Me',
        onClick: () => {
          const numClones = this.props.numClones + 1;
          console.log('Adding another clone: ', numClones);
          this.update({ numClones });
        },
      };
      clonedComponents.push(clone);
    }

    return [
      introMessage,
      divider,
      collapseBox,
      divider,
      boxHeader,
      box,
      divider,
      exampleComponentsHeading,
      textInput,
      email,
      password,
      telephone,
      button,
      link,
      checkbox,
      pair,
      numberInput,
      select,
      radioBtn,
      divider,
      updatableComponentsHeading,
      updatableMessage,
      updatableMessageInput,
      updatableLabelInput,
      resetButton,
      ...clonedComponents,
    ];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: IntroWhisper.onClose,
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
    this.whisper.close(IntroWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Intro whisper', err);
    }
    console.log('Intro whisper closed');
  }
}
