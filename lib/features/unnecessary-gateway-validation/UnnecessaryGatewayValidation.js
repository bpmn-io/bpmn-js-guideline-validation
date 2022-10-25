
import ValidationModule from '../../core/ValidationModule';

import { validationErrorCodes, validationHTMLCode } from '../../util/ValidationConstants';
import { isGateway, getOutgoingSequenceflows, getIncomingSequenceflows } from '../../util/ValidationUtil';


export default class UnnecessaryGatewayValidation extends ValidationModule {
    
    constructor(elementRegistry, translate) {
        super()
        this.name = translate('Unnecessary Gateway');
        
        this._elementRegistry = elementRegistry;
        this._translate = translate;
    }

    validate() {
        let elements = this._elementRegistry.filter((element) => {
            return isGateway(element);
        });

        elements.forEach(gateway => {
            if (getOutgoingSequenceflows(gateway).length == 1 && getIncomingSequenceflows(gateway).length == 1) {
                this.addValidationError({
                    element: gateway,
                    errorType: validationErrorCodes.UNNECESSARY_GATEWAY,
                    notification: this._translate('Unnecessary gateway element:'),
                    html: validationHTMLCode(this._translate).UNNECESSARY_GATEWAY_HTML
                });
            };
        });

        return this.errors;
    }
}
UnnecessaryGatewayValidation.$inject = ['elementRegistry', 'translate'];