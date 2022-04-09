import React from 'react';

export default class Reference extends React.PureComponent
{   
    References(){}

    ModalReference = '';
    ModalVisibility = false;

    setModalReference(ref)
    {
        this.ModalReference = ref;
    }

    getModalReference()
    {
        return this.ModalReference;
    }

    setModalVisibilityTrue()
    {
        this.ModalVisibility = true;
    }

    setModalVisibilityFalse()
    {
        this.ModalVisibility = false;
    }


}