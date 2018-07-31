/**
 * Represents a base function for all validation modules
 */
export default class ValidationModule {
    constructor () {
        this.currentModuleValidationErrors = []; 
        this.name = '';
    }

    addValidationError(error) {
        this.currentModuleValidationErrors.push(error);
    }

    get errors() {
        return this.currentModuleValidationErrors;
    }

    name() {
        return this.name;
    }

    reset() {
        this.currentModuleValidationErrors = [];
    }

    validate() {
        console.log('Error: each validation module should overwrite the validate() function!');
    }
}