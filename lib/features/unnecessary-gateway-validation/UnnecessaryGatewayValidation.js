
import ValidationModule from '../../core/ValidationModule';

import { validationErrorCodes, validationHTMLCode } from '../../util/ValidationConstants';
import { isGateway, getOutgoingSequenceflows, getIncomingSequenceflows } from '../../util/ValidationUtil';


export default class UnnecessaryGatewayValidation extends ValidationModule {
    
    constructor(elementRegistry) {
        super()
        this.name = 'Unnecessary Gateway';
        
        this._elementRegistry = elementRegistry;
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
                    notification: 'Unnecessary gateway element:',
                    html: validationHTMLCode.UNNECESSARY_GATEWAY_HTML
                });
            };
        });

        return this.errors;
    }
}
UnnecessaryGatewayValidation.$inject = ['elementRegistry'];