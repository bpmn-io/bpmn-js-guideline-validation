import ValidationModule from '../../core/ValidationModule';

import { validationErrorCodes, validationHTMLCode } from '../../util/ValidationConstants';
import { moreThanOneIncomingSequenceflows, moreThanOneOutgoingSequenceflows } from '../../util/ValidationUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';


export default class UseOfParallelGatewayValidation extends ValidationModule {

    constructor(elementRegistry, translate) {
        super()
        this.name = translate('Use of Parallel Gateway');
        
        this._elementRegistry = elementRegistry;
        this._translate = translate;
    }

    validate() {
        let elements = this._elementRegistry.filter(this._shouldHaveJustOneOutgoingOrIncomingSequenceFlow);

        elements.forEach(element => {
            if (moreThanOneIncomingSequenceflows(element) && moreThanOneOutgoingSequenceflows(element)) {
                this.addValidationError({
                    element: element,
                    errorType: validationErrorCodes.MULTIPLE_FLOW_ON_ELEMENT,
                    notification: this._translate('Multiple incoming flows on element:'),
                    html: validationHTMLCode(this._translate).MULTIPLE_INCOMING_HTML
                });
                this.addValidationError({
                    element: element,
                    errorType: validationErrorCodes.MULTIPLE_FLOW_ON_ELEMENT,
                    notification: this._translate('Multiple outgoing flows on element:'),
                    html: validationHTMLCode(this._translate).MULTIPLE_OUTGOING_HTML
                });
            } else if (moreThanOneIncomingSequenceflows(element)) {
                this.addValidationError({
                    element: element,
                    errorType: validationErrorCodes.MULTIPLE_FLOW_ON_ELEMENT,
                    notification: this._translate('Multiple incoming flows on element:'),
                    html: validationHTMLCode(this._translate).MULTIPLE_INCOMING_HTML
                });
            } else if (moreThanOneOutgoingSequenceflows(element)) {
                this.addValidationError({
                    element: element,
                    errorType: validationErrorCodes.MULTIPLE_FLOW_ON_ELEMENT,
                    notification: this._translate('Multiple outgoing flows on element:'),
                    html: validationHTMLCode(this._translate).MULTIPLE_OUTGOING_HTML
                });
            }
        })

        return this.errors;
    }

    _shouldHaveJustOneOutgoingOrIncomingSequenceFlow = (element) => {

        return (element.type !== 'label'
            && isAny(element,
                [
                    'bpmn:Task',
                    'bpmn:StartEvent',
                    'bpmn:IntermediateThrowEvent',
                    'bpmn:IntermediateCatchEvent',
                    'bpmn:EndEvent'
                ]));

    }
}
UseOfParallelGatewayValidation.$inject = ['elementRegistry','translate'];