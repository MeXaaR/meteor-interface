import React from 'react';
import { Confirm, Transition } from 'semantic-ui-react';

const Confirmation = ({ confirmationObject = {}, confirmation, loading }) => (
    <Transition visible={confirmation} animation="fade" duration={500}>
      <Confirm
        open={confirmation}
        loading={loading}
        header={confirmationObject.title}
        content={confirmationObject.text}
        onCancel={confirmationObject.cancel}
        onConfirm={confirmationObject.confirm}
        cancelButton="Cancel"
        confirmButton="Confirm"
      />
    </Transition>
  );

export default Confirmation