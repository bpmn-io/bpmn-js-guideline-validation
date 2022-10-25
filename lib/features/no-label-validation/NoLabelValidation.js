import ValidationModule from '../../core/ValidationModule';

import { getLabel } from 'bpmn-js/lib/features/label-editing/LabelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { validationErrorCodes, validationHTMLCode } from '../../util/ValidationConstants';
import { isGateway, moreThanOneIncomingSequenceflows } from '../../util/ValidationUtil';


export default class NoLabelValidation extends ValidationModule {
    
    constructor(elementRegistry, translate) {
        super();
        this.name = translate('No Label');

        this._elementRegistry = elementRegistry;
        this._translate = translate;
    }

    validate = () => {
        let elements = this._elementRegistry.filter(element => {
            return this._shouldHaveLabelPerDefault(element);
        });

        elements.forEach(element => {
            if (!this._isLabelSet(element)) {
                let elementForLabel = this._getElementForLabelElement(element);
                if (!(isGateway(elementForLabel) && moreThanOneIncomingSequenceflows(elementForLabel))) {
                    this.addValidationError({
                        element: elementForLabel,
                        errorType: validationErrorCodes.LABELING,
                        notification: this._translate('Label is missing on element:'),
                        html: validationHTMLCode(this._translate).MISSING_LABEL_HTML
                    });
                }
            }
        });

        return this.errors;
    }

    _isLabelSet = (element) => {
        return getLabel(element).length > 1;
    }

    _shouldHaveLabelPerDefault = (element) => {

        return (element.type === 'label'
            && !(isAny(element,
                [
                    'bpmn:DataStoreReference',
                    'bpmn:DataObjectReference',
                    'bpmn:SequenceFlow',
                    'bpmn:MessageFlow',
                    'bpmn:ParallelGateway'
                ])));

    }

    _getElementForLabelElement = (labelElement) => {
        let elements = this._elementRegistry.filter(element => {
            return element.id === labelElement.businessObject.id;
        });
        return elements[0];
    }
}

NoLabelValidation.$inject = ['elementRegistry', 'translate'];