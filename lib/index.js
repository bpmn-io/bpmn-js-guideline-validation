import GuidelineValidator from './core/GuidelineValidator';
import NoLabelValidation from './features/no-label-validation/NoLabelValidation';
import NoStartAndEndEventValidation from './features/no-start-and-end-event/NoStartAndEndEventValidation';
import ValidationModuleController from './core/ValidationModuleController';
import ToggleController from './features/validation-menu/ToggleController';
import ValidationNotifier from './features/notification-validation/ValidationNotifier';
import JoiningSplittingGatewaysValidation from './features/joining-and-splitting-gateways/JoiningSplittingGatewaysValidation'
import SymmetricModellingValidation from './features/symmetric-modelling-validation/SymmetricModellingValidation';
import UseOfParallelGatewayValidation from './features/use-of-parallel-gateways-validation/UseOfParallelGatewayValidation';
import UnnecessaryGatewayValidation from './features/unnecessary-gateway-validation/UnnecessaryGatewayValidation';
import CrossingFlowValidation from './features/crossing-flow-validation/CrossingFlowValidation';
import ValidationModuleMenu from './features/validation-menu/ValidationModuleMenu';



export default {
  __init__: [
    'guidelineValidator',
    'noLabelValidation',
    'noStartAndEndEventValidation',
    'validationModuleController',
    'toggleController',
    'validationNotifier',
    'joiningSplittingGatewaysValidation',
    'symmetricModellingValidation',
    'useOfParallelGatewayValidation',
    'unnecessaryGatewayValidation',
    'crossingFlowValidation',
    'validationModuleMenu'
  ],
  guidelineValidator: ['type', GuidelineValidator],
  noLabelValidation: ['type', NoLabelValidation],
  noStartAndEndEventValidation: ['type', NoStartAndEndEventValidation],
  validationModuleController: ['type', ValidationModuleController],
  toggleController: ['type', ToggleController],
  validationNotifier: ['type', ValidationNotifier],
  joiningSplittingGatewaysValidation: ['type', JoiningSplittingGatewaysValidation],
  symmetricModellingValidation: ['type', SymmetricModellingValidation],
  useOfParallelGatewayValidation: ['type', UseOfParallelGatewayValidation],
  unnecessaryGatewayValidation: ['type', UnnecessaryGatewayValidation],
  crossingFlowValidation: ['type', CrossingFlowValidation],
  validationModuleMenu: ['type', ValidationModuleMenu]
};